'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CompareChart({ chartData }: { chartData: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis domain={[0, 1]} stroke="#9ca3af" />
        <Tooltip contentStyle={{ background: '#1f2937', border: 'none' }} />
        <Legend />
        <Bar dataKey="entropy" fill="#22d3ee" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
