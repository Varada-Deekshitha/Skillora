"use client";

import { useState } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface GithubData {
  login: string; name: string; bio: string; company: string; location: string;
  blog: string; email: string; twitter: string; public_repos: number;
  followers: number; following: number; avatar_url: string; html_url: string;
  top_languages: string[]; repos: any[]; total_stars: number;
}

interface OptResult {
  profile_score: number; grade: string; verdict: string;
  optimized_bio: string; bio_tips: string[];
  readme_template: string; top_repos_to_pin: string[];
  repo_improvement_tips: string[]; languages_to_learn: string[];
  contribution_tips: string[]; profile_strengths: string[];
  profile_weaknesses: string[]; quick_wins: string[];
  github_data: GithubData;
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const r = 54, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = grade === "A" ? "#22c55e" : grade === "B" ? "#3b82f6" : grade === "C" ? "#f59e0b" : "#dc2626";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 124 124">
          <circle cx="62" cy="62" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
          <circle cx="62" cy="62" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">/100</span>
        </div>
      </div>
      <span className={`text-2xl font-black px-4 py-1 rounded-xl border-2`} style={{ color, borderColor: color + "40", background: color + "10" }}>
        Grade {grade}
      </span>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      className="text-xs flex items-center gap-1 text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0">
      {done
        ? <><svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg><span className="text-green-400">Copied</span></>
        : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>
      }
    </button>
  );
}

