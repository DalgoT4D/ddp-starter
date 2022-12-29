from django.urls import path
from .controllers import AuthController
from .controllers import PublicController
from .controllers import ProfileController
from .controllers import AirbyteController

urlpatterns = [
    path('auth/signup', AuthController.postSignup),
    path('auth/signin', AuthController.postSignin),
    path('auth/signout', AuthController.postSignout),
    path('auth/profile', ProfileController.getProfile),
    
    path('', PublicController.home),

    path('api/airbyte', AirbyteController.getAirbyteConnections),
    path('api/airbyte/create', AirbyteController.postAirbyteConnection),
    path('api/airbyte/<str:connection_uuid>', AirbyteController.getAirbyteConnection),
    path('api/airbyte/<str:connection_uuid>/update', AirbyteController.putAirbyteConnection),
    path('api/airbyte/<str:connection_uuid>/delete', AirbyteController.deleteAirbyteConnection),
]