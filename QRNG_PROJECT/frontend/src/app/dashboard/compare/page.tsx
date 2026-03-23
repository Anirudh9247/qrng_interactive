"use client";
import { useState } from "react";
import axios from "@/app/lib/api"; // Note: Adjusting the import based on the actual file location `src/app/lib/api.ts`
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ComparePage() {
  const [result, setResult] = useState<any>(null);
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
          {result.comparison_plot && (
            <div className="col-span-2 mt-8">
              <h2 className="text-xl font-bold mb-4">Comparison Plot</h2>
              <img src={result.comparison_plot} alt="Comparison Plot" className="rounded-lg w-full"/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
