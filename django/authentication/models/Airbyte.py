import uuid
from django.db import models
from .User import User
from .Organisation import Organisation

# Create your models here.
class Airbyte(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    connector = models.CharField(max_length=255, null=True, blank=True)
    connector_type = models.CharField(max_length=100, null=True)
    creds = models.JSONField(null=True)
    status = models.CharField(max_length=50, default='active')
    type = models.CharField(max_length=100, default='source')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    class Meta:
        db_table = 'airbyte'
        app_label = 'authentication'