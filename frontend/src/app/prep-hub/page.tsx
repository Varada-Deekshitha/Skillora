"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────────
interface TopicInfo {
  slug: string; name: string; section: string;
  has_content: boolean; question_count: number;
}
interface TopicContent {
  slug: string; name: string; section: string;
  concept: string; questions: MCQ[];
}
interface MCQ {
  q: string; opts: string[]; ans: number; exp: string;
}

// ── Section nav (mirrors placementpreparation.io) ──────────────────────────────
const NAV = [
  {
    group: "Aptitude",
    items: [
      { label: "Quantitative Aptitude", slug: "quantitative-aptitude", icon: "🔢" },
      { label: "Logical Reasoning",     slug: "logical-reasoning",     icon: "🧠" },
      { label: "Verbal Ability",        slug: "verbal-ability",        icon: "📝" },
      { label: "Data Interpretation",   slug: "data-interpretation",   icon: "📊" },
      { label: "Verbal Reasoning",      slug: "verbal-reasoning",      icon: "💬" },
      { label: "Non-Verbal Reasoning",  slug: "non-verbal-reasoning",  icon: "🔷" },
    ],
  },
  {
    group: "Company Specific",
    items: [
      { label: "Aptitude Questions", slug: "company-aptitude", icon: "🏢" },
      { label: "Placement Exams",    slug: "placement-exams",  icon: "📋" },
    ],
  },
  {
    group: "Programming",
    items: [
      { label: "Programming Exercises", slug: "programming",     icon: "💻" },
      { label: "Technical MCQs",        slug: "technical-mcqs",  icon: "🎯" },
      { label: "DSA Questions",         slug: "dsa",             icon: "⚡" },
      { label: "Interview Questions",   slug: "interview-qs",    icon: "🎤" },
    ],
  },
  {
    group: "Resources",
    items: [
      { label: "Daily Test",     slug: "daily-test",  icon: "📅" },
      { label: "Mock Tests",     slug: "mock-tests",  icon: "🎯" },
    ],
  },
];

