from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from utils.helpers import *

# Create your views here.
@api_view(['POST'])
def postSignup(request):
    try:
        return api('Successfully signed up', {'user': '1'}) 
    except Exception as e:
        return api_error(str(e), {}, e.code if (type(e) is dict and 'code' in e.keys()) else 500)