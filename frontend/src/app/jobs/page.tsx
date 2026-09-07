"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── Types ──────────────────────────────────────────────────────────────────────
interface JobPortal {
  name: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
  buildUrl: (q: string, loc: string, exp: string) => string;
}

// ── Job Portals Config ─────────────────────────────────────────────────────────
const PORTALS: JobPortal[] = [
  {
    name: "Naukri",
    icon: "🟠",
    color: "text-orange-400",
    bg: "bg-orange-500/8",
    border: "border-orange-500/20 hover:border-orange-500/40",
    desc: "India's #1 job portal — 1 Crore+ listings",
    buildUrl: (q, loc, exp) => {
      const slug = q.toLowerCase().replace(/\s+/g, "-");
      const locSlug = loc.toLowerCase().replace(/\s+/g, "-") || "india";
      const expParam = exp ? `&experience=${exp}` : "";
      return `https://www.naukri.com/${slug}-jobs-in-${locSlug}${expParam}`;
    },
  },
  {
    name: "LinkedIn Jobs",
    icon: "🔵",
    color: "text-sky-400",
    bg: "bg-sky-500/8",
    border: "border-sky-500/20 hover:border-sky-500/40",
    desc: "Professional network + recruiter connections",
    buildUrl: (q, loc, exp) => {
      const params = new URLSearchParams({
        keywords: q,
        location: loc || "India",
        ...(exp ? { f_E: exp } : {}),
      });
      return `https://www.linkedin.com/jobs/search/?${params}`;
    },
  },
  {
    name: "Indeed India",
    icon: "🔷",
    color: "text-blue-400",
    bg: "bg-blue-500/8",
    border: "border-blue-500/20 hover:border-blue-500/40",
    desc: "Global jobs aggregator — apply directly",
    buildUrl: (q, loc, _exp) => {
      const params = new URLSearchParams({ q, l: loc || "India" });
      return `https://in.indeed.com/jobs?${params}`;
    },
  },
  {
    name: "Internshala",
    icon: "🟢",
    color: "text-green-400",
    bg: "bg-green-500/8",
    border: "border-green-500/20 hover:border-green-500/40",
    desc: "Internships + fresher jobs in India",
    buildUrl: (q, _loc, _exp) => {
      const slug = q.toLowerCase().replace(/\s+/g, "-");
      return `https://internshala.com/jobs/${slug}-jobs`;
    },
  },
  {
    name: "Glassdoor",
    icon: "🟡",
    color: "text-yellow-400",
    bg: "bg-yellow-500/8",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
    desc: "Jobs + company reviews + salary insights",
    buildUrl: (q, loc, _exp) => {
      const params = new URLSearchParams({ sc: "KO0," + q.length, locT: "C", locId: "3", typedKeyword: q, keyword: q, locKeyword: loc || "India" });
      return `https://www.glassdoor.co.in/Job/jobs.htm?${params}`;
    },
  },
  {
    name: "Foundit (Monster)",
    icon: "🔴",
    color: "text-red-400",
    bg: "bg-red-500/8",
    border: "border-red-500/20 hover:border-red-500/40",
    desc: "Formerly Monster India — IT & tech jobs",
    buildUrl: (q, loc, _exp) => {
      const params = new URLSearchParams({ q, locationCode: loc || "India" });
      return `https://www.foundit.in/srp/results?${params}`;
    },
  },
  {
    name: "Shine.com",
    icon: "🟣",
    color: "text-purple-400",
    bg: "bg-purple-500/8",
    border: "border-purple-500/20 hover:border-purple-500/40",
    desc: "HT Media jobs portal — good for freshers",
    buildUrl: (q, loc, _exp) => {
      const params = new URLSearchParams({ q, location: loc || "India" });
      return `https://www.shine.com/job-search/${q.toLowerCase().replace(/\s+/g, "-")}-jobs-in-${(loc || "india").toLowerCase().replace(/\s+/g, "-")}`;
    },
  },
  {
    name: "Wellfound (AngelList)",
    icon: "🚀",
    color: "text-violet-400",
    bg: "bg-violet-500/8",
    border: "border-violet-500/20 hover:border-violet-500/40",
    desc: "Startup jobs — equity + remote options",
    buildUrl: (q, _loc, _exp) => {
      return `https://wellfound.com/jobs?q=${encodeURIComponent(q)}&l=India`;
    },
  },
];

