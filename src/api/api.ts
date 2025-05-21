import axios from 'axios';
import { baseUrl, endpoints } from '@/constants/urls';
import { isTokenExpired } from '@/utils/auth';

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await axios.post(baseUrl + endpoints.refresh, {
      refreshToken,
    });
    const newAccessToken = response.data['access_token'];
    const newRefreshToken = response.data['refresh_token'];

    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    return newAccessToken;
  } catch (_error) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login if refresh fails
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');

    if (token && isTokenExpired(token)) {
      console.log('Access token expired. Attempting refresh...');
      token = await refreshAccessToken();
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle failed requests due to expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry failed request
      }
    }

    return Promise.reject(error);
  },
);

export default api;
