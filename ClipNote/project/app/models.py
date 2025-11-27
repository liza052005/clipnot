from django.db import models

class Video(models.Model):
    url = models.URLField(unique=True, help_text="URL видео для обработки")
    summary = models.TextField(blank=True, null=True, help_text="Краткий конспект видео")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.url
