"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create user");
      } else {
        setForm({ name: "", email: "", role: "user" });
        setUsers((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Users</h1>
      <p className="text-sm text-slate-400 mb-6">
        Manage application users, roles and access.
      </p>

      <form
        onSubmit={handleCreate}
        className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-lg grid gap-3 sm:grid-cols-4"
      >
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-slate-950 border-slate-700 text-white"
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-slate-950 border-slate-700 text-white"
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="rounded bg-slate-950 border border-slate-700 text-sm text-white px-3 py-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add User"}
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
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-slate-800">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 text-right">
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-auto"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-4 text-center text-slate-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}