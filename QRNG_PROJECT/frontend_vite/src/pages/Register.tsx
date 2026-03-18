import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error('Please enter all fields');
      return;
    }

    try {
      await register(username, email, password);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err: any) {
      // The store catches the actual error
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-quantum-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-quantum-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-quantum-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="mx-auto w-16 h-16 bg-quantum-800 rounded-2xl flex items-center justify-center mb-6 neon-border"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 text-quantum-secondary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Access Granted</h1>
          <p className="text-gray-400 mt-2 text-sm">Create New Access Credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="username">
                Scientist Alias (Username)
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Dr. Quantum"
                className="w-full bg-quantum-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-primary/50 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">
                Security Key (Password)
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-quantum-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-primary/50 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-quantum-primary to-quantum-accent hover:from-quantum-accent hover:to-quantum-primary text-white font-semibold py-3 px-4 rounded-lg shadow-[0_0_20px_rgba(170,59,255,0.4)] hover:shadow-[0_0_25px_rgba(170,59,255,0.6)] focus:outline-none focus:ring-2 focus:ring-quantum-primary focus:ring-offset-2 focus:ring-offset-quantum-900 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Generating Identity...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                <span>Create Registration</span>
              </>
            )}
          </button>
          
          <div className="text-center mt-4">
             <Link to="/login" className="text-sm text-gray-400 hover:text-quantum-accent transition-colors">
                Already have credentials? Return to login.
             </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
