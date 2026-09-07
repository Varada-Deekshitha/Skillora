"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = "company-prep" | "resume-analyzer";
type SideSection = "home" | "roadmap" | "resume-ats" | "interview" | "coding" | "aptitude" | "prep-hub" | "resume-builder" | "skillmap" | "linkedin" | "github" | "jobs";

interface UserProfile {
  name: string; targetCompany: string; targetRole: string;
  skillLevel: string; targetDate: string; setupDate: string;
}

const PROFILE_KEY = "skillora_user_profile";
const HISTORY_KEY = "skillora_history";
const INTV_KEY    = "skillora_interview_count";

const THEME_KEY    = "skillora_theme";

const loadProfile  = (): UserProfile | null => { try { const s = localStorage.getItem(PROFILE_KEY); return s ? JSON.parse(s) : null; } catch { return null; } };
const saveProfile  = (p: UserProfile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
const loadHistory  = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
const saveHistory  = (e: any[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(e.slice(0, 30)));
const loadIntv     = () => { try { return parseInt(localStorage.getItem(INTV_KEY) || "0"); } catch { return 0; } };
const loadSolved   = () => { try { return JSON.parse(localStorage.getItem("skillora_solved") || "[]").length; } catch { return 0; } };
const loadTheme    = (): "dark" | "light" => { try { return (localStorage.getItem(THEME_KEY) as "dark"|"light") || "dark"; } catch { return "dark"; } };

const timeAgo = (ts: number) => {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000), h = Math.floor(d / 3600000), day = Math.floor(d / 86400000);
  return m < 1 ? "just now" : m < 60 ? `${m}m ago` : h < 24 ? `${h}h ago` : `${day}d ago`;
};

const TIPS = [
  "Use the STAR method for behavioral questions.",
  "Quantify resume bullets — numbers stand out.",
  "Solve 1 coding problem daily — consistency wins.",
  "Read your target company's engineering blog.",
  "Prepare 5 questions to ask the interviewer.",
  "Contribute to open source to strengthen your GitHub.",
  "Tailor your resume keywords to each job description.",
  "Time yourself while solving problems.",
  "Practice answering out loud, not just in your head.",
  "Connect with 3 people at your target company this week.",
];

const HISTORY_ICON: Record<string, string> = { prep:"🗺️", resume:"📄", interview:"🎤", coding:"💻", aptitude:"🎯" };
const HISTORY_COLOR: Record<string, string> = { prep:"text-red-400", resume:"text-orange-400", interview:"text-blue-400", coding:"text-purple-400", aptitude:"text-yellow-400" };

const ADMIN_EMAIL = "skillora215@gmail.com";

// ── Sidebar nav config ─────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "home" as SideSection, icon: "⚡", label: "Dashboard", href: null },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { id: "roadmap"      as SideSection, icon: "🗺️", label: "Roadmap",       href: null },
      { id: "resume-ats"   as SideSection, icon: "📄", label: "Resume ATS",     href: null },
      { id: "interview"    as SideSection, icon: "🎤", label: "Mock Interview",  href: "/mock-interview" },
      { id: "coding"       as SideSection, icon: "💻", label: "Coding",          href: "/coding" },
      { id: "aptitude"     as SideSection, icon: "🎯", label: "Aptitude",        href: "/aptitude" },
    ],
  },
  {
    label: "Resources",
    items: [
      { id: "prep-hub"       as SideSection, icon: "📚", label: "Prep Hub",       href: "/prep-hub" },
      { id: "resume-builder" as SideSection, icon: "📝", label: "Resume Builder",  href: "/resume-builder" },
      { id: "skillmap"       as SideSection, icon: "🔥", label: "SkillMap",        href: "/skillmap" },
      { id: "linkedin"       as SideSection, icon: "💼", label: "LinkedIn",        href: "/linkedin-optimizer" },
      { id: "github"         as SideSection, icon: "🐙", label: "GitHub",          href: "/github-optimizer" },
      { id: "jobs"           as SideSection, icon: "💼", label: "Find Jobs",       href: "/jobs" },
    ],
  },
];

