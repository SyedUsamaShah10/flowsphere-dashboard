"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        // Auto-login ho chuka hai, ab dashboard pe bhej do
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="w-full max-w-md bg-slate-900/90 border-slate-700 text-white p-6">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Create account
          </h1>
          <p className="text-sm text-slate-300 mb-6 text-center">
            Sign up to access the SaaSify Admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm password</label>
              <Input
                type="password"
                placeholder="********"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="bg-slate-950 border-slate-700 text-white"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Already have an account?{" "}
            <Link href="/" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
