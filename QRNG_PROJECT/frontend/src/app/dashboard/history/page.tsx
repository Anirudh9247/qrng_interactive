// src/app/dashboard/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Activity } from 'lucide-react';
import api from '../../../lib/api';

interface Experiment {
  id: number;
  generator: string;
  sample_size: number;
  zeros: number;
  ones: number;
  entropy: number;
}

export default function HistoryPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/experiments');
        // Sort by ID descending so the newest experiments are at the top
        const sortedData = response.data.sort((a: Experiment, b: Experiment) => b.id - a.id);
        setExperiments(sortedData);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Database className="text-cyan-400 w-6 h-6" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Experiment Logs</h1>
        </div>
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Generator
        </Link>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Activity className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
              <p>Loading database records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-sm font-medium text-slate-400">
                    <th className="p-4">Run ID</th>
                    <th className="p-4">Generator Type</th>
                    <th className="p-4">Sample Size</th>
                    <th className="p-4 text-center">Zeros</th>
                    <th className="p-4 text-center">Ones</th>
                    <th className="p-4 text-right">Shannon Entropy</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-800/50">
                  {experiments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No experiments found. Run a simulation first!
                      </td>
                    </tr>
                  ) : (
                    experiments.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 font-mono text-slate-400">#{exp.id}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            exp.generator === 'quantum' 
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {exp.generator.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">{exp.sample_size} bits</td>
                        <td className="p-4 text-center text-slate-300">{exp.zeros}</td>
                        <td className="p-4 text-center text-slate-300">{exp.ones}</td>
                        <td className="p-4 text-right font-mono font-medium text-cyan-400">
                          {exp.entropy.toFixed(5)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}