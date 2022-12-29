from rest_framework.decorators import api_view
from rest_framework.response import Response

# Helpers
from utils.helpers.helpers import *

# Exceptions
from utils.exceptions.CustomException import CustomException

# Middlewares
from utils.middlewares.AuthenticateMiddleware import authenticate

@api_view(['POST'])
def postAirbyteConnection(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        return api('Airbyte connection details saved successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnections(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        return api('Airbyte connections fetched succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        return api('Airbyte connection fetched succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['PUT'])
def putAirbyteConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        return api('Airbyte connection updated succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['DELETE'])
def deleteAirbyteConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        return api('Airbyte connection deleted succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)