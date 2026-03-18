export interface User {
  id: string; // The backend uses int for DB but token relies on email sub; we can simplify or adapt
  email: string;
  username: string; // From backend schema
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface ExperimentResponse {
  id: number;
  generator: string;
  sample_size: number;
  zeros: number;
  ones: number;
  entropy: number;
}

export interface QRNGState {
  history: ExperimentResponse[];
  isGenerating: boolean;
  error: string | null;
  generateNumber: (sampleSize?: number) => Promise<ExperimentResponse>;
  fetchHistory: () => Promise<void>;
  clearHistory: () => void;
}