export default function GitHubOptimizerPage() {
  const [username, setUsername]     = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCo, setTargetCo]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [result, setResult]         = useState<OptResult | null>(null);
  const [showReadme, setShowReadme] = useState(false);

  const analyze = async () => {
    if (!username.trim()) { setError("Please enter a GitHub username."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API}/github/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), target_role: targetRole, target_company: targetCo }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError("Failed to connect to backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const gh = result?.github_data;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/6 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <SkilloraLogo size={32} />
          <span className="text-lg font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Dashboard
          </Link>
          {result && <button onClick={() => setResult(null)} className="btn-ghost text-xs px-3 py-2">Re-analyze</button>}
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">

        {/* Header */}
        <div className="text-center mb-10 anim-fade-up">
          <span className="inline-flex items-center gap-2 text-xs bg-zinc-800 text-zinc-300 border border-white/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            GitHub Profile Optimizer
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Make recruiters <span className="text-gradient">notice you</span> on GitHub
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Enter any GitHub username — we fetch your real profile data and AI generates a complete optimization report with a ready-to-use README template.
          </p>
        </div>

        {/* Input Form */}
        {!result && (
          <div className="space-y-5 anim-fade-up">
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub Username
              </h2>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">github.com/</span>
                  <input
                    className="w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl pl-24 pr-4 py-3 text-zinc-100 outline-none text-sm placeholder:text-zinc-700 transition-all"
                    placeholder="torvalds"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && analyze()}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Target Role <span className="text-zinc-700 font-normal normal-case">(optional)</span></label>
                  <input className="w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all" placeholder="e.g. Backend Engineer, ML Engineer" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Target Company <span className="text-zinc-700 font-normal normal-case">(optional)</span></label>
                  <input className="w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all" placeholder="e.g. Google, Microsoft" value={targetCo} onChange={e => setTargetCo(e.target.value)} />
                </div>
              </div>
            </div>

            {error && <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

            <div className="flex justify-center">
              <button onClick={analyze} disabled={loading || !username.trim()}
                className="btn-red px-12 py-4 text-base font-bold flex items-center gap-3 glow-red disabled:opacity-50">
                {loading ? (
                  <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Fetching GitHub data...</>
                ) : (
                  <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  Analyze GitHub Profile</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && gh && (
          <div className="space-y-6 anim-scale-pop">

            {/* Profile Card */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0 text-center">
                  {gh.avatar_url ? (
                    <img src={gh.avatar_url} alt={gh.login} className="w-24 h-24 rounded-2xl border-2 border-red-500/30" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">👤</div>
                  )}
                  <a href={gh.html_url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 mt-2 block">@{gh.login}</a>
                </div>

                {/* Stats */}
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white mb-0.5">{gh.name || gh.login}</h2>
                  <p className="text-zinc-500 text-sm mb-4">{gh.bio || "No bio set"}</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Repos", value: gh.public_repos },
                      { label: "Followers", value: gh.followers },
                      { label: "Stars", value: gh.total_stars },
                    ].map(s => (
                      <div key={s.label} className="card-inset p-3 text-center">
                        <p className="text-lg font-black text-white">{s.value}</p>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gh.top_languages.map(l => (
                      <span key={l} className="bg-red-500/10 text-red-300 border border-red-500/15 px-2.5 py-1 rounded-full text-xs font-medium">{l}</span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0">
                  <ScoreRing score={result.profile_score} grade={result.grade} />
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-white/5">
                <p className="text-zinc-400 text-sm text-center">{result.verdict}</p>
              </div>
            </div>

            {/* Optimized Bio */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" />Optimized Bio</h3>
                <CopyBtn text={result.optimized_bio} />
              </div>
              <div className="bg-[#060606] border border-white/8 rounded-xl p-4 mb-4">
                <p className="text-zinc-100 text-sm font-medium">{result.optimized_bio}</p>
                <p className="text-[10px] text-zinc-600 mt-1">{result.optimized_bio.length}/160 chars</p>
              </div>
              <div className="space-y-2">
                {result.bio_tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-500"><span className="text-red-400 flex-shrink-0 mt-0.5">→</span>{t}</div>
                ))}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" />⚡ Quick Wins — Do These First</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.quick_wins.map((w, i) => (
                  <div key={i} className="card-inset p-4 flex items-start gap-3 hover:border-amber-500/15 transition-all">
                    <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-400 text-xs font-black flex items-center justify-center flex-shrink-0">{i+1}</span>
                    <p className="text-zinc-300 text-sm">{w}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Strengths */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" />Profile Strengths</h3>
                <ul className="space-y-2.5">
                  {result.profile_strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" />Needs Improvement</h3>
                <ul className="space-y-2.5">
                  {result.profile_weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Repos to Pin */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" />Repos to Pin (Top 6)</h3>
                <div className="space-y-2">
                  {result.top_repos_to_pin.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="text-blue-400 font-mono text-xs">{i+1}.</span>
                      <a href={`${gh.html_url}/${r}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-mono text-xs">{r}</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages to Learn */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500" />Languages to Learn Next</h3>
                <div className="flex flex-wrap gap-2">
                  {result.languages_to_learn.map((l, i) => (
                    <span key={i} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-full text-xs font-medium">+ {l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contribution Tips */}
            <div className="card p-7">
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-400" />Contribution Tips</h3>
              <div className="space-y-3">
                {result.contribution_tips.map((t, i) => (
                  <div key={i} className="card-inset p-4 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                    <p className="text-zinc-400 text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Repo Tips */}
            <div className="card p-7">
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" />Repository Improvement Tips</h3>
              <div className="space-y-3">
                {result.repo_improvement_tips.map((t, i) => (
                  <div key={i} className="card-inset p-4 flex items-start gap-3">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">→</span>
                    <p className="text-zinc-400 text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* README Template */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Profile README Template
                  <span className="text-[10px] text-zinc-600 font-normal">Create repo: <span className="font-mono text-zinc-500">{gh.login}/{gh.login}</span></span>
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowReadme(!showReadme)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-white/8 px-3 py-1 rounded-lg">
                    {showReadme ? "Hide" : "Show"} Template
                  </button>
                  <CopyBtn text={result.readme_template} />
                </div>
              </div>
              {showReadme && (
                <pre className="bg-[#060606] border border-white/5 rounded-xl p-5 text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap leading-relaxed anim-slide-down">
                  {result.readme_template}
                </pre>
              )}
              {!showReadme && (
                <p className="text-zinc-600 text-xs">Ready-to-use markdown README with stats widgets, tech stack badges, and contact links. Click "Show Template" to preview.</p>
              )}
            </div>

            {/* Top Repos Preview */}
            {gh.repos.length > 0 && (
              <div className="card p-7">
                <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-500" />
                  Your Repositories ({gh.public_repos} total)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gh.repos.slice(0, 6).map((repo: any, i: number) => (
                    <a key={i} href={`${gh.html_url}/${repo.name}`} target="_blank" rel="noopener noreferrer"
                      className="card-inset p-4 hover:border-red-500/20 transition-all group">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 font-mono">{repo.name}</span>
                        <div className="flex items-center gap-2 text-xs text-zinc-600 flex-shrink-0">
                          <span>⭐ {repo.stars}</span>
                          <span>🍴 {repo.forks}</span>
                        </div>
                      </div>
                      {repo.desc && <p className="text-xs text-zinc-600 leading-relaxed">{repo.desc.slice(0, 80)}{repo.desc.length > 80 ? "..." : ""}</p>}
                      {repo.lang && <span className="text-[10px] text-zinc-700 mt-1.5 block">● {repo.lang}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => setResult(null)} className="btn-red px-8 py-3.5 flex items-center gap-2 glow-red">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Analyze Another Profile
              </button>
              <Link href="/dashboard" className="btn-ghost px-8 py-3.5">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
