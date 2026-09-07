"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── History helpers ────────────────────────────────────────────────────────────
const HISTORY_KEY = "skillora_history";
const loadHistory  = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
const saveHistory  = (e: any[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(e.slice(0, 30)));

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Category { id: string; name: string; section: string; icon: string; }
interface Question  { id: number; q: string; opts: string[]; cat: string; }
interface Result    { id: number; question: string; options: string[]; selected: number; correct: number; is_correct: boolean; explanation: string; }
interface TestResult { score: number; correct: number; total: number; grade: string; results: Result[]; }
interface TopicQ    { q: string; opts: string[]; ans: number; exp: string; }
interface TopicData { slug: string; name: string; section: string; concept: string; questions: TopicQ[]; }

const SECTIONS = ["all", "Aptitude", "Reasoning", "Verbal Ability"] as const;
type Section = typeof SECTIONS[number];
type Mode = "home" | "test" | "result" | "topic-list" | "topic-practice";

const SECTION_META: Record<Section, { label: string; color: string; bg: string; desc: string }> = {
  all:              { label: "Full Mock Test",     color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",    desc: "20 mixed questions — Aptitude + Reasoning + Verbal" },
  "Aptitude":       { label: "Aptitude",           color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",  desc: "Numbers, Percentage, Profit/Loss, Time & Work, etc." },
  "Reasoning":      { label: "Reasoning",          color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", desc: "Series, Analogy, Coding-Decoding, Blood Relations, etc." },
  "Verbal Ability": { label: "Verbal Ability",     color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20", desc: "Synonyms, Antonyms, Grammar, Fill in the Blanks, Idioms" },
};

// Topic-wise MCQ card with answer reveal
function TopicMCQ({ q, idx }: { q: TopicQ; idx: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp]   = useState(false);
  const answered = selected !== null;
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="flex items-start gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx+1}</span>
        <p className="text-zinc-100 text-sm font-medium leading-relaxed">{q.q}</p>
      </div>
      <div className="space-y-2 mb-3">
        {q.opts.map((opt, i) => {
          let cls = "border-white/8 bg-[#0f0f0f] text-zinc-400 hover:border-white/15 hover:text-zinc-200 cursor-pointer";
          if (answered) {
            if (i === q.ans) cls = "border-green-500/40 bg-green-500/8 text-green-300 cursor-default";
            else if (i === selected) cls = "border-red-500/40 bg-red-500/8 text-red-300 cursor-default";
            else cls = "border-white/5 bg-[#0a0a0a] text-zinc-600 cursor-default";
          }
          return (
            <button key={i} onClick={() => !answered && setSelected(i)} disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${cls}`}>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${answered && i===q.ans?"border-green-500 bg-green-500 text-white":answered && i===selected?"border-red-500 bg-red-500 text-white":"border-zinc-700 text-zinc-600"}`}>
                {["A","B","C","D"][i]}
              </span>
              {opt}
              {answered && i===q.ans && <span className="ml-auto text-green-400 text-xs font-bold">✓</span>}
              {answered && i===selected && i!==q.ans && <span className="ml-auto text-red-400 text-xs font-bold">✗</span>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="anim-slide-down">
          <button onClick={() => setShowExp(e=>!e)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 mb-2 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {showExp ? "Hide" : "Show"} Explanation
          </button>
          {showExp && (
            <div className="bg-amber-500/6 border border-amber-500/15 rounded-xl px-4 py-3">
              <p className="text-amber-200 text-xs leading-relaxed">{q.exp}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Concept text renderer
function ConceptViewer({ text }: { text: string }) {
  return (
    <div className="space-y-2">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## "))   return <h2 key={i} className="text-xl font-black text-white mt-4 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith("### "))  return <h3 key={i} className="text-sm font-bold text-red-400 mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("- "))    return <li key={i} className="text-zinc-300 text-sm ml-4 list-disc">{line.slice(2)}</li>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-white font-semibold text-sm">{line.slice(2,-2)}</p>;
        if (line.match(/^\|.*\|/))    return null; // skip table separator
        if (line.trim() === "")       return <div key={i} className="h-1" />;
        return <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const r = 46, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#dc2626";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 104 104">
          <circle cx="52" cy="52" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9"/>
          <circle cx="52" cy="52" r={r} fill="none" stroke={color} strokeWidth="9"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}%</span>
        </div>
      </div>
      <span className="text-2xl font-black px-4 py-1 rounded-xl border-2"
        style={{ color, borderColor: color + "40", background: color + "15" }}>
        Grade {grade}
      </span>
    </div>
  );
}

// Topic list per section
const TOPIC_GROUPS = [
  {
    section: "Aptitude", color: "text-blue-400", bg: "bg-blue-500/8 border-blue-500/15",
    topics: [
      { slug:"number-system",       name:"Number System",           icon:"🔢" },
      { slug:"hcf-lcm",             name:"HCF and LCM",             icon:"🔣" },
      { slug:"average",             name:"Average",                  icon:"📐" },
      { slug:"percentage",          name:"Percentage",               icon:"📊" },
      { slug:"profit-loss",         name:"Profit and Loss",          icon:"💰" },
      { slug:"simple-interest",     name:"Simple Interest",          icon:"🏦" },
      { slug:"compound-interest",   name:"Compound Interest",        icon:"📈" },
      { slug:"ratio-proportion",    name:"Ratio and Proportion",     icon:"⚖️" },
      { slug:"time-work",           name:"Time and Work",            icon:"⏰" },
      { slug:"time-speed-distance", name:"Time, Speed & Distance",   icon:"🚗" },
      { slug:"permutation-combination", name:"Permutation & Combination", icon:"🔀" },
      { slug:"probability",         name:"Probability",              icon:"🎲" },
      { slug:"pipes-cistern",       name:"Pipes and Cistern",        icon:"🚿" },
      { slug:"ages",                name:"Problems on Ages",         icon:"👴" },
      { slug:"mixtures",            name:"Mixture & Alligation",     icon:"🧪" },
      { slug:"logarithm",           name:"Logarithm",                icon:"🔬" },
      { slug:"mensuration",         name:"Mensuration",              icon:"📏" },
      { slug:"boats-streams",       name:"Boats and Streams",        icon:"⛵" },
      { slug:"trains",              name:"Problems on Trains",       icon:"🚂" },
      { slug:"heights-distances",   name:"Height and Distance",      icon:"⛰️" },
      { slug:"partnership",         name:"Partnership",              icon:"🤝" },
    ]
  },
  {
    section: "Reasoning", color: "text-purple-400", bg: "bg-purple-500/8 border-purple-500/15",
    topics: [
      { slug:"number-series",       name:"Number Series",            icon:"🔢" },
      { slug:"series-completion",   name:"Series Completion",        icon:"🔗" },
      { slug:"letter-symbol-series",name:"Letter & Symbol Series",   icon:"🔤" },
      { slug:"analogy",             name:"Analogy",                  icon:"🔗" },
      { slug:"odd-man-out",         name:"Odd Man Out",              icon:"🎯" },
      { slug:"blood-relations",     name:"Blood Relations",          icon:"👨‍👩‍👧" },
      { slug:"coding-decoding",     name:"Coding-Decoding",          icon:"🔐" },
      { slug:"direction-sense",     name:"Direction Sense",          icon:"🧭" },
      { slug:"syllogism",           name:"Syllogism",                icon:"💬" },
      { slug:"seating-arrangement", name:"Seating Arrangement",      icon:"💺" },
      { slug:"puzzles",             name:"Puzzles",                  icon:"🧩" },
      { slug:"calendar",            name:"Calendar",                 icon:"📅" },
      { slug:"clocks",              name:"Clocks",                   icon:"🕐" },
      { slug:"order-ranking",       name:"Order and Ranking",        icon:"🏆" },
      { slug:"statement-assumption",name:"Statement & Assumption",   icon:"💭" },
      { slug:"statement-conclusion",name:"Statement & Conclusion",   icon:"📋" },
      { slug:"statement-argument",  name:"Statement & Argument",     icon:"⚖️" },
      { slug:"course-of-action",    name:"Course of Action",         icon:"🎬" },
      { slug:"cause-effect",        name:"Cause and Effect",         icon:"🔄" },
      { slug:"logical-problems",    name:"Logical Problems",         icon:"🧠" },
      { slug:"theme-detection",     name:"Theme Detection",          icon:"🔍" },
    ]
  },
  {
    section: "Verbal Ability", color: "text-green-400", bg: "bg-green-500/8 border-green-500/15",
    topics: [
      { slug:"synonyms",            name:"Synonyms",                 icon:"📝" },
      { slug:"antonyms",            name:"Antonyms",                 icon:"↔️" },
      { slug:"grammar",             name:"Grammar",                  icon:"✏️" },
      { slug:"fill-blanks",         name:"Fill in the Blanks",       icon:"🔤" },
      { slug:"idioms",              name:"Idioms & Phrases",         icon:"💬" },
      { slug:"comprehension",       name:"Reading Comprehension",    icon:"📖" },
      { slug:"sentence-correction", name:"Sentence Correction",     icon:"✅" },
      { slug:"one-word-substitution",name:"One Word Substitution",  icon:"🔑" },
      { slug:"spotting-errors",     name:"Spotting Errors",          icon:"🔎" },
      { slug:"para-jumbles",        name:"Para Jumbles",             icon:"🔀" },
    ]
  },
];

export default function AptitudePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mode, setMode]             = useState<Mode>("home");
  const [section, setSection]       = useState<Section>("all");
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [answers, setAnswers]       = useState<Record<number, number>>({});
  const [current, setCurrent]       = useState(0);
  const [timeLeft, setTimeLeft]     = useState(0);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<TestResult | null>(null);
  const [catFilter, setCatFilter]   = useState<Section>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  // Topic practice states
  const [topicData, setTopicData]     = useState<TopicData | null>(null);
  const [topicLoading, setTopicLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<{slug:string;name:string}|null>(null);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    fetch(`${API}/aptitude/categories`)
      .then(r => r.json())
      .then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    if (mode !== "test" || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [mode, timeLeft > 0 && mode === "test"]);

  const startTest = async (sec: Section) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/aptitude/mock-test`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sec, count: 20 }),
      });
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers({});
      setCurrent(0);
      setTimeLeft(Math.floor(data.time_limit * 60));
      setSection(sec);
      setMode("test");
    } catch { alert("Backend not running!"); }
    finally { setLoading(false); }
  };

  const startCategoryTest = async (catId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/aptitude/questions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cat_id: catId, count: 10 }),
      });
      const data = await res.json();
      const qs = data.questions.map((q: any) => ({ id: q.id, q: q.q, opts: q.opts, cat: q.cat }));
      setQuestions(qs);
      setAnswers({});
      setCurrent(0);
      setTimeLeft(15 * 60);
      setSection("all");
      setMode("test");
    } catch { alert("Backend not running!"); }
    finally { setLoading(false); }
  };

  const openTopicPractice = async (slug: string, name: string) => {
    setTopicLoading(true);
    setActiveTopic({ slug, name });
    setMode("topic-practice");
    setTopicData(null);
    try {
      const res = await fetch(`${API}/topics/${slug}`);
      if (!res.ok) throw new Error();
      const data: TopicData = await res.json();
      setTopicData(data);
    } catch {
      setTopicData({
        slug, name, section: "",
        concept: `## ${name}\n\nContent for this topic is being prepared. Practice questions are available below.`,
        questions: [],
      });
    } finally {
      setTopicLoading(false);
    }
  };

  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    const subs = questions.map(q => ({ id: q.id, selected: answers[q.id] ?? -1 }));
    try {
      const res = await fetch(`${API}/aptitude/submit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions: subs }),
      });
      const data: TestResult = await res.json();
      setResult(data);
      setMode("result");
      // ── Save to history ──
      try {
        const entry = {
          id: Date.now().toString(),
          type: "aptitude",
          section: section === "all" ? "Full Mock" : section,
          score: data.score,
          correct: data.correct,
          total: data.total,
          grade: data.grade,
          timestamp: Date.now(),
        };
        saveHistory([entry, ...loadHistory()]);
      } catch {}
    } catch { alert("Submission failed."); }
  };

  const formatTime = (s: number) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const answered   = Object.keys(answers).length;
  const filteredCats = catFilter === "all" ? categories : categories.filter(c => c.section === catFilter);

  // ── TOPIC PRACTICE ────────────────────────────────────────────────────────
  if (mode === "topic-practice") return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2"><SkilloraLogo size={28}/><span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span></Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setMode("topic-list")} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            All Topics
          </button>
          <button onClick={() => setMode("home")} className="btn-ghost text-xs px-3 py-2">Mock Tests</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
          <button onClick={() => setMode("topic-list")} className="hover:text-zinc-300 transition-colors">Topics</button>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          <span className="text-zinc-400">{activeTopic?.name}</span>
        </div>

        {topicLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            <p className="text-zinc-600 text-sm">Loading topic…</p>
          </div>
        ) : topicData ? (
          <div className="space-y-6">
            {/* Topic header */}
            <div className="card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <h1 className="text-2xl font-black text-white mb-1">{topicData.name}</h1>
              <p className="text-zinc-500 text-sm">Concepts, formulas, tips and practice questions</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full">{topicData.questions.length} Questions</span>
                <span className="text-xs bg-blue-500/8 border border-blue-500/15 text-blue-400 px-2.5 py-1 rounded-full">With Explanations</span>
                <span className="text-xs bg-amber-500/8 border border-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full">Tap option to check answer</span>
              </div>
            </div>

            {/* Concept */}
            {topicData.concept && (
              <div className="card p-7">
                <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />Concepts & Formulas
                </h2>
                <ConceptViewer text={topicData.concept} />
              </div>
            )}

            {/* Questions */}
            {topicData.questions.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />Practice Questions
                  <span className="text-zinc-600 font-normal text-xs">— tap an option to reveal answer + explanation</span>
                </h2>
                <div className="space-y-4">
                  {topicData.questions.map((q, i) => (
                    <TopicMCQ key={i} q={q} idx={i} />
                  ))}
                </div>
              </div>
            )}

            {topicData.questions.length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-zinc-500 text-sm mb-4">No practice questions yet for this topic.</p>
                <button onClick={() => startCategoryTest(activeTopic?.slug || "")} className="btn-red text-sm px-6 py-2.5">Take Quick Test Instead</button>
              </div>
            )}

            {/* Bottom actions */}
            <div className="card p-5 flex items-center justify-between gap-4">
              <p className="text-zinc-500 text-sm">Done with this topic? Try a full mock test or pick another topic.</p>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startTest("all")} className="btn-red text-xs px-4 py-2">Mock Test</button>
                <button onClick={() => setMode("topic-list")} className="btn-ghost text-xs px-4 py-2">All Topics</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  // ── TOPIC LIST ────────────────────────────────────────────────────────────
  if (mode === "topic-list") return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2"><SkilloraLogo size={28}/><span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span></Link>
        <button onClick={() => setMode("home")} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back
        </button>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
        <div className="text-center mb-8 anim-fade-up">
          <h1 className="text-3xl font-black text-white mb-2">Topic-wise Practice</h1>
          <p className="text-zinc-500 text-sm">Select any topic to study concepts + solve practice questions with explanations</p>
        </div>

        {/* Section filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all","Aptitude","Reasoning","Verbal Ability"].map(f=>(
            <button key={f} onClick={()=>setTopicFilter(f)}
              className={`text-xs px-4 py-2 rounded-xl transition-all font-medium ${topicFilter===f?"bg-red-600 text-white":"bg-[#111] text-zinc-500 border border-white/5 hover:border-white/10 hover:text-zinc-300"}`}>
              {f==="all"?"All Topics":f}
            </button>
          ))}
        </div>

        {TOPIC_GROUPS.filter(g => topicFilter === "all" || g.section === topicFilter).map(group => (
          <div key={group.section} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${group.color}`}>{group.section}</h2>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-zinc-600">{group.topics.length} topics</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.topics.map(topic => (
                <button key={topic.slug} onClick={() => openTopicPractice(topic.slug, topic.name)}
                  className={`card border ${group.bg} p-4 text-left group hover:scale-[1.02] transition-all`}>
                  <span className="text-2xl block mb-2">{topic.icon}</span>
                  <p className={`text-xs font-semibold ${group.color} group-hover:brightness-125 transition-all leading-tight mb-1`}>{topic.name}</p>
                  <p className="text-zinc-700 text-[10px]">Concepts + MCQs →</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (mode === "home") return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/6 rounded-full blur-[100px] pointer-events-none z-0" />

      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2.5"><SkilloraLogo size={30}/><span className="text-lg font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span></Link>
        <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Dashboard
        </Link>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10">
        {/* Header */}
        <div className="text-center mb-10 anim-fade-up">
          <span className="inline-flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
            Aptitude · Reasoning · Verbal
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Practice <span className="text-gradient">Platform</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Timed mock tests with instant results + topic-wise practice with concept explanations.
          </p>
        </div>

        {/* Two main modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 anim-fade-up delay-100">
          {/* Mock Tests */}
          <div className="card p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-xl">⏱️</span>
              <div>
                <h2 className="text-white font-bold text-base">Mock Tests</h2>
                <p className="text-zinc-600 text-xs">Timed tests · Instant score</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(SECTION_META) as [Section, typeof SECTION_META[Section]][]).map(([sec, meta]) => (
                <button key={sec} onClick={() => startTest(sec)} disabled={loading}
                  className={`p-3 rounded-xl border text-left transition-all group hover:scale-[1.02] ${meta.bg} ${meta.color}`}>
                  <div className="text-base mb-1">{sec==="all"?"🎯":sec==="Aptitude"?"🔢":sec==="Reasoning"?"🧠":"📝"}</div>
                  <p className="text-xs font-semibold truncate">{meta.label}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">20Q · 30min</p>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Practice */}
          <div className="card p-7 relative overflow-hidden cursor-pointer group hover:border-red-500/30 transition-all" onClick={() => setMode("topic-list")}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-xl">📚</span>
              <div>
                <h2 className="text-white font-bold text-base">Topic-wise Practice</h2>
                <p className="text-zinc-600 text-xs">Concepts + MCQs + Explanations</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{icon:"🔢",name:"Aptitude",n:21},{icon:"🧠",name:"Reasoning",n:21},{icon:"📝",name:"Verbal",n:10}].map(s=>(
                <div key={s.name} className="bg-[#111] border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <p className="text-zinc-400 text-xs font-semibold">{s.name}</p>
                  <p className="text-zinc-700 text-[10px]">{s.n} topics</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-zinc-600 text-xs">52 total topics · Concept theory included</p>
              <span className="text-red-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Explore <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Category Quick Practice */}
        <div className="anim-fade-up delay-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Quick Practice by Category</h2>
            <div className="flex gap-1.5">
              {(["all", "Aptitude", "Reasoning", "Verbal Ability"] as const).map(s => (
                <button key={s} onClick={() => setCatFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${catFilter===s?"bg-red-600 text-white":"bg-[#111] text-zinc-500 border border-white/5 hover:border-white/10"}`}>
                  {s === "all" ? "All" : s === "Verbal Ability" ? "Verbal" : s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredCats.map(cat => (
              <button key={cat.id} onClick={() => startCategoryTest(cat.id)} disabled={loading}
                className="card p-4 text-left group hover:border-red-500/25 transition-all">
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <p className="text-zinc-300 text-xs font-semibold group-hover:text-red-300 transition-colors leading-tight">{cat.name}</p>
                <p className="text-zinc-700 text-[10px] mt-1">10Q timed test</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── TEST ──────────────────────────────────────────────────────────────────
  if (mode === "test") {
    const q = questions[current];
    const pct = (answered / questions.length) * 100;
    const timePct = (timeLeft / (questions.length * 90)) * 100;

    return (
      <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/5">
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-zinc-600 mb-1">
                <span>{answered}/{questions.length} answered</span>
                <span className={timeLeft < 120 ? "text-red-400 font-bold animate-pulse" : ""}>{formatTime(timeLeft)}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${pct}%` }}/>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn-red text-xs px-4 py-2 flex-shrink-0">Submit</button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 pt-8">
          {/* Question navigation dots */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${
                  i === current ? "bg-red-600 text-white" :
                  answers[questions[i].id] !== undefined ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                  "bg-[#111] text-zinc-600 border border-white/5"
                }`}>
                {i + 1}
              </button>
            ))}
          </div>

          {/* Question */}
          <div className="card p-7 mb-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent"/>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 text-xs font-bold flex-shrink-0 mt-0.5">
                {current + 1}
              </div>
              <p className="text-white text-base leading-relaxed font-medium">{q.q}</p>
            </div>
            <div className="space-y-3">
              {q.opts.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <button key={i} onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                    className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 ${
                      selected
                        ? "border-red-500/60 bg-red-500/10 text-white"
                        : "border-white/8 bg-[#0f0f0f] text-zinc-400 hover:border-white/15 hover:text-zinc-200"
                    }`}>
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "border-red-500 bg-red-500 text-white" : "border-zinc-700 text-zinc-600"}`}>
                      {["A","B","C","D"][i]}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between">
            <button onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current===0} className="btn-ghost text-sm px-5 py-2.5 disabled:opacity-30">← Prev</button>
            {current < questions.length - 1
              ? <button onClick={() => setCurrent(c => c+1)} className="btn-red text-sm px-6 py-2.5">Next →</button>
              : <button onClick={handleSubmit} className="btn-red text-sm px-6 py-2.5 glow-red">Submit Test ✓</button>
            }
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (mode === "result" && result) {
    const correct = result.correct, total = result.total, wrong = total - correct - result.results.filter(r=>r.selected===-1).length;
    const skipped = result.results.filter(r=>r.selected===-1).length;
    return (
      <div className="min-h-screen bg-[#080808] text-zinc-200 pb-20">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/6 rounded-full blur-[100px] pointer-events-none z-0"/>
        <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2"><SkilloraLogo size={28}/><span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span></Link>
          <button onClick={() => setMode("home")} className="btn-ghost text-xs px-3 py-2">New Test</button>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10 space-y-6">

          {/* Score banner */}
          <div className="card p-8 relative overflow-hidden text-center anim-scale-pop">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"/>
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/15 to-transparent pointer-events-none"/>
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-8">
              <ScoreRing score={result.score} grade={result.grade} />
              <div className="text-left">
                <h2 className="text-2xl font-black text-white mb-4">Test Complete!</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: correct, l: "Correct", c: "text-green-400" },
                    { v: wrong,   l: "Wrong",   c: "text-red-400" },
                    { v: skipped, l: "Skipped", c: "text-zinc-500" },
                  ].map(s => (
                    <div key={s.l} className="card-inset p-3 text-center">
                      <p className={`text-xl font-black ${s.c}`}>{s.v}</p>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.l}</p>
                    </div>
                  ))}
                </div>
                <p className="text-zinc-500 text-sm mt-3">{result.total} questions · {SECTION_META[section]?.label || "Mixed"}</p>
              </div>
            </div>
          </div>

          {/* Answer review */}
          <div className="card p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"/>
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"/>Answer Review
            </h3>
            <div className="space-y-4">
              {result.results.map((r, i) => (
                <div key={i} className={`card-inset p-5 border ${r.is_correct ? "border-green-500/15" : "border-red-500/15"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${r.is_correct ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                      {r.is_correct ? "✓" : "✗"}
                    </span>
                    <p className="text-zinc-200 text-sm font-medium">{r.question}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {r.options.map((opt, j) => (
                      <div key={j} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
                        j === r.correct ? "bg-green-500/10 border border-green-500/25 text-green-300" :
                        j === r.selected && !r.is_correct ? "bg-red-500/10 border border-red-500/25 text-red-300" :
                        "bg-[#060606] border border-white/5 text-zinc-600"
                      }`}>
                        <span className="font-bold">{["A","B","C","D"][j]}.</span> {opt}
                        {j === r.correct && <span className="ml-auto text-green-400">✓</span>}
                        {j === r.selected && !r.is_correct && <span className="ml-auto text-red-400">✗</span>}
                      </div>
                    ))}
                  </div>
                  {r.explanation && (
                    <div className="bg-blue-500/6 border border-blue-500/15 rounded-lg px-4 py-2.5">
                      <p className="text-[11px] text-blue-300"><span className="font-bold">💡 Explanation: </span>{r.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={() => setMode("home")} className="btn-red px-8 py-3.5 flex items-center gap-2 glow-red">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Try Again
            </button>
            <Link href="/dashboard" className="btn-ghost px-8 py-3.5">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
