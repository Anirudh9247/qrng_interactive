import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordInput } from '../components/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter all fields');
      return;
    }

    try {
      await login(email, password);
      toast.success('Authentication successful');
      navigate('/dashboard');
    } catch (err: any) {
      // The store exposes actual error inline, avoiding duplicate toasts
    }
  };

  return (
    <AuthLayout title="QRNG Nexus" subtitle="Secure Access Terminal" error={error}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">
              Quantum Credentials (Email)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scientist@nexus.io"
              className="w-full bg-quantum-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-primary/50 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>
          <PasswordInput
            id="password"
            label="Security Key (Password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 bg-quantum-900 border-white/20 rounded accent-quantum-primary focus:ring-quantum-primary"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
            Maintain connection
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-quantum-primary to-quantum-accent hover:from-quantum-accent hover:to-quantum-primary text-white font-semibold py-3 px-4 rounded-lg shadow-[0_0_20px_rgba(170,59,255,0.4)] hover:shadow-[0_0_25px_rgba(170,59,255,0.6)] focus:outline-none focus:ring-2 focus:ring-quantum-primary focus:ring-offset-2 focus:ring-offset-quantum-900 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Authenticating sequence...</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Initialize Terminal</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-white/10 pt-6">
        <p className="text-sm text-gray-400 mb-2">
          Don't have a key?{' '}
          <Link to="/register" className="text-quantum-accent hover:text-quantum-secondary transition-colors font-medium">
            Register here
          </Link>
        </p>
        <p className="text-xs text-gray-500">
          WARNING: Unauthorized access to quantum resources is strictly monitored.
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
