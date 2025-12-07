// components/OrdersStatusChart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type StatusCount = {
  status: string;
  count: number;
};

const COLORS = {
  pending: "#f97316",
  paid: "#22c55e",
  refunded: "#ef4444",
};

export default function OrdersStatusChart({
  data,
}: {
  data: StatusCount[];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  if (!total) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-80 flex items-center justify-center">
        <p className="text-sm text-slate-400">No orders data yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-80">
      <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={COLORS[entry.status as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1f2937",
              borderRadius: 8,
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}