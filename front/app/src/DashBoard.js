import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { videoAPI } from './api';
import VideoList from './VideoList';
import AddVideoForm from './AddVideoForm';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadVideos();
    const interval = setInterval(loadVideos, 5000); // Обновляем каждые 5 секунд
    return () => clearInterval(interval);
  }, []);

  const loadVideos = async () => {
    try {
      const videosData = await videoAPI.getVideos();
      setVideos(videosData);
      setLoading(false);
    } catch (error) {
      setError('Ошибка загрузки видео');
      setLoading(false);
    }
  };

  const handleAddVideo = async (url) => {
    try {
      await videoAPI.createVideo(url);
      await loadVideos(); // Перезагружаем список
    } catch (error) {
      throw new Error(error.message || 'Ошибка добавления видео');
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await videoAPI.deleteVideo(id);
      setVideos(videos.filter(video => video.id !== id));
    } catch (error) {
      setError('Ошибка удаления видео');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>ClipNote</h1>
          <p>Добро пожаловать, {user?.username}!</p>
        </div>
        <button onClick={logout} className="logout-btn">
          Выйти
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <AddVideoForm onAddVideo={handleAddVideo} />

      <VideoList 
        videos={videos} 
        onDeleteVideo={handleDeleteVideo}
        onRefresh={loadVideos}
      />
    </div>
  );
};

export default Dashboard;