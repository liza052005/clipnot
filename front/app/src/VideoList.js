import React from 'react';

const VideoList = ({ videos, onDeleteVideo, onRefresh }) => {
  const getStatusText = (status) => {
    const statusMap = {
      processing: '🔄 В обработке',
      completed: '✅ Завершено',
      error: '❌ Ошибка'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `video-status video-status-${status}`;
  };

  if (videos.length === 0) {
    return (
      <div className="videos-container">
        <div className="videos-header">
          <h2>Мои видео</h2>
          <button onClick={onRefresh} className="refresh-btn">
            Обновить
          </button>
        </div>
        <div className="empty-state">
          <p>Пока нет добавленных видео</p>
          <p>Добавьте ссылку на видео выше, чтобы получить конспект</p>
        </div>
      </div>
    );
  }

  return (
    <div className="videos-container">
      <div className="videos-header">
        <h2>Мои видео ({videos.length})</h2>
        <button onClick={onRefresh} className="refresh-btn">
          Обновить
        </button>
      </div>
      
      <div className="videos-list">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-header">
              <h3 className="video-url">{video.url}</h3>
              <div className="video-actions">
                <span className={getStatusClass(video.status)}>
                  {getStatusText(video.status)}
                </span>
                <button 
                  onClick={() => onDeleteVideo(video.id)}
                  className="delete-btn"
                  title="Удалить видео"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="video-dates">
              <small>Добавлено: {new Date(video.created_at).toLocaleString('ru-RU')}</small>
              {video.updated_at !== video.created_at && (
                <small>Обновлено: {new Date(video.updated_at).toLocaleString('ru-RU')}</small>
              )}
            </div>

            {video.summary && (
              <div className="video-summary">
                <h4>Конспект:</h4>
                <div className="summary-content">
                  {video.summary.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {video.status === 'processing' && (
              <div className="processing-indicator">
                <div className="spinner"></div>
                <span>Идет обработка видео...</span>
              </div>
            )}

            {video.status === 'error' && (
              <div className="error-indicator">
                <span>Произошла ошибка при обработке видео</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;