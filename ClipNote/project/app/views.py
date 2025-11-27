from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from .models import Video
from .serializers import UserRegistrationSerializer, UserSerializer, VideoSerializer
import threading
from .video_processor import process_video

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

class VideoListCreateView(generics.ListCreateAPIView):
    serializer_class = VideoSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Video.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        video = serializer.save(user=self.request.user)
        # Запускаем обработку видео в фоновом режиме
        threading.Thread(target=process_video, args=(video.id,)).start()

class VideoDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = VideoSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Video.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_videos_count(request):
    count = Video.objects.filter(user=request.user).count()
    return Response({'count': count})