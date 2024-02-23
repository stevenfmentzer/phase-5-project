from flask import Flask, abort, session, redirect, url_for, make_response, request, jsonify
from models import db, User, Friendship, Message, Inbox
from flask_restful import Resource
from sqlalchemy import or_
import os, math 
#Import database and application from config.py
from config import app, api, db


######### ROUTES / VIEWS #########

#### HOME ####

class Home(Resource):
    def get():
        return 'Here IM'
api.add_resource(Home, '/home')

class Users(Resource):
    def post(self):
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
                password_hash = form_data["password"]
                )

            db.session.add(new_user)
            db.session.commit()

            response = make_response(new_user.to_dict(), 201)

        except Exception as e: 
            return {"errors": [str(e)]}, 400
        return response
api.add_resource(Users, '/users')

class UserById(Resource):
    def get(self, id):
        try: 
            user_dict = User.query.filter(User.id == id).first().to_dict()
            if user_dict():
                response = make_response(user_dict, 200)
            else:
                response = make_response({"error" : f"Friendship with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response
    
    def patch(self, id):
        return 
    
    def delete(self, id):
        try:
            user = User.query.filter(User.id == id).first()
            if user:
                db.session.delete(user)
                db.session.commit()
                response = make_response('',204)
            else:
                response = make_response({"error" : f"User with id {id} not found"}, 404)
        except: 
            response = make_response({"error" : "User not found"}, 404)
        return response
    
api.add_resource(UserById, '/user/<int:id>')

class Friendships(Resource):
    def post(self):
        try: 
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            new_friendship = Friendship(
                user1_id = form_data["user1_id"],
                user2_id = form_data["user2_id"]
                )

            db.session.add(new_friendship)
            db.session.commit()

            response = make_response(new_friendship.to_dict(), 201)

        except Exception as e: 
            return {"errors": [str(e)]}, 400
        return response
    
api.add_resource(Friendships, '/friends')

class FriendshipsByUserId(Resource):
    def get(self, id):
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
    def patch(self, id):
        return 
    
    def delete(self, id):
        try:
            friendship = Friendship.query.filter(Friendship.id == id).first()
            if friendship:
                db.session.delete(friendship)
                db.session.commit()
                response = make_response('',204)
            else:
                response = make_response({"error" : f"Friendship with id {id} not found"}, 404)
        except: 
            response = make_response({"error" : "Friendship not found"}, 404)
        return response
    
api.add_resource(FriendshipById, '/friends/<int:id>')

class Messages(Resource):
    def post(self):
        try:
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else:
                form_data = request.form


            #### CHECK IF AN INBOX EXISTS FOR THESE TWO PEOPLE, IF NOT MAKE A NEW INBOX TO ASSIGN MESSAGES TO ####
                

            # Query the database to get the ID of the last message
            parent_message = Message.query \
                .filter(or_((Message.sender_id == form_data['sender_id']) & (Message.recipient_id == form_data['recipient_id']),
                            (Message.sender_id == form_data['recipient_id']) & (Message.recipient_id == form_data['sender_id']))) \
                .order_by(Message.id.desc()) \
                .first()

            # Create the new message object
            new_message = Message(
                sender_id=form_data['sender_id'],
                recipient_id=form_data['recipient_id'],
                message_body=form_data['message_body']
                )

            db.session.add(new_message)
            db.session.commit()

            # Set the parent_message_id and child_message_id properties
            if parent_message:
                new_message.parent_message_id = parent_message.id
                parent_message.child_message_id = new_message.id
                db.session.commit()

            response = make_response(new_message.to_dict(), 201)
        except Exception as e:
            response = make_response({"errors": [str(e)]}, 400)
        return response

api.add_resource(Messages, '/messages')

class MessageByInboxId(Resource):
    def get(self, id):
        try: 
            inbox = Inbox.query.filter(Inbox.id == id).first()
            if not inbox:
                raise Exception(f"Inbox with id {id} not found")
            
            inbox_message_dict = [message.to_dict() for message in Message.query.filter(
                (Message.sender_id == inbox.user_id) | (Message.sender_id == inbox.contact_user_id),
                (Message.recipient_id == inbox.user_id) | (Message.recipient_id == inbox.contact_user_id),
                Message.id.between(inbox.first_message_id, inbox.last_message_id)
                ).all()]
            
            if inbox_message_dict:
                response = make_response(inbox_message_dict, 200)
            else:
                response = make_response({"error" : f"Message with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response

api.add_resource(MessageByInboxId, '/messages/inbox/<int:id>')


class MessageById(Resource):
    def get(self, id):
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
    
    def patch(self, id):
        return
    
    def delete(self, id):
        try:
            message = Message.query.filter(Message.id == id).first()
            if message:
                db.session.delete(message)
                db.session.commit()
                response = make_response('',204)
            else:
                response = make_response({"error" : f"Message with id {id} not found"}, 404)
        except Exception as e:
            response = make_response({"error" : f"An error occurred: {str(e)}"}, 500)
        return response

api.add_resource(MessageById, '/message/<int:id>')

class Inboxes(Resource):
    def post(self):
        try: 
            if request.headers.get('Content-Type') == 'application/json':
                form_data = request.get_json()
            else: 
                form_data = request.form

            new_inbox = Inbox(
                user_id = form_data['user_id'],
                contact_user_id = form_data['contact_user_id'],
                first_message_id = form_data['first_message_id'],
                last_message_id = form_data['last_message_id'],
                )
            
            db.session.add(new_inbox)
            db.session.commit()

            response = make_response(new_inbox.to_dict(), 201)

        except Exception as e: 
            return {"errors": [str(e)]}, 400
        return response
    
api.add_resource(Inboxes, '/inboxes')

class InboxesByUserId(Resource):
    def get(self, id):
        try: 
            inbox_dict = [inbox.to_dict() for inbox in Inbox.query.filter(Inbox.user_id == id)]
            response = make_response(inbox_dict, 200)
        except: 
            response = make_response({"error" : "Inbox not found"}, 404)
        return response
    
api.add_resource(InboxesByUserId, '/user/<int:id>/inboxes')

class InboxById(Resource):
    def get(self, id):
        try: 
            inbox_dict = Inbox.query.filter(Inbox.id == id).first().to_dict()
            response = make_response(inbox_dict, 200)
        except: 
            response = make_response({"error" : "Inbox not found"}, 404)
        return response

    def patch(self, id):
        return 
    
    def delete(self, id):
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