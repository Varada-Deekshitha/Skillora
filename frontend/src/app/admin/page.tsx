"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SkilloraLogo from "@/components/SkilloraLogo";

const API          = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const ADMIN_EMAIL  = "skillora215@gmail.com";

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  login_count: number;
  last_login: string | null;
  last_logout: string | null;
}

interface Session {
  id: number;
  email: string;
  event: "login" | "logout" | "register";
  timestamp: string;
}

interface Stats {
  total_users: number;
  total_logins: number;
  total_logouts: number;
  today_logins: number;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso + "Z");
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

const EVENT_COLOR: Record<string, string> = {
  login:    "text-green-400  bg-green-500/10  border-green-500/20",
  logout:   "text-red-400    bg-red-500/10    border-red-500/20",
  register: "text-blue-400   bg-blue-500/10   border-blue-500/20",
};

export default function AdminPage() {
  const router = useRouter();
  const [authed,   setAuthed]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [stats,    setStats]    = useState<Stats | null>(null);
  const [users,    setUsers]    = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tab,      setTab]      = useState<"users" | "sessions">("users");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    // Check if logged-in user is admin
    const email = (() => { try { return localStorage.getItem("skillora_user_email") || ""; } catch { return ""; } })();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      router.replace("/dashboard");
      return;
    }
    setAuthed(true);
    setChecking(false);
    loadData(email);
  }, []);

  const loadData = async (email: string) => {
    setLoading(true); setError("");
    const headers = { "x-admin-email": email };
    try {
      const [sRes, uRes, seRes] = await Promise.all([
        fetch(`${API}/admin/stats`,    { headers }),
        fetch(`${API}/admin/users`,    { headers }),
        fetch(`${API}/admin/sessions`, { headers }),
      ]);
      if (!sRes.ok || !uRes.ok || !seRes.ok) throw new Error("Access denied");
      setStats(await sRes.json());
      setUsers(await uRes.json());
      setSessions(await seRes.json());
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;
  if (!authed)  return null;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-[#080808]/95 backdrop-blur border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkilloraLogo size={32} />
          <span className="font-black text-lg">
            <span className="brand-skill">Skill</span><span className="brand-ora">ora</span>
          </span>
          <span className="text-xs bg-red-600/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-semibold ml-1">ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { const e = localStorage.getItem("skillora_user_email") || ""; loadData(e); }}
            className="text-xs text-zinc-500 hover:text-zinc-300 border border-white/8 px-3 py-1.5 rounded-lg transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs text-zinc-500 hover:text-zinc-300 border border-white/8 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-1">Admin Dashboard</h1>
          <p className="text-zinc-600 text-sm">User activity & session logs for Skillora</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Users",   value: stats.total_users,   icon: "👥" },
              { label: "Total Logins",  value: stats.total_logins,  icon: "🔐" },
              { label: "Total Logouts", value: stats.total_logouts, icon: "🚪" },
              { label: "Today Logins",  value: stats.today_logins,  icon: "📅" },
            ].map(s => (
              <div key={s.label} className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-5">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["users", "sessions"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                tab === t
                  ? "bg-red-600/20 border border-red-500/30 text-red-400"
                  : "bg-[#0f0f0f] border border-white/6 text-zinc-500 hover:text-zinc-300"
              }`}
            >{t}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-zinc-600 text-sm">Loading...</div>
        ) : tab === "users" ? (
          /* ── Users Table ── */
          <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">#</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Registered</th>
                    <th className="text-left px-5 py-3">Logins</th>
                    <th className="text-left px-5 py-3">Last Login</th>
                    <th className="text-left px-5 py-3">Last Logout</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-zinc-700">No users yet</td></tr>
                  ) : users.map((u, i) => (
                    <tr key={u.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3 text-zinc-700">{i + 1}</td>
                      <td className="px-5 py-3 text-zinc-200 font-medium">{u.email}</td>
                      <td className="px-5 py-3 text-zinc-400">{u.name || "—"}</td>
                      <td className="px-5 py-3 text-zinc-500">{fmt(u.created_at)}</td>
                      <td className="px-5 py-3">
                        <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {u.login_count}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500">{fmt(u.last_login)}</td>
                      <td className="px-5 py-3 text-zinc-500">{fmt(u.last_logout)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ── Sessions Table ── */
          <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">#</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Event</th>
                    <th className="text-left px-5 py-3">Time (UTC)</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-12 text-zinc-700">No sessions yet</td></tr>
                  ) : sessions.map((s, i) => (
                    <tr key={s.id} className="border-b border-white/3 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3 text-zinc-700">{i + 1}</td>
                      <td className="px-5 py-3 text-zinc-200">{s.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${EVENT_COLOR[s.event] || ""}`}>
                          {s.event}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500">{fmt(s.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
