import os

destination  = {
    'default': {
        "creds": {
            "host": os.getenv('DEFAULT_DESTINATION_HOST'),
            "password": os.getenv('DEFAULT_DESTINATION_PASSWORD'),
            "port": int(os.getenv('DEFAULT_DESTINATION_PORT')),
            "database": os.getenv('DEFAULT_DESTINATION_DATABASE'),
            "schema": os.getenv('DEFAULT_DESTINATION_SCHEMA'),
            "username": os.getenv('DEFAULT_DESTINATION_USERNAME'),
        },
        "destinationDefinitionId": os.getenv('DEFAULT_DESTINATION_DEFINITION_ID'),
        "name": os.getenv('DEFAULT_DESTINATION_DEFINITION_NAME'),
    }
}