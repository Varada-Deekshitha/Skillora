"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── History helpers ────────────────────────────────────────────────────────────
const HISTORY_KEY = "skillora_history";
const loadHistory  = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
const saveHistory  = (e: any[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(e.slice(0, 30)));

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Problem {
  id: number; title: string; slug: string;
  difficulty: string; tags: string[]; acceptance: number;
}
interface ProblemDetail extends Problem {
  description: string;
  starter: Record<string, string>;
  test_cases: { input: string; expected: string }[];
}
interface TestResult {
  input: string; expected: string; actual: string;
  passed: boolean; status: string; time: string; stderr: string;
}
interface SubmitResult {
  passed: number; total: number; accepted: boolean;
  verdict: string; results: TestResult[];
}
interface RunResult {
  stdout: string; stderr: string; status: string;
  time: string; memory: string;
}

const LANGS = [
  { id: "python",     label: "Python 3",    icon: "🐍" },
  { id: "javascript", label: "JavaScript",  icon: "🟨" },
  { id: "java",       label: "Java",        icon: "☕" },
  { id: "cpp",        label: "C++",         icon: "⚙️" },
];

const DIFF_COLOR: Record<string, string> = {
  Easy:   "text-green-400 bg-green-500/10 border-green-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard:   "text-red-400   bg-red-500/10   border-red-500/20",
};

// ── Problem List ───────────────────────────────────────────────────────────────
function ProblemList({ onSelect, solved }: { onSelect: (p: Problem) => void; solved: Set<number> }) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");

  useEffect(() => {
    fetch(`${API}/coding/problems`)
      .then(r => r.json())
      .then(d => setProblems(d.problems || []));
  }, []);

  const filtered = problems.filter(p => {
    const matchDiff   = filter === "All" || p.difficulty === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchDiff && matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input className="w-full bg-[#060606] border border-white/8 focus:border-red-500/50 rounded-xl pl-9 pr-4 py-2.5 text-zinc-200 outline-none text-sm placeholder:text-zinc-700 transition-all" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5">
          {["All", "Easy", "Medium", "Hard"].map(d => (
            <button key={d} onClick={() => setFilter(d)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === d ? "bg-red-600 text-white" : "bg-[#111] text-zinc-500 hover:text-zinc-300 border border-white/5 hover:border-white/10"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        {[
          { label: "Total", val: problems.length, col: "text-zinc-300" },
          { label: "Solved", val: solved.size, col: "text-green-400" },
          { label: "Easy",   val: problems.filter(p => p.difficulty === "Easy").length,   col: "text-green-400" },
          { label: "Medium", val: problems.filter(p => p.difficulty === "Medium").length, col: "text-amber-400" },
          { label: "Hard",   val: problems.filter(p => p.difficulty === "Hard").length,   col: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="card-inset px-3 py-2 text-center flex-1">
            <p className={`text-base font-black ${s.col}`}>{s.val}</p>
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Problem List */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {filtered.map((p, i) => (
          <button key={p.id} onClick={() => onSelect(p)}
            className="w-full text-left card-inset px-4 py-3 hover:border-red-500/20 transition-all group flex items-center gap-3">
            {/* Status dot */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${solved.has(p.id) ? "bg-green-400" : "bg-zinc-700"}`} />
            {/* Number */}
            <span className="text-xs text-zinc-600 w-6 flex-shrink-0">{p.id}.</span>
            {/* Title */}
            <span className="text-sm text-zinc-200 group-hover:text-white transition-colors flex-1 truncate">{p.title}</span>
            {/* Tags */}
            <div className="hidden md:flex gap-1 flex-shrink-0">
              {p.tags.slice(0, 2).map(t => (
                <span key={t} className="text-[9px] bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded">{t}</span>
              ))}
            </div>
            {/* Difficulty */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${DIFF_COLOR[p.difficulty] || ""}`}>{p.difficulty}</span>
            {/* Acceptance */}
            <span className="text-[10px] text-zinc-600 flex-shrink-0 hidden md:block">{p.acceptance}%</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-700 text-sm">No problems match your filter</div>
        )}
      </div>
    </div>
  );
}

// ── Code Editor ────────────────────────────────────────────────────────────────
function CodeEditor({ problem, onBack, onSolve }: { problem: Problem; onBack: () => void; onSolve: (id: number, title: string, difficulty: string) => void }) {
  const [detail, setDetail]       = useState<ProblemDetail | null>(null);
  const [lang, setLang]           = useState("python");
  const [code, setCode]           = useState("");
  const [tab, setTab]             = useState<"desc" | "result">("desc");
  const [running, setRunning]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    fetch(`${API}/coding/problem/${problem.id}`)
      .then(r => r.json())
      .then(d => {
        setDetail(d);
        setCode(d.starter?.[lang] || "");
      });
  }, [problem.id]);

  useEffect(() => {
    if (detail) setCode(detail.starter?.[lang] || "");
  }, [lang]);

  const handleRun = async () => {
    setRunning(true); setRunResult(null); setTab("result");
    try {
      const res = await fetch(`${API}/coding/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, language: lang, stdin: customInput }) });
      const data: RunResult = await res.json();
      setRunResult(data);
    } catch { setRunResult({ stdout: "", stderr: "Failed to connect to backend.", status: "Error", time: "N/A", memory: "N/A" }); }
    finally { setRunning(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitResult(null); setTab("result");
    try {
      const res = await fetch(`${API}/coding/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ problem_id: problem.id, code, language: lang }) });
      const data: SubmitResult = await res.json();
      setSubmitResult(data);
      if (data.accepted) onSolve(problem.id, problem.title, problem.difficulty);
    } catch { setSubmitResult(null); }
    finally { setSubmitting(false); }
  };

  if (!detail) return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3 text-zinc-600">
        <svg className="animate-spin w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        <p className="text-sm">Loading problem...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Problem header */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <button onClick={onBack} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Problems
        </button>
        <h2 className="text-base font-bold text-white flex-1">{problem.id}. {problem.title}</h2>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFF_COLOR[problem.difficulty] || ""}`}>{problem.difficulty}</span>
        <div className="flex gap-1">
          {problem.tags.map(t => <span key={t} className="text-[10px] bg-white/5 text-zinc-500 px-2 py-1 rounded-lg">{t}</span>)}
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex flex-col lg:flex-row gap-3" style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* Left: description / results */}
        <div className="w-full lg:w-[42%] flex flex-col card overflow-hidden" style={{ minHeight: "300px", flex: "0 0 42%" }}>
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            {(["desc", "result"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${tab === t ? "text-red-400 border-b-2 border-red-500 bg-red-500/5" : "text-zinc-600 hover:text-zinc-300"}`}>
                {t === "desc" ? "Description" : "Results"}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {tab === "desc" && (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {detail.description.replace(/```[\s\S]*?```/g, (match) => match)}
                </div>
              </div>
            )}

            {tab === "result" && (
              <div className="space-y-4">
                {/* Run result */}
                {runResult && !submitResult && (
                  <div>
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl mb-3 text-sm font-bold ${runResult.status === "Accepted" || runResult.status === "0" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {runResult.status === "Accepted" ? "✓" : "✗"} {runResult.status}
                      {runResult.time !== "N/A" && <span className="font-normal text-xs ml-auto text-zinc-500">{runResult.time}</span>}
                    </div>
                    {runResult.stdout && (
                      <div className="card-inset p-4 mb-3">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Output</p>
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{runResult.stdout}</pre>
                      </div>
                    )}
                    {runResult.stderr && (
                      <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                        <p className="text-[10px] text-red-400 uppercase tracking-wider mb-2">Error</p>
                        <pre className="text-red-300 text-xs font-mono whitespace-pre-wrap">{runResult.stderr}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit result */}
                {submitResult && (
                  <div>
                    <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${submitResult.accepted ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/8 border border-red-500/20"}`}>
                      <span className="text-2xl">{submitResult.accepted ? "🎉" : "❌"}</span>
                      <div>
                        <p className={`text-base font-black ${submitResult.accepted ? "text-green-400" : "text-red-400"}`}>{submitResult.verdict}</p>
                        <p className="text-xs text-zinc-500">{submitResult.passed}/{submitResult.total} test cases passed</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {submitResult.results.map((r, i) => (
                        <div key={i} className={`card-inset p-4 ${r.passed ? "border-green-500/15" : "border-red-500/15"}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold ${r.passed ? "text-green-400" : "text-red-400"}`}>{r.passed ? "✓ Passed" : "✗ Failed"}</span>
                            <span className="text-[10px] text-zinc-600 ml-auto">{r.time}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><p className="text-zinc-600 mb-1">Input</p><pre className="text-zinc-400 font-mono text-[11px] bg-[#060606] px-2 py-1.5 rounded-lg">{r.input}</pre></div>
                            <div><p className="text-zinc-600 mb-1">Expected</p><pre className="text-zinc-400 font-mono text-[11px] bg-[#060606] px-2 py-1.5 rounded-lg">{r.expected}</pre></div>
                          </div>
                          {!r.passed && r.actual && (
                            <div className="mt-2"><p className="text-zinc-600 text-xs mb-1">Got</p><pre className="text-red-400 font-mono text-[11px] bg-red-500/5 px-2 py-1.5 rounded-lg">{r.actual}</pre></div>
                          )}
                          {r.stderr && <pre className="text-red-400 text-[10px] font-mono mt-2 bg-red-500/5 px-2 py-1.5 rounded-lg">{r.stderr}</pre>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!runResult && !submitResult && (
                  <div className="flex flex-col items-center justify-center h-32 text-zinc-700 text-sm">
                    <p>Run or submit your code to see results here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: code editor */}
        <div className="flex flex-col card overflow-hidden" style={{ flex: 1, minHeight: "300px" }}>
          {/* Editor header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-wrap">
            <div className="flex gap-1.5">
              {LANGS.map(l => (
                <button key={l.id} onClick={() => setLang(l.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${lang === l.id ? "bg-red-600/20 text-red-300 border border-red-500/30" : "text-zinc-500 hover:text-zinc-300 border border-white/5 hover:border-white/10"}`}>
                  <span>{l.icon}</span>{l.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-1.5">
              <button onClick={() => setCode(detail.starter?.[lang] || "")} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors px-2 py-1.5 border border-white/5 rounded-lg">Reset</button>
            </div>
          </div>

          {/* Code textarea */}
          <div className="relative overflow-hidden" style={{ flex: 1, minHeight: "400px" }}>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-[#080808] text-zinc-100 font-mono text-sm p-4 outline-none resize-none leading-relaxed border-none"
              style={{ fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace", tabSize: 4, fontSize: "13px", lineHeight: "1.7" }}
              onKeyDown={e => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end   = e.currentTarget.selectionEnd;
                  const newCode = code.substring(0, start) + "    " + code.substring(end);
                  setCode(newCode);
                  setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4; }, 0);
                }
              }}
            />
          </div>

          {/* Custom input */}
          <div className="border-t border-white/5 px-4 py-2">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Custom Input (stdin)</p>
            <textarea rows={2} className="w-full bg-[#060606] border border-white/5 rounded-lg px-3 py-2 text-zinc-400 font-mono text-xs outline-none resize-none focus:border-red-500/30 transition-all" placeholder="Optional custom input for Run..." value={customInput} onChange={e => setCustomInput(e.target.value)} />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5">
            <span className="text-[10px] text-zinc-700 flex-1">Python runs locally · Other languages need RapidAPI key</span>
            <button onClick={handleRun} disabled={running || submitting}
              className="btn-ghost text-sm px-5 py-2.5 flex items-center gap-2 disabled:opacity-50">
              {running ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Running...</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>Run</>}
            </button>
            <button onClick={handleSubmit} disabled={running || submitting}
              className="btn-red text-sm px-6 py-2.5 flex items-center gap-2 disabled:opacity-50 glow-red-sm">
              {submitting ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Judging...</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Submit</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function CodingPage() {
  const [selected, setSelected]   = useState<Problem | null>(null);
  const [solved, setSolved]       = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("skillora_solved") || "[]");
      setSolved(new Set(s));
    } catch {}
  }, []);

  const markSolved = (id: number, problemTitle?: string, difficulty?: string) => {
    setSolved(prev => {
      const n = new Set(prev); n.add(id);
      localStorage.setItem("skillora_solved", JSON.stringify([...n]));
      // Save to history
      try {
        const entry = {
          id: Date.now().toString(),
          type: "coding",
          problemId: id,
          title: problemTitle || `Problem #${id}`,
          difficulty: difficulty || "Unknown",
          timestamp: Date.now(),
        };
        saveHistory([entry, ...loadHistory()]);
      } catch {}
      return n;
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 flex flex-col">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-red-600/6 rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-6 py-3.5 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <SkilloraLogo size={28} />
            <span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <span className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            Coding Assessment
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600">{solved.size} solved</span>
          <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col px-4 py-3 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {selected ? (
          <CodeEditor problem={selected} onBack={() => { setSelected(null); }} onSolve={markSolved} />
        ) : (
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            {/* Hero */}
            <div className="text-center mb-8 anim-fade-up">
              <span className="inline-flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Coding Assessment Platform
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Practice <span className="text-gradient">like it's the real thing</span>
              </h1>
              <p className="text-zinc-500 text-sm max-w-lg mx-auto">
                500+ curated problems · AI-powered hints · Python runs instantly · Track your solved count
              </p>
            </div>
            <div className="flex-1 min-h-0 anim-fade-up delay-100">
              <ProblemList onSelect={setSelected} solved={solved} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
