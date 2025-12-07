"use client";

import { useEffect, useState } from "react";

interface Activity {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
}

const typeLabels: Record<string, string> = {
  user_created: "User created",
  user_registered: "User registered",
  product_created: "Product created",
  order_created: "Order created",
};

const typeColors: Record<string, string> = {
  user_created: "bg-blue-500/20 text-blue-300",
  user_registered: "bg-emerald-500/20 text-emerald-300",
  product_created: "bg-purple-500/20 text-purple-300",
  order_created: "bg-amber-500/20 text-amber-300",
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        if (!cancelled) {
          setActivities(data);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Failed to load activity");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Activity</h1>
      <p className="text-sm text-slate-400 mb-6">
        Recent actions across users, products and orders.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg divide-y divide-slate-800">
        {activities.length === 0 && (
          <div className="px-4 py-4 text-slate-400 text-sm">
            No activity yet.
          </div>
        )}

        {activities.map((a) => {
          const label = typeLabels[a.type] || a.type;
          const badgeClass = typeColors[a.type] || "bg-slate-700 text-slate-200";

          return (
            <div key={a._id} className="px-4 py-3 flex items-start gap-3">
              <span
                className={`text-xs px-2 py-1 rounded-full mt-0.5 ${badgeClass}`}
              >
                {label}
              </span>
              <div className="flex-1">
                <p className="text-sm text-slate-100">{a.message}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}