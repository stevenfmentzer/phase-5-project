from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
import re

#Import database and bcrypt from config.py
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.VARCHAR(20), nullable=False)
    last_name = db.Column(db.VARCHAR(20), nullable=False)
    phone_number = db.Column(db.VARCHAR(20), nullable=False, unique=True)
    email = db.Column(db.VARCHAR(320), nullable=False, unique=True)
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    available_status = db.Column(db.Boolean, default=False)
    _password_hash = db.Column(db.VARCHAR)

    #### RELATIONSHIPS ####

    # Relationship with messages sent by the user
    sent_messages = db.relationship('Message', back_populates='sender', foreign_keys='Message.sender_id')

    # Relationship with messages received by the user
    received_messages = db.relationship('Message', back_populates='recipient', foreign_keys='Message.recipient_id')

    # Relationship with inboxes related to the user
    inboxes = db.relationship('Inbox', back_populates='user', foreign_keys='Inbox.user_id')

    # Relationship with friendships where the user is the first user
    friendships_user1 = db.relationship('Friendship', back_populates='user1')

    # Relationship with friendships where the user is the second user
    friendships_user2 = db.relationship('Friendship', back_populates='user2')

    #### SERIALIZATION RULES ####

    serialize_rules = ('-sent_messages', '-received_messages', '-friendships', '-inboxes')

    #### VALIDATIONS ####

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    # Check name values are between 1-20 characters, strip spaces ' ', capitalize first letter of each
    @validates('first_name', 'last_name')
    def validate_name(self, key, value):
        value = value.strip().title()
        if not 1 <= len(value) <= 20:
            raise ValueError(f"{key} must be a String between 1-20 characters")
        return value 
    
    # Check phone number contains only numerals
    @validates('phone_number')
    def validate_phone_number(self, key, value):
        if value is None:
            raise ValueError(f"{key} cannot be None")
        
        # remove characters that maye be manually entered into a phone number [(,),+.-]
        value = value.translate({ord('('): None, ord(')'): None, ord('-'): None, ord('+'): None})
        pattern = r'^[\d+]+$'
        if not re.match(pattern, value):
            raise ValueError(f"{key} must only contain numerals")
        return value
    
    @validates('email')
    def validates_email(self, key, value):
        if not value:
            raise ValueError("Email address cannot be empty")

        # Regular expression pattern to validate email addresses
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

        if not re.match(email_pattern, value):
            raise ValueError("Invalid email address")

        # Check if the email address is less than 320 characters long
        if len(value) >= 320:
            raise ValueError("Email address must be less than 320 characters")

        return value
    
    def __repr__(self):
        return f'<User id: {self.id}\n \
                    name: {self.first_name} {self.last_name}\n \
                    phone number: {self.phone_number}\n \
                    email: {self.email}\n \
                    password: {self._password_hash}\n \
                    join date: {self.join_date}\n \
                    availability status: {self.available_status}\n \
                    >'

class Friendship(db.Model, SerializerMixin):
    __tablename__ = 'friendships'

    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    is_active = db.Column(db.Boolean, default=False)
    is_close_friend = db.Column(db.Boolean, default=False)
    creation_date = db.Column(db.DateTime, default=datetime.utcnow)
    message_count = db.Column(db.Integer, default=0)

    #### RELATIONSHIPS ####

    # Relationship with the first user
    user1 = db.relationship('User', foreign_keys='Friendship.user1_id', back_populates='friendships_user1')

    # Relationship with the second user
    user2 = db.relationship('User', foreign_keys='Friendship.user2_id', back_populates='friendships_user2')

    #### SERIALIZATION RULES ####
    
    serialize_rules = ('-user1', '-user2')

    #### VALIDATIONS ####

    # Ensure the provided User.ID's exist
    @validates('user1_id', 'user2_id')
    def validates_users(self, key, value):
        user = User.query.get(value)

        if user is None:
            raise ValueError(f"No {key} found with ID: {value}")
        return value


    def __repr__(self):
        return f'<Friendship id: {self.id}\n \
                    user1_id: {self.user1_id}\n \
                    user2_id: {self.user2_id}\n \
                    is_active: {self.is_active}\n \
                    is_close_friend: {self.is_close_friend}\n \
                    creation_date: {self.creation_date}\n \
                    message_count: {self.message_count}\n \
                    >'    
    
class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    parent_message_id = db.Column(db.Integer, db.ForeignKey('messages.id'))
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    sent_time = db.Column(db.DateTime, default=datetime.utcnow)
    delivery_time = db.Column(db.DateTime)
    message_body = db.Column(db.VARCHAR(400))
    is_read = db.Column(db.Boolean, default=False)

    #### RELATIONSHIPS ####

    # Relationship with parent message
    # `remote_side='Message.id` defines the relationship from the perspective of the child_message
    child_message = db.relationship('Message', back_populates='parent_message', remote_side='Message.id')
    parent_message = db.relationship('Message', back_populates='child_message')

    #### SERIALIZATION RULES ####

    serialize_rules = ('-parent_message', '-child_message')

    #### VALIDATIONS ####

    @validates('sender_id', 'recipient_id')
    def validates_users(self, key, value):
        user = User.query.get(value)

        if user is None:
            raise ValueError(f"No {key} found with ID: {value}")
        return value
    
    @validates('parent_message_id')
    def validates_parent_message(self, key, value):
        message = Message.query.get(value)

        if message is None: 
            raise ValueError(f"No {key} found with ID: {value}")
        return value
    

    def __repr__(self):
        return f'<Message id: {self.id}\n \
                    parent_message_id: {self.parent_message_id}\n \
                    sender_id: {self.sender_id}\n \
                    recipient_id: {self.recipient_id}\n \
                    sent_time: {self.sent_time}\n \
                    delivery_time: {self.delivery_time}\n \
                    message_body: {self.message_body}\n \
                    is_read: {self.is_read}\n \
                    >'    
    
class Inbox(db.Model, SerializerMixin):
    __tablename__ = 'inboxes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    contact_user_id = db.Column(db.Integer)
    last_message_id = db.Column(db.Integer)

    #### RELATIONSHIP ####

    # Relationship with the last message in the inbox
    last_message = db.relationship('Message', back_populates='inbox')

    # Relationship with the contact user in the inbox
    contact_user = db.relationship('User', back_populates='contact_inboxes', foreign_keys='Inbox.contact_user_id')

    #### SERIALIZATION RULES ####

    serialize_rules = ('-last_message', '-contact_user')

    #### VALIDATIONS ####

    # Ensure the provided User.ID's exist
    @validates('user_id', 'contact_user_id')
    def validates_users(self, key, value):
        user = User.query.get(value)

        if user is None:
            raise ValueError(f"No {key} found with ID: {value}")
        return value
    
    @validates('last_message_id')
    def validates_last_message(self, key, value):
        message = Message.query.get(value)

        if message is None: 
            raise ValueError(f"No {key} found with ID: {value}")
        return value 

    def __repr__(self):
        return f'<Inbox id: {self.id}\n \
                    user_id: {self.user_id}\n \
                    contact_user_id: {self.contact_user_id}\n \
                    last_message_id: {self.last_message_id}\n \
                    >'    