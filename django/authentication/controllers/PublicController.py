from django.shortcuts import render
from rest_framework.decorators import api_view
from utils.helpers import *

# Create your views here.
@api_view(['GET'])
def home(request):
    return api('Welcome to django backend services', {})
