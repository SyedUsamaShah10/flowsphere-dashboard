"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OrdersStatusChart from "@/components/OrdersStatusChart";

interface Order {
  _id: string;
  userEmail: string;
  amount: number;
  status: "pending" | "paid" | "refunded";
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({
    userEmail: "",
    amount: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        userEmail: form.userEmail,
        amount: Number(form.amount),
        status: form.status,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create order");
      } else {
        setForm({ userEmail: "", amount: "", status: "pending" });
        setOrders((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create order");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this order?")) return;

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete order");
        return;
      }

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  }

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      paid: 0,
      refunded: 0,
    };

    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
    }));
  }, [orders]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Orders</h1>
      <p className="text-sm text-slate-400 mb-6">
        Track incoming orders, revenue and payment status.
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form + table */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleCreate}
            className="p-4 bg-slate-900 border border-slate-800 rounded-lg grid gap-3 sm:grid-cols-4"
          >
            <Input
              placeholder="Customer email"
              type="email"
              value={form.userEmail}
              onChange={(e) =>
                setForm({ ...form, userEmail: e.target.value })
              }
              className="bg-slate-950 border-slate-700 text-white"
              required
            />
            <Input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              className="bg-slate-950 border-slate-700 text-white"
              required
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              className="rounded bg-slate-950 border border-slate-700 text-sm text-white px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Order"}
            </Button>
          </form>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-950">
                <tr>
                  <th className="text-left px-4 py-2">Customer</th>
                  <th className="text-left px-4 py-2">Amount</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-right px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t border-slate-800">
                    <td className="px-4 py-2">{o.userEmail}</td>
                    <td className="px-4 py-2">${o.amount}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs capitalize ${
                          o.status === "paid"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : o.status === "pending"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Button
                        type="button"
                        className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-auto"
                        onClick={() => handleDelete(o._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-center text-slate-400"
                    >
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div>
          <OrdersStatusChart data={statusChartData} />
        </div>
      </div>
    </div>
  );
}