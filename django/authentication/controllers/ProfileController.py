from django.shortcuts import render
from rest_framework.decorators import api_view
import jwt
import os

# Cache
from django.core.cache import cache

# Helpers
from utils.helpers import *

# Exceptions
from utils.CustomException import CustomException

# Models
from ..models import User

@api_view(['GET'])
def getProfile(request):
    try:
        headerToken = request.headers.get('Authorization')

        if(headerToken is None):
            raise CustomException('Authentication Failed. Please ensure you have logged in.', 422)

        token = headerToken.replace('Bearer ', '')

        try:
            verify = jwt.decode(token, os.getenv('JWT_SECRET'), ['HS256'])
        except jwt.exceptions.InvalidTokenError:
            raise CustomException('Authentication Failed. Please try again.', 422)

        redisToken = cache.get(verify['uuid'])

        if(token != redisToken):
            raise CustomException('Authentication Failed', 422)

        user = User.objects.filter(uuid=verify['uuid']).first()

        if(user is None):
            raise CustomException('User does not exist', 401)

        return api('', {'first_name': user.first_name, 'last_name': user.last_name, 'uuid': user.uuid, 'status': user.status})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)