import uuid
from django.db import models
from .User import User
from .Organisation import Organisation
from .AirbyteConnector import AirbyteConnector

# Create your models here.
class AirbyteConnection(models.Model):
    uuid = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    source = models.ForeignKey(AirbyteConnector, on_delete=models.CASCADE, related_name='source')
    destination = models.ForeignKey(AirbyteConnector, on_delete=models.CASCADE, related_name='destination')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    class Meta:
        db_table = 'airbyte_connections'
        app_label = 'app'