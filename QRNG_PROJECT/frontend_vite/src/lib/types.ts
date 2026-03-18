export interface User {
  id: string;
  email: string;
  name: string;
}

export interface QRNGData {
  id: string;
  number: number;
  hash: string;
  timestamp: number;
  entropyScore: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export interface QRNGState {
  history: QRNGData[];
  isGenerating: boolean;
  generateNumber: () => Promise<QRNGData>;
  clearHistory: () => void;
}
