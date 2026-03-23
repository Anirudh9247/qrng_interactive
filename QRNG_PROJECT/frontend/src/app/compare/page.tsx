"use client";
import { useState } from "react";
import axios from "@/app/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ComparisonResult {
  quantum_entropy: number;
  classical_entropy: number;
  quantum_bits: string;
  classical_bits: string;
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

  const handleCompare = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/comparison/compare-rng", { sample_size: 100 });
      setResult(res.data);
    } catch {
      setError("Failed to fetch comparison. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: "Quantum", entropy: result.quantum_entropy },
    { name: "Classical", entropy: result.classical_entropy },
  ] : [];

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Quantum vs Classical RNG</h1>
      <button onClick={handleCompare} disabled={loading}
        className="bg-cyan-500 px-6 py-3 rounded-lg font-semibold mb-6 hover:bg-cyan-400 disabled:opacity-50">
        {loading ? "Comparing..." : "Run Comparison"}
      </button>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {result && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Quantum Entropy</p>
            <p className="text-3xl font-bold text-cyan-400">{result.quantum_entropy?.toFixed(4)}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Classical Entropy</p>
            <p className="text-3xl font-bold text-blue-400">{result.classical_entropy?.toFixed(4)}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Quantum sample number (first 32 bits)</p>
            <p className="text-2xl font-bold text-cyan-400">{bitsToNumber(result.quantum_bits)}</p>
            <p className="text-gray-400 text-xs break-words mt-2">{formatBits(result.quantum_bits, 80)}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm">Classical sample number (first 32 bits)</p>
            <p className="text-2xl font-bold text-blue-400">{bitsToNumber(result.classical_bits)}</p>
            <p className="text-gray-400 text-xs break-words mt-2">{formatBits(result.classical_bits, 80)}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 col-span-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#9ca3af"/>
                <YAxis domain={[0, 1]} stroke="#9ca3af"/>
                <Tooltip contentStyle={{ background: "#1f2937", border: "none" }}/>
                <Legend/>
                <Bar dataKey="entropy" fill="#22d3ee" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}