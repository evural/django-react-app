from django.conf import settings
from django.db import models

# Create your models here.

class Topic(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.CharField(max_length=80)
    created_at = models.DateTimeField("Created At", auto_now_add=True)
