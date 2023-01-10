import uuid
from django.db import models
from .User import User
from .Organisation import Organisation

# Create your models here.
class AirbyteConnector(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    definition_id = models.UUIDField(null=False, blank=False)
    definition_name = models.CharField(max_length=255, null=False, blank=False)
    creds = models.JSONField(null=True)
    status = models.CharField(max_length=50, default='active')
    type = models.CharField(max_length=100, default='source')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    class Meta:
        db_table = 'airbyte_connectors'
        app_label = 'app'