// ── Popular Roles ──────────────────────────────────────────────────────────────
const POPULAR_ROLES = [
  "Software Engineer", "Data Scientist", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Machine Learning Engineer", "Data Analyst",
  "Product Manager", "UI/UX Designer", "Cloud Engineer", "Android Developer",
  "iOS Developer", "React Developer", "Python Developer", "Java Developer",
];

const POPULAR_LOCATIONS = [
  "Bengaluru", "Hyderabad", "Mumbai", "Pune", "Chennai", "Delhi NCR",
  "Kolkata", "Noida", "Gurgaon", "Remote",
];

const EXP_OPTIONS = [
  { label: "Fresher (0-1 yr)", value: "0-1" },
  { label: "1-3 years", value: "1-3" },
  { label: "3-5 years", value: "3-5" },
  { label: "5+ years", value: "5+" },
];

export default function JobsPage() {
  const [role, setRole]         = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExp]    = useState("");
  const [mounted, setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const openJobs = (portal: JobPortal) => {
    const url = portal.buildUrl(role || "Software Engineer", location, experience);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openAll = () => {
    PORTALS.forEach((p, i) => {
      setTimeout(() => {
        const url = p.buildUrl(role || "Software Engineer", location, experience);
        window.open(url, "_blank", "noopener,noreferrer");
      }, i * 300);
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <SkilloraLogo size={30} />
          <span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>
        <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Dashboard
        </Link>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Job Search
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Find Your <span className="text-gradient">Dream Job</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Search across Naukri, LinkedIn, Indeed, Internshala and more — all at once.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-[#0f0f0f] border border-white/6 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {/* Role */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Job Role / Skills</label>
              <input
                type="text"
                placeholder="e.g. React Developer, Data Scientist"
                className="w-full bg-[#060606] border border-white/8 focus:border-red-500/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all"
                value={role}
                onChange={e => setRole(e.target.value)}
                onKeyDown={e => e.key === "Enter" && openJobs(PORTALS[0])}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Location</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad, Remote"
                className="w-full bg-[#060606] border border-white/8 focus:border-red-500/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Experience</label>
              <select
                className="w-full bg-[#060606] border border-white/8 focus:border-red-500/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
                value={experience}
                onChange={e => setExp(e.target.value)}
              >
                <option value="">Any experience</option>
                {EXP_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Popular roles */}
          <div className="mb-5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Popular roles</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_ROLES.map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${role === r ? "bg-red-600/15 border-red-500/30 text-red-300" : "border-white/8 bg-[#111] text-zinc-500 hover:text-zinc-200 hover:border-white/15"}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Popular locations */}
          <div className="mb-5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2">Popular locations</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LOCATIONS.map(l => (
                <button key={l} onClick={() => setLocation(l)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${location === l ? "bg-red-600/15 border-red-500/30 text-red-300" : "border-white/8 bg-[#111] text-zinc-500 hover:text-zinc-200 hover:border-white/15"}`}>
                  📍 {l}
                </button>
              ))}
            </div>
          </div>

          {/* Open all button */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button onClick={openAll}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-600/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              Search All Portals at Once
            </button>
            <p className="text-xs text-zinc-600">Opens all 8 job sites in separate tabs</p>
          </div>
        </div>

        {/* Portal Cards */}
        <div>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Choose a portal to search</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PORTALS.map(portal => (
              <button key={portal.name} onClick={() => openJobs(portal)}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${portal.bg} ${portal.border} transition-all group text-left hover:scale-[1.01]`}>
                <div className="w-12 h-12 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {portal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-bold ${portal.color}`}>{portal.name}</p>
                    <svg className="w-3.5 h-3.5 opacity-40 group-hover:opacity-80 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </div>
                  <p className="text-xs text-zinc-500">{portal.desc}</p>
                </div>
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity ${portal.bg} ${portal.border} ${portal.color}`}>
                  Search →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-[#0f0f0f] border border-white/6 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-3">💡 Job Search Tips</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🎯", tip: "Use exact job titles like 'React Developer' instead of just 'Developer' — better matches" },
              { icon: "📄", tip: "Analyze your resume with ATS Analyzer before applying to improve your shortlist rate" },
              { icon: "🔔", tip: "Set job alerts on Naukri and LinkedIn — new jobs get the most applications in first 24 hours" },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{t.icon}</span>
                <p className="text-xs text-zinc-500 leading-relaxed">{t.tip}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-3">
            <Link href="/dashboard" className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
              → Analyze Resume with ATS
            </Link>
            <Link href="/linkedin-optimizer" className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors">
              → Optimize LinkedIn Profile
            </Link>
            <Link href="/mock-interview" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              → Practice Mock Interview
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
