import uuid
from django.db import models

# Create your models here.
class Organisation(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    name = models.CharField(max_length=255)
    airbyte_workspace_id = models.CharField(max_length=100, null=True)
    manage_warehouse = models.BooleanField(default=False)
    warehouse_creds = models.JSONField(null=True)
    manage_github = models.BooleanField(default=False)
    git_repo = models.CharField(max_length=255, null=True)
    git_token = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = 'organisations'
        app_label = 'app'