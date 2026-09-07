"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SkilloraLogo from "@/components/SkilloraLogo";

const HISTORY_KEY = "skillora_history";
const INTV_KEY    = "skillora_interview_count";
const loadHistory  = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } };
const saveHistory  = (e: any[]) => localStorage.setItem(HISTORY_KEY, JSON.stringify(e.slice(0, 30)));
const incIntv      = () => { try { const n = parseInt(localStorage.getItem(INTV_KEY) || "0") + 1; localStorage.setItem(INTV_KEY, String(n)); } catch {} };

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const ROUNDS = [
  { id: "hr",        label: "HR Round",        icon: "🤝", color: "from-orange-600/20 to-orange-800/10", border: "border-orange-500/20", accent: "text-orange-400" },
  { id: "technical", label: "Technical Round",  icon: "⚙️", color: "from-blue-600/20 to-blue-800/10",   border: "border-blue-500/20",   accent: "text-blue-400"  },
];

type Stage = "setup" | "answering" | "report";
type Mode  = "text" | "voice";

interface Evaluation {
  score: number; confidence_score: number; communication_score: number;
  strengths: string[]; weaknesses: string[]; ideal_answer_hint: string; improvements: string[];
}
interface Report {
  overall_score: number; confidence_score: number; communication_score: number;
  grade: string; verdict: string; round_type: string; questions_attempted: number;
  top_improvements: string[]; weak_areas: string[];
}

