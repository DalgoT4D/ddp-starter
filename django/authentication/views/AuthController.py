from django.shortcuts import render
from rest_framework.decorators import api_view

# Cache
from django.core.cache import cache

# Helpers
from utils.helpers import *
from utils.AuthTokenHelper import *

# Validators
from ..validators import AuthRequest

# Models
from ..models import User

# Create your views here.
@api_view(['POST'])
def postSignup(request):
    try:
        validation = AuthRequest.postSignup(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        user = User(**validation.data, username=validation.data['email'])
        user.save()

        token = generateAuthToken({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'uuid': str(user.uuid)
        })

        cache.set(user.uuid, token, None)

        return api('Successfully signed up', { 'token': token, 'status': user.status }) 
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)


@api_view(['POST'])
def postSignin(request):
    try:
        validation = AuthRequest.postSignin(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        user = User.objects.get(email=validation.data['email'])

        token = cache.get(user.uuid)

        return api('Signed in successfully', { token: token })
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)

@api_view(['POST'])
def postSignout(request):
    try:
        return api('Signed out successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)
 