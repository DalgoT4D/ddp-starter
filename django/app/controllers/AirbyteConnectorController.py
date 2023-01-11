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
from services.airbyte.DestinationService import *

# Config
from utils.config.config import destination

@api_view(['POST'])
def postAirbyteConnector(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteConnectorRequest.postAirbyteConnector(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Organisation not mapped', 422)

        credentials = {}
        for key, value in validation.data['creds'].items():
            if value != "" and value is not None:
                credentials[key] = value

        # Create airbyte source/destination
        data = {}
        if(validation.data['type'] == 'source'):
            data = createSource(validation.data['definition_id'], organisation.airbyte_workspace_id, credentials, validation.data['name'])
        else:
            data = createDestination(validation.data['definition_id'], organisation.airbyte_workspace_id, credentials, validation.data['name'])

        airbyteConnector = AirbyteConnector(
            uuid=data['sourceId'] if validation.data['type'] == 'source' else data['destinationId'],
            user_id=user.id,
            organisation_id=user.organisation_id,
            name=data['name'],
            definition_id=data['sourceDefinitionId'] if validation.data['type'] == 'source' else data['destinationDefinitionId'],
            definition_name=data['sourceName'] if validation.data['type'] == 'source' else data['destinationName'],
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
        
        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Organisation not mapped', 422)

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

        credentials = {}
        for key, value in validation.data['creds'].items():
            if value != "" and value is not None:
                credentials[key] = value

        if(validation.data['type'] == 'source'):
            updateSource(str(connector.uuid), credentials, validation.data['name'])
        else:
            updateDestination(str(connector.uuid), credentials, validation.data['name'])

        connector.name = validation.data['name'] if('name' in validation.data.keys()) else connector.name
        connector.creds = validation.data['creds'] if('creds' in validation.data.keys() and len(validation.data['creds']) > 0) else connector.creds
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

        if connector.type == 'source':
            res = deleteSource(connector.uuid)
        else:
            res = deleteDestination(connector.uuid)

        connector.delete()

        return api('Airbyte connector deleted succesfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnectorDefinitions(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        query = { 'type': 'source' }

        if (request.GET.get('type')):
            query['type'] = request.GET.get('type')

        definitions = fetchSourceDefinitions() if query['type'] == 'source' else fetchDestinationDefinitions()

        apiRes = definitions['sourceDefinitions' if query['type'] == 'source' else 'destinationDefinitions']

        for defObj in apiRes:
            defObj['uuid'] = defObj['sourceDefinitionId' if query['type'] == 'source' else 'destinationDefinitionId']

        return api('Airbyte connector definitions fetched', apiRes)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)

@api_view(['GET'])
def getAirbyteConnectorDefinitionSpecs(request, definition_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Please make sure the user is mapped to an organisation', 422)

        query = { 'type': 'source' }

        if (request.GET.get('type')):
            query['type'] = request.GET.get('type')

        data = {}

        if query['type'] == 'source':
            data = fetchSourceDefinitionSpecs(definition_uuid, organisation.airbyte_workspace_id)
        else:
            data = fetchDestinationDefinitionSpecs(definition_uuid, organisation.airbyte_workspace_id)

        connectionConfig = data['connectionSpecification']

        apiRes = []
        for key, value in connectionConfig['properties'].items():
            if key in connectionConfig['required']:
                value['required'] = True
            else:
                value['required'] = False
            value['field'] = key
            apiRes.append(value)

        apiRes.sort(key=lambda x: x['order'] if 'order' in x.keys() else 0)

        return api('Airbyte connector definition specs fetched', apiRes)
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['POST'])
def postAirbyteDefaultDestinationConnector(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Organisation not mapped', 422)

        print(destination['default']['destinationDefinitionId'],
            organisation.airbyte_workspace_id,
            destination['default']['creds'],
            destination['default']['name'] + ' default')

        # Create airbyte destination
        data = createDestination(
            destination['default']['destinationDefinitionId'],
            organisation.airbyte_workspace_id,
            destination['default']['creds'],
            destination['default']['name'] + ' default'
        )


        airbyteConnector = AirbyteConnector(
            uuid=data['destinationId'],
            user_id=user.id,
            organisation_id=user.organisation_id,
            name=data['name'],
            definition_id=data['destinationId'],
            definition_name=data['destinationName'],
            creds=data['connectionConfiguration'],
            type='destination'
        )
        airbyteConnector.save()

        return api('Airbyte connector details saved successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)