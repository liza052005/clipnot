from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Аутентификация
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Пользователь
    path('auth/profile/', views.UserProfileView.as_view(), name='user_profile'),
    
    # Видео
    path('videos/', views.VideoListCreateView.as_view(), name='video_list_create'),
    path('videos/<int:pk>/', views.VideoDetailView.as_view(), name='video_detail'),
    path('videos/stats/count/', views.user_videos_count, name='user_videos_count'),
]