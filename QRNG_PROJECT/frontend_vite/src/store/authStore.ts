import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../lib/types';
import { authApi } from '../lib/authApi';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      
      register: async (username, email, password) => {
        set({ loading: true, error: null });
        try {
          await authApi.register(username, email, password);
        } catch (err: any) {
          const errMsg = err.response?.data?.detail || "Registration Failed";
          set({ error: errMsg });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // This will set the HttpOnly cookie in the browser if backend CORS is right
          await authApi.login(email, password);
          
          // Cookie is set, but we need the user profile info for the UI
          const userProfile = await authApi.getProfile();
          set({
            user: { 
              id: Date.now().toString(), 
              email: userProfile.email, 
              username: userProfile.username || email.split('@')[0],
              role: userProfile.role 
            },
            isAuthenticated: true,
          });
        } catch (err: any) {
          const errMsg = err.response?.data?.detail || "Authentication Failed";
          set({ error: errMsg });
          throw err;
        } finally {
          set({ loading: false });
        }
      },
      
      checkAuth: async () => {
        set({ loading: true, error: null });
        try {
          const userProfile = await authApi.getProfile();
          set({
            user: { 
              id: Date.now().toString(), 
              email: userProfile.email, 
              username: userProfile.username || userProfile.email.split('@')[0],
              role: userProfile.role 
            },
            isAuthenticated: true,
          });
        } catch (err) {
          // 401 Unauthorized -> not logged in
          set({ user: null, isAuthenticated: false, error: null });
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authApi.logout();
        } finally {
           // Always clear local state regardless of server logout status
          set({ user: null, isAuthenticated: false, loading: false, error: null });
        }
      },
      
    }),
    { 
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
