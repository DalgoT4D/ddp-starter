import uuid
from django.db import models
from .Organisation import Organisation

# Create your models here.
class User(models.Model):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    uuid = models.UUIDField(default=uuid.uuid4)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    status = models.CharField(max_length=50, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    class Meta:
        db_table = 'users'
        app_label = 'app'
