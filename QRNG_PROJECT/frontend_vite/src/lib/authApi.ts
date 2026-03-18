import { api } from './api';

export const authApi = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/register', {
      username,
      email,
      password,
    });
    return response.data;
  },

  login: async (username: string, password: string) => {
    // FastAPI OAuth2PasswordRequestForm expects form data
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('access_token');
    try {
      await api.post('/logout'); 
    } catch {
      // Ignore if it doesn't exist yet
    }
  }
};
