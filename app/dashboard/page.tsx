// app/dashboard/page.tsx
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  await connectDB();

  const usersCount = await User.countDocuments();
  const productsCount = await Product.countDocuments();

  const stats = [
    { label: "Total Users", value: usersCount },
    { label: "Total Products", value: productsCount },
    { label: "Monthly Revenue", value: "$12,340" },
  ];

  const chartData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 6500 },
    { month: "Mar", revenue: 8000 },
    { month: "Apr", revenue: 7200 },
    { month: "May", revenue: 9000 },
    { month: "Jun", revenue: 11000 },
  ];

  return <DashboardClient stats={stats} chartData={chartData} />;
}