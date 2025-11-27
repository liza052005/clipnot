from django.contrib import admin
from .models import Video

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['url', 'user', 'status', 'created_at']
    list_filter = ['status', 'created_at', 'user']
    search_fields = ['url', 'summary']
    readonly_fields = ['created_at', 'updated_at']