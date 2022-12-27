from django.urls import path
from .views import AuthController
from .views import PublicController

urlpatterns = [
    path('auth/signup', AuthController.postSignup),
    path('auth/signin', AuthController.postSignin),
    path('auth/signout', AuthController.postSignout),
    path('', PublicController.home)
]