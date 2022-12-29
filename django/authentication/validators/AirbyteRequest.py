from rest_framework import serializers

class postAirbyteConnection(serializers.Serializer):
    connector = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please enter the name of source connector',
            'blank': 'Please enter the source connector'
        }
    )
    creds = serializers.JSONField(
        required=True,
        error_messages={
            'required': 'Please enter your connector credentials',
            'blank': 'Please enter your connector credentials',
        }
    )