function speak(text: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.95; utt.pitch = 1; utt.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const en = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
          || voices.find(v => v.lang.startsWith("en")) || voices[0];
  if (en) utt.voice = en;
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 36, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function IdealAnswerCard({ question, roundType }: { question: string; roundType: string }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const load = async () => {
    if (fetched) { setOpen(o => !o); return; }
    setLoading(true); setOpen(true);
    try {
      const res = await fetch(`${API}/mock-interview/ideal-answer`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, round_type: roundType }),
      });
      const data = await res.json();
      setAnswer(data.answer); setFetched(true);
    } catch { setAnswer("Could not load ideal answer."); }
    finally { setLoading(false); }
  };
  return (
    <div className="mt-3">
      <button onClick={load}
        className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${open ? "bg-amber-500/10 border-amber-500/25 text-amber-400" : "border-white/8 text-zinc-500 hover:border-amber-500/25 hover:text-amber-400"}`}>
        {loading ? <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading…</>
          : <>{open ? "Hide" : "View"} Ideal Answer 💡</>}
      </button>
      {open && answer && (
        <div className="mt-2 bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">💡 Model Answer</p>
          <pre className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{answer}</pre>
        </div>
      )}
    </div>
  );
}

export default function MockInterviewPage() {
  const [stage, setStage]         = useState<Stage>("setup");
  const [mode, setMode]           = useState<Mode>("text");
  const [roundType, setRoundType] = useState("hr");
  const [company, setCompany]     = useState("");
  const [role, setRole]           = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ]   = useState(0);
  const [answers, setAnswers]     = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluations, setEvaluations]     = useState<Evaluation[]>([]);
  const [report, setReport]       = useState<Report | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const [voiceReady, setVoiceReady]   = useState(false);
  const recognitionRef = useRef<any>(null);
  const selectedRound = ROUNDS.find(r => r.id === roundType)!;

  useEffect(() => {
    const hasSpeech = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    const hasSynth  = typeof window !== "undefined" && "speechSynthesis" in window;
    setVoiceReady(hasSpeech && hasSynth);
    if (hasSynth) window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    if (mode === "voice" && stage === "answering" && questions[currentQ]) {
      setIsSpeaking(true);
      speak(`Question ${currentQ + 1}: ${questions[currentQ]}`, () => setIsSpeaking(false));
    }
  }, [currentQ, stage, mode, questions]);

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
    rec.onresult = (e: any) => {
      let t = ""; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setCurrentAnswer(t);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    rec.start(); recognitionRef.current = rec; setIsListening(true);
  };
  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };

  const startInterview = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/mock-interview/questions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round_type: roundType, company, role }),
      });
      if (!res.ok) throw new Error("Failed to fetch questions.");
      const data = await res.json();
      setQuestions(data.questions); setCurrentQ(0);
      setAnswers([]); setEvaluations([]); setCurrentAnswer(""); setStage("answering");
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) { setError("Please provide an answer."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/mock-interview/evaluate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questions[currentQ], answer: currentAnswer, round_type: roundType }),
      });
      if (!res.ok) throw new Error("Evaluation failed.");
      const ev: Evaluation = await res.json();
      const newEvals = [...evaluations, ev];
      setEvaluations(newEvals); setAnswers([...answers, currentAnswer]);
      if (currentQ + 1 >= questions.length) { await generateReport(newEvals); }
      else { setCurrentQ(q => q + 1); setCurrentAnswer(""); setError(""); }
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const generateReport = async (evals: Evaluation[]) => {
    const res = await fetch(`${API}/mock-interview/report`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ round_type: roundType, evaluations: evals }),
    });
    const data: Report = await res.json();
    setReport(data); setStage("report");
    if (mode === "voice") speak(`Interview complete. Score: ${data.overall_score} out of 100. Grade ${data.grade}.`);
    try {
      saveHistory([{ id: Date.now().toString(), type: "interview", roundType, company: company||"General",
        role: role||"Any", score: data.overall_score, grade: data.grade, result: data, timestamp: Date.now() }, ...loadHistory()]);
      incIntv();
    } catch {}
  };

  const restart = () => {
    window.speechSynthesis?.cancel(); recognitionRef.current?.stop();
    setStage("setup"); setQuestions([]); setCurrentQ(0); setAnswers([]);
    setEvaluations([]); setCurrentAnswer(""); setReport(null); setError("");
    setIsListening(false); setIsSpeaking(false);
  };

  const gradeColor = (g: string) =>
    g==="A"?"text-green-400 border-green-500/30 bg-green-500/10":
    g==="B"?"text-blue-400 border-blue-500/30 bg-blue-500/10":
    g==="C"?"text-amber-400 border-amber-500/30 bg-amber-500/10":"text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-red-600/6 rounded-full blur-[80px] pointer-events-none z-0" />

      <nav className="relative z-10 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-8 py-4 flex justify-between items-center sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <SkilloraLogo size={32} />
          <span className="text-lg font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>Dashboard
          </Link>
          {stage !== "setup" && (
            <button onClick={restart} className="btn-ghost text-xs px-3 py-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>Restart
            </button>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />AI Mock Interview
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Practice. <span className="text-gradient">Improve.</span> Get Placed.</h1>
          <p className="text-zinc-500 text-sm">AI evaluates every answer — confidence, communication, and technical depth</p>
        </div>

        {/* ══ SETUP ══ */}
        {stage === "setup" && (
          <div className="space-y-6">
            {/* Mode */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-white mb-1">Interview Mode</h2>
              <p className="text-zinc-600 text-xs mb-4">Choose how you want to answer</p>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <button onClick={() => setMode("text")}
                  className={`p-4 rounded-xl border text-left transition-all ${mode==="text"?"bg-red-600/15 border-red-500/30 text-white":"border-white/8 bg-[#111] text-zinc-400 hover:border-white/15"}`}>
                  <div className="text-2xl mb-1.5">⌨️</div>
                  <p className="text-sm font-semibold">Text Mode</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Type your answers</p>
                </button>
                <button onClick={() => setMode("voice")} disabled={!voiceReady}
                  className={`p-4 rounded-xl border text-left transition-all relative ${mode==="voice"?"bg-blue-600/15 border-blue-500/30 text-white":voiceReady?"border-white/8 bg-[#111] text-zinc-400 hover:border-white/15":"border-white/5 bg-[#0a0a0a] text-zinc-700 cursor-not-allowed"}`}>
                  <div className="text-2xl mb-1.5">🎤</div>
                  <p className="text-sm font-semibold">Voice Mode</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{voiceReady?"Speak your answers":"Browser unsupported"}</p>
                  {mode==="voice" && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                </button>
              </div>
              {mode==="voice" && (
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-400 bg-blue-500/8 border border-blue-500/15 px-3 py-2 rounded-lg">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  AI reads questions aloud. Tap the mic to record your answer.
                </div>
              )}
            </div>

            {/* Round */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-white mb-1">Select Round</h2>
              <p className="text-zinc-600 text-xs mb-4">Choose the type of interview to practice</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {ROUNDS.map(r => (
                  <button key={r.id} onClick={() => setRoundType(r.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all ${roundType===r.id?`bg-gradient-to-br ${r.color} ${r.border} ring-1 ring-red-500/30`:"border-white/5 bg-[#111] hover:border-white/10"}`}>
                    <div className="text-2xl mb-1.5">{r.icon}</div>
                    <div className={`text-sm font-semibold ${roundType===r.id?r.accent:"text-zinc-300"}`}>{r.label}</div>
                    {roundType===r.id && <div className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Context */}
            <div className="card p-6">
              <h2 className="text-sm font-bold text-white mb-1">Target Context <span className="text-zinc-600 font-normal text-xs">(Optional)</span></h2>
              <p className="text-zinc-600 text-xs mb-4">Customizes questions for your role</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Company</label>
                  <input type="text" placeholder="e.g. Google, TCS, Infosys" className="input-field" value={company} onChange={e => setCompany(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1.5">Role</label>
                  <input type="text" placeholder="e.g. SDE-2, Data Analyst" className="input-field" value={role} onChange={e => setRole(e.target.value)} />
                </div>
              </div>
            </div>

            {error && <div className="bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>}

            <div className="flex justify-center">
              <button onClick={startInterview} disabled={loading}
                className="btn-red px-10 py-4 text-base font-bold flex items-center gap-3 glow-red disabled:opacity-50">
                {loading ? <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Generating Questions...</>
                  : <>{mode==="voice"?"🎤":"⌨️"} Start {selectedRound.label}</>}
              </button>
            </div>
          </div>
        )}

        {/* ══ ANSWERING ══ */}
        {stage === "answering" && (
          <div className="space-y-6">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedRound.icon}</span>
                  <span className="text-sm font-semibold text-white">{selectedRound.label}</span>
                  {company && <span className="text-xs text-zinc-600">· {company}</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${mode==="voice"?"bg-blue-500/15 text-blue-400":"bg-zinc-500/15 text-zinc-400"}`}>
                    {mode==="voice"?"🎤 Voice":"⌨️ Text"}
                  </span>
                </div>
                <span className="text-xs text-zinc-500">Q{currentQ+1} / {questions.length}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width:`${(currentQ/questions.length)*100}%` }} />
              </div>
            </div>

            <div className="card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400 font-black text-sm flex-shrink-0">Q{currentQ+1}</div>
                <div className="flex-1">
                  <p className="text-white text-lg font-medium leading-relaxed">{questions[currentQ]}</p>
                  {mode==="voice" && (
                    <button onClick={() => speak(questions[currentQ])}
                      className="mt-3 text-xs flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0a9 9 0 01-6.364-2.636M12 18a9 9 0 006.364-2.636"/></svg>
                      {isSpeaking?"Reading...":"Read again"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="card p-7">
              {mode==="text" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider">Your Answer</label>
                    <span className="text-xs text-zinc-700">{currentAnswer.length} chars</span>
                  </div>
                  <textarea rows={7} placeholder="Type your answer here. Be detailed, use examples, explain your thinking."
                    className="input-field resize-none w-full text-sm leading-relaxed"
                    value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)} />
                </>
              ) : (
                <div className="flex flex-col items-center py-4 gap-4">
                  <button onClick={isListening ? stopListening : startListening}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 border-4 ${isListening?"bg-red-600 border-red-400 scale-110 shadow-2xl shadow-red-600/50":"bg-[#1a1a1a] border-white/10 hover:border-red-500/40 hover:scale-105"}`}>
                    {isListening ? (
                      <div className="flex items-end gap-1 h-8">
                        {[1,2,3,4,5].map(i => <div key={i} className="wave-bar bg-white" style={{ animationDelay:`${i*0.1}s` }} />)}
                      </div>
                    ) : (
                      <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"/>
                      </svg>
                    )}
                  </button>
                  <p className="text-sm text-zinc-400">
                    {isListening ? <span className="text-red-400 font-semibold animate-pulse">● Listening... tap to stop</span> : "Tap mic to speak your answer"}
                  </p>
                  {currentAnswer && (
                    <div className="w-full bg-[#111] border border-white/8 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Transcript</p>
                      <p className="text-zinc-300 text-sm leading-relaxed">{currentAnswer}</p>
                      <button onClick={() => setCurrentAnswer("")} className="text-[10px] text-zinc-600 hover:text-red-400 mt-2 transition-colors">Clear</button>
                    </div>
                  )}
                </div>
              )}
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              <div className="flex justify-end mt-4">
                <button onClick={submitAnswer} disabled={loading||!currentAnswer.trim()}
                  className="btn-red px-7 py-3 text-sm flex items-center gap-2 disabled:opacity-50">
                  {loading ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{currentQ+1>=questions.length?"Generating Report...":"Next..."}</>
                    : currentQ+1>=questions.length?"Submit & View Score →":"Next Question →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ REPORT ══ */}
        {stage==="report" && report && (
          <div className="space-y-6">
            <div className="card p-8 relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Interview Complete · {selectedRound.label}</p>
                <div className={`inline-block text-6xl font-black border-2 rounded-2xl px-8 py-4 mb-4 ${gradeColor(report.grade)}`}>{report.grade}</div>
                <h2 className="text-xl font-bold text-white mb-1">{report.verdict}</h2>
                <p className="text-zinc-500 text-sm">{report.questions_attempted} questions answered</p>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"/>Overall Scores</h3>
              <div className="flex justify-around">
                <ScoreRing score={report.overall_score} label="Interview Score" color="#dc2626" />
                <ScoreRing score={report.confidence_score} label="Confidence" color="#f59e0b" />
                <ScoreRing score={report.communication_score} label="Communication" color="#3b82f6" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {report.weak_areas.length>0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-bold text-red-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"/>Weak Areas</h3>
                  <ul className="space-y-2">
                    {report.weak_areas.map((w,i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="w-5 h-5 rounded-full bg-red-500/15 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>{w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.top_improvements.length>0 && (
                <div className="card p-6">
                  <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"/>Improvements</h3>
                  <ul className="space-y-2">
                    {report.top_improvements.map((tip,i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400"><span className="text-amber-400 mt-0.5">→</span>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="card p-7">
              <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-zinc-500"/>Q&amp;A Breakdown</h3>
              <div className="space-y-3">
                {questions.map((q,i) => {
                  const ev = evaluations[i]; if (!ev) return null;
                  return (
                    <div key={i} className="card-inset p-4 flex items-start gap-4">
                      <div className="w-7 h-7 rounded-full bg-red-500/10 text-red-400 text-xs font-bold flex items-center justify-center flex-shrink-0">Q{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-300 text-sm mb-2">{q}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${ev.score>=70?"bg-green-500/10 text-green-400 border-green-500/20":ev.score>=50?"bg-amber-500/10 text-amber-400 border-amber-500/20":"bg-red-500/10 text-red-400 border-red-500/20"}`}>
                            Score: {ev.score}/100
                          </span>
                          <span className="text-xs text-amber-400/80">Conf: {ev.confidence_score}</span>
                          <span className="text-xs text-blue-400/80">Comm: {ev.communication_score}</span>
                        </div>
                        {ev.ideal_answer_hint && <p className="text-zinc-600 text-xs mt-2 italic">💡 {ev.ideal_answer_hint}</p>}
                        <IdealAnswerCard question={q} roundType={roundType} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={restart} className="btn-red px-8 py-3.5 flex items-center gap-2 glow-red">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Try Another Round
              </button>
              <Link href="/dashboard" className="btn-ghost px-8 py-3.5">Back to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
