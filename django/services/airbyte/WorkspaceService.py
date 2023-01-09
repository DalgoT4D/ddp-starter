import os
import requests
import json

# Exceptions
from utils.exceptions.CustomException import CustomException

airbyte_uri = os.getenv('AIRBYTE_API_URL')
username = os.getenv('AIRBYTE_USERNAME')
password = os.getenv('AIRBYTE_PASSWORD')

def createWorkspace(name):
    try:
        payload = json.dumps({ "name": name })
        res = requests.post(airbyte_uri + '/workspaces/create', data=payload, auth=(username, password), headers={
            'Content-Type': 'application/json'
        })
        data = res.json()
        if res.status_code != 200:
            raise CustomException(data['message'], res.status_code)
        return res.json()
    except Exception as e:
        raise CustomException(str(e), e.code if isinstance(e, CustomException) else 500)
