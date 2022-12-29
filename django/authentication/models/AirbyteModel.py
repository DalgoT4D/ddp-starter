import uuid
from django.db import models
from .UserModel import User

# Create your models here.
class Airbyte(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    connector = models.CharField(max_length=255, null=True, blank=True)
    creds = models.JSONField(null=True)
    status = models.CharField(max_length=50, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    class Meta:
        db_table = 'airbyte'
        app_label = 'authentication'