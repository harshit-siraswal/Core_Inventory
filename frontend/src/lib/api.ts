import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url ?? '');
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('access_token');
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);