// Topic lists per section
const SECTION_TOPICS: Record<string, { slug: string; name: string }[]> = {
  "quantitative-aptitude": [
    { slug: "number-system",       name: "Number System" },
    { slug: "hcf-lcm",             name: "HCF and LCM" },
    { slug: "average",             name: "Average" },
    { slug: "percentage",          name: "Percentage" },
    { slug: "profit-loss",         name: "Profit and Loss" },
    { slug: "simple-interest",     name: "Simple Interest" },
    { slug: "compound-interest",   name: "Compound Interest" },
    { slug: "ratio-proportion",    name: "Ratio and Proportion" },
    { slug: "time-work",           name: "Time and Work" },
    { slug: "time-speed-distance", name: "Time, Speed and Distance" },
    { slug: "permutation-combination", name: "Permutations and Combinations" },
    { slug: "probability",         name: "Probability" },
    { slug: "pipes-cistern",       name: "Pipes and Cistern" },
    { slug: "ages",                name: "Problems on Ages" },
    { slug: "mixtures",            name: "Mixture and Alligation" },
    { slug: "logarithm",           name: "Logarithm" },
    { slug: "mensuration",         name: "Mensuration" },
    { slug: "boats-streams",       name: "Boats and Streams" },
    { slug: "trains",              name: "Problems on Trains" },
    { slug: "heights-distances",   name: "Height and Distance" },
    { slug: "partnership",         name: "Partnership" },
  ],
  "logical-reasoning": [
    { slug: "number-series",        name: "Number Series" },
    { slug: "series-completion",    name: "Series Completion" },
    { slug: "letter-symbol-series", name: "Letter and Symbol Series" },
    { slug: "analogy",              name: "Analogy" },
    { slug: "odd-man-out",          name: "Odd Man Out" },
    { slug: "blood-relations",      name: "Blood Relations" },
    { slug: "coding-decoding",      name: "Coding-Decoding" },
    { slug: "direction-sense",      name: "Direction Sense" },
    { slug: "syllogism",            name: "Syllogism" },
    { slug: "seating-arrangement",  name: "Seating Arrangement" },
    { slug: "puzzles",              name: "Puzzles" },
    { slug: "calendar",             name: "Calendar" },
    { slug: "clocks",               name: "Clocks" },
    { slug: "order-ranking",        name: "Order and Ranking" },
    { slug: "statement-assumption", name: "Statement and Assumption" },
    { slug: "statement-conclusion", name: "Statement and Conclusion" },
    { slug: "statement-argument",   name: "Statement and Argument" },
    { slug: "course-of-action",     name: "Course of Action" },
    { slug: "cause-effect",         name: "Cause and Effect" },
    { slug: "logical-problems",     name: "Logical Problems" },
    { slug: "theme-detection",      name: "Theme Detection" },
  ],
  "verbal-ability": [
    { slug: "synonyms",             name: "Synonyms" },
    { slug: "antonyms",             name: "Antonyms" },
    { slug: "grammar",              name: "Grammar" },
    { slug: "fill-blanks",          name: "Fill in the Blanks" },
    { slug: "idioms",               name: "Idioms and Phrases" },
    { slug: "comprehension",        name: "Reading Comprehension" },
    { slug: "sentence-correction",  name: "Sentence Correction" },
    { slug: "one-word-substitution",name: "One Word Substitution" },
    { slug: "spotting-errors",      name: "Spotting Errors" },
    { slug: "para-jumbles",         name: "Para Jumbles" },
  ],
  "technical-mcqs": [
    { slug: "c-programming", name: "C Programming" },
    { slug: "cpp",           name: "C++" },
    { slug: "java",          name: "Java" },
    { slug: "python",        name: "Python" },
    { slug: "oop",           name: "OOP Concepts" },
    { slug: "dbms",          name: "DBMS" },
    { slug: "os",            name: "Operating Systems" },
    { slug: "networking",    name: "Computer Networks" },
    { slug: "sql",           name: "SQL" },
    { slug: "data-structures", name: "Data Structures" },
    { slug: "algorithms",    name: "Algorithms" },
  ],
  "dsa": [
    { slug: "arrays",           name: "Arrays" },
    { slug: "linked-lists",     name: "Linked Lists" },
    { slug: "stacks-queues",    name: "Stacks and Queues" },
    { slug: "trees",            name: "Binary Trees" },
    { slug: "graphs",           name: "Graphs" },
    { slug: "dp",               name: "Dynamic Programming" },
    { slug: "hashing",          name: "Hashing" },
    { slug: "two-pointers",     name: "Two Pointers" },
    { slug: "binary-search",    name: "Searching" },
    { slug: "greedy",           name: "Greedy Algorithms" },
    { slug: "backtracking",     name: "Backtracking" },
    { slug: "strings",          name: "String and Tries" },
  ],
};

