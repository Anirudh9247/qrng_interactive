import axios from 'axios';

// Create a configured Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // Send and receive HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});


// Optional: Add interceptors for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle 401s globally here if needed
    if (error.response?.status === 401) {
      console.warn("Unauthorized access detected.");
    }
    return Promise.reject(error);
  }
);
