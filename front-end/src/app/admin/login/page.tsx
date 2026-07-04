"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const DEMO_USERNAME = process.env.NEXT_PUBLIC_DEMO_ADMIN_USERNAME ?? "";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (loginUsername: string, loginPassword: string) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
  };

  const handleDemoLogin = () => login(DEMO_USERNAME, DEMO_PASSWORD);

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-[#F9F5F1] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-border rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4"
      >
        <div className="font-serif text-2xl text-text text-center mb-2">
          Admin <span className="text-brand italic">Login</span>
        </div>

        {DEMO_MODE && (
          <div className="bg-brand-light border border-brand/30 rounded-lg p-3 flex flex-col gap-2">
            <div className="text-[12px] text-brand-dark leading-snug">
              👋 This is a portfolio demo — skip the form and explore the admin
              dashboard directly.
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="bg-white border border-brand text-brand rounded-lg py-1.5 text-[13px] font-semibold disabled:opacity-60 cursor-pointer hover:bg-brand hover:text-white transition"
            >
              {loading ? "Signing in..." : "Continue as Demo Admin"}
            </button>
          </div>
        )}

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
