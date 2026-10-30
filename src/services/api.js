import axios from 'axios';

export const TOKEN_KEY = 'skill2career.token';

// Create the shared client so every service uses the same API origin and auth behavior.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || undefined,
});

// Attach the persisted bearer token to every authenticated API request.
api.interceptors.request.use((request) => {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const isPublicAuth = /\/api\/auth\/(login|register|demo-login)$/.test(request.url || '');
  if (token && !isPublicAuth) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

// Notify AuthContext when the backend rejects the current session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      window.dispatchEvent(new CustomEvent('skill2career:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default api;
