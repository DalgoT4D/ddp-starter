from django.shortcuts import render
from rest_framework.decorators import api_view
import bcrypt

# Cache
from django.core.cache import cache

# Helpers
from utils.helpers.helpers import *
from utils.helpers.AuthTokenHelper import *

# Validators
from ..validators import AuthRequest

# Models
from ..models.UserModel import User

# Exceptions
from utils.exceptions.CustomException import CustomException

# Middlewares
from utils.middlewares.AuthenticateMiddleware import authenticate

# Create your views here.
@api_view(['POST'])
def postSignup(request):
    try:
        validation = AuthRequest.postSignup(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        # Check if user exists
        user = User.objects.filter(email=validation.data['email']).first()

        if(user):
            raise CustomException('User with the email already exists. Please enter different email', 422)

        # If not create a new one
        user = User(
            first_name=validation.data['first_name'],
            last_name=validation.data['last_name'],
            email=validation.data['email'],
            password=bcrypt.hashpw(validation.data['password'].encode('utf-8'), bcrypt.gensalt()).decode(),
            username=validation.data['email']
        )
        user.save()

        # Set token in redis cache
        token = generateAuthToken({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'uuid': str(user.uuid)
        })

        cache.set(user.uuid, token, None)

        return api('Successfully signed up', { 'token': token, 'status': user.status }) 
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['POST'])
def postSignin(request):
    try:
        validation = AuthRequest.postSignin(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        # Check if user exists
        user = User.objects.filter(email=validation.data['email']).first()

        if(user is None):
            raise CustomException('User does not exist', 401)

        # Verify creds if user exists
        if(bcrypt.checkpw(validation.data['password'].encode('utf-8'), user.password.encode('utf-8')) is not True):
            raise CustomException('Invalid credentials', 422)

        # Set token in redis cache
        token = generateAuthToken({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'uuid': str(user.uuid)
        })

        cache.set(user.uuid, token, None)

        return api('Signed in successfully', { 'token': token })
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)
    

@api_view(['POST'])
def postSignout(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        cache.delete(user.uuid)

        return api('Signed out successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)
 