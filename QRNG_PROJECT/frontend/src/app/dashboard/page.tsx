'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import Link from 'next/link';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { BarChart2, Cpu, Database, Zap, Activity } from 'lucide-react';

interface ExperimentResult {
  generator: string;
  sample_size: number;
  zeros: number;
  ones: number;
  entropy: number;
  chi_square?: number;
  distribution_plot?: string;
}

export default function DashboardPage() {
  const [sampleSize, setSampleSize] = useState(10);
  const [generator, setGenerator] = useState('quantum');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ExperimentResult | null>(null);

  const handleRunExperiment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/run-experiment-db', {
        generator,
        sample_size: Number(sampleSize),
      });

      if (response.data.success) {
        setError('');
        setResult(response.data.data);
        toast.success("Experiment generated successfully!");
      } else {
        setResult(null);
        setError(response.data.error || 'Failed to run experiment.');
        toast.error(response.data.error || 'Failed to run experiment.');
      }
    } catch {
      setResult(null);
      setError('Failed to run experiment. Ensure your backend is running.');
      toast.error('Failed to run experiment. Ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? [
      { name: 'Zeros (0)', count: result.zeros },
      { name: 'Ones (1)', count: result.ones },
    ]
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Zap className="text-cyan-400 w-6 h-6" />
          <h1 className="text-2xl font-bold tracking-tight text-white">QRNG Control Center</h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/compare"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
          >
            <BarChart2 className="w-4 h-4" />
            Compare RNG
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
          >
            <Database className="w-4 h-4" />
            View History
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Experiment Parameters
            </h2>

            {error && (
              <div className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="generator" className="block text-sm font-medium text-slate-400 mb-1">
                  Generator Type
                </label>
                <select
                  id="generator"
                  value={generator}
                  onChange={(e) => setGenerator(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none backdrop-blur-sm transition-all"
                >
                  <option value="quantum">Qiskit AerSimulator (Quantum)</option>
                  <option value="classical">Python random (Classical)</option>
                </select>
              </div>

              <div>
                <label htmlFor="sampleSize" className="block text-sm font-medium text-slate-400 mb-1">
                  Sample Size (Bits)
                </label>
                <input
                  id="sampleSize"
                  type="number"
                  min="1"
                  max="1000"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none backdrop-blur-sm transition-all"
                />
              </div>

              <button
                onClick={handleRunExperiment}
                disabled={loading}
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-cyan-500/25 flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {loading ? 'Simulating...' : 'Run Experiment'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-panel p-5 subtle-glow">
                  <p className="text-slate-400 text-sm font-medium mb-1">Shannon Entropy</p>
                  <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{result.entropy.toFixed(4)}</p>
                  <p className="text-xs text-cyan-400 mt-2">Perfect randomness approaches 1.0</p>
                </div>

                <div className="glass-panel p-5">
                  <p className="text-slate-400 text-sm font-medium mb-1">Zero Bits</p>
                  <p className="text-3xl font-bold text-white">{result.zeros}</p>
                  <p className="text-xs text-slate-500 mt-2">Total &quot;0&quot; measurements</p>
                </div>

                <div className="glass-panel p-5">
                  <p className="text-slate-400 text-sm font-medium mb-1">One Bits</p>
                  <p className="text-3xl font-bold text-white">{result.ones}</p>
                  <p className="text-xs text-slate-500 mt-2">Total &quot;1&quot; measurements</p>
                </div>

                {result.chi_square !== undefined && (
                  <div className="glass-panel p-5">
                    <p className="text-slate-400 text-sm font-medium mb-1">Chi-Square</p>
                    <p className="text-3xl font-bold text-white">{result.chi_square.toFixed(4)}</p>
                    <p className="text-xs text-slate-500 mt-2">Uniformity test statistic</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-6 h-80">
                  <h3 className="text-lg font-semibold text-white mb-6">Bit Distribution</h3>

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8' }} />
                      <Tooltip
                        cursor={{ fill: '#1e293b' }}
                        contentStyle={{
                          backgroundColor: '#020617',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#22d3ee' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#22d3ee'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {result.distribution_plot && (
                  <div className="glass-panel p-4 flex flex-col items-center justify-center h-80">
                    <h3 className="text-lg font-semibold text-white mb-2 self-start w-full">Distribution Plot</h3>
                    <img 
                      src={result.distribution_plot.startsWith('http') ? result.distribution_plot : `data:image/png;base64,${result.distribution_plot}`} 
                      alt="Distribution Plot" 
                      className="max-h-full max-w-full rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-slate-700/50 object-contain" 
                    />
                  </div>
                )}
              </div>

            </>
          ) : (
            <div className="glass-panel border-dashed border-slate-600/50 h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500">
              <Activity className="w-12 h-12 mb-4 opacity-50" />
              <p>Configure parameters and run an experiment to see data.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}