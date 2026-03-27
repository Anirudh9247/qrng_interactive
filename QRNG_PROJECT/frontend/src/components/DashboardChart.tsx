'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardChart({ chartData }: { chartData: any[] }) {
  return (
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
  );
}
