import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Database, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Activity },
    { label: 'History', path: '/history', icon: Database },
  ];

  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-hidden bg-quantum-900">
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-quantum-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-quantum-secondary/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-t-0 border-x-0 border-b-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="relative flex items-center justify-center p-2 rounded-lg bg-quantum-600 border border-white/5 shadow-inner">
                <Zap className="h-5 w-5 text-quantum-secondary" />
                <motion.div 
                  className="absolute inset-0 rounded-lg border border-quantum-secondary/50"
                  animate={{ opacity: [0.2, 0.8, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
                QRNG<span className="text-quantum-accent">.nexus</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                      isActive 
                        ? "text-white bg-white/10" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-quantum-secondary to-quantum-primary rounded-full"
                        style={{ bottom: '-10px' }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Removed User & Actions section */}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {children}
      </main>
      
      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden glass-panel border-b-0 border-x-0 border-t-white/10 fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={clsx(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-quantum-secondary" : "text-gray-400"
                )}
              >
                <Icon className={clsx("h-5 w-5", isActive && "animate-pulse")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;
