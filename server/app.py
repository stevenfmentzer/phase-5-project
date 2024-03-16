from datetime import datetime
from flask import abort, session, make_response, request
from models import db, User, Friendship, Message, Inbox
from flask_restful import Resource
from sqlalchemy import desc, or_
from config import app, api, db, scheduler

# Background task to periodically update is_sent on Delayed Messages
def update_message_status():
    with app.app_context():
        # Retrieve unsent messages with a delivery time in the past
        messages_to_update = Message.query.filter(
            Message.is_sent == False, 
            Message.delivery_time < datetime.utcnow()
        ).all()

        # Iterate over each unsent message
        for message in messages_to_update:
            print(message)
            # Step 1: If the message is not the most child message
            if message.child_message_id == 0:
                # Step 2: Find the most recent message in the conversation
                most_recent_message = Message.query.filter(
                    Message.sender_id == message.sender_id,
                    Message.recipient_id == message.recipient_id
                ).order_by(Message.id.desc()).first()

                # Step 3: If there's a most recent message, update its child_message_id
                if most_recent_message:
                    most_recent_message.child_message_id = message.id

                    # Step 4: If the message has a parent message
                    if message.parent_message_id:
                        # Step 5: Retrieve the parent message, update parent message's child_message_id to the current message's child
                        parent_message = Message.query.get(message.parent_message_id)
                        parent_message.child_message_id = message.child_message_id
                        # Step 6: Retreive the child message, update child message's parent_message_id to the current message's parent
                        child_message = Message.query.get(message.child_message_id)
                        child_message.parent_message_id = parent_message.id

                    # Step 7: Ensure the message becomes the most child message
                    message.child_message_id = 0
                    # Step 8: Ensure the message's parent is the most_recent_message
                    message.parent_message_id = most_recent_message.id
                    # Step 9: Update message status to sent
                    message.is_sent = True
                    # Commit changes to the database after processing each message
                    db.session.commit()
            
                # Step 9: Update message status to sent
                message.is_sent = True
                # Commit changes to the database after processing each message
                db.session.commit()

#Initiate Background Task
# Schedule the background task to run every minute
scheduler.add_job(update_message_status, 'interval', seconds=5)
scheduler.start()

if __name__ == '__main__':
    app.run(debug=True)



######### ROUTES / VIEWS #########

#### HOME ####

class Home(Resource):
    def get(self): #### !!!! CHECKED !!!! #### 
        return 'Here IM'
api.add_resource(Home, '/home')

#### AUTHENTICATIONS #### 

class Login(Resource):
    def post(self):
        # If a GET request is made to this endpoint, return 405 Method Not Allowed
        if request.method != 'POST':
            abort(405)
        try: 
            if request.headers.get("Content-Type") == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            email = form_data['email']
            password = form_data['password']

            user = User.query.filter(User.email == email).first()

            if user.authenticate(password):
                session['user_id'] = user.id
                response = make_response(user.to_dict(), 200)

            else:
                response = make_response({"Error": "Not valid password"}, 400)
        except Exception as e: 
            response = make_response({"errors": [str(e)]}, 400)
        return response

api.add_resource(Login, '/login')

