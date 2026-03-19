import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  error: string | null;
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, error, children }) => {
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
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-gray-400 mt-2 text-sm">{subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-400" role="alert">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
};
