from django.shortcuts import render
from rest_framework.decorators import api_view

# Helpers
from utils.helpers.helpers import *

# Exceptions
from utils.exceptions.CustomException import CustomException

# Models
from ..models.Organisation import Organisation

# Create your views here.
@api_view(['GET'])
def home(request):
    return api('Welcome to django backend services', {})


@api_view(['GET'])
def getOrganisations(request):
    try:
        organisations = Organisation.objects.filter().values('id', 'name')

        return api('Airbyte connection fetched succesfully', organisations)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)
