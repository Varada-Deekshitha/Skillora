"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RegisterPage() {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle"|"sending"|"sent"|"failed">("idle");
  const [error, setError]             = useState("");
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true); setError(""); setEmailStatus("sending");

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (!res.ok || data.success === false) {
        setLoading(false);
        setEmailStatus("failed");
        setError(data.message || `Could not deliver to ${email}. Please check the address.`);
        return;
      }

      // Success — clear all previous user data and set auth cookie
      setEmailStatus("sent");
      try {
        localStorage.removeItem("skillora_user_profile");
        localStorage.removeItem("skillora_history");
        localStorage.removeItem("skillora_interview_count");
        localStorage.removeItem("skillora_solved");
        localStorage.setItem("skillora_user_email", email);
        document.cookie = "skillora_auth=1; path=/; max-age=2592000; SameSite=Lax";
      } catch {}

      setTimeout(() => { setLoading(false); window.location.href = "/theme-select"; }, 1200);
    } catch {
      setEmailStatus("idle");
      try {
        localStorage.removeItem("skillora_user_profile");
        localStorage.removeItem("skillora_history");
        localStorage.removeItem("skillora_interview_count");
        localStorage.removeItem("skillora_solved");
        localStorage.setItem("skillora_user_email", email);
        document.cookie = "skillora_auth=1; path=/; max-age=2592000; SameSite=Lax";
      } catch {}
      setTimeout(() => { setLoading(false); window.location.href = "/theme-select"; }, 900);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] flex flex-col">
      <div className="fixed top-1/4 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[300px] h-[300px] bg-red-700/4 rounded-full blur-[80px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <SkilloraLogo size={34} />
          <span className="text-xl font-bold tracking-tight">
            <span className="brand-skill">Skill</span><span className="brand-ora">ora</span>
          </span>
        </Link>
        <Link href="/login" className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
          Have an account? <span className="text-red-400 font-medium hover:text-red-300">Sign in →</span>
        </Link>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
        <div className={`w-full max-w-md transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="card p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

            {/* Header */}
            <div className="text-center mb-7">
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 anim-pulse-red">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-black text-white mb-1">Create your account</h1>
              <p className="text-zinc-500 text-sm">Start your AI career prep today — it&apos;s free</p>
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

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  autoComplete="name"
                  autoFocus
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  autoComplete="email"
                />
                <p className="text-zinc-700 text-xs mt-1.5">A welcome email will be sent to this address</p>
              </div>

              {/* Email status banners */}
              {emailStatus === "sending" && (
                <div className="bg-blue-500/8 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Sending welcome email to <strong className="ml-1">{email}</strong>...
                </div>
              )}
              {emailStatus === "sent" && (
                <div className="bg-green-500/8 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  🎉 Welcome email sent to <strong className="ml-1">{email}</strong> — check your inbox!
                </div>
              )}
              {emailStatus === "failed" && (
                <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  Email not found — <strong className="mx-1">{email}</strong> doesn&apos;t exist. Use a valid email.
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full btn-red py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading
                  ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      {emailStatus === "sending" ? "Sending welcome email..." : "Creating account..."}
                    </>
                  : <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      Create Free Account →
                    </>
                }
              </button>
            </form>

            <p className="text-center text-sm text-zinc-500 mt-5">
              Already registered?{" "}
              <Link href="/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign in →</Link>
            </p>
          </div>

          <p className="text-center text-xs text-zinc-700 mt-4">
            No password required · Free forever · No credit card
          </p>
        </div>
      </div>
    </div>
  );
}
