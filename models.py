# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    long_url = db.Column(db.String(500))
    short_url = db.Column(db.String(80), unique=True)

    def __init__(self, long_url, short_url):
        self.long_url = long_url
        self.short_url = short_url