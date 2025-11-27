import React, { useState } from 'react';

const AddVideoForm = ({ onAddVideo }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!url.trim()) {
      setError('Введите URL видео');
      return;
    }

    // Простая валидация URL
    try {
      new URL(url);
    } catch {
      setError('Введите корректный URL');
      return;
    }

    setLoading(true);

    try {
      await onAddVideo(url);
      setUrl('');
    } catch (error) {
      setError(error.message || 'Ошибка при добавлении видео');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-video-form">
      <h2>Добавить новое видео</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>URL видео:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={loading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Добавление...' : 'Добавить видео'}
        </button>
      </form>
      
      <div className="video-tips">
        <h4>Поддерживаемые платформы:</h4>
        <ul>
          <li>YouTube</li>
          <li>Vimeo</li>
          <li>и другие видеохостинги</li>
        </ul>
      </div>
    </div>
  );
};

export default AddVideoForm;    