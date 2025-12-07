// components/RevenueChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface RevenuePoint {
  month: string;
  revenue: number;
}

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-80">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2933" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4, fill: "#6366f1" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}