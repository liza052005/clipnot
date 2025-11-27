import React, { useState } from 'react';

function VideoForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await fetch('/api/videos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError('Ошибка при отправке запроса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <label className="block mb-2 font-semibold" htmlFor="videoUrl">Ссылка на видео:</label>
        <input
          id="videoUrl"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="https://example.com/video"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Обработка...' : 'Получить конспект'}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {summary && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Краткий конспект:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default VideoForm;
