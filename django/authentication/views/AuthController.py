from django.shortcuts import render
from rest_framework.decorators import api_view

# Helpers
from utils.helpers import *

# Validators
from ..validators import AuthRequest

# Create your views here.
@api_view(['POST'])
def postSignup(request):
    try:
        validation = AuthRequest.postSignup(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)
        return api('Successfully signed up', {'user': '1'}) 
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)


@api_view(['POST'])
def postSignin(request):
    try:
        return api('Signed in successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)

@api_view(['POST'])
def postSignout(request):
    try:
        return api('Signed out successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)
 