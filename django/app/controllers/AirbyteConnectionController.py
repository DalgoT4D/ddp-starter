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
from ..validators import AirbyteConnectionRequest

# Models
from ..models.AirbyteConnector import AirbyteConnector
from ..models.Organisation import Organisation
from ..models.AirbyteConnection import AirbyteConnection

# Airbyte api services
from services.airbyte.SourceService import *
from services.airbyte.DestinationService import *
from services.airbyte.ConnectionSevice import *

# Config
from utils.config.config import destination

@api_view(['POST'])
def postDiscoverSourceSchema(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteConnectionRequest.postDiscoverSourceSchema(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Organisation not mapped', 422)

        source = AirbyteConnector.objects.filter(uuid=validation.data['source_id']).first()

        if(source is None):
            raise CustomException('Source not found', 422)

        apiMes = 'Schema validated'

        res = discoverSourceSchema(source.uuid)
        
        return api(apiMes, {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['POST'])
def postSourceAndConnection(request):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        validation = AirbyteConnectionRequest.postSourceAndConnection(data=request.data)
        if validation.is_valid() is not True:
            return api_error('', validation.errors)

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Organisation not mapped', 422)

        # Check if the default warehouse detination has been added or not
        destination = AirbyteConnector.objects.filter(organisation_id=user.organisation_id).first()

        if(destination is None):
            raise CustomException('Please setup your warehouse before moving on', 422)

        # Create airbyte source. If its already created move on to validating and making a connection
        credentials = {}
        for key, value in validation.data['creds'].items():
            if value != "" and value is not None:
                credentials[key] = value

        data = createSource(validation.data['definition_id'], organisation.airbyte_workspace_id, credentials, validation.data['name'])
       
        source = AirbyteConnector(
            uuid=data['sourceId'],
            user_id=user.id,
            organisation_id=user.organisation_id,
            name=data['name'],
            definition_id=data['sourceDefinitionId'],
            definition_name=data['sourceName'],
            creds=validation.data['creds'],
            type=validation.data['type']
        )
        source.save()

        # Validate schema
        schemaData = discoverSourceSchema(source.uuid)

        # Create connection between source and destination (default for now)
        data = createConnection(source.uuid, destination.uuid, schemaData['catalog'], schemaData['catalogId'])

        connection = AirbyteConnection(
            uuid=data['connectionId'],
            user_id=user.id,
            organisation_id=organisation.id,
            source_id=source.id,
            destination_id=destination.id
        )
        connection.save()

        return api('Source created and connection established to warehouse', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)


@api_view(['POST'])
def postSyncDataForConnection(request, connection_uuid):
    try:
        user = authenticate(request)

        if isinstance(user, Response):
            return user

        organisation = Organisation.objects.filter(id=user.organisation_id).first()

        if(organisation is None):
            raise CustomException('Organisation not mapped', 422)

        data = triggerDataSync(connection_uuid)

        return api('Data synced successfully', {})
    except Exception as e:
        return api_error(str(e), {}, e.code if isinstance(e, CustomException) else 500)