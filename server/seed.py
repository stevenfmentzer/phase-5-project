from random import random, randint, choice as rc
from sqlalchemy import or_
from faker import Faker
from app import app
from models import db, User, Friendship, Inbox, Message
import argparse
import math
import random

fake = Faker()


def create_user_object():
    new_user = User(
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        phone_number=fake.numerify('##########') ,
        email=fake.email()
    )
    # Set the password using the setter method
    password = fake.password()
    user_passwords.append(password)
    new_user.password_hash = password
    return new_user

def create_friendship_object(user1_id, user2_id):
    new_friendship = Friendship(
        user1_id=user1_id,
        user2_id=user2_id,
        is_close_friend_user1=fake.boolean(),
        is_close_friend_user2=fake.boolean()
    )
    return new_friendship

def create_inbox_object(user_id, contact_user_id, friendship):
    new_inbox = Inbox(
    user_id=user_id,
    contact_user_id=contact_user_id,
    friendship_id=friendship.id
    )
    return new_inbox

def create_message_object(sender_id, recipient_id):
    # Query the database to get the ID of the last message sent from sender_id to recipient_id
    parent_message = Message.query \
    .filter(or_((Message.sender_id == sender_id) & (Message.recipient_id == recipient_id),
                (Message.sender_id == recipient_id) & (Message.recipient_id == sender_id))) \
    .order_by(Message.id.desc()) \
    .first()

    # Create the new message object
    new_message = Message(
        sender_id=sender_id,
        recipient_id=recipient_id,
        message_body = fake.paragraph(nb_sentences=1, variable_nb_sentences=True, ext_word_list=None)
    )
    db.session.add(new_message)
    db.session.commit()

    # If there wasn't a parent message, parent & child properties will be set to self.id
    if parent_message:
        # Set parent_message_id to the ID of the last message
        new_message.parent_message_id = parent_message.id
        # Set parent_message.child_message.id to the ID of the new message
        parent_message.child_message_id = new_message.id
        db.session.commit()

    return new_message


def calculate_possible_friendships(num_users):
    if num_users < 2:
        return 0  # Not enough users to form friendships
    
    # Calculate the number of possible friendships using the combination formula
    num_friendships = math.comb(num_users, 2)
    return num_friendships

if __name__ == '__main__':
    with app.app_context():
        # CLI Argparse for specified num_users
        # Defaults to 25
        parser = argparse.ArgumentParser(description="Seed script for database population")
        parser.add_argument("num_users", type=int, nargs='?', default=25, help="Number of users to generate (default: 20)")
        args = parser.parse_args()

        num_users = args.num_users
        num_friendships = calculate_possible_friendships(num_users)

        # Clear all tables of existing data
        models = [User, Friendship, Inbox, Message]
        print("Clearing db...")
        for model in models:
            model.query.delete()
            print(f"{model} cleared")

        # Repopulate the tables with new data
        print("Seeding Tables")
        print("...")

        # Create new Users and save un-encrypted passwords
        print(f"Users: {num_users}")
        user_passwords = []
        for _ in range(num_users):
            user = create_user_object()
            db.session.add(user)
            db.session.commit()

        # Create Max number of Friendships
        print(f"Friendships: {num_friendships}")
        print(f"Inboxes: {num_friendships*2}")
        print(f"Messages: {num_friendships*30}")
        print("...")
        for user1_id in range(1, num_users+1):
            for user2_id in range(user1_id + 1, num_users+1):
                # Make Friendship
                friendship = create_friendship_object(user1_id, user2_id)
                # Set message_count to 10
                friendship.message_count = 10
                db.session.add(friendship)
                db.session.commit()
                # Make two Inboxes
                user1_inbox = create_inbox_object(user1_id, user2_id, friendship)
                user2_inbox = create_inbox_object(user2_id, user1_id, friendship)
                # Commit Friendship and Inboxes
                db.session.add_all([user1_inbox, user2_inbox])
                db.session.commit()

                # Make Initial Message and set Inboxes first and last message to ID of Initial Message
                initial_message = create_message_object(user1_id, user2_id)
                db.session.commit()
                
                user1_inbox.first_message_id = initial_message.id
                user1_inbox.last_message_id = initial_message.id
                user2_inbox.first_message_id = initial_message.id
                user2_inbox.last_message_id = initial_message.id
                db.session.commit()

                # Make Subsequent Messages
                for _ in range(1,30):
                    sender_id, recipient_id = random.sample([user1_id, user2_id], k=2)
                    message = create_message_object(sender_id, recipient_id)
                    db.session.commit()
                    user1_inbox.last_message_id = message.id
                    user2_inbox.last_message_id = message.id
                    db.session.commit()
        

        # Write User email & passwords to a file
        with open('user_passwords.txt', 'w') as f:
            for user, password in zip(User.query.all(), user_passwords):
                f.write(f"Email: {user.email}, Password: {password}\n")
        print("Done seeding!")