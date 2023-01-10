from rest_framework import serializers

class postAirbyteConnector(serializers.Serializer):
    name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please enter the name of your connector',
            'blank': 'Please enter the name of your connector'
        }
    )
    creds = serializers.JSONField(
        required=True,
        error_messages={
            'required': 'Please enter your connector credentials',
            'blank': 'Please enter your connector credentials',
        }
    )
    definition_id = serializers.UUIDField(
        required=True,
        error_messages={
            'required': 'Please select the source type',
            'blank': 'Please select the source type',
        }
    )
    definition_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            'required': 'Please select the type of the connector',
            'blank': 'Please select the type of the connector'
        }
    )
    type = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Please mention the connector type. Only allowed values are source or destination',
        }
    )

class putAirbyteConnector(serializers.Serializer):
    name = serializers.CharField(
        required=False,
        allow_blank=False,
        error_messages={
            'blank': 'Please enter the source connector'
        }
    )
    creds = serializers.JSONField(
        required=False,
        error_messages={
            'blank': 'Please enter your connector credentials',
        }
    )
    definition_id = serializers.UUIDField(
        required=False,
        error_messages={
            'required': 'Please select the source type',
            'blank': 'Please select the source type',
        }
    )
    definition_name = serializers.CharField(
        required=False,
        allow_blank=False,
        error_messages={
            'required': 'Please select the type of the connector',
            'blank': 'Please select the type of the connector'
        }
    )
    type = serializers.CharField(
        required=False,
        error_messages={
            'required': 'Please mention the connector type. Only allowed values are source or destination',
        }
    )