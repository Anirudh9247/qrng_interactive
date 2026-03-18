import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, QRNGState, QRNGData } from '../lib/types';

// Simple hash generator for mock data
const generateHash = () => {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string) => {
        // Mock API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({
          user: { id: Date.now().toString(), email, name: email.split('@')[0] },
          isAuthenticated: true,
        });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);

export const useQRNGStore = create<QRNGState>()(
  persist(
    (set, get) => ({
      history: [],
      isGenerating: false,
      generateNumber: async () => {
        set({ isGenerating: true });
        
        // Mock quantum API delay (realistic 1-3s)
        const delay = Math.random() * 2000 + 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        
        // Generate mock data simulating quantum source
        const min = 0;
        const max = 1000000;
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        const entropyScore = +(Math.random() * (100 - 90) + 90).toFixed(2); // High entropy
        
        const newData: QRNGData = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          number: randomNum,
          hash: generateHash(),
          timestamp: Date.now(),
          entropyScore,
        };
        
        set({
          history: [newData, ...get().history],
          isGenerating: false,
        });
        
        return newData;
      },
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'qrng-storage' }
  )
);
