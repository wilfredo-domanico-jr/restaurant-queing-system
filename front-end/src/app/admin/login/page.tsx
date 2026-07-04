"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid username or password");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#F9F5F1] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <div className="font-serif text-2xl text-text text-center mb-2">
          Admin <span className="text-brand italic">Login</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-text-muted">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-text-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
          />
        </div>

        {error && <div className="text-[13px] text-red-600">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white rounded-lg py-2 text-sm font-semibold mt-2 disabled:opacity-60 cursor-pointer hover:bg-brand-dark transition"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
