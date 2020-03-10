from django.conf import settings
from django.db import models
from urbanlib.topics.models import Topic

class Entry(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, related_name='entry_list', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField("Created At", auto_now_add=True)