// ── Setup Modal ────────────────────────────────────────────────────────────────
function SetupModal({ onSave }: { onSave: (p: UserProfile) => void }) {
  const [form, setForm] = useState<UserProfile>({ name:"", targetCompany:"", targetRole:"", skillLevel:"Intermediate", targetDate:"", setupDate: new Date().toISOString() });
  const set = (k: keyof UserProfile, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all";
  const lbl = "block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md mx-4 bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-2xl p-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent rounded-t-2xl" />
        <div className="text-center mb-7">
          <div className="flex justify-center mb-3"><SkilloraLogo size={40} /></div>
          <h2 className="text-xl font-black text-white mb-1">Set up your workspace</h2>
          <p className="text-zinc-600 text-sm">Takes 30 seconds. Personalizes everything.</p>
        </div>
        <div className="space-y-3.5">
          <div><label className={lbl}>Your Name</label><input className={inp} placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => set("name", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Target Company</label><input className={inp} placeholder="Google, Amazon…" value={form.targetCompany} onChange={e => set("targetCompany", e.target.value)} /></div>
            <div><label className={lbl}>Target Role</label><input className={inp} placeholder="SDE-2, Analyst…" value={form.targetRole} onChange={e => set("targetRole", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={lbl}>Skill Level</label>
              <select className={inp} value={form.skillLevel} onChange={e => set("skillLevel", e.target.value)}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div><label className={lbl}>Target Date</label>
              <input type="date" className={inp} value={form.targetDate} onChange={e => set("targetDate", e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
          </div>
        </div>
        <button onClick={() => { if (!form.name.trim()) return; saveProfile(form); onSave(form); }} disabled={!form.name.trim()}
          className="w-full bg-red-600 hover:bg-red-500 text-white py-3 mt-5 font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Launch Dashboard
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [profile, setProfile]         = useState<UserProfile | null>(null);
  const [showSetup, setShowSetup]     = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [activeSection, setActiveSection] = useState<SideSection>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [history, setHistory]         = useState<any[]>([]);
  const [theme, setTheme]             = useState<"dark"|"light">("dark");

  // Roadmap state
  const [company, setCompany]         = useState("");
  const [targetRole, setTargetRole]   = useState("");
  const [skillLevel, setSkillLevel]   = useState("Intermediate");
  const [incRoadmap, setIncRoadmap]   = useState(true);
  const [incResume, setIncResume]     = useState(true);
  const [incInterview, setIncInterview] = useState(true);
  const [roadmap, setRoadmap]         = useState<any>(null);
  const [rmLoading, setRmLoading]     = useState(false);
  const [rmError, setRmError]         = useState("");

  // Resume ATS state
  const [jobLink, setJobLink]         = useState("");
  const [resumeFile, setResumeFile]   = useState<File | null>(null);
  const [analysis, setAnalysis]       = useState<any>(null);
  const [anLoading, setAnLoading]     = useState(false);
  const [anError, setAnError]         = useState("");
  const [dragActive, setDragActive]   = useState(false);
  const fileRef                       = useRef<HTMLInputElement>(null);

  const refreshHistory = () => setHistory(loadHistory());

  useEffect(() => {
    setMounted(true);
    const p = loadProfile();
    if (!p) setShowSetup(true);
    else setProfile(p);
    refreshHistory();
    setTheme(loadTheme());
  }, []);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refreshHistory(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // ── Computed ──────────────────────────────────────────────────────────────────
  const greeting  = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
  const daysLeft  = () => { if (!profile?.targetDate) return null; return Math.max(0, Math.ceil((new Date(profile.targetDate).getTime() - Date.now()) / 86400000)); };
  const daysActive = () => !profile?.setupDate ? 1 : Math.max(1, Math.ceil((Date.now() - new Date(profile.setupDate).getTime()) / 86400000));
  const intvCount  = mounted ? loadIntv() : 0;
  const solvedCount = mounted ? loadSolved() : 0;
  const todayTip   = TIPS[new Date().getDay() % TIPS.length];

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const generateRoadmap = async () => {
    if (!company.trim()) { setRmError("Enter a target company."); return; }
    if (!targetRole.trim()) { setRmError("Enter a target role."); return; }
    const goals = [...(incRoadmap?["roadmap"]:[]), ...(incResume?["resume"]:[]), ...(incInterview?["interview"]:[])];
    if (!goals.length) { setRmError("Select at least one component."); return; }
    setRmLoading(true); setRmError(""); setRoadmap(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/roadmap`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ company, skill_level: skillLevel, goal: `${goals.join(", ")} for ${targetRole} role` }) });
      if (!res.ok) throw new Error("Failed to generate plan.");
      const data = await res.json(); setRoadmap(data);
      const entry = { id: Date.now().toString(), type:"prep", company, role:targetRole, skillLevel, result:data, timestamp: Date.now() };
      const updated = [entry, ...loadHistory()]; saveHistory(updated); setHistory(updated);
    } catch(e:any) { setRmError(e.message||"Error occurred."); } finally { setRmLoading(false); }
  };

  const analyzeResume = async () => {
    if (!resumeFile) { setAnError("Upload your PDF resume first."); return; }
    setAnLoading(true); setAnError(""); setAnalysis(null);
    const fd = new FormData(); fd.append("resume", resumeFile); fd.append("job_link", jobLink);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/resume-match`, { method:"POST", body:fd });
      if (!res.ok) throw new Error("Failed to analyze resume.");
      const data = await res.json(); setAnalysis(data);
      const entry = { id: Date.now().toString(), type:"resume", fileName:resumeFile.name, jobLink, score:data.match_score??0, result:data, timestamp: Date.now() };
      const updated = [entry, ...loadHistory()]; saveHistory(updated); setHistory(updated);
    } catch(e:any) { setAnError(e.message||"Error occurred."); } finally { setAnLoading(false); }
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type==="dragenter"||e.type==="dragover"); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); const f=e.dataTransfer.files?.[0]; if(f?.type==="application/pdf") setResumeFile(f); else if(f) setAnError("Only PDF files are supported."); };
  const deleteEntry = (id: string, ev: React.MouseEvent) => { ev.stopPropagation(); const u=history.filter(h=>h.id!==id); saveHistory(u); setHistory(u); };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const navigate = (item: typeof NAV_GROUPS[0]["items"][0]) => {
    if (item.href) { window.location.href = item.href; return; }
    setActiveSection(item.id);
    setSidebarOpen(false);
  };

  const inp = `w-full border focus:border-red-500/40 rounded-xl px-4 py-3 outline-none text-sm transition-all ${theme === "dark" ? "bg-[#060606] border-white/8 text-zinc-200 placeholder:text-zinc-700" : "bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-400"}`;

  // Theme-aware class shorthands
  const T = {
    page:      theme === "dark" ? "bg-[#080808] text-zinc-200"              : "bg-zinc-50 text-zinc-800",
    sidebar:   theme === "dark" ? "bg-[#0a0a0a] border-white/5"             : "bg-white border-zinc-200",
    topbar:    theme === "dark" ? "bg-[#080808]/95 border-white/5"          : "bg-white/95 border-zinc-200",
    card:      theme === "dark" ? "bg-[#0f0f0f] border-white/6"             : "bg-white border-zinc-200",
    cardInner: theme === "dark" ? "bg-[#111] border-white/5"                : "bg-zinc-50 border-zinc-200",
    navItem:   theme === "dark" ? "text-zinc-500 hover:text-zinc-200 hover:bg-white/4" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100",
    navActive: theme === "dark" ? "bg-red-600/15 border-red-500/20 text-white"         : "bg-red-50 border-red-200 text-red-700",
    muted:     theme === "dark" ? "text-zinc-600"   : "text-zinc-400",
    subtle:    theme === "dark" ? "text-zinc-500"   : "text-zinc-500",
    label:     theme === "dark" ? "text-zinc-700"   : "text-zinc-400",
    heading:   theme === "dark" ? "text-white"      : "text-zinc-900",
    divider:   theme === "dark" ? "border-white/5"  : "border-zinc-100",
    badge:     theme === "dark" ? "bg-[#111] border-white/8 text-zinc-300"  : "bg-zinc-100 border-zinc-200 text-zinc-600",
    history:   theme === "dark" ? "hover:bg-white/3" : "hover:bg-zinc-50",
    stat:      theme === "dark" ? "bg-[#0f0f0f] border-white/6"             : "bg-white border-zinc-200",
  };

  if (!mounted) return null;

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`${mobile ? "flex" : "hidden lg:flex"} flex-col h-full border-r w-56 flex-shrink-0 ${T.sidebar}`}>
      {/* Logo */}
      <div className={`px-5 py-4 border-b ${T.divider}`}>
        <Link href="/" className="flex items-center gap-2.5">
          <SkilloraLogo size={30} />
          <span className="text-base font-black tracking-tight">
            <span className="brand-skill">Skill</span>
            <span className="brand-ora">ora</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 mb-1.5 ${T.label}`}>{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => navigate(item)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group border ${
                      isActive ? T.navActive : `border-transparent ${T.navItem}`
                    }`}>
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.href && (
                      <svg className="w-3 h-3 ml-auto opacity-30 group-hover:opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    )}
                    {isActive && !item.href && <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: activity + theme toggle + settings */}
      <div className={`border-t px-3 py-4 ${T.divider}`}>
        <p className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 mb-2 ${T.label}`}>Recent Activity</p>
        <div className="space-y-1.5 mb-3">
          {history.length === 0 ? (
            <p className={`text-[11px] px-2 ${T.label}`}>No activity yet</p>
          ) : history.slice(0, 4).map((e, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all group ${T.history}`}>
              <span className="text-xs">{HISTORY_ICON[e.type] || "📌"}</span>
              <p className={`text-[11px] truncate flex-1 ${T.subtle}`}>
                {e.type==="prep"?e.company:e.type==="resume"?e.fileName?.split(".")[0]:e.type==="interview"?`${e.roundType} round`:e.type==="coding"?e.title:e.type==="aptitude"?e.section:"—"}
              </p>
              <button onClick={ev=>deleteEntry(e.id,ev)} className={`opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all ${T.label}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>

        {/* ── Theme Toggle ── */}
        <div className={`rounded-xl border p-3 mb-2 ${T.card}`}>
          <p className={`text-[9px] font-black uppercase tracking-[0.15em] mb-2 ${T.label}`}>Appearance</p>
          <div className="flex gap-1.5">
            <button onClick={() => { setTheme("dark"); localStorage.setItem(THEME_KEY,"dark"); document.documentElement.setAttribute("data-theme","dark"); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold transition-all border ${
                theme === "dark" ? "bg-zinc-800 border-zinc-600 text-white" : "border-transparent text-zinc-400 hover:bg-zinc-100"
              }`}>
              🌙 Dark
            </button>
            <button onClick={() => { setTheme("light"); localStorage.setItem(THEME_KEY,"light"); document.documentElement.setAttribute("data-theme","light"); }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-semibold transition-all border ${
                theme === "light" ? "bg-white border-zinc-300 text-zinc-900 shadow-sm" : "border-transparent text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
              }`}>
              ☀️ Light
            </button>
          </div>
        </div>

        {/* Profile / Setup */}
        <button onClick={() => setShowSetup(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border border-transparent ${T.navItem}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span className="text-xs">Edit Profile</span>
        </button>

        {/* Admin link — only visible to admin */}
        {(() => { try { return localStorage.getItem("skillora_user_email") === ADMIN_EMAIL; } catch { return false; } })() && (
          <button onClick={() => window.location.href = "/admin"}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border border-red-500/20 bg-red-600/10 text-red-400 hover:bg-red-600/20">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span className="text-xs font-semibold">Admin Panel</span>
          </button>
        )}

        {/* Logout */}
        <button onClick={() => {
          const email = (() => { try { return localStorage.getItem("skillora_user_email") || ""; } catch { return ""; } })();
          // Record logout in DB (non-blocking)
          if (email) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/logout`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            }).catch(() => {});
          }
          try {
            localStorage.removeItem("skillora_user_profile");
            localStorage.removeItem("skillora_history");
            localStorage.removeItem("skillora_interview_count");
            localStorage.removeItem("skillora_solved");
            localStorage.removeItem("skillora_user_email");
            // Clear auth cookie so middleware redirects correctly
            document.cookie = "skillora_auth=; path=/; max-age=0; SameSite=Lax";
          } catch {}
          window.location.href = "/login";
        }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all border border-transparent text-zinc-600 hover:text-red-400 hover:bg-red-500/8 hover:border-red-500/15">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${T.page}`}>
      {showSetup && <SetupModal onSave={p => { setProfile(p); setShowSetup(false); }} />}

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Mobile sidebar */}
      <div className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ width: 224 }}>
        <Sidebar mobile />
      </div>

      {/* ── Top bar (mobile) ── */}
      <div className={`lg:hidden sticky top-0 z-30 border-b backdrop-blur-xl flex items-center justify-between px-4 py-3 ${T.topbar}`}>
        <button onClick={() => setSidebarOpen(true)} className={`p-1.5 rounded-lg transition-all ${T.navItem}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
        <Link href="/" className="flex items-center gap-2"><SkilloraLogo size={24}/><span className="text-sm font-black"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span></Link>
        {/* Mobile theme toggle */}
        <button onClick={toggleTheme} className={`p-1.5 rounded-lg transition-all ${T.navItem}`}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 h-screen overflow-hidden">

        {/* Desktop sidebar */}
        <Sidebar />

        {/* ── Content ── */}
        <main className={`flex-1 overflow-y-auto transition-colors duration-300 ${T.page}`}>
          {/* Ambient */}
          <div className="fixed top-0 right-0 w-[600px] h-[300px] bg-red-600/4 rounded-full blur-[120px] pointer-events-none z-0" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-7">

            {/* ══════ HOME ══════ */}
            {activeSection === "home" && (
              <div className="space-y-5">

                {/* ── Hero Banner ── */}
                <div className={`relative rounded-2xl overflow-hidden border ${T.card}`}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
                  <div className="absolute -top-16 -right-16 w-72 h-72 bg-red-600/8 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #dc2626 1px, transparent 0)", backgroundSize: "32px 32px" }} />

                  <div className="relative p-7 md:p-9">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${T.muted}`}>{profile ? greeting() : "Welcome"}</span>
                        </div>
                        {profile ? (
                          <>
                            <h1 className={`text-2xl md:text-3xl font-black leading-tight mb-1.5 ${T.heading}`}>
                              {profile.name.split(" ")[0]} 👋
                            </h1>
                            <p className={`text-sm leading-relaxed mb-5 max-w-sm ${T.subtle}`}>
                              {profile.targetCompany
                                ? <>Targeting <span className={`font-semibold ${T.heading}`}>{profile.targetCompany}</span>{profile.targetRole ? <> · {profile.targetRole}</> : ""}. Stay consistent.</>
                                : "Your AI placement prep hub. All tools, zero cost."}
                            </p>
                          </>
                        ) : (
                          <>
                            <h1 className={`text-2xl md:text-3xl font-black leading-tight mb-1.5 ${T.heading}`}>
                              Your Career, <span className="text-red-500">Supercharged.</span>
                            </h1>
                            <p className={`text-sm leading-relaxed mb-5 max-w-sm ${T.subtle}`}>
                              Mock interviews, resume analysis, coding, roadmaps — 100% free.
                            </p>
                          </>
                        )}
                        <div className="flex flex-wrap gap-2.5 items-center">
                          <button onClick={() => setActiveSection("roadmap")}
                            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 hover:-translate-y-0.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Get Roadmap
                          </button>
                          <Link href="/mock-interview" className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all border ${T.card} hover:border-red-500/25 ${T.subtle}`}>
                            🎤 Interview
                          </Link>
                          <Link href="/coding" className={`px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all border ${T.card} hover:border-red-500/25 ${T.subtle}`}>
                            💻 Coding
                          </Link>
                        </div>
                      </div>

                      {/* Stats 2x2 */}
                      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
                        {[
                          { val: daysActive(),  label: "Day Streak",  icon: "🔥", c: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/15" },
                          { val: intvCount,     label: "Interviews",  icon: "🎤", c: "text-blue-400",   bg: "bg-blue-500/8 border-blue-500/15"   },
                          { val: solvedCount,   label: "Solved",      icon: "💻", c: "text-purple-400", bg: "bg-purple-500/8 border-purple-500/15"},
                          { val: history.filter(h => h.type === "aptitude").length, label: "Tests", icon: "🎯", c: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/15" },
                        ].map(s => (
                          <div key={s.label} className={`rounded-xl px-3.5 py-3 text-center border ${s.bg}`}>
                            <p className="text-base mb-0.5">{s.icon}</p>
                            <p className={`text-lg font-black leading-tight ${s.c}`}>{s.val}</p>
                            <p className={`text-[9px] uppercase tracking-wider mt-0.5 ${T.muted}`}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress bar */}
                    {profile?.targetDate && profile?.setupDate && (() => {
                      const total = new Date(profile.targetDate).getTime() - new Date(profile.setupDate).getTime();
                      const pct = Math.min(100, Math.max(0, ((Date.now() - new Date(profile.setupDate).getTime()) / total) * 100));
                      const dl = daysLeft();
                      return (
                        <div className={`mt-5 pt-4 border-t ${T.divider}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[11px] font-medium ${T.subtle}`}>
                              Prep progress to <span className={`font-bold ${T.heading}`}>{profile.targetCompany || "target"}</span>
                            </span>
                            <span className={`text-xs font-bold ${dl !== null && dl <= 7 ? "text-red-400" : dl !== null && dl <= 30 ? "text-amber-400" : "text-green-400"}`}>
                              {dl !== null ? `${dl} days left` : `${Math.round(pct)}%`}
                            </span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* ── 2-col: Tip + Recent Activity ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Daily tip */}
                  <div className={`rounded-2xl p-5 border relative overflow-hidden ${T.card}`}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-sm">💡</span>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Today's Tip</p>
                    </div>
                    <p className={`text-sm leading-relaxed ${T.subtle}`}>{todayTip}</p>
                  </div>

                  {/* Recent activity */}
                  <div className={`rounded-2xl p-5 border relative overflow-hidden ${T.card}`}>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-sm">📋</span>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${T.label}`}>Recent Activity</p>
                      </div>
                      {history.length > 3 && (
                        <button onClick={() => setActiveSection("home")} className="text-[10px] text-red-500 hover:text-red-400 transition-colors">
                          {history.length} total
                        </button>
                      )}
                    </div>
                    {history.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-4 gap-2">
                        <span className="text-3xl opacity-20">📭</span>
                        <p className={`text-xs ${T.label}`}>No activity yet — pick a tool from the sidebar</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {history.slice(0, 4).map((e, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className="text-base flex-shrink-0">{HISTORY_ICON[e.type] || "📌"}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate font-medium ${T.heading}`}>
                                {e.type==="prep"?`${e.company} — ${e.role}`:e.type==="resume"?e.fileName:e.type==="interview"?`${e.roundType?.toUpperCase()} Interview`:e.type==="coding"?e.title:e.type==="aptitude"?`${e.section} · ${e.correct}/${e.total}`:"—"}
                              </p>
                              {e.score !== undefined && (
                                <p className={`text-[10px] ${e.score >= 70 ? "text-green-400" : e.score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                                  Score: {e.score}{e.type === "aptitude" ? "%" : "/100"}
                                </p>
                              )}
                            </div>
                            <span className={`text-[9px] flex-shrink-0 ${T.label}`}>{timeAgo(e.timestamp)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Quick actions row ── */}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${T.label}`}>Quick Actions</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon:"🗺️", label:"Get Roadmap",    sub:"AI plan for any company",   action:()=>setActiveSection("roadmap"),   color:"border-red-500/20 hover:border-red-500/40 hover:bg-red-500/5"    },
                      { icon:"📄", label:"Analyze Resume",  sub:"ATS score in seconds",       action:()=>setActiveSection("resume-ats"),color:"border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/5"},
                      { icon:"🎤", label:"Mock Interview",  sub:"HR & Tech rounds",           href:"/mock-interview",                  color:"border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5"   },
                      { icon:"🎯", label:"Aptitude Test",   sub:"Full mock + topic practice", href:"/aptitude",                        color:"border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5"},
                    ].map((q, i) => {
                      const content = (
                        <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${T.card} ${q.color}`}>
                          <span className="text-2xl flex-shrink-0">{q.icon}</span>
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${T.heading}`}>{q.label}</p>
                            <p className={`text-[10px] ${T.label}`}>{q.sub}</p>
                          </div>
                          <svg className={`w-4 h-4 ml-auto flex-shrink-0 opacity-30 ${T.subtle}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                        </div>
                      );
                      if (q.href) return <Link key={i} href={q.href}>{content}</Link>;
                      return <div key={i} onClick={q.action}>{content}</div>;
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ══════ ROADMAP ══════ */}
            {activeSection === "roadmap" && (
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl font-black text-white">Company Roadmap</h1>
                  <p className="text-zinc-500 text-sm mt-0.5">Generate a personalized placement plan for any company and role</p>
                </div>
                <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
                  {rmError && <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{rmError}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-wider">Company</label>
                      <input type="text" placeholder="e.g. Google" className={inp} value={company} onChange={e => setCompany(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-wider">Role</label>
                      <input type="text" placeholder="e.g. SDE Intern" className={inp} value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1.5 uppercase tracking-wider">Level</label>
                      <select className={inp} value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-5 pt-4 border-t border-white/5">
                    {[{s:incRoadmap,set:setIncRoadmap,l:"Roadmap"},{s:incResume,set:setIncResume,l:"Resume Tips"},{s:incInterview,set:setIncInterview,l:"Interview Questions"}].map(({s,set,l})=>(
                      <label key={l} className="flex items-center gap-2 cursor-pointer text-sm text-zinc-400 hover:text-zinc-200 transition-colors select-none">
                        <input type="checkbox" checked={s} onChange={e=>set(e.target.checked)} className="w-3.5 h-3.5 accent-red-600"/>{l}
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <button onClick={generateRoadmap} disabled={rmLoading}
                      className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-all">
                      {rmLoading ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating…</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Generate Plan</>}
                    </button>
                  </div>
                </div>
                {roadmap && (
                  <div className="space-y-4">
                    {roadmap.roadmap?.length > 0 && (
                      <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                        <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"/>Learning Roadmap</h3>
                        <div className="relative border-l border-red-500/20 pl-5 ml-1 space-y-4">
                          {roadmap.roadmap.map((step: string, i: number) => (
                            <div key={i} className="relative group">
                              <div className="absolute -left-[25px] top-0.5 w-6 h-6 rounded-full bg-[#0f0f0f] border border-red-500/20 group-hover:border-red-500/50 transition-all flex items-center justify-center text-[10px] font-bold text-zinc-600 group-hover:text-red-400">{i+1}</div>
                              <div className="bg-[#111] border border-white/5 hover:border-red-500/15 rounded-xl px-4 py-3 transition-all"><p className="text-zinc-300 text-sm leading-relaxed">{step}</p></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {roadmap.resume?.length > 0 && (
                      <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"/>Resume Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {roadmap.resume.map((tip: string, i: number) => (
                            <div key={i} className="flex items-start gap-2.5 bg-[#111] border border-white/5 rounded-xl px-4 py-3">
                              <span className="text-orange-400 mt-0.5 flex-shrink-0">→</span>
                              <p className="text-zinc-300 text-sm leading-relaxed">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {roadmap.interview?.length > 0 && (
                      <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"/>Interview Questions</h3>
                        <div className="space-y-2">
                          {roadmap.interview.map((q: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 bg-[#111] border border-white/5 rounded-xl px-4 py-3">
                              <span className="text-blue-400 font-black text-xs flex-shrink-0 mt-0.5">Q{i+1}</span>
                              <p className="text-zinc-300 text-sm leading-relaxed">{q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ══════ RESUME ATS ══════ */}
            {activeSection === "resume-ats" && (
              <div className="space-y-5">
                <div>
                  <h1 className={`text-xl font-black ${T.heading}`}>ATS Resume Analyzer</h1>
                  <p className={`text-sm mt-0.5 ${T.subtle}`}>Upload your resume — get ATS score, keyword gaps, tips, and interview questions</p>
                </div>

                {/* Upload form */}
                <div className={`rounded-2xl p-6 border relative overflow-hidden ${T.card}`}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                  {anError && <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{anError}</div>}

                  <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={()=>setDragActive(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()}
                    className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all mb-4 ${dragActive?"border-red-500/60 bg-red-500/5":resumeFile?"border-green-500/40 bg-green-500/5":"border-white/10 hover:border-white/20 hover:bg-white/3"}`}>
                    <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f){setResumeFile(f);setAnError("");setAnalysis(null);}}} />
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                      <span className="text-3xl">{resumeFile?"✅":"📎"}</span>
                      {resumeFile
                        ? <><p className="text-green-400 text-sm font-semibold">{resumeFile.name}</p><p className="text-zinc-600 text-xs">Click to replace</p></>
                        : <><p className={`text-sm font-medium ${T.subtle}`}>Drop your PDF resume here</p><p className={`text-xs ${T.label}`}>or click to browse</p></>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-wider ${T.label}`}>
                      Job Posting URL <span className={`font-normal normal-case ${T.label}`}>(optional — improves accuracy)</span>
                    </label>
                    <input type="url" placeholder="https://careers.google.com/jobs/..." className={inp} value={jobLink} onChange={e=>setJobLink(e.target.value)} />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={analyzeResume} disabled={anLoading||!resumeFile}
                      className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 transition-all">
                      {anLoading
                        ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyzing Resume…</>
                        : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>Analyze Resume</>}
                    </button>
                  </div>
                </div>

                {/* ── Results ── */}
                {analysis && (
                  <div className="space-y-4">

                    {/* Score banner */}
                    <div className={`rounded-2xl p-6 border relative overflow-hidden ${T.card}`}>
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Score ring */}
                        <div className="relative w-28 h-28 flex-shrink-0">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
                            <circle cx="56" cy="56" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9"/>
                            <circle cx="56" cy="56" r="46" fill="none"
                              stroke={analysis.match_score>=75?"#22c55e":analysis.match_score>=50?"#f59e0b":"#dc2626"}
                              strokeWidth="9" strokeDasharray={2*Math.PI*46}
                              strokeDashoffset={2*Math.PI*46*(1-(analysis.match_score??0)/100)}
                              strokeLinecap="round" style={{transition:"stroke-dashoffset 1.2s ease"}}/>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white">{analysis.match_score??0}</span>
                            <span className="text-[10px] text-zinc-500">/100</span>
                          </div>
                        </div>
                        {/* Score details */}
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                            <h3 className={`text-lg font-black ${T.heading}`}>ATS Match Score</h3>
                            {analysis.ats_grade && (
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                analysis.ats_grade==="Excellent"?"bg-green-500/10 text-green-400 border-green-500/25":
                                analysis.ats_grade==="Good"?"bg-blue-500/10 text-blue-400 border-blue-500/25":
                                analysis.ats_grade==="Average"?"bg-amber-500/10 text-amber-400 border-amber-500/25":
                                "bg-red-500/10 text-red-400 border-red-500/25"}`}>
                                {analysis.ats_grade}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${T.subtle}`}>
                            {analysis.match_score>=75?"Strong match — your resume is well-optimized for this role. Apply with confidence!":
                             analysis.match_score>=50?"Decent match — add missing keywords and fix gaps to improve shortlist chances.":
                             "Weak match — significant optimization needed before applying."}
                          </p>
                          {/* Strengths */}
                          {analysis.strengths?.length>0 && (
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                              {analysis.strengths.map((s:string, i:number) => (
                                <span key={i} className="text-xs bg-green-500/8 border border-green-500/20 text-green-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                                  <span className="text-green-400">✓</span> {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Keywords grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.matched_keywords?.length>0 && (
                        <div className={`rounded-2xl p-5 border ${T.card}`}>
                          <h3 className="text-xs font-bold text-green-400 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"/>✓ Matched Keywords ({analysis.matched_keywords.length})
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.matched_keywords.map((k:string)=>(
                              <span key={k} className="text-[11px] bg-green-500/8 border border-green-500/20 text-green-300 px-2.5 py-1 rounded-full">{k}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysis.missing_keywords?.length>0 && (
                        <div className={`rounded-2xl p-5 border ${T.card}`}>
                          <h3 className="text-xs font-bold text-red-400 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"/>✗ Missing Keywords ({analysis.missing_keywords.length})
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.missing_keywords.map((k:string)=>(
                              <span key={k} className="text-[11px] bg-red-500/8 border border-red-500/20 text-red-300 px-2.5 py-1 rounded-full">{k}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Missing skills */}
                    {analysis.missing_skills?.length>0 && (
                      <div className={`rounded-2xl p-5 border ${T.card}`}>
                        <h3 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>⚠ Skills to Add
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing_skills.map((s:string, i:number)=>(
                            <span key={i} className="text-xs bg-amber-500/8 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl">+ {s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions + Resume improvements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysis.suggestions?.length>0 && (
                        <div className={`rounded-2xl p-5 border ${T.card}`}>
                          <h3 className="text-xs font-bold text-orange-400 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"/>💡 ATS Tips
                          </h3>
                          <ul className="space-y-2.5">
                            {analysis.suggestions.map((s:string, i:number)=>(
                              <li key={i} className={`flex items-start gap-2.5 text-xs ${T.subtle}`}>
                                <span className="text-orange-400 mt-0.5 flex-shrink-0 font-bold">{i+1}.</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.resume_improvements?.length>0 && (
                        <div className={`rounded-2xl p-5 border ${T.card}`}>
                          <h3 className="text-xs font-bold text-purple-400 mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"/>✏️ Resume Fixes
                          </h3>
                          <ul className="space-y-2.5">
                            {analysis.resume_improvements.map((s:string, i:number)=>(
                              <li key={i} className={`flex items-start gap-2.5 text-xs ${T.subtle}`}>
                                <span className="text-purple-400 mt-0.5 flex-shrink-0">→</span>{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Roadmap */}
                    {analysis.roadmap?.length>0 && (
                      <div className={`rounded-2xl p-6 border relative overflow-hidden ${T.card}`}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                        <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${T.heading}`}>
                          <span className="w-2 h-2 rounded-full bg-blue-400"/>🗺️ Skill Gap Roadmap
                        </h3>
                        <div className="relative border-l border-blue-500/20 pl-5 ml-1 space-y-3">
                          {analysis.roadmap.map((step:string, i:number)=>(
                            <div key={i} className="relative group">
                              <div className="absolute -left-[21px] top-1 w-5 h-5 rounded-full bg-[#0f0f0f] border border-blue-500/30 flex items-center justify-center text-[9px] font-black text-blue-400">{i+1}</div>
                              <div className={`rounded-xl px-4 py-2.5 border ${T.cardInner} border-white/5`}>
                                <p className={`text-xs leading-relaxed ${T.subtle}`}>{step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interview questions */}
                    {analysis.interview_questions?.length>0 && (
                      <div className={`rounded-2xl p-6 border relative overflow-hidden ${T.card}`}>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                        <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${T.heading}`}>
                          <span className="w-2 h-2 rounded-full bg-red-400"/>🎤 Likely Interview Questions
                          <span className="text-[10px] text-zinc-600 font-normal ml-auto">Practice these before applying</span>
                        </h3>
                        <div className="space-y-2.5">
                          {analysis.interview_questions.map((q:string, i:number)=>(
                            <div key={i} className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${T.cardInner} border-white/5`}>
                              <span className="w-6 h-6 rounded-full bg-red-500/10 text-red-400 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">Q{i+1}</span>
                              <p className={`text-sm leading-relaxed ${T.subtle}`}>{q}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Link href="/mock-interview" className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                            → Practice these in Mock Interview →
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Pro tips */}
                    {analysis.tips?.length>0 && (
                      <div className={`rounded-2xl p-5 border ${T.card}`}>
                        <h3 className="text-xs font-bold text-amber-500 mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"/>⚡ Pro ATS Tips
                        </h3>
                        <div className="space-y-2">
                          {analysis.tips.map((t:string, i:number)=>(
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="text-amber-400 text-xs mt-0.5">💡</span>
                              <p className={`text-xs leading-relaxed ${T.subtle}`}>{t}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Re-analyze */}
                    <div className="flex justify-center">
                      <button onClick={()=>{setAnalysis(null);setResumeFile(null);setJobLink("");}}
                        className={`text-sm px-6 py-2.5 rounded-xl border transition-all ${T.card} hover:border-red-500/30 ${T.subtle}`}>
                        ↺ Analyze Another Resume
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══════ REDIRECT STUBS ══════ */}
            {["interview","coding","aptitude","prep-hub","resume-builder","skillmap","linkedin","github","jobs"].includes(activeSection) && (
              <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
                <span className="text-6xl">
                  {activeSection==="interview"?"🎤":activeSection==="coding"?"💻":activeSection==="aptitude"?"🎯":activeSection==="prep-hub"?"📚":activeSection==="resume-builder"?"📝":activeSection==="skillmap"?"🔥":activeSection==="linkedin"?"💼":activeSection==="jobs"?"🔍":"🐙"}
                </span>
                <h2 className="text-xl font-black text-white capitalize">{activeSection.replace(/-/g," ")}</h2>
                <p className="text-zinc-500 text-sm max-w-sm">This tool opens in its own dedicated page for the best experience.</p>
                <Link href={
                  activeSection==="interview"?"/mock-interview":
                  activeSection==="coding"?"/coding":
                  activeSection==="aptitude"?"/aptitude":
                  activeSection==="prep-hub"?"/prep-hub":
                  activeSection==="resume-builder"?"/resume-builder":
                  activeSection==="skillmap"?"/skillmap":
                  activeSection==="linkedin"?"/linkedin-optimizer":
                  activeSection==="jobs"?"/jobs":
                  "/github-optimizer"
                } className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                  Open {activeSection.replace(/-/g," ")}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </Link>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
