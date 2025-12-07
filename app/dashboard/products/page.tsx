"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
  status: "active" | "inactive";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        status: form.status,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create product");
      } else {
        setForm({ name: "", price: "", status: "active" });
        setProducts((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete product");
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Products</h1>
      <p className="text-sm text-slate-400 mb-6">
        Manage your SaaS plans, pricing and availability.
      </p>

      <form
        onSubmit={handleCreate}
        className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-lg grid gap-3 sm:grid-cols-4"
      >
        <Input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-slate-950 border-slate-700 text-white"
          required
        />
        <Input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="bg-slate-950 border-slate-700 text-white"
          required
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="rounded bg-slate-950 border border-slate-700 text-sm text-white px-3 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </form>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-950">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Price</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-slate-800">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">${p.price}</td>
                <td className="px-4 py-2 capitalize">{p.status}</td>
                <td className="px-4 py-2 text-right">
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-auto"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-slate-400"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}