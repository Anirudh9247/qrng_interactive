import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true
});

export default api;

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