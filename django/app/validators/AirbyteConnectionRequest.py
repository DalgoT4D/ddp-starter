from rest_framework import serializers

class postDiscoverSourceSchema(serializers.Serializer):
    source_id = serializers.UUIDField(
        required=True,
        error_messages={
            'required': 'Please select the source type',
        }
    )

class postSourceAndConnection(serializers.Serializer):
    source_id = serializers.UUIDField(
        required=False,
        error_messages={
            'required': 'Please select the source type',
        }
    )
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
    type = serializers.CharField(
        required=True,
        error_messages={
            'required': 'Please mention the connector type. Only allowed values are source or destination',
        }
    )
    data_type = serializers.CharField(
        required=False,
        error_messages={
            'required': 'Please select the type of data',
        }
    )