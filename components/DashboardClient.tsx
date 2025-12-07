"use client";

import { motion } from "framer-motion";
import StatsCards from "@/components/StatsCards";
import RevenueChart from "@/components/RevenueChart";

interface StatItem {
  label: string;
  value: string | number;
}

interface RevenuePoint {
  month: string;
  revenue: number;
}

export default function DashboardClient({
  stats,
  chartData,
}: {
  stats: StatItem[];
  chartData: RevenuePoint[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
      <p className="text-sm text-slate-400 mb-6">
        Quick summary of your SaaS product performance.
      </p>

      <StatsCards stats={stats} />
      <RevenueChart data={chartData} />
    </motion.div>
  );
}