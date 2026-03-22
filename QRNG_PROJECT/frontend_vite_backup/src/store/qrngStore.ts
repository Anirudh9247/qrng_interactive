import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QRNGState, ExperimentResponse } from '../lib/types';
import { qrngApi } from '../lib/qrngApi';

export const useQRNGStore = create<QRNGState>()(
  persist(
    (set, get) => ({
      history: [],
      isGenerating: false,
      error: null,

      generateNumber: async (sampleSize: number = 1000): Promise<ExperimentResponse> => {
        set({ isGenerating: true, error: null });
        try {
          const newData = await qrngApi.runExperiment(sampleSize);
          
          set({
            history: [newData, ...get().history],
            isGenerating: false,
          });
          
          return newData;
        } catch (err: any) {
          const errMsg = err.response?.data?.detail || "Failed to generate state. Core offline.";
          set({ error: errMsg, isGenerating: false });
          throw err;
        }
      },

      fetchHistory: async () => {
        try {
          const logs = await qrngApi.getExperiments();
          
          // Optionally, sort descending if the backend doesn't already
          const sorted = logs.sort((a, b) => b.id - a.id);
          set({ history: sorted, error: null });
        } catch (err: any) {
          const errMsg = err.response?.data?.detail || "Failed to retrieve history logs.";
          set({ error: errMsg });
        }
      },

      clearHistory: () => {
         // Optionally you could add an API route `DELETE /experiments` in the future.
         // For now, clear frontend store.
         set({ history: [], error: null });
      },
    }),
    { 
      name: 'qrng-storage',
      // We persist history so it shows rapidly, then hydrates via fetchHistory later
    }
  )
);
