const API_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('access_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401 && !config._retry) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          config._retry = true;
          config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
          return this.request(endpoint, config);
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
}

export const apiService = new ApiService();

export const authAPI = {
  login: (credentials) => apiService.request('/auth/token/', {
    method: 'POST',
    body: credentials,
  }),
  register: (userData) => apiService.request('/auth/register/', {
    method: 'POST',
    body: userData,
  }),
  getProfile: () => apiService.request('/auth/profile/'),
};

export const videoAPI = {
  getVideos: () => apiService.request('/videos/'),
  createVideo: (url) => apiService.request('/videos/', {
    method: 'POST',
    body: { url },
  }),
  getVideo: (id) => apiService.request(`/videos/${id}/`),
  deleteVideo: (id) => apiService.request(`/videos/${id}/`, {
    method: 'DELETE',
  }),
  getVideosCount: () => apiService.request('/videos/stats/count/'),
};