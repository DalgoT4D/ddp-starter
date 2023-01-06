from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Cache
from django.core.cache import cache

# Helpers
from utils.helpers.helpers import *

# Exceptions
from utils.exceptions.CustomException import CustomException

# Models
from ..models.User import User

# Middlewares
from utils.middlewares.AuthenticateMiddleware import authenticate

@api_view(['GET'])
def getProfile(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        return api('', {'first_name': user.first_name, 'last_name': user.last_name, 'uuid': user.uuid, 'status': user.status})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)