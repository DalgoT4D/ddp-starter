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
from ..validators import AirbyteConnectorRequest

# Models
from ..models.AirbyteConnector import AirbyteConnector
from ..models.Organisation import Organisation

# Airbyte api services
from services.airbyte.SourceService import *

@api_view(['POST'])
def postAirbyteConnector(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteConnectorRequest.postAirbyteConnector(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        airbyteConnector = AirbyteConnector(
            user_id=user.id,
            organisation_id=user.organisation_id,
            name=validation.data['name'],
            definition_id=validation.data['definition_id'],
            definition_name=validation.data['definition_name'],
            creds=validation.data['creds'],
            type=validation.data['type']
        )
        airbyteConnector.save()

        return api('Airbyte connector details saved successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnectors(request):
    try:
        query = {}

        user = authenticate(request)

        if isinstance(user, Response):
            return user

        query['organisation_id'] = user.organisation_id

        if (request.GET.get('type')):
            query['type'] = request.GET.get('type')

        connectors = AirbyteConnector.objects.filter(**query).order_by('-created_at').values('uuid', 'name', 'definition_id', 'definition_name', 'creds', 'status', 'created_at')

        return api('Airbyte connectors fetched succesfully', connectors)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnector(request, connector_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        try:
            uuid.UUID(connector_uuid)
        except Exception as e:
            raise CustomException('Invalid request', 422)

        connector = AirbyteConnector.objects.filter(organisation_id=user.organisation_id, uuid=connector_uuid).values('uuid', 'name', 'definition_id', 'definition_name', 'creds', 'status', 'created_at').first()

        if(connector is None):
            raise CustomException('Connection does not exist', 401)

        return api('Airbyte connector fetched succesfully', connector)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['PUT'])
def putAirbyteConnector(request, connector_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteConnectorRequest.putAirbyteConnector(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        try:
            uuid.UUID(connector_uuid)
        except Exception as e:
            raise CustomException('Invalid request', 422)

        connector = AirbyteConnector.objects.filter(organisation_id=user.organisation_id, uuid=connector_uuid).first()

        if(connector is None):
            raise CustomException('Connector does not exist', 401)
            
        connector.name = validation.data['name'] if('name' in validation.data.keys()) else connector.name
        connector.creds = validation.data['creds'] if('creds' in validation.data.keys() and len(validation.data['creds']) > 0) else connector.creds
        connector.definition_id = validation.data['definition_id'] if('definition_id' in validation.data.keys()) else connector.definition_id
        connector.definition_name = validation.data['definition_name'] if('definition_name' in validation.data.keys()) else connector.definition_name
        connector.type = validation.data['type'] if('type' in validation.data.keys()) else connector.type
        connector.save()

        return api('Airbyte connector updated succesfully', {'connector': connector.name, 'creds': connector.creds, 'type': connector.type, 'status': connector.status, 'uuid': connector.uuid})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['DELETE'])
def deleteAirbyteConnector(request, connector_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        try:
            uuid.UUID(connector_uuid)
        except Exception as e:
            raise CustomException('Invalid request', 422)

        connector = AirbyteConnector.objects.filter(user_id=user.id, uuid=connector_uuid).first()

        if(connector is None):
            raise CustomException('Connector does not exist', 404)

        connector.delete()

        return api('Airbyte connector deleted succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['GET'])
def getAirbyteSourceDefinitions(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        res = fetchSourceDefinitions()

        return api('Airbyte source definitions', res['sourceDefinitions'])
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['GET'])
def getAirbyteSourceDefinitionSpecs(request, definition_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Please make sure the user is mapped to an organisation', 422)

        data = fetchSourceDefinitionSpecs(definition_uuid, organisation.airbyte_workspace_id)

        connectionConfig = data['connectionSpecification']

        data = []
        for key, value in connectionConfig['properties'].items():
            if key in connectionConfig['required']:
                value['required'] = True
            else:
                value['required'] = False
            value['field'] = key
            data.append(value)

        data.sort(key=lambda x: x['order'])

        return api('Airbyte source definitions', data)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)
