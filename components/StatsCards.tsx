// components/StatsCards.tsx
interface StatItem {
  label: string;
  value: string | number;
}

export default function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats?.map((item) => (
        <div
          key={item.label}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4"
        >
          <p className="text-xs text-slate-400">{item.label}</p>
          <p className="text-2xl font-semibold mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
}