class Logout(Resource):
    def post(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204
    
api.add_resource(Logout, '/logout')

class CheckSession(Resource):
    def get(self):
        print(request.json)  # Print JSON data sent in the request body
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401
    def post(self):
        print(request.json)  # Print JSON data sent in the request body
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401
        
api.add_resource(CheckSession, '/session')
        
#### USERS ####

class Users(Resource):
    def post(self):  #### !!!! CHECKED !!!! #### 
        try: 
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            new_user = User(
                first_name = form_data["first_name"],
                last_name = form_data["last_name"],
                phone_number = form_data["phone_number"],
                email = form_data["email"],
                )
            new_user.password_hash = form_data['password'] 

            db.session.add(new_user)
            db.session.commit()

            response = make_response(new_user.to_dict(), 201)

        except Exception as e: 
            return {"errors": [str(e)]}, 400
        return response
api.add_resource(Users, '/register')

class UserById(Resource):
    def get(self, id): #### !!!! CHECKED !!!! #### 
        try: 
            user_dict = User.query.filter(User.id == id).first().to_dict()
            if user_dict:
                response = make_response(user_dict, 200)
            else:
                response = make_response({"error" : f"Friendship with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response
    
    def patch(self, id):  #### !!!! CHECKED !!!! #### 
        try: 
            user = User.query.filter(User.id == id).first()
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            # Permit specifics attrs to be updated
            allowed_attrs = ['first_name', 'last_name', 'available_status', 'password_hash']
            for attr in form_data: 
                if attr in allowed_attrs:
                    setattr(user, attr, form_data[attr])

            db.session.commit()
            response = make_response(user.to_dict(), 202)

        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)

        return response
    
    def delete(self, id): #### !!!! CHECKED !!!! #### 
        try:
            user = User.query.filter(User.id == id).first()
            if user:

                # Delete associated Friendships Inboxes and Messages
                Friendship.query.filter(or_(Friendship.user1_id == id, Friendship.user2_id == id)).delete()
                Inbox.query.filter(or_(Inbox.user_id == id, Inbox.contact_user_id == id)).delete()
                Message.query.filter(or_(Message.sender_id == id, Message.recipient_id == id)).delete()

                # Delete User
                db.session.delete(user)
                
                db.session.commit()
                response = make_response('',204)
            else:
                response = make_response({"error" : f"User with id {id} not found"}, 404)
        except Exception as e: 
            response = make_response({"errors": [str(e)]}, 400)
        return response
    
api.add_resource(UserById, '/user/<int:id>')

class SearchUser(Resource):
    def get(self, phone_number): #### !!!! CHECKED !!!! #### 
        try: 
            user_dict = User.query.filter(User.phone_number == phone_number).first().to_dict()
            if user_dict:
                response = make_response(user_dict, 200)
            else:
                response = make_response({"error" : f"User with phone_number {phone_number} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
            print(e)
        return response
    
api.add_resource(SearchUser, '/search/<int:phone_number>')

#### FRIENDSHIPS ####

class Friendships(Resource):
    def post(self):  #### !!!! CHECKED !!!! #### 
        try: 
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            print(form_data)
            # Check if a Friendship between User1_id and User2_id already exists
            existing_friendship = Friendship.query.filter(                
                or_(
                    (Friendship.user1_id == form_data['user1_id']) & (Friendship.user2_id == form_data['user2_id']),
                    (Friendship.user1_id == form_data['user2_id']) & (Friendship.user2_id == form_data['user1_id'])
                )).first()

            # If there's no existing Friendship make a new one
            if not existing_friendship:
                new_friendship = Friendship(
                    user1_id=form_data["user1_id"],
                    user2_id=form_data["user2_id"]
                )

                db.session.add(new_friendship)
                db.session.commit()

                response = make_response(new_friendship.to_dict(), 201)
            else:
                # Check if the existing friendship is inactive, if so, activate it
                print(f"FRIENDSHIP ACTIVE: {existing_friendship}")
                if not existing_friendship.is_active:
                    print(f"NOT ACTIVE")
                    existing_friendship.is_active = True
                    db.session.commit()
                    response = make_response(existing_friendship.to_dict(), 200)
                else:
                    response = make_response({"error": "Friendship already exists"}, 400)
        except Exception as e: 
            return {"errors": [str(e)]}, 400
        return response
    
api.add_resource(Friendships, '/friends/')

class FriendshipsByUserId(Resource):
    def get(self, id):  #### !!!! CHECKED !!!! #### 
        try: 
            friendship_dict = [friendship.to_dict() for friendship in Friendship.query.filter((Friendship.user1_id == id) | (Friendship.user2_id == id))]
            if friendship_dict:
                response = make_response(friendship_dict, 200)
            else:
                response = make_response({"error" : f"Friendship with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response
    
api.add_resource(FriendshipsByUserId, '/user/<int:id>/friends')

class FriendshipById(Resource):
    def patch(self, id):  #### !!!! CHECKED !!!! #### 
        try: 
            friendship = Friendship.query.filter(Friendship.id == id).first()
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            # Permit specifics attrs to be updated
            allowed_attrs = ['is_active', 'message_count','is_close_friend_user1','is_close_friend_user2']
            for attr in form_data: 
                if attr in allowed_attrs:
                    setattr(friendship, attr, form_data[attr])

            db.session.commit()
            response = make_response(friendship.to_dict(), 202)

        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)

        return response
    
#### FRIENDSHIP DELETE WORKS BUT MIGHT NOT REALLY NEED IT

    # def delete(self, id):   #### !!!! CHECKED !!!! #### 
    #     try:
    #         friendship = Friendship.query.filter(Friendship.id == id).first()
    #         if friendship:


    #             db.session.delete(friendship)
    #             db.session.commit()
    #             response = make_response('',204)
    #         else:
    #             response = make_response({"error" : f"Friendship with id {id} not found"}, 404)
    #     except: 
    #         response = make_response({"error" : "Friendship not found"}, 404)
    #     return response
    
api.add_resource(FriendshipById, '/friends/<int:id>')

#### MESSAGES ####

class Messages(Resource):
    def post(self): #### !!!! CHECKED !!!! #### 
        print("SERVER")
        try:
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else:
                form_data = request.form

            # Check if a Friendship between User1_id and User2_id already exists
            existing_friendship = Friendship.query.filter(                
                or_(
                    (Friendship.user1_id == form_data['sender_id']) & (Friendship.user2_id == form_data['recipient_id']),
                    (Friendship.user1_id == form_data['recipient_id']) & (Friendship.user2_id == form_data['sender_id'])
                ),Friendship.is_active == True).first()
            
            # Once Friendship exists, Create the new Message object
            if existing_friendship:

                #Check if the message is sent delayed
                try: 
                    delivery_time = datetime.strptime(form_data['delivery_time'], '%Y-%m-%dT%H:%M:%S.%fZ')
                except:
                    delivery_time = None
                
                if delivery_time:
                    new_message = Message(
                        sender_id=form_data['sender_id'],
                        recipient_id=form_data['recipient_id'],
                        message_body=form_data['message_body'],
                        delivery_time=delivery_time
                    )
                else: 
                    new_message = Message(
                        sender_id=form_data['sender_id'],
                        recipient_id=form_data['recipient_id'],
                        message_body=form_data['message_body']
                    )

                # Check whether or not a message already belongs to these two Users, set to parent_message
                parent_message = Message.query.filter(
                    or_(
                        (Message.sender_id == form_data['sender_id']) & (Message.recipient_id == form_data['recipient_id']),
                        (Message.sender_id == form_data['recipient_id']) & (Message.recipient_id == form_data['sender_id'])
                    )
                ).order_by(Message.id.desc()).first()

                # Increment the Friendship.message_count
                existing_friendship.message_count += 1 
                db.session.add(new_message)
                db.session.commit()
       
                # Set the parent_message_id and child_message_id properties         
                if parent_message:
                    new_message.parent_message_id = parent_message.id
                    parent_message.child_message_id = new_message.id
                    db.session.commit()

                # Check if two inboxes exist: one for each sender and recipient
                sender_inbox = Inbox.query.filter(
                    Inbox.user_id == form_data['sender_id'], 
                    Inbox.contact_user_id == form_data['recipient_id']
                ).first()

                recipient_inbox = Inbox.query.filter(
                    Inbox.user_id == form_data['recipient_id'], 
                    Inbox.contact_user_id == form_data['sender_id']
                ).first()

                # If inboxes don't exist, create new ones
                if not sender_inbox:
                    sender_inbox = Inbox(
                        user_id=form_data['sender_id'],
                        contact_user_id=form_data['recipient_id'],
                        first_message_id=new_message.id,
                        last_message_id=new_message.id
                    )
                    db.session.add(sender_inbox)
                else:
                    sender_inbox.last_message_id = new_message.id

                recipient_inbox = Inbox.query.filter(
                    Inbox.user_id == form_data['recipient_id'], 
                    Inbox.contact_user_id == form_data['sender_id']
                ).first()

                if not recipient_inbox:
                    recipient_inbox = Inbox(
                        user_id=form_data['recipient_id'],
                        contact_user_id=form_data['sender_id'],
                        first_message_id=new_message.id,
                        last_message_id=new_message.id
                    )
                    db.session.add(recipient_inbox)
                else:
                    recipient_inbox.last_message_id = new_message.id

                db.session.commit()

                response = make_response(new_message.to_dict(), 201)
            else: 
                response = make_response({"error" : f"Friendship.is_active=True for Users: {form_data['sender_id']} & {form_data['recipient_id']} not found"}, 400)
        except Exception as e:
            response = make_response({"errors": [str(e)]}, 400)
        return response

api.add_resource(Messages, '/messages')

class MessageByInboxId(Resource):
    def get(self, id): #### !!!! CHECKED !!!! #### 
        try: 
            inbox = Inbox.query.filter(Inbox.id == id).first()
            if not inbox:
                raise Exception(f"Inbox with id {id} not found")
            
            # Retrieve a Dict of Messages that include both Users as either sender or recipient
            inbox_message_dict = [message.to_dict() for message in Message.query.filter(
                (Message.sender_id == inbox.user_id) | (Message.sender_id == inbox.contact_user_id),
                (Message.recipient_id == inbox.user_id) | (Message.recipient_id == inbox.contact_user_id),
                Message.id.between(inbox.first_message_id, inbox.last_message_id)
                ).all()]
            
            # Return Dictionary
            if inbox_message_dict:
                response = make_response(inbox_message_dict, 200)
            else:
                response = make_response({"error" : f"Messages for Inbox id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response

api.add_resource(MessageByInboxId, '/messages/inbox/<int:id>')

class InboxesByUserId(Resource):
    def get(self, user_id, inbox_id=None):
        try:
            # Retrieve all inboxes belonging to the user
            inboxes = Inbox.query.filter(Inbox.user_id == user_id).order_by(desc(Inbox.id)).all()
            # Create a list to store the messages for each inbox
            messages_by_inbox = []
            
            # If inbox_id is provided and not 0, find the corresponding inbox and move it to the front
            if inbox_id:
                inbox_index = next((index for index, inbox in enumerate(inboxes) if inbox.id == inbox_id), None)
                if inbox_index is not None:
                    inbox = inboxes.pop(inbox_index)
                    inboxes.insert(0, inbox)
                else:
                    # If the provided inbox_id does not exist or does not belong to the user, return an empty response
                    return make_response({"error": "Inbox not found or does not belong to the user"}, 404)

            # Iterate over each inbox
            for inbox in inboxes:
                # Find the last sent message for the current inbox
                last_message = Message.query.filter(
                    Message.id.between(inbox.first_message_id, inbox.last_message_id),
                    Message.is_sent == True  # Ensure only sent messages are considered
                    ).order_by(Message.delivery_time.desc()).first() 

                # Retrieve messages for the current inbox ordered by delivery_time in ascending order
                inbox_messages = Message.query.filter(
                    (Message.sender_id == inbox.user_id) | (Message.sender_id == inbox.contact_user_id),
                    (Message.recipient_id == inbox.user_id) | (Message.recipient_id == inbox.contact_user_id),
                    Message.id.between(inbox.first_message_id, inbox.last_message_id)
                ).order_by(Message.delivery_time).all()
                
                # Convert messages to dictionaries
                inbox_messages_dict = [message.to_dict() for message in inbox_messages]

                # Include inbox information at the beginning of the list of messages
                inbox_info = {
                    'inbox_id': inbox.id,
                    'first_message_id': inbox.first_message_id,
                    'last_message_id': inbox.last_message_id,
                    'last_message_body': last_message.message_body if last_message else None,
                    'user_id': inbox.user_id,
                    'user' : inbox.user.to_dict(),
                    'contact_user_id': inbox.contact_user_id,
                    'contact_user' : inbox.contact_user.to_dict(),
                    'friendship_is_active': inbox.friendship.is_active
                }
                inbox_messages_dict.insert(0, inbox_info)
                
                # Append messages for the current inbox to the list
                messages_by_inbox.append(inbox_messages_dict)
            
            # Return the list of lists containing messages for each inbox
            response = make_response(messages_by_inbox, 200)
            
        except Exception as e:
            response = make_response({"error": f"An error occurred: {str(e)}"}, 500)
            print(e)
        return response
    

api.add_resource(InboxesByUserId, '/user/<int:user_id>/inbox/', '/user/<int:user_id>/inbox/<int:inbox_id>')


class MessageById(Resource):
    def get(self, id): #### !!!! CHECKED !!!! #### 
        try: 
            message = Message.query.filter(Message.id == id).first()
            if message:
                message_dict = message.to_dict()
                response = make_response(message_dict, 200)
            else:
                response = make_response({"error" : f"Message with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response
    
    def patch(self, id):  #### !!!! CHECKED !!!! #### 
        try: 
            message = Message.query.filter(Message.id == id).first()
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            # Permit specific attrs to be updated
            allowed_attrs = ['message_body', 'is_read']
            for attr in form_data: 
                if attr in allowed_attrs:
                    setattr(message, attr, form_data[attr])

            db.session.commit()
            response = make_response(message.to_dict(), 202)

        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)

        return response
            
    def delete(self, id):
        try:
            message = Message.query.filter(Message.id == id).first()
            if message:
                # Fetch parent_message and child_message if their IDs are not None
                parent_message = Message.query.get(message.parent_message_id) if message.parent_message_id != 0 else None
                child_message = Message.query.get(message.child_message_id) if message.child_message_id != 0 else None

                # Update parent_message and child_message
                if parent_message and child_message and parent_message.id != child_message.id:
                    parent_message.child_message_id = child_message.id
                    child_message.parent_message_id = parent_message.id
                elif parent_message:
                    parent_message.child_message_id = 0
                elif child_message:
                    child_message.parent_message_id = 0
                

                # Handle the scenario where the message was the first or last message in an inbox
                inboxes = Inbox.query.filter((Inbox.first_message_id == id) | (Inbox.last_message_id == id)).all()
                for inbox in inboxes:
                    if inbox.first_message_id == id:
                        inbox.first_message_id = child_message.id if child_message else 0
                    if inbox.last_message_id == id:
                        inbox.last_message_id = parent_message.id if parent_message else 0

                # Delete the message
                db.session.delete(message)
                db.session.commit()

                response = make_response("", 204)
            else:
                response = make_response({"error": f"Message with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error": f"An error occurred: {str(e)}"}, 500)
        return response

api.add_resource(MessageById, '/message/<int:id>')

#### INBOXES ####

class Inboxes(Resource):
    def post(self):  #### !!!! CHECKED !!!! #### 
        try: 
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            # Check if a Friendship between User1_id and User2_id already exists
            existing_friendship = Friendship.query.filter(                
                or_(
                    (Friendship.user1_id == form_data['sender_id']) & (Friendship.user2_id == form_data['recipient_id']),
                    (Friendship.user1_id == form_data['recipient_id']) & (Friendship.user2_id == form_data['sender_id'])
                ),Friendship.is_active == True).first()
            
            if existing_friendship:

                existing_inbox = Inbox.query.filter(
                    Inbox.user_id == form_data['user_id'], 
                    Inbox.contact_user_id == form_data['contact_user_id']
                ).first()

                if not existing_inbox:
                    new_inbox = Inbox(
                        user_id = form_data['user_id'],
                        contact_user_id = form_data['contact_user_id'],
                        )
                    
                    db.session.add(new_inbox)
                    db.session.commit()

                    response = make_response(new_inbox.to_dict(), 201)
                else: 
                    make_response({"error": "Inbox already exists"}, 400)
            else: 
                 make_response({"error" : f"a Friendship for Users: {form_data['user_id']} & {form_data['contact_user_id']} doesn't exist"}, 400)
        except Exception as e: 
            return {"errors": [str(e)]}, 400
        return response
    
api.add_resource(Inboxes, '/inboxes')

class InboxById(Resource):

    def delete(self, id): #### !!!! CHECKED !!!! #### 
        try:
            inbox = Inbox.query.filter(Inbox.id == id).first()
            if inbox:
                db.session.delete(inbox)
                db.session.commit()
                response = make_response('',204)
            else:
                response = make_response({"error" : f"Inbox with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response
    
api.add_resource(InboxById, '/inbox/<int:id>')