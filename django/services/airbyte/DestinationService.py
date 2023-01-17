import os
import requests
import json

# Exceptions
from utils.exceptions.CustomException import CustomException

airbyte_uri = os.getenv('AIRBYTE_API_URL')
username = os.getenv('AIRBYTE_USERNAME')
password = os.getenv('AIRBYTE_PASSWORD')

def fetchDestinationDefinitions():
    try:
        res = requests.post(airbyte_uri + '/destination_definitions/list', auth=(username, password), headers={
            'Content-Type': 'application/json'
        })
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], res.status_code)
        return res.json()
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)

def fetchDestinationDefinitionSpecs(destinationDefinitionId, workspaceId):
    try:
        payload = json.dumps({ "destinationDefinitionId": destinationDefinitionId, "workspaceId": workspaceId  })
        res = requests.post(airbyte_uri + '/destination_definition_specifications/get', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        data = res.json()
        if res.status_code != 200:
            raise CustomException('Something went wrong in deleting destination', res.status_code)
        return data
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)


def createDestination(destinationDefinitionId, workspaceId, connectionConfiguration, name):
    try:
        payload = json.dumps({ 
            "destinationDefinitionId": str(destinationDefinitionId), 
            "workspaceId": workspaceId, 
            "connectionConfiguration": connectionConfiguration, 
            "name": name
        })
        res = requests.post(airbyte_uri + '/destinations/create', 
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

def updateDestination(destinationId, connectionConfiguration, name):
    try:
        payload = json.dumps({ 
            "destinationId": str(destinationId),
            "connectionConfiguration": connectionConfiguration, 
            "name": name  
        })
        res = requests.post(airbyte_uri + '/destinations/update', 
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

def deleteDestination(destinationId):
    try:
        payload = json.dumps({ 
            "destinationId": str(destinationId)
        })
        res = requests.post(airbyte_uri + '/destinations/delete', 
            auth=(username, password), 
            data=payload,
            headers={
                'Content-Type': 'application/json'
            }
        )
        if res.status_code != 200 and res.status_code != 204:
            raise CustomException('Something went wrong in deleting destination', res.status_code)
        return True
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)

