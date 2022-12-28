from django.urls import path
from .controllers import AuthController
from .controllers import PublicController
from .controllers import ProfileController

urlpatterns = [
    path('auth/signup', AuthController.postSignup),
    path('auth/signin', AuthController.postSignin),
    path('auth/signout', AuthController.postSignout),
    path('auth/profile', ProfileController.getProfile),
    path('', PublicController.home)
]