import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, Cpu, Database, Zap } from 'lucide-react';
import { useQRNGStore } from '../store/qrngStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { ExperimentResponse } from '../lib/types';

// Helper for UI flair
const computeHash = async (data: any) => {
  const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const Dashboard = () => {
  const { history, isGenerating, generateNumber, fetchHistory } = useQRNGStore();
  const [currentResult, setCurrentResult] = useState<ExperimentResponse | null>(null);
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const [currentHash, setCurrentHash] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleGenerate = async () => {
    try {
      const data = await generateNumber(1000);
      setCurrentResult(data);
      const hash = await computeHash(data);
      setCurrentHash(hash);
      toast.success('Quantum state collapsed successfully');
    } catch (error) {
      toast.error('Failed to access quantum source');
    }
  };

  // Simulating the rapid changing of numbers before settling on the generated one
  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      interval = setInterval(() => {
        setAnimatedNumber(Math.floor(Math.random() * 1000000));
      }, 50) as unknown as number;
    } else if (currentResult !== null) {
      setAnimatedNumber(currentResult.ones); // using 'ones' as the visual number to show variance
    }
    return () => clearInterval(interval);
  }, [isGenerating, currentResult]);

  // Chart data formatting
  const chartData = [...history].reverse().slice(-15).map(item => ({
    time: `ID:${item.id}`,
    entropy: item.entropy * 100, // Assuming entropy is 0-1, converting to 0-100%
    value: item.ones,
  }));

  const recentActivity = history.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-quantum-primary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-quantum-primary/10 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-quantum-800 rounded-xl border border-white/5 shadow-inner">
              <Database className="h-6 w-6 text-quantum-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Generated</p>
              <h3 className="text-2xl font-bold text-white">{history.length} <span className="text-xs font-normal text-gray-500">states</span></h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-quantum-secondary/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-quantum-secondary/10 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-quantum-800 rounded-xl border border-white/5 shadow-inner">
              <Activity className="h-6 w-6 text-quantum-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Avg. Entropy</p>
              <h3 className="text-2xl font-bold text-white">
                {history.length > 0 ? ((history.reduce((acc, curr) => acc + curr.entropy, 0) / history.length) * 100).toFixed(2) : '0.00'}
                <span className="text-xs font-normal text-gray-500 ml-1">%</span>
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-quantum-accent/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-quantum-accent/10 transition-colors" />
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-quantum-800 rounded-xl border border-white/5 shadow-inner">
              <Cpu className="h-6 w-6 text-quantum-accent" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-400">Online & Stable</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Generator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Generator Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center relative z-10 neon-border min-h-[400px]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-quantum-primary/5 to-transparent rounded-3xl pointer-events-none" />
          
          <div className="mb-8">
            <h2 className="text-lg text-gray-400 font-medium tracking-widest uppercase mb-2">Quantum Core output</h2>
            <div className="relative">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={isGenerating ? 'generating' : animatedNumber}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)', position: 'absolute' }}
                  transition={{ duration: 0.2 }}
                  className="text-6xl sm:text-7xl font-mono font-bold text-white tracking-widest leading-none drop-shadow-[0_0_25px_rgba(0,240,255,0.6)]"
                >
                  {animatedNumber.toString().padStart(4, '0')}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {currentHash && !isGenerating && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-xs font-mono text-quantum-accent/80 truncate max-w-[250px] mx-auto opacity-70">
                HASH: {currentHash.substring(0, 32)}...
              </motion.div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="group relative w-full sm:w-auto px-8 py-4 bg-quantum-900 border border-quantum-primary/50 text-white rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(170,59,255,0.3)] hover:shadow-[0_0_30px_rgba(170,59,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-quantum-primary to-quantum-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-3">
              {isGenerating ? (
                <>
                  <Zap className="h-5 w-5 animate-pulse text-quantum-secondary" />
                  <span className="font-bold tracking-wider">COLLAPSING WAVEFUNCTION...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 text-quantum-primary group-hover:text-quantum-secondary transition-colors" />
                  <span className="font-bold tracking-wider uppercase">Generate State</span>
                </>
              )}
            </div>
          </button>
        </motion.div>

        {/* Chart Visualization */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-6 min-h-[400px] flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-quantum-secondary" />
              Entropy Visualization Network
            </h2>
            <span className="text-xs text-quantum-secondary/70 bg-quantum-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider border border-quantum-secondary/20">Live Sync</span>
          </div>
          
          <div className="flex-1 w-full h-full min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#aa3bff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={12} tickMargin={10} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10, 11, 26, 0.9)', border: '1px solid rgba(170, 59, 255, 0.3)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#aa3bff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
                <Database className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-sm text-gray-400">Waiting for quantum data...</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      {/* Recent Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel rounded-3xl p-6 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity Segment</h2>
          <button 
            onClick={() => navigate('/history')}
            className="text-sm text-quantum-accent hover:text-white transition-colors hover:underline"
          >
            View Full Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                <th className="pb-4 pl-4 font-medium">Record ID</th>
                <th className="pb-4 font-medium">Bits: 0 / 1</th>
                <th className="pb-4 font-medium">Entropy Quality</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, index) => (
                    <motion.tr 
                      key={`recent-${item.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 pl-4 text-emerald-400 font-mono font-bold text-lg">#{item.id}</td>
                      <td className="py-4 text-gray-300 text-sm font-mono">{item.zeros} / {item.ones}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[150px] h-2 bg-quantum-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-quantum-secondary to-quantum-primary"
                              style={{ width: `${item.entropy * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{(item.entropy * 100).toFixed(2)}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 text-sm">
                      No quantum events recorded in the current session.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default Dashboard;
