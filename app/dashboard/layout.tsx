// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Dashboard | FlowSphere",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}