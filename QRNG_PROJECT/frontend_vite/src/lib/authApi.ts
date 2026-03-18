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
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  logout: async () => {
    // Note: If the backend has a /logout endpoint that invalidates the cookie, call it here.
    // Currently, typical stateless JWT setups just ask the client to drop it.
    // We'll simulate a cleanup or optional backend call.
    try {
      await api.post('/logout'); // Assuming you might add this to FastAPI
    } catch {
      // Ignore if it doesn't exist yet
    }
  }
};
