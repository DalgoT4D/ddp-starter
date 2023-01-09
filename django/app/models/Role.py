import uuid
from django.db import models

# Create your models here.
class Role(models.Model):
    slug = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now= True)

    class Meta:
        db_table = 'roles'
        app_label = 'app'