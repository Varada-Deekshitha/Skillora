"use client";

import { useState } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface OptimizeResult {
  profile_score:        number;
  optimized_headline:   string;
  optimized_summary:    string;
  headline_tips:        string[];
  summary_tips:         string[];
  skills_to_add:        string[];
  skills_to_remove:     string[];
  experience_tips:      string[];
  keyword_gaps:         string[];
  profile_photo_tips:   string[];
  engagement_tips:      string[];
  overall_improvements: string[];
  seo_keywords:         string[];
}

const inp   = "w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all";
const lbl   = "block text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5";

function ScoreArc({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#dc2626";
  const grade = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Average" : "Needs Work";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">/100</span>
        </div>
      </div>
      <span className="text-sm font-bold" style={{ color }}>{grade}</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="text-xs text-zinc-600 hover:text-red-400 transition-colors flex items-center gap-1 flex-shrink-0">
      {copied
        ? <><svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg><span className="text-green-400">Copied!</span></>
        : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>Copy</>
      }
    </button>
  );
}

export default function LinkedInOptimizerPage() {
  const [form, setForm] = useState({
    current_headline: "", current_summary: "", current_experience: "",
    current_skills: "", target_role: "", target_company: "",
    years_experience: "", key_achievements: "",
  });
  const [result, setResult]   = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [step, setStep]       = useState(1);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const analyze = async () => {
    // Validate — at least some profile info needed
    if (!form.current_headline.trim() && !form.current_summary.trim() && !form.current_skills.trim()) {
      setError("Please fill in at least your Current Headline, Summary, or Skills to analyze.");
      return;
    }
    if (!form.target_role.trim()) {
      setError("Please enter your Target Role so AI can optimize for it.");
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/linkedin/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to analyze. Make sure backend is running.");
      const data = await res.json();
      setResult(data);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-red-600/6 rounded-full blur-[100px] pointer-events-none z-0" />

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
          {result && (
            <button onClick={() => { setResult(null); setStep(1); }} className="btn-ghost text-xs px-3 py-2">
              Re-analyze
            </button>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">

        {/* Header */}
        <div className="text-center mb-10 anim-fade-up">
          <span className="inline-flex items-center gap-2 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            LinkedIn Profile Optimizer
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Get <span className="text-gradient">10x more</span> recruiter views
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            AI analyzes your LinkedIn profile and gives you an optimized headline, summary, keyword gaps, and actionable tips to attract top recruiters.
          </p>
        </div>

        {/* ══ STEP 1: FORM ══ */}
        {step === 1 && (
          <div className="space-y-6 anim-fade-up">

            {/* Guide banner */}
            <div className="bg-blue-500/8 border border-blue-500/20 rounded-2xl px-5 py-4 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="text-sm font-semibold text-blue-300 mb-1">How to get the best results</p>
                <ul className="text-xs text-zinc-400 space-y-1">
                  <li>→ Open LinkedIn in another tab and copy-paste your current Headline, About, Experience, and Skills</li>
                  <li>→ Fill in your Target Role (required) so AI knows what to optimize for</li>
                  <li>→ Add key achievements with numbers — this makes your summary 10x stronger</li>
                </ul>
              </div>
            </div>

            {/* Target Info */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Target Info <span className="text-red-400 text-xs">*</span>
              </h2>
              <p className="text-zinc-600 text-xs mb-5">Tell us what role you&apos;re targeting — this is required for accurate optimization</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Target Role <span className="text-red-400">*</span></label>
                  <input className={inp} placeholder="e.g. SDE-2, Data Scientist, Product Manager" value={form.target_role} onChange={e => set("target_role", e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Target Company</label>
                  <input className={inp} placeholder="e.g. Google, Amazon, Microsoft" value={form.target_company} onChange={e => set("target_company", e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Years of Experience</label>
                  <input className={inp} placeholder="e.g. 2" value={form.years_experience} onChange={e => set("years_experience", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Current Profile */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Your Current LinkedIn Profile
              </h2>
              <p className="text-zinc-600 text-xs mb-5">Fill at least one field below — more info = better optimization</p>

              <div className="space-y-5">
                <div>
                  <label className={lbl}>Current Headline <span className="text-zinc-600 font-normal normal-case tracking-normal">— copy from your LinkedIn profile</span></label>
                  <input className={inp} placeholder="e.g. Software Engineer at TCS | 3 Years Exp | Java | Spring Boot | MySQL" value={form.current_headline} onChange={e => set("current_headline", e.target.value)} />
                  <p className="text-[10px] text-zinc-700 mt-1">{form.current_headline.length}/220 chars</p>
                </div>

                <div>
                  <label className={lbl}>Current About / Summary <span className="text-zinc-600 font-normal normal-case tracking-normal">— paste from LinkedIn &quot;About&quot; section</span></label>
                  <textarea rows={5} className={inp + " resize-none"} placeholder="Paste your current LinkedIn About/Summary section here. If empty, write 2-3 lines about yourself." value={form.current_summary} onChange={e => set("current_summary", e.target.value)} />
                </div>

                <div>
                  <label className={lbl}>Current Experience <span className="text-zinc-600 font-normal normal-case tracking-normal">— company, role, duration, what you did</span></label>
                  <textarea rows={4} className={inp + " resize-none"} placeholder={`e.g.\nTCS — Software Engineer (Jan 2022 – Present)\n- Built REST APIs using Java Spring Boot\n- Worked with MySQL, Docker, Kubernetes\n- Deployed to AWS, reduced latency by 30%`} value={form.current_experience} onChange={e => set("current_experience", e.target.value)} />
                </div>

                <div>
                  <label className={lbl}>Current Skills <span className="text-zinc-600 font-normal normal-case tracking-normal">— comma separated</span></label>
                  <input className={inp} placeholder="e.g. Java, Spring Boot, MySQL, Docker, REST API, Git, Agile, Problem Solving" value={form.current_skills} onChange={e => set("current_skills", e.target.value)} />
                </div>

                <div>
                  <label className={lbl}>Key Achievements <span className="text-zinc-600 font-normal normal-case tracking-normal">— numbers make it powerful</span></label>
                  <textarea rows={3} className={inp + " resize-none"} placeholder={`e.g.\n- Led a team of 5 engineers\n- Reduced API response time by 40%\n- Built feature used by 2M+ users\n- Won company hackathon 2023`} value={form.key_achievements} onChange={e => set("key_achievements", e.target.value)} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>
            )}

            <div className="flex justify-center">
              <button onClick={analyze} disabled={loading}
                className="btn-red px-12 py-4 text-base font-bold flex items-center gap-3 glow-red disabled:opacity-50">
                {loading ? (
                  <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyzing Profile...</>
                ) : (
                  <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                  Optimize My LinkedIn</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2: RESULTS ══ */}
        {step === 2 && result && (
          <div className="space-y-6 anim-scale-pop">

            {/* Score + Grade */}
            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/10 to-transparent pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <ScoreArc score={result.profile_score} />
                <div className="flex-1">
                  <h2 className="text-xl font-black text-white mb-2">Profile Strength Score</h2>
                  <p className="text-zinc-500 text-sm mb-4">Based on your current profile content, completeness, and keyword optimization.</p>
                  <div className="flex flex-wrap gap-2">
                    {result.seo_keywords.map((k, i) => (
                      <span key={i} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-xs font-medium">{k}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-2">↑ Top SEO keywords for your profile</p>
                </div>
              </div>
            </div>

            {/* Optimized Headline */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Optimized Headline
                </h3>
                <CopyButton text={result.optimized_headline} />
              </div>
              <div className="bg-[#060606] border border-white/8 rounded-xl p-4 mb-4">
                <p className="text-zinc-100 text-sm font-medium leading-relaxed">{result.optimized_headline}</p>
                <p className="text-[10px] text-zinc-600 mt-2">{result.optimized_headline.length}/220 characters</p>
              </div>
              <div className="space-y-2">
                {result.headline_tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>{t}
                  </div>
                ))}
              </div>
            </div>

            {/* Optimized Summary */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  Optimized About Section
                </h3>
                <CopyButton text={result.optimized_summary} />
              </div>
              <div className="bg-[#060606] border border-white/8 rounded-xl p-5 mb-4 whitespace-pre-line">
                <p className="text-zinc-300 text-sm leading-relaxed">{result.optimized_summary}</p>
              </div>
              <div className="space-y-2">
                {result.summary_tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">→</span>{t}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Skills to Add */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Skills to Add
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills_to_add.map((s, i) => (
                    <span key={i} className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-medium">+ {s}</span>
                  ))}
                </div>
              </div>

              {/* Keyword Gaps */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyword_gaps.map((k, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full text-xs font-medium">⚠ {k}</span>
                  ))}
                </div>
              </div>

              {/* Experience Tips */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  Experience Section Tips
                </h3>
                <ul className="space-y-2.5">
                  {result.experience_tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                      <span className="w-4 h-4 rounded-full bg-zinc-700 text-zinc-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>{t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engagement Tips */}
              <div className="card p-6">
                <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Get More Recruiter Views
                </h3>
                <ul className="space-y-2.5">
                  {result.engagement_tips.map((t, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0">→</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Profile Photo Tips */}
            <div className="card p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-500" />
                Profile Photo Tips
              </h3>
              <div className="flex flex-wrap gap-3">
                {result.profile_photo_tips.map((t, i) => (
                  <div key={i} className="card-inset px-4 py-3 text-xs text-zinc-400 flex items-start gap-2 flex-1 min-w-[200px]">
                    <span className="text-zinc-500 flex-shrink-0">📸</span>{t}
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Improvements */}
            <div className="card p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Top Priority Improvements
              </h3>
              <div className="space-y-3">
                {result.overall_improvements.map((imp, i) => (
                  <div key={i} className="card-inset p-4 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-red-500/15 text-red-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-zinc-300 text-sm leading-relaxed">{imp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => { setResult(null); setStep(1); }} className="btn-red px-8 py-3.5 flex items-center gap-2 glow-red">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Optimize Again
              </button>
              <Link href="/dashboard" className="btn-ghost px-8 py-3.5 flex items-center gap-2">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
