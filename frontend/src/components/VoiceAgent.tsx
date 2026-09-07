"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SkilloraLogo from "./SkilloraLogo";

interface Message { role: "user" | "assistant"; content: string; }
type AgentState = "idle" | "listening" | "thinking" | "speaking";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

declare global {
  interface Window { SpeechRecognition: any; webkitSpeechRecognition: any; }
}

export default function VoiceAgent() {
  const [open, setOpen]             = useState(false);
  const [state, setState]           = useState<AgentState>("idle");
  const [messages, setMessages]     = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput]   = useState("");
  const [error, setError]           = useState("");
  const [supported, setSupported]   = useState(true);
  const [isDemo, setIsDemo]         = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef       = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMounted      = useRef(true);
  const voicesLoaded   = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    synthRef.current  = window.speechSynthesis;

    // Pre-load voices
    const loadVoices = () => { synthRef.current?.getVoices(); voicesLoaded.current = true; };
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) { setSupported(false); return; }

    const rec = new SpeechRec();
    rec.continuous = false; rec.interimResults = true; rec.lang = "en-US";

    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(t);
    };

    rec.onend = () => {
      if (!isMounted.current) return;
      setTranscript(t => {
        if (t.trim()) sendMessage(t.trim());
        else setState("idle");
        return "";
      });
    };

    rec.onerror = (e: any) => {
      if (!isMounted.current) return;
      if (e.error === "not-allowed") setError("Microphone access denied. Use the text box below instead.");
      else if (e.error !== "no-speech") setError("Mic error: " + e.error);
      setState("idle");
    };

    recognitionRef.current = rec;

    return () => {
      isMounted.current = false;
      rec.abort();
      synthRef.current?.cancel();
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    setMessages(prev => {
      const updated = [...prev, { role: "user" as const, content: text }];
      fetchReply(updated);
      return updated;
    });
    setState("thinking");
  }, []);

  const fetchReply = async (history: Message[]) => {
    const userMsg     = history[history.length - 1];
    const prevHistory = history.slice(0, -1);
    try {
      const res  = await fetch(`${API_BASE}/voice-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: prevHistory }),
      });
      if (!res.ok) throw new Error("Backend not responding.");
      const data = await res.json();
      const reply = data.reply as string;
      if (data.source === "fallback") setIsDemo(true);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      speak(reply);
    } catch (err: any) {
      setError("Backend not running. Start the backend server first.");
      setState("idle");
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) { setState("idle"); return; }
    synthRef.current.cancel();
    setState("speaking");

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = 1.05;
    utt.pitch = 1.0;
    utt.volume = 1.0;

    const voices = synthRef.current.getVoices();
    const preferred =
      voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ||
      voices.find(v => v.lang === "en-US" && v.name.includes("Samantha")) ||
      voices.find(v => v.lang === "en-US" && !v.localService) ||
      voices.find(v => v.lang.startsWith("en-"));
    if (preferred) utt.voice = preferred;

    utt.onend   = () => { if (isMounted.current) setState("idle"); };
    utt.onerror = (e) => {
      console.warn("Speech synthesis error:", e);
      if (isMounted.current) setState("idle");
    };

    // Workaround for Chrome bug where long utterances get cut off
    const chunkSize = 200;
    if (text.length > chunkSize) {
      const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
      let i = 0;
      const speakNext = () => {
        if (!isMounted.current || i >= sentences.length) { setState("idle"); return; }
        const chunk = new SpeechSynthesisUtterance(sentences[i++]);
        chunk.rate   = utt.rate;
        chunk.pitch  = utt.pitch;
        chunk.volume = utt.volume;
        if (preferred) chunk.voice = preferred;
        chunk.onend = speakNext;
        synthRef.current?.speak(chunk);
      };
      setState("speaking");
      speakNext();
      return;
    }

    synthRef.current.speak(utt);
  };

  const handleMicClick = () => {
    if (state === "listening") { recognitionRef.current?.stop(); return; }
    if (state === "speaking")  { synthRef.current?.cancel(); setState("idle"); return; }
    if (state === "idle") {
      setError(""); setTranscript("");
      setState("listening");
      try { recognitionRef.current?.start(); } catch { setState("idle"); }
    }
  };

  const handleTextSend = () => {
    if (!textInput.trim() || state === "thinking") return;
    const msg = textInput.trim();
    setTextInput("");
    setError("");
    sendMessage(msg);
  };

  const clearChat = () => {
    synthRef.current?.cancel();
    recognitionRef.current?.abort();
    setMessages([]); setTranscript(""); setError(""); setTextInput("");
    setState("idle"); setIsDemo(false);
  };

  const stateLabel = { idle:"Tap mic to speak", listening:"Listening…", thinking:"Thinking…", speaking:"Speaking…" }[state];

  return (
    <>
      {/* Floating trigger */}
      <button onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 bg-red-600 hover:bg-red-500 glow-red anim-pulse-red ${open ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
        title="Open AI Voice Agent">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
        </svg>
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
      </button>

      {/* Panel */}
      <div className={`fixed bottom-6 right-6 z-50 w-[370px] bg-[#0f0f0f] border border-white/8 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
        style={{ maxHeight: 580 }}>

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <SkilloraLogo size={20} />
            <span className="text-sm font-bold"><span className="brand-skill">Skillora</span> <span className="text-red-400">Voice</span></span>
            {isDemo && (
              <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button onClick={clearChat} className="text-zinc-600 hover:text-red-400 transition-colors p-1.5 rounded" title="Clear chat">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            )}
            <button onClick={() => { setOpen(false); synthRef.current?.cancel(); }} className="text-zinc-600 hover:text-zinc-300 transition-colors p-1.5 rounded">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {!supported && (
          <div className="px-5 py-2.5 bg-amber-500/8 border-b border-amber-500/15 text-amber-400 text-xs flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Voice not supported in this browser — use the text box below.
          </div>
        )}
        {error && (
          <div className="px-5 py-2.5 bg-red-500/8 border-b border-red-500/15 text-red-400 text-xs flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")} className="text-red-600 hover:text-red-400 flex-shrink-0">✕</button>
          </div>
        )}
        {isDemo && (
          <div className="px-5 py-2 bg-amber-500/6 border-b border-amber-500/10 text-amber-500/80 text-[10px] flex items-center gap-1.5">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Demo mode — add GROQ_API_KEY in backend/.env for full AI responses
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 anim-float">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              </div>
              <p className="text-zinc-500 text-sm font-medium">Ask me anything</p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {["Interview tips", "Resume help", "Study roadmap", "DSA practice"].map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-[11px] bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-zinc-500 px-2.5 py-1 rounded-full border border-white/8 hover:border-red-500/20 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-red-600 text-white rounded-br-sm"
                  : "bg-[#1a1a1a] border border-white/6 text-zinc-300 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {transcript && (
            <div className="flex justify-end">
              <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm bg-red-600/25 border border-red-500/25 text-red-200 italic">
                {transcript}
              </div>
            </div>
          )}

          {state === "thinking" && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] border border-white/6 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Orb */}
        <div className="flex-shrink-0 border-t border-white/5 px-5 pt-4 pb-2 flex flex-col items-center gap-2">
          <button onClick={handleMicClick} disabled={state === "thinking"}
            className="relative w-14 h-14 rounded-full flex items-center justify-center focus:outline-none disabled:opacity-40 group">
            <span className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
              state === "listening" ? "border-red-500 animate-ping opacity-50"
              : state === "speaking" ? "border-red-400/50 animate-pulse"
              : "border-white/10 group-hover:border-red-500/30"
            }`} />
            {state === "speaking" && (
              <span className="absolute inset-[-8px] flex items-center justify-center gap-[3px]">
                <span className="wave-bar" /><span className="wave-bar" /><span className="wave-bar" /><span className="wave-bar" /><span className="wave-bar" />
              </span>
            )}
            <span className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
              state === "listening" ? "bg-red-600 glow-red scale-110"
              : state === "thinking" ? "bg-zinc-800"
              : state === "speaking" ? "bg-red-500 glow-red"
              : "bg-red-600 group-hover:bg-red-500 group-hover:scale-105"
            }`}>
              {state === "listening" ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
              ) : state === "thinking" ? (
                <svg className="w-4 h-4 text-zinc-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
              )}
            </span>
          </button>
          <p className={`text-[11px] font-medium transition-colors ${
            state==="listening"?"text-red-400":state==="thinking"?"text-zinc-500":state==="speaking"?"text-red-300":"text-zinc-600"
          }`}>{stateLabel}</p>
        </div>

        {/* Text input fallback */}
        <div className="flex-shrink-0 px-4 pb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTextSend()}
              placeholder="Type a message…"
              disabled={state === "thinking"}
              className="flex-1 bg-[#060606] border border-white/8 focus:border-red-500/40 rounded-xl px-3.5 py-2.5 text-zinc-300 text-sm outline-none placeholder:text-zinc-700 transition-all disabled:opacity-50"
            />
            <button onClick={handleTextSend} disabled={!textInput.trim() || state === "thinking"}
              className="bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white px-3.5 rounded-xl transition-all flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
