from django.db import models
from django.contrib.auth.models import User

class Video(models.Model):
    STATUS_CHOICES = [
        ('processing', 'В обработке'),
        ('completed', 'Завершено'),
        ('error', 'Ошибка'),
    ]
    
    # Временно сделайте поле nullable для миграции
    user = models.ForeignKey(
    User, 
    on_delete=models.CASCADE, 
    related_name='videos'
    # null=True и blank=True удалены
)
    url = models.URLField(max_length=500, help_text="URL видео для обработки")
    summary = models.TextField(blank=True, null=True, help_text="Краткий конспект видео")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='processing'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.url} - {self.user.username if self.user else 'No user'}"

    class Meta:
        ordering = ['-created_at']