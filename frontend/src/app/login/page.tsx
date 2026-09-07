"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function LoginForm() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [mounted, setMounted] = useState(false);
  const searchParams          = useSearchParams();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true); setError("");

    // Clear all previous user data and set auth cookie
    try {
      localStorage.removeItem("skillora_user_profile");
      localStorage.removeItem("skillora_history");
      localStorage.removeItem("skillora_interview_count");
      localStorage.removeItem("skillora_solved");
      localStorage.setItem("skillora_user_email", email);
      // Set auth cookie so middleware can protect routes
      document.cookie = "skillora_auth=1; path=/; max-age=2592000; SameSite=Lax";
    } catch {}

    // Send login notification email — non-blocking
    fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: email.split("@")[0], email }),
    }).catch(() => {});

    // Redirect to original destination or theme-select
    const next = searchParams.get("next") || "/theme-select";
    setTimeout(() => { setLoading(false); window.location.href = next; }, 900);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] flex flex-col">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-600/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-red-700/4 rounded-full blur-[80px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <SkilloraLogo size={34} />
          <span className="text-xl font-bold tracking-tight">
            <span className="brand-skill">Skill</span><span className="brand-ora">ora</span>
          </span>
        </Link>
        <Link href="/register" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          No account? <span className="text-red-400 font-medium hover:text-red-300">Register →</span>
        </Link>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <div className={`w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="card p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 anim-pulse-red">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
              <p className="text-zinc-500 text-sm">Enter your email to continue your prep</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full btn-red py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>
                  : <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      Continue with Email →
                    </>
                }
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-zinc-700 text-xs">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <p className="text-center text-sm text-zinc-500">
              No account?{" "}
              <Link href="/register" className="text-red-400 hover:text-red-300 font-medium transition-colors">Create one free →</Link>
            </p>
          </div>
          <p className="text-center text-xs text-zinc-700 mt-4">No password required · Just your email</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
