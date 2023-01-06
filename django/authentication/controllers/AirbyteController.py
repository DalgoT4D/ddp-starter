from rest_framework.decorators import api_view
from rest_framework.response import Response
import uuid

# Helpers
from utils.helpers.helpers import *

# Exceptions
from utils.exceptions.CustomException import CustomException

# Middlewares
from utils.middlewares.AuthenticateMiddleware import authenticate

# Validations
from ..validators import AirbyteRequest

# Models
from ..models.Airbyte import Airbyte

@api_view(['POST'])
def postAirbyteConnection(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteRequest.postAirbyteConnection(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        airbyte = Airbyte(
            user_id=user.id,
            organisation_id=user.organisation_id,
            connector=validation.data['connector'],
            creds=validation.data['creds'],
        )
        airbyte.save()

        return api('Airbyte connection details saved successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnections(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        connections = Airbyte.objects.filter(organisation_id=user.organisation_id).order_by('-created_at').values('connector', 'creds', 'uuid', 'status', 'created_at')

        return api('Airbyte connections fetched succesfully', connections)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        try:
            uuid.UUID(connection_uuid)
        except Exception as e:
            raise CustomException('Invalid request', 422)

        connection = Airbyte.objects.filter(organisation_id=user.organisation_id, uuid=connection_uuid).values('connector', 'creds', 'uuid', 'status', 'created_at').first()

        if(connection is None):
            raise CustomException('Connection does not exist', 401)

        return api('Airbyte connection fetched succesfully', connection)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['PUT'])
def putAirbyteConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteRequest.putAirbyteConnection(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        try:
            uuid.UUID(connection_uuid)
        except Exception as e:
            raise CustomException('Invalid request', 422)

        connection = Airbyte.objects.filter(organisation_id=user.organisation_id, uuid=connection_uuid).first()

        if(connection is None):
            raise CustomException('Connection does not exist', 401)
            
        connection.connector = validation.data['connector'] if('connector' in validation.data.keys()) else connection.connector
        connection.creds = validation.data['creds'] if('creds' in validation.data.keys()) else connection.creds
        connection.save()

        return api('Airbyte connection updated succesfully', {'connector': connection.connector, 'creds': connection.creds, 'status': connection.status, 'uuid': connection.uuid})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['DELETE'])
def deleteAirbyteConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        try:
            uuid.UUID(connection_uuid)
        except Exception as e:
            raise CustomException('Invalid request', 422)

        connection = Airbyte.objects.filter(user_id=user.id, uuid=connection_uuid).first()

        if(connection is None):
            raise CustomException('Connection does not exist', 401)

        connection.delete()

        return api('Airbyte connection deleted succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)