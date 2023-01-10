from django.urls import path
from .controllers import AuthController
from .controllers import PublicController
from .controllers import ProfileController
from .controllers import AirbyteConnectorController

urlpatterns = [
    path('auth/signup', AuthController.postSignup),
    path('auth/signin', AuthController.postSignin),
    path('auth/signout', AuthController.postSignout),
    path('auth/profile', ProfileController.getProfile),
    
    path('', PublicController.home),

    path('api/airbyte/connectors', AirbyteConnectorController.getAirbyteConnectors),
    path('api/airbyte/connectors/create', AirbyteConnectorController.postAirbyteConnector),
    path('api/airbyte/source_definitions', AirbyteConnectorController.getAirbyteSourceDefinitions),
    path('api/airbyte/source_definitions/<str:definition_uuid>/specs', AirbyteConnectorController.getAirbyteSourceDefinitionSpecs),
    path('api/airbyte/connectors/<str:connector_uuid>', AirbyteConnectorController.getAirbyteConnector),
    path('api/airbyte/connectors/<str:connector_uuid>/update', AirbyteConnectorController.putAirbyteConnector),
    path('api/airbyte/connectors/<str:connector_uuid>/delete', AirbyteConnectorController.deleteAirbyteConnector),

    path('api/public/organisations', PublicController.getOrganisations)
]