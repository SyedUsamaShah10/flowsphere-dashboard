"use client";

import { useEffect, useState } from "react";
import DashboardClient from "@/components/DashboardClient";

interface OverviewData {
  usersCount: number;
  productsCount: number;
  ordersCount: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard/overview");
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = data
    ? [
        { label: "Total Users", value: data.usersCount },
        { label: "Total Products", value: data.productsCount },
        { label: "Total Orders", value: data.ordersCount },
      ]
    : [
        { label: "Total Users", value: "..." },
        { label: "Total Products", value: "..." },
        { label: "Total Orders", value: "..." },
      ];

  const chartData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 6500 },
    { month: "Mar", revenue: 8000 },
    { month: "Apr", revenue: 7200 },
    { month: "May", revenue: 9000 },
    { month: "Jun", revenue: 11000 },
  ];

  return (
    <DashboardClient
      stats={stats}
      chartData={chartData}
    />
  );
}