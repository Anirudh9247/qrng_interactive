"use client";
import { useState, useMemo, useEffect } from "react";
import axios from "@/app/lib/api";
import dynamic from "next/dynamic";

const CompareChart = dynamic(() => import("@/components/CompareChart"), { ssr: false });
import toast from "react-hot-toast";
import Link from "next/link";

interface ComparisonResult {
  quantum_entropy: number;
  classical_entropy: number;
  quantum_bits: string;
  classical_bits: string;
  comparison_plot?: string;
}

const formatBits = (bits: string, maxLen = 64) => {
  if (!bits) return "";
  if (bits.length <= maxLen) return bits;
  return `${bits.slice(0, maxLen)}...`;
};

const bitsToNumber = (bits: string, chunk = 32) => {
  if (!bits || bits.length < 1) return null;
  const slice = bits.slice(0, chunk);
  try {
    return Number.parseInt(slice, 2);
  } catch {
    return null;
  }
};

export default function ComparePage() {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warmingUpMessage, setWarmingUpMessage] = useState("");

  useEffect(() => {
    // Pre-flight ping to wake up the Render backend
    axios.get('/health').catch(() => {
      // Ignore initial errors silently
    });
  }, []);

  const handleCompare = async () => {
    setLoading(true);
    setError("");
    setWarmingUpMessage("");
    
    const warmupTimeout = setTimeout(() => {
      setWarmingUpMessage('Warming up backend (may take up to 60s)...');
      toast('Waking up the server... this may take up to a minute on the free tier.', {
        icon: '⏳',
        duration: 8000,
      });
    }, 4000);

    try {
      const res = await axios.post("/comparison/compare-rng", { sample_size: 100 });
      if (res.data.success) {
        setResult(res.data.data);
        toast.success("Comparison completed successfully!");
      } else {
        setError(res.data.error || "Failed to fetch comparison.");
        toast.error(res.data.error || "Failed to fetch comparison.");
      }
    } catch {
      setError("Failed to fetch comparison. Ensure backend is running.");
      toast.error("Failed to fetch comparison. Ensure backend is running.");
    } finally {
      clearTimeout(warmupTimeout);
      setWarmingUpMessage("");
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    return result ? [
      { name: "Quantum", entropy: result.quantum_entropy },
      { name: "Classical", entropy: result.classical_entropy },
    ] : [];
  }, [result]);

  return (
    <div className="p-8 text-white max-w-6xl mx-auto z-10 relative">
      <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 flex items-center gap-2 transition-colors">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold mb-6 mt-4">Quantum vs Classical RNG</h1>
      <button onClick={handleCompare} disabled={loading}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] px-6 py-3 rounded-lg font-semibold mb-6 disabled:opacity-50 transition-all flex flex-col items-center justify-center">
        <div>{loading ? "Comparing..." : "Run Comparison"}</div>
        {warmingUpMessage && (
          <span className="text-xs text-cyan-200 mt-1 font-normal">{warmingUpMessage}</span>
        )}
      </button>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="bg-slate-800 h-24 rounded-lg"></div>
          <div className="bg-slate-800 h-64 rounded-lg"></div>
        </div>
      ) : result ? (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6 subtle-glow">
            <p className="text-slate-400 text-sm">Quantum Entropy</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{result.quantum_entropy?.toFixed(4)}</p>
          </div>
          <div className="glass-panel p-6 subtle-glow">
            <p className="text-slate-400 text-sm">Classical Entropy</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{result.classical_entropy?.toFixed(4)}</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-slate-400 text-sm">Quantum sample number (first 32 bits)</p>
            <p className="text-2xl font-bold text-cyan-400">{bitsToNumber(result.quantum_bits)}</p>
            <p className="text-slate-500 text-xs break-words mt-2 font-mono">{formatBits(result.quantum_bits, 80)}</p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-slate-400 text-sm">Classical sample number (first 32 bits)</p>
            <p className="text-2xl font-bold text-blue-400">{bitsToNumber(result.classical_bits)}</p>
            <p className="text-slate-500 text-xs break-words mt-2 font-mono">{formatBits(result.classical_bits, 80)}</p>
          </div>
          <div className="glass-panel p-6 col-span-2 h-80">
            <CompareChart chartData={chartData} />
          </div>
          {result.comparison_plot && (
            <div className="glass-panel p-6 col-span-2 flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4 text-white">Comparison Plot</h2>
              <img 
                src={result.comparison_plot.startsWith('http') ? result.comparison_plot : `data:image/png;base64,${result.comparison_plot}`} 
                alt="Comparison Plot" 
                className="max-w-full rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-slate-700/50" 
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}