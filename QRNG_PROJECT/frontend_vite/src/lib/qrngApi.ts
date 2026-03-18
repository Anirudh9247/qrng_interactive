import { api } from './api';
import type { ExperimentResponse } from './types';

export const qrngApi = {
  runExperiment: async (sampleSize: number = 1000): Promise<ExperimentResponse> => {
    // According to backend ExperimentRequest: { generator: str, sample_size: int }
    const response = await api.post('/run-experiment', {
      generator: 'quantum',
      sample_size: sampleSize,
    });
    return response.data;
  },

  getExperiments: async (): Promise<ExperimentResponse[]> => {
    const response = await api.get('/experiments');
    return response.data;
  },
};
