from flask import Flask, abort, session, redirect, url_for, make_response, request, jsonify
from models import db, User, Friendship, Message, Inbox
#Import database and application from config.py
from config import app, db
import math


######### ROUTES / VIEWS #########

#### HOME ####
@app.route('/')
def home():
    return 'Here IM'