// ── MCQ Question Component ─────────────────────────────────────────────────────
function MCQCard({ q, idx }: { q: MCQ; idx: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showExp, setShowExp]   = useState(false);
  const answered = selected !== null;

  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <div className="flex items-start gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
          {idx + 1}
        </span>
        <p className="text-zinc-100 text-sm font-medium leading-relaxed">{q.q}</p>
      </div>

      <div className="space-y-2 mb-4">
        {q.opts.map((opt, i) => {
          const isCorrect  = i === q.ans;
          const isSelected = selected === i;
          let cls = "border-white/8 bg-[#0f0f0f] text-zinc-400 hover:border-white/15 hover:text-zinc-200";
          if (answered) {
            if (isCorrect)                cls = "border-green-500/40 bg-green-500/8 text-green-300";
            else if (isSelected && !isCorrect) cls = "border-red-500/40 bg-red-500/8 text-red-300";
            else                          cls = "border-white/5 bg-[#0a0a0a] text-zinc-600";
          }
          return (
            <button key={i} onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center gap-3 ${cls} ${!answered ? "cursor-pointer" : "cursor-default"}`}>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                answered && isCorrect   ? "border-green-500 bg-green-500 text-white" :
                answered && isSelected  ? "border-red-500 bg-red-500 text-white" :
                isSelected              ? "border-red-500 bg-red-600 text-white" :
                "border-zinc-700 text-zinc-600"
              }`}>
                {["A","B","C","D"][i]}
              </span>
              {opt}
              {answered && isCorrect  && <span className="ml-auto text-green-400 text-xs font-bold">✓ Correct</span>}
              {answered && isSelected && !isCorrect && <span className="ml-auto text-red-400 text-xs font-bold">✗ Wrong</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="anim-slide-down">
          <button onClick={() => setShowExp(e => !e)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors mb-2">
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

// ── Concept Renderer ───────────────────────────────────────────────────────────
function ConceptViewer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="prose-custom space-y-3">
      {lines.map((line, i) => {
        if (line.startsWith("## "))    return <h2 key={i} className="text-xl font-black text-white mt-4 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith("### "))   return <h3 key={i} className="text-base font-bold text-red-400 mt-3 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-white font-semibold text-sm">{line.slice(2,-2)}</p>;
        if (line.startsWith("- "))     return <li key={i} className="text-zinc-300 text-sm ml-4 list-disc">{line.slice(2)}</li>;
        if (line.startsWith("| ") && line.includes("|"))  {
          const cells = line.split("|").map(c=>c.trim()).filter(Boolean);
          if (cells.every(c => c.match(/^-+$/))) return null;
          return (
            <div key={i} className="flex gap-4 text-sm border-b border-white/5 pb-1">
              {cells.map((c,j) => <span key={j} className={`flex-1 ${j===0?"text-zinc-300 font-medium":"text-zinc-500"}`}>{c}</span>)}
            </div>
          );
        }
        if (line.startsWith("```"))    return null;
        if (line.trim() === "")        return <div key={i} className="h-1" />;
        return <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function PrepHubPage() {
  const [activeSection, setActiveSection]   = useState("quantitative-aptitude");
  const [activeTopic, setActiveTopic]       = useState<string | null>(null);
  const [topicContent, setTopicContent]     = useState<TopicContent | null>(null);
  const [loadingTopic, setLoadingTopic]     = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  const sectionTopics = SECTION_TOPICS[activeSection] || [];

  const loadTopic = async (slug: string) => {
    setLoadingTopic(true);
    setActiveTopic(slug);
    setTopicContent(null);
    try {
      const res = await fetch(`${API}/topics/${slug}`);
      if (!res.ok) throw new Error();
      const data: TopicContent = await res.json();
      setTopicContent(data);
    } catch {
      // Fallback — show placeholder
      setTopicContent({
        slug, name: slug, section: activeSection,
        concept: `## ${slug}\n\nContent for this topic is being prepared. Practice questions available in the Mock Test section.`,
        questions: [],
      });
    } finally {
      setLoadingTopic(false);
    }
  };

  const handleSectionClick = (slug: string) => {
    // Route DSA and mock tests to existing pages
    if (slug === "dsa") { window.location.href = "/coding"; return; }
    if (slug === "mock-tests" || slug === "daily-test") { window.location.href = "/aptitude"; return; }
    if (slug === "interview-qs") { window.location.href = "/mock-interview"; return; }
    if (slug === "programming") { window.location.href = "/coding"; return; }
    setActiveSection(slug);
    setActiveTopic(null);
    setTopicContent(null);
  };

  const currentTopic = activeTopic ? sectionTopics.find(t => t.slug === activeTopic) : null;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Navbar — exactly like placementpreparation.io */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/95 backdrop-blur-xl px-6 py-3.5 flex items-center gap-6 sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <SkilloraLogo size={28} />
          <span className="text-base font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-1">
          {NAV.map(group => (
            <div key={group.group} className="relative group">
              <button className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-1">
                {group.group}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0f0f0f] border border-white/8 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {group.items.map(item => (
                  <button key={item.slug} onClick={() => handleSectionClick(item.slug)}
                    className="w-full text-left px-4 py-2.5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link href="/aptitude" className="btn-ghost text-xs px-3 py-2">Mock Test</Link>
          <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Dashboard
          </Link>
          {/* Mobile menu */}
          <button className="lg:hidden btn-ghost text-xs px-2 py-2" onClick={() => setSidebarOpen(o=>!o)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </nav>

      {/* Hero banner */}
      {!activeTopic && (
        <div className="relative z-10 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-start gap-4">
              <div>
                <p className="text-zinc-600 text-xs mb-1">Home › {NAV.find(g => g.items.find(i => i.slug === activeSection))?.group}</p>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
                  {NAV.flatMap(g => g.items).find(i => i.slug === activeSection)?.label || "Placement Prep"}
                </h1>
                <p className="text-zinc-500 text-sm max-w-2xl">
                  Master the concepts, formulas, tips and tricks. Practice questions and answers are vital for achieving high scores in placement exams.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 flex gap-6">

        {/* ── LEFT SIDEBAR — exactly like placementpreparation.io ── */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block w-60 flex-shrink-0`}>
          <div className="card sticky top-[65px] overflow-hidden">
            {NAV.map(group => (
              <div key={group.group}>
                <div className="px-4 py-2.5 border-b border-white/5">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{group.group}</p>
                </div>
                {group.items.map(item => (
                  <button key={item.slug}
                    onClick={() => { handleSectionClick(item.slug); setSidebarOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all flex items-center gap-2.5 border-b border-white/3 ${
                      activeSection === item.slug
                        ? "bg-red-500/10 text-red-400 border-l-2 border-l-red-500"
                        : "text-zinc-400 hover:bg-white/4 hover:text-zinc-200"
                    }`}>
                    <span className="text-sm">{item.icon}</span>
                    <span className="truncate text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0">

          {/* Topic grid — shown when no topic selected */}
          {!activeTopic && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {NAV.flatMap(g => g.items).find(i => i.slug === activeSection)?.label || "Topics"}
                  <span className="text-zinc-600 font-normal text-sm ml-1">Topics</span>
                </h2>
                <span className="text-xs text-zinc-600">{sectionTopics.length} topics</span>
              </div>

              {sectionTopics.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-zinc-500 text-sm mb-4">This section redirects to the dedicated page.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/coding"   className="btn-red text-sm px-5 py-2.5">Go to Coding</Link>
                    <Link href="/aptitude" className="btn-ghost text-sm px-5 py-2.5">Go to Mock Tests</Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {sectionTopics.map((topic, i) => (
                    <button key={i} onClick={() => loadTopic(topic.slug)}
                      className="card p-5 text-left group hover:border-red-500/25 transition-all relative overflow-hidden anim-fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}>
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600/0 via-red-600/40 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors mb-1">{topic.name}</h3>
                          <p className="text-[10px] text-zinc-600">{NAV.flatMap(g=>g.items).find(i=>i.slug===activeSection)?.label}</p>
                        </div>
                        <svg className="w-4 h-4 text-zinc-700 group-hover:text-red-400 transition-all group-hover:translate-x-0.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-[10px] bg-red-500/10 border border-red-500/15 text-red-400 px-2 py-0.5 rounded-full">MCQ Practice</span>
                        <span className="text-[10px] bg-blue-500/8 border border-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">Concepts</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Topic content — shown when topic selected */}
          {activeTopic && (
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-zinc-600 mb-5">
                <button onClick={() => { setActiveTopic(null); setTopicContent(null); }} className="hover:text-zinc-300 transition-colors">
                  {NAV.flatMap(g=>g.items).find(i=>i.slug===activeSection)?.label}
                </button>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                <span className="text-zinc-400">{currentTopic?.name}</span>
              </div>

              {loadingTopic ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <svg className="animate-spin w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  <p className="text-zinc-600 text-sm">Loading topic…</p>
                </div>
              ) : topicContent ? (
                <div className="space-y-6">
                  {/* Page header */}
                  <div className="card p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    <h1 className="text-2xl font-black text-white mb-1">{topicContent.name}</h1>
                    <p className="text-zinc-500 text-sm">Concepts, formulas, tips and practice questions for placement exams</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-2.5 py-1 rounded-full">{topicContent.questions.length} Practice Questions</span>
                      <span className="text-xs bg-blue-500/8 border border-blue-500/15 text-blue-400 px-2.5 py-1 rounded-full">With Explanations</span>
                    </div>
                  </div>

                  {/* Concepts */}
                  <div className="card p-7">
                    <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Concepts & Formulas
                    </h2>
                    <ConceptViewer text={topicContent.concept} />
                  </div>

                  {/* Questions */}
                  {topicContent.questions.length > 0 && (
                    <div>
                      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Practice Questions
                        <span className="text-zinc-600 font-normal text-sm">— Click an option to check your answer</span>
                      </h2>
                      <div className="space-y-4">
                        {topicContent.questions.map((q, i) => (
                          <MCQCard key={i} q={q} idx={i} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next topic */}
                  <div className="card p-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Done with this topic?</p>
                      <p className="text-zinc-600 text-xs">Take a full mock test or move to the next topic</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href="/aptitude" className="btn-red text-xs px-4 py-2">Mock Test</Link>
                      <button onClick={() => { setActiveTopic(null); setTopicContent(null); }} className="btn-ghost text-xs px-4 py-2">All Topics</button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
