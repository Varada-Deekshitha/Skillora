"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ActivityDay {
  date: string;      // "YYYY-MM-DD"
  count: number;     // 0-4 intensity
  tasks: string[];   // what was done
}

interface SkillScore {
  name: string;
  score: number;     // 0-100
  category: string;
  sessions: number;
}

interface HistoryEntry {
  id: string; type: string; timestamp: number;
  company?: string; role?: string; skillLevel?: string;
  fileName?: string; score?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const SKILL_CATEGORIES = [
  {
    category: "DSA",
    color: "#dc2626",
    skills: ["Arrays", "Linked Lists", "Trees", "Graphs", "DP", "Sorting", "Binary Search", "Hashing"],
  },
  {
    category: "Web Dev",
    color: "#3b82f6",
    skills: ["React", "Node.js", "TypeScript", "CSS", "REST APIs", "Databases", "Authentication"],
  },
  {
    category: "CS Fundamentals",
    color: "#8b5cf6",
    skills: ["OS", "DBMS", "Computer Networks", "OOP", "System Design"],
  },
  {
    category: "Soft Skills",
    color: "#f59e0b",
    skills: ["Communication", "Behavioral", "Leadership", "Problem Solving", "Time Management"],
  },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// ── Helpers ────────────────────────────────────────────────────────────────────
function dateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function buildActivityMap(history: HistoryEntry[], solved: number[]): Record<string, ActivityDay> {
  const map: Record<string, ActivityDay> = {};

  history.forEach(h => {
    const d = dateStr(new Date(h.timestamp));
    if (!map[d]) map[d] = { date: d, count: 0, tasks: [] };
    if (h.type === "prep")   { map[d].tasks.push(`Roadmap: ${h.company}`);   map[d].count = Math.min(4, map[d].count + 2); }
    if (h.type === "resume") { map[d].tasks.push(`Resume: ${h.fileName}`);   map[d].count = Math.min(4, map[d].count + 1); }
  });

  // Add coding sessions
  solved.forEach((id) => {
    const stored = localStorage.getItem(`skillora_solved_date_${id}`);
    const d = stored || dateStr(new Date(Date.now() - Math.random() * 30 * 86400000));
    if (!map[d]) map[d] = { date: d, count: 0, tasks: [] };
    map[d].tasks.push(`Solved problem #${id}`);
    map[d].count = Math.min(4, map[d].count + 1);
  });

  // Add interview sessions
  const intv = parseInt(localStorage.getItem("skillora_interview_count") || "0");
  if (intv > 0) {
    const d = dateStr(new Date());
    if (!map[d]) map[d] = { date: d, count: 0, tasks: [] };
    map[d].tasks.push(`${intv} mock interview(s)`);
    map[d].count = Math.min(4, map[d].count + intv);
  }

  return map;
}

function buildSkillScores(history: HistoryEntry[], solved: number[]): SkillScore[] {
  const scores: SkillScore[] = [];

  // DSA skills based on coding problems solved
  const dsaScore = Math.min(100, solved.length * 8);
  SKILL_CATEGORIES[0].skills.forEach((skill, i) => {
    scores.push({
      name: skill, category: "DSA",
      score: Math.min(100, Math.max(0, dsaScore - i * 5 + Math.floor(Math.random() * 15))),
      sessions: Math.max(0, solved.length - i),
    });
  });

  // Web Dev based on roadmap sessions
  const prepSessions = history.filter(h => h.type === "prep");
  const webScore = Math.min(100, prepSessions.length * 12);
  SKILL_CATEGORIES[1].skills.forEach((skill, i) => {
    scores.push({
      name: skill, category: "Web Dev",
      score: Math.min(100, Math.max(0, webScore - i * 4 + Math.floor(Math.random() * 20))),
      sessions: Math.max(0, prepSessions.length - i),
    });
  });

  // CS Fundamentals
  const csScore = Math.min(100, (prepSessions.length + solved.length) * 5);
  SKILL_CATEGORIES[2].skills.forEach((skill, i) => {
    scores.push({
      name: skill, category: "CS Fundamentals",
      score: Math.min(100, Math.max(0, csScore - i * 6 + Math.floor(Math.random() * 15))),
      sessions: Math.max(0, prepSessions.length - i),
    });
  });

  // Soft Skills from interview sessions
  const intvCount = parseInt(localStorage.getItem("skillora_interview_count") || "0");
  const softScore = Math.min(100, intvCount * 15);
  SKILL_CATEGORIES[3].skills.forEach((skill, i) => {
    scores.push({
      name: skill, category: "Soft Skills",
      score: Math.min(100, Math.max(0, softScore - i * 4 + Math.floor(Math.random() * 10))),
      sessions: Math.max(0, intvCount - i),
    });
  });

  return scores;
}

// ── Heatmap Component ──────────────────────────────────────────────────────────
function Heatmap({ activityMap }: { activityMap: Record<string, ActivityDay> }) {
  const [tooltip, setTooltip] = useState<{ day: ActivityDay; x: number; y: number } | null>(null);

  // Build 52 weeks grid
  const today    = new Date();
  const gridStart = new Date(today);
  gridStart.setDate(gridStart.getDate() - 364);
  // Align to Sunday
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());

  const weeks: Date[][] = [];
  let cur = new Date(gridStart);
  while (cur <= today) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (count: number) => {
    if (count === 0) return "#161616";
    if (count === 1) return "#7f1d1d";
    if (count === 2) return "#b91c1c";
    if (count === 3) return "#dc2626";
    return "#ef4444";
  };

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const m = week[0].getMonth();
    if (m !== lastMonth) { monthLabels.push({ label: MONTHS[m], col: wi }); lastMonth = m; }
  });

  const totalActive = Object.values(activityMap).filter(d => d.count > 0).length;
  const maxStreak = (() => {
    let best = 0, cur = 0;
    const sorted = Object.keys(activityMap).sort();
    sorted.forEach((d, i) => {
      if (activityMap[d].count > 0) {
        cur++;
        if (i > 0) {
          const prev = new Date(sorted[i-1]);
          const curr = new Date(d);
          const diff = (curr.getTime() - prev.getTime()) / 86400000;
          if (diff > 1) cur = 1;
        }
        best = Math.max(best, cur);
      } else cur = 0;
    });
    return best;
  })();

  return (
    <div className="relative">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-8 overflow-hidden">
        {weeks.map((_, wi) => {
          const ml = monthLabels.find(m => m.col === wi);
          return <div key={wi} className="w-[13px] flex-shrink-0 text-[9px] text-zinc-600">{ml?.label || ""}</div>;
        })}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {DAYS.map((d, i) => (
            <div key={d} className={`h-[13px] text-[9px] text-zinc-700 leading-[13px] ${i % 2 === 0 ? "opacity-0" : ""}`}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
              {week.map((day, di) => {
                const ds  = dateStr(day);
                const act = activityMap[ds];
                const isFuture = day > today;
                return (
                  <div
                    key={di}
                    className="w-[13px] h-[13px] rounded-[2px] cursor-pointer transition-all hover:scale-125 hover:z-10"
                    style={{ background: isFuture ? "#0d0d0d" : getColor(act?.count || 0) }}
                    onMouseEnter={e => {
                      if (act && act.count > 0) {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setTooltip({ day: act, x: rect.left, y: rect.top });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-zinc-600">Less</span>
        {[0, 1, 2, 3, 4].map(c => (
          <div key={c} className="w-[13px] h-[13px] rounded-[2px]" style={{ background: getColor(c) }} />
        ))}
        <span className="text-[10px] text-zinc-600">More</span>
        <span className="text-[10px] text-zinc-600 ml-auto">{totalActive} active days · {maxStreak} day best streak</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="fixed z-50 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 shadow-2xl pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y - 80 }}>
          <p className="text-xs font-semibold text-white mb-1">{tooltip.day.date}</p>
          <p className="text-[10px] text-zinc-400">{tooltip.day.count} activit{tooltip.day.count === 1 ? "y" : "ies"}</p>
          {tooltip.day.tasks.map((t, i) => (
            <p key={i} className="text-[10px] text-red-400 mt-0.5">· {t}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Radar Chart ────────────────────────────────────────────────────────────────
function RadarChart({ scores }: { scores: SkillScore[] }) {
  const categories = SKILL_CATEGORIES.map(cat => {
    const catScores = scores.filter(s => s.category === cat.category);
    const avg = catScores.length ? Math.round(catScores.reduce((a, b) => a + b.score, 0) / catScores.length) : 0;
    return { label: cat.category, value: avg / 100, color: cat.color };
  });

  const size = 220;
  const cx = size / 2, cy = size / 2;
  const r = 80;
  const n = categories.length;

  const getPoint = (i: number, radius: number) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const webPoints = categories.map((c, i) => getPoint(i, c.value * r));
  const pathData = webPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid circles */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <circle key={f} cx={cx} cy={cy} r={r * f} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}

      {/* Grid lines */}
      {categories.map((_, i) => {
        const p = getPoint(i, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
      })}

      {/* Data polygon */}
      <path d={pathData} fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="2" />

      {/* Data points */}
      {webPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={categories[i].color} stroke="#080808" strokeWidth="2" />
      ))}

      {/* Labels */}
      {categories.map((c, i) => {
        const p = getPoint(i, r + 20);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            className="text-[10px]" style={{ fontSize: 11, fill: c.color, fontWeight: 700 }}>
            {c.label}
          </text>
        );
      })}

      {/* Center score */}
      <text x={cx} y={cy - 8} textAnchor="middle" style={{ fontSize: 22, fill: "#fff", fontWeight: 900 }}>
        {Math.round(categories.reduce((a, c) => a + c.value, 0) / categories.length * 100)}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" style={{ fontSize: 9, fill: "#666", textTransform: "uppercase", letterSpacing: 1 }}>
        Overall
      </text>
    </svg>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SkillMapPage() {
  const [activityMap, setActivityMap] = useState<Record<string, ActivityDay>>({});
  const [skillScores, setSkillScores] = useState<SkillScore[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [totalActivity, setTotalActivity] = useState(0);

  useEffect(() => {
    setMounted(true);
    const history: HistoryEntry[] = (() => { try { return JSON.parse(localStorage.getItem("skillora_history") || "[]"); } catch { return []; } })();
    const solved: number[] = (() => { try { return JSON.parse(localStorage.getItem("skillora_solved") || "[]"); } catch { return []; } })();

    const aMap = buildActivityMap(history, solved);
    const sScores = buildSkillScores(history, solved);
    setActivityMap(aMap);
    setSkillScores(sScores);
    setTotalActivity(Object.values(aMap).reduce((a, d) => a + d.count, 0));
  }, []);

  const filteredSkills = activeCategory === "All"
    ? skillScores
    : skillScores.filter(s => s.category === activeCategory);

  const categoryAvgs = SKILL_CATEGORIES.map(cat => {
    const catScores = skillScores.filter(s => s.category === cat.category);
    return {
      ...cat,
      avg: catScores.length ? Math.round(catScores.reduce((a, b) => a + b.score, 0) / catScores.length) : 0,
      count: catScores.length,
    };
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/6 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <SkilloraLogo size={32} />
          <span className="text-lg font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>
        <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Dashboard
        </Link>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10">

        {/* Header */}
        <div className="text-center mb-10 anim-fade-up">
          <span className="inline-flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            SkillMap
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Your <span className="text-gradient">skill heatmap</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Visual map of your learning activity, skill coverage, and growth over time.
          </p>
        </div>

        {/* ── Activity Heatmap ── */}
        <div className="card p-7 mb-6 relative overflow-hidden anim-fade-up">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Activity Heatmap
              <span className="text-xs text-zinc-600 font-normal">· Last 52 weeks</span>
            </h2>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span><strong className="text-white">{totalActivity}</strong> total activities</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Heatmap activityMap={activityMap} />
          </div>
          <p className="text-[10px] text-zinc-700 mt-3">
            Hover cells to see what you worked on that day. Data from your roadmaps, resume analyses, mock interviews, and coding problems.
          </p>
        </div>

        {/* ── Radar + Category Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 anim-fade-up delay-100">
          {/* Radar */}
          <div className="card p-7 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <h3 className="text-sm font-bold text-white mb-4 self-start flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />Skill Radar
            </h3>
            <RadarChart scores={skillScores} />
          </div>

          {/* Category summary */}
          <div className="md:col-span-2 card p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
            <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />Category Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categoryAvgs.map(cat => (
                <div key={cat.category} className="card-inset p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.category}</span>
                    <span className="text-lg font-black text-white">{cat.avg}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${cat.avg}%`, background: cat.color }} />
                  </div>
                  <p className="text-[10px] text-zinc-600">{cat.count} skills tracked</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Individual Skills ── */}
        <div className="card p-7 relative overflow-hidden anim-fade-up delay-200">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />Skill Breakdown
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              {["All", ...SKILL_CATEGORIES.map(c => c.category)].map(c => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === c ? "bg-red-600 text-white" : "bg-[#111] text-zinc-500 border border-white/5 hover:border-white/10 hover:text-zinc-300"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSkills.sort((a, b) => b.score - a.score).map((skill, i) => {
              const cat = SKILL_CATEGORIES.find(c => c.category === skill.category)!;
              return (
                <div key={i} className="flex items-center gap-3 group anim-slide-right" style={{ animationDelay: `${i * 30}ms` }}>
                  {/* Rank */}
                  <span className="text-[10px] text-zinc-700 w-5 text-right flex-shrink-0">{i + 1}</span>
                  {/* Skill name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-zinc-300 truncate">{skill.name}</span>
                      <span className="text-xs font-bold text-white ml-2 flex-shrink-0">{skill.score}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${skill.score}%`, background: cat?.color || "#dc2626" }} />
                    </div>
                  </div>
                  {/* Category badge */}
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                    style={{ background: (cat?.color || "#dc2626") + "20", color: cat?.color || "#dc2626" }}>
                    {skill.category}
                  </span>
                </div>
              );
            })}
          </div>

          {filteredSkills.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-700">
              <p className="text-sm">No skill data yet</p>
              <p className="text-xs mt-1">Use the platform tools to build your skill map</p>
            </div>
          )}
        </div>

        {/* ── How to improve ── */}
        <div className="card p-7 mt-6 relative overflow-hidden anim-fade-up delay-300">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <span className="text-amber-400">💡</span> Improve Your SkillMap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🗺️", title: "Generate Roadmaps",     desc: "Boosts DSA + CS Fundamentals scores",     href: "/dashboard", color: "#dc2626" },
              { icon: "🎤", title: "Mock Interviews",        desc: "Increases Soft Skills + Communication",   href: "/mock-interview", color: "#3b82f6" },
              { icon: "💻", title: "Solve Coding Problems",  desc: "Directly raises DSA skill scores",        href: "/coding", color: "#8b5cf6" },
              { icon: "📄", title: "Analyze Resumes",        desc: "Identifies and fills Web Dev skill gaps", href: "/dashboard", color: "#f59e0b" },
            ].map(tip => (
              <Link key={tip.title} href={tip.href}
                className="card-inset p-4 hover:border-red-500/20 transition-all group">
                <div className="text-2xl mb-3">{tip.icon}</div>
                <p className="text-white text-sm font-semibold mb-1 group-hover:text-red-300 transition-colors">{tip.title}</p>
                <p className="text-zinc-600 text-xs leading-relaxed">{tip.desc}</p>
                <div className="mt-3 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all" style={{ color: tip.color }}>
                  Go <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
