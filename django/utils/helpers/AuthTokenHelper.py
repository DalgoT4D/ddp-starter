import jwt
import os
from datetime import datetime, timedelta

def generateAuthToken(payload):
    payload['exp'] = datetime.utcnow() + timedelta(hours=int(os.getenv('JWT_EXPIRY_HOURS')))
    return jwt.encode(payload, os.getenv('JWT_SECRET'))