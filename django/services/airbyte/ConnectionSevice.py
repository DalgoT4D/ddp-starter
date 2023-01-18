import os
import requests
import json

# Exceptions
from utils.exceptions.CustomException import CustomException

airbyte_uri = os.getenv('AIRBYTE_API_URL')
username = os.getenv('AIRBYTE_USERNAME')
password = os.getenv('AIRBYTE_PASSWORD')

def discoverSourceSchema(sourceId):
    try:
        payload = json.dumps({ 
            "sourceId": str(sourceId),
            "disable_cache": True
        })
        res = requests.post(airbyte_uri + '/sources/discover_schema', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200 or data['jobInfo']['succeeded'] is False:
            raise CustomException('Failed to fetch source schema', 500)
        return data
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)


def createConnection(sourceId, destinationId, schema_catalog, sourceCatalogId):
    try:
        payload = json.dumps({ 
            "sourceId": str(sourceId),
            "destinationId": str(destinationId),
            "status": "active",
            "syncCatalog": schema_catalog,
            "sourceCatalogId": sourceCatalogId
        })
        res = requests.post(airbyte_uri + '/web_backend/connections/create', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], 500)
        return data
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)

def triggerDataSync(connectionId):
    try:
        payload = json.dumps({ 
            "connectionId": connectionId
        })
        res = requests.post(airbyte_uri + '/connections/sync', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], 500)
        return data
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)