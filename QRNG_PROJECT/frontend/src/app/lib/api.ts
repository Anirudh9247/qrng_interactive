import axios from 'axios';

// 1. Create a base Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an interceptor to automatically attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Right now the token is read from localStorage, which is vulnerable to
    // XSS. Once the backend sets a secure HttpOnly cookie with the JWT, this
    // interceptor can be removed or updated to rely on the cookie automatically.
    // TODO: migrate authentication flow and delete all localStorage access.
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;