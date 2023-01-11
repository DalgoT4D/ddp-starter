import os
import requests
import json

# Exceptions
from utils.exceptions.CustomException import CustomException

airbyte_uri = os.getenv('AIRBYTE_API_URL')
username = os.getenv('AIRBYTE_USERNAME')
password = os.getenv('AIRBYTE_PASSWORD')

def fetchSourceDefinitions():
    try:
        res = requests.post(airbyte_uri + '/source_definitions/list', auth=(username, password), headers={
            'Content-Type': 'application/json'
        })
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], res.status_code)
        return res.json()
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)

def fetchSourceDefinitionSpecs(sourceDefinitionId, workspaceId):
    try:
        payload = json.dumps({ "sourceDefinitionId": sourceDefinitionId, "workspaceId": workspaceId  })
        res = requests.post(airbyte_uri + '/source_definition_specifications/get', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], res.status_code)
        return res.json()
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)


def createSource(sourceDefinitionId, workspaceId, connectionConfiguration, name):
    try:
        payload = json.dumps({ 
            "sourceDefinitionId": str(sourceDefinitionId), 
            "workspaceId": workspaceId, 
            "connectionConfiguration": connectionConfiguration, 
            "name": name  
        })
        res = requests.post(airbyte_uri + '/sources/create', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], res.status_code)
        return res.json()
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)

def updateSource(sourceId, connectionConfiguration, name):
    try:
        payload = json.dumps({ 
            "sourceId": str(sourceId),
            "connectionConfiguration": connectionConfiguration, 
            "name": name  
        })
        res = requests.post(airbyte_uri + '/sources/update', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], res.status_code)
        return res.json()
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)

def deleteSource(sourceId):
    try:
        payload = json.dumps({ 
            "sourceId": str(sourceId)
        })
        res = requests.post(airbyte_uri + '/sources/delete', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        if res.status_code != 200 and res.status_code != 204:
            raise CustomException('Something went wrong in deleting source', res.status_code)
        return True
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)
