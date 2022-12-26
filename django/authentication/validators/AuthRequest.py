from rest_framework import serializers

class postSignup(serializers.Serializer):
    first_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please enter your first name',
            'blank': 'Please enter your first name'
        }
    )
    last_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please enter your last name',
            'blank': 'Please enter your last name'
        }
    )
    email = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please enter your email id',
            'blank': 'Please enter your email id'
        }
    )
    password = serializers.CharField(
        required=True,
        allow_blank=False,
        min_length=6,
        error_messages={
            'required': 'Please enter your password',
            'blank': 'Please enter your password',
            'min_length': 'Please make sure the password is atleast 6 characters'
        }
    )

class postSignin(serializers.Serializer):
    email = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please enter your email id',
            'blank': 'Please enter your email id'
        }
    )
    password = serializers.CharField(
        required=True,
        allow_blank=False,
        min_length=6,
        error_messages={
            'required': 'Please enter your password',
            'blank': 'Please enter your password',
            'min_length': 'Please make sure the password is atleast 6 characters'
        }
    )
