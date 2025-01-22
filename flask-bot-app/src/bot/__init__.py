# FILE: /flask-bot-app/flask-bot-app/src/bot/__init__.py

from flask import Blueprint

bot_bp = Blueprint('bot', __name__)

from . import services  # Import services to register routes and functionalities