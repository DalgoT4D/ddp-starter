from rest_framework import serializers

class postSignup(serializers.Serializer):
    first_name = serializers.CharField(
        required=True, 
        error_messages={
            'required': 'Please enter your first name'
        }
    )
    last_name = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Please enter your last name'
        }
    )
    email = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Please enter your email id'
        }
    )
    password = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Please enter your password'
        }
    )