"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SkilloraLogo from "@/components/SkilloraLogo";

// ── Data ───────────────────────────────────────────────────────────────────────
const TOOLS = [
  { icon: "🗺️", title: "AI Roadmap",         desc: "Custom prep plan for any company & role",      tag: "Free",    color: "text-red-400",    bg: "bg-red-500/8 border-red-500/15"    },
  { icon: "📄", title: "ATS Analyzer",         desc: "Resume vs job match score + skill gaps",       tag: "Free",    color: "text-orange-400", bg: "bg-orange-500/8 border-orange-500/15" },
  { icon: "🎤", title: "Mock Interview",        desc: "HR & Technical AI interview with scoring",     tag: "Free",    color: "text-blue-400",   bg: "bg-blue-500/8 border-blue-500/15"  },
  { icon: "💻", title: "Coding Platform",       desc: "75+ problems, 4 languages, instant judge",    tag: "Free",    color: "text-purple-400", bg: "bg-purple-500/8 border-purple-500/15"},
  { icon: "📝", title: "Resume Builder",        desc: "10 layouts, live preview, PDF export",        tag: "Free",    color: "text-green-400",  bg: "bg-green-500/8 border-green-500/15" },
  { icon: "🎯", title: "Aptitude Tests",        desc: "IndiaBix-style MCQs with explanations",      tag: "Free",    color: "text-yellow-400", bg: "bg-yellow-500/8 border-yellow-500/15"},
  { icon: "📚", title: "Prep Hub",              desc: "Topic-wise concepts + practice (30 topics)",  tag: "Free",    color: "text-zinc-300",   bg: "bg-zinc-500/8 border-zinc-500/15"  },
  { icon: "💼", title: "LinkedIn Optimizer",    desc: "AI headline, summary & keyword analysis",     tag: "Free",    color: "text-sky-400",    bg: "bg-sky-500/8 border-sky-500/15"    },
  { icon: "🐙", title: "GitHub Optimizer",      desc: "Real profile fetch + README generator",       tag: "Free",    color: "text-zinc-300",   bg: "bg-zinc-500/8 border-zinc-500/15"  },
  { icon: "🔥", title: "SkillMap",              desc: "GitHub-style heatmap + radar chart",          tag: "Free",    color: "text-amber-400",  bg: "bg-amber-500/8 border-amber-500/15"},
  { icon: "🎙️", title: "Voice AI Coach",         desc: "Real-time spoken career coaching",            tag: "Free",    color: "text-red-300",    bg: "bg-red-500/8 border-red-500/15"    },
  { icon: "📊", title: "Smart Dashboard",       desc: "Personalized progress + daily tips",          tag: "Free",    color: "text-indigo-400", bg: "bg-indigo-500/8 border-indigo-500/15"},
];

const STEPS = [
  { n: "01", icon: "🎯", title: "Create account",      desc: "Sign up free in 30 seconds, set your target company & role" },
  { n: "02", icon: "🗺️", title: "Get your roadmap",    desc: "AI generates a personalised, step-by-step prep plan"         },
  { n: "03", icon: "📄", title: "Optimize resume",      desc: "Upload resume + job URL → instant ATS match score"          },
  { n: "04", icon: "🎤", title: "Practice interviews",  desc: "Mock HR & technical rounds, get scored with model answers"   },
  { n: "05", icon: "💻", title: "Sharpen coding",       desc: "Solve 75+ curated problems with instant judge feedback"      },
  { n: "06", icon: "✅", title: "Land the offer",       desc: "Walk in confident, clear the rounds, get placed"             },
];

const TESTIMONIALS = [
  { name: "Priya S.",     role: "SDE @ Amazon",       text: "The AI roadmap + mock interviews helped me crack Amazon in 2 months. The voice coach is genuinely useful.", avatar: "P" },
  { name: "Rahul M.",     role: "Data Analyst @ TCS",  text: "Skillora's ATS analyzer told me exactly which keywords I was missing. Resume shortlist rate went from 10% to 60%.", avatar: "R" },
  { name: "Ananya K.",    role: "SWE Intern @ Google", text: "The coding platform and aptitude tests in one place saved me so much time. Cleared all 3 test rounds on first attempt.", avatar: "A" },
  { name: "Karan V.",     role: "Backend Dev @ Wipro",  text: "GitHub optimizer generated my entire README and improved my profile score from D to A in one click.", avatar: "K" },
];

const STATS = [
  { value: "12+",  label: "AI Tools",         icon: "🛠️" },
  { value: "75+",  label: "Coding Problems",   icon: "💻" },
  { value: "500+", label: "Practice Questions",icon: "📝" },
  { value: "100%", label: "Free to Use",       icon: "🆓" },
];

// Floating tech keywords
const TECH_WORDS = ["DSA","Python","LeetCode","React","System Design","Resume","SQL","Java","AWS","Machine Learning","Data Structures","API","Git","Docker","Algorithms","Interview","Placement","JavaScript","TypeScript","Node.js"];
const CODE_LINES = ["def binary_search(arr, target):","  → ATS Score: 87%","class Solution { twoSum() }","git commit -m 'prep complete'","O(log n) time complexity","const roadmap = await AI.generate()","✓ Interview cleared at Google","Offer Letter Received 🎉","return dp[n][capacity]","npm run build -- --success"];

// ── FAQ Accordion Item ────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card overflow-hidden transition-all duration-200 ${open ? "border-red-500/20" : ""}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-white/2 transition-colors">
        <span className={`text-sm font-semibold leading-snug ${open ? "text-white" : "text-zinc-200"}`}>{q}</span>
        <svg className={`w-4 h-4 flex-shrink-0 text-red-400 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5">
          <div className="h-px bg-white/5 mb-4" />
          <p className="text-zinc-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted]       = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(document.cookie.includes("skillora_auth=1"));
  }, []);

  // If not logged in, feature links go to /login
  const featureHref = (href: string) => isLoggedIn ? href : "/login";

  // Animated canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    type Node = { x:number; y:number; vx:number; vy:number; r:number; pulse:number };
    const nodes: Node[] = Array.from({length:40},()=>({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r: Math.random()*2+.5, pulse: Math.random()*Math.PI*2,
    }));
    type Fword = {text:string;x:number;y:number;vy:number;op:number;sz:number};
    const words: Fword[] = TECH_WORDS.map((w,i)=>({text:w,x:(i%5)*(canvas.width/5)+Math.random()*160,y:Math.random()*canvas.height,vy:-(Math.random()*.25+.08),op:Math.random()*.15+.04,sz:Math.random()*3+9}));
    type Cline = {text:string;x:number;y:number;vy:number;op:number};
    const clines: Cline[] = CODE_LINES.map((c,i)=>({text:c,x:Math.random()*(canvas.width-280),y:canvas.height+i*110,vy:-(Math.random()*.4+.15),op:Math.random()*.08+.02}));

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // grid
      ctx.strokeStyle="rgba(220,38,38,0.025)"; ctx.lineWidth=1;
      for(let x=0;x<canvas.width;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
      for(let y=0;y<canvas.height;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
      // connections
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.setLineDash([3,7]);ctx.strokeStyle=`rgba(220,38,38,${.07*(1-d/130)})`;ctx.lineWidth=.7;ctx.stroke();ctx.setLineDash([]);}
      }
      // nodes
      for(const n of nodes){
        n.x+=n.vx;n.y+=n.vy;n.pulse+=.025;
        if(n.x<0)n.x=canvas.width;if(n.x>canvas.width)n.x=0;
        if(n.y<0)n.y=canvas.height;if(n.y>canvas.height)n.y=0;
        const pr=Math.max(0.1, n.r+Math.sin(n.pulse)*.6),al=.25+Math.sin(n.pulse)*.12;
        ctx.fillStyle=`rgba(220,38,38,${al})`;
        ctx.beginPath();ctx.arc(n.x,n.y,pr,0,Math.PI*2);ctx.fill();
      }
      // words
      for(const w of words){
        w.y+=w.vy;if(w.y<-20)w.y=canvas.height+20;
        ctx.font=`${w.sz}px monospace`;ctx.fillStyle="#dc2626";ctx.globalAlpha=w.op;ctx.fillText(w.text,w.x,w.y);ctx.globalAlpha=1;
      }
      // code lines
      for(const c of clines){
        c.y+=c.vy;if(c.y<-15)c.y=canvas.height+15;
        ctx.font="10px monospace";ctx.fillStyle="#ef4444";ctx.globalAlpha=c.op;ctx.fillText(c.text,c.x,c.y);ctx.globalAlpha=1;
      }
      animId=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(animId);window.removeEventListener("resize",resize);};
  },[]);

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 flex flex-col overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/8 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-800/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="relative z-20 w-full border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl px-6 md:px-10 py-4 flex justify-between items-center sticky top-0">
        <Link href="/" className="flex items-center gap-2.5">
          <SkilloraLogo size={34} />
          <span className="text-lg font-bold tracking-tight"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href:"/prep-hub",  label:"Prep Hub"   },
            { href:"/coding",    label:"Coding"     },
            { href:"/aptitude",  label:"Aptitude"   },
            { href:"/mock-interview", label:"Interview" },
          ].map(n=>(
            <Link key={n.href} href={featureHref(n.href)} className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all">{n.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-red text-sm px-5 py-2.5">Go to Dashboard →</Link>
          ) : (
            <>
              <Link href="/login"    className="hidden sm:block btn-ghost text-sm px-4 py-2">Sign In</Link>
              <Link href="/register" className="btn-red text-sm px-5 py-2.5">Get Started</Link>
            </>
          )}
          <button className="md:hidden btn-ghost p-2" onClick={()=>setMenuOpen(o=>!o)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen?"M6 18L18 6M6 6l12 12":"M4 6h16M4 12h16M4 18h16"}/></svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0f0f0f] border-b border-white/8 py-3 px-6 flex flex-col gap-1 md:hidden z-50">
            {[{href:"/prep-hub",label:"Prep Hub"},{href:"/coding",label:"Coding"},{href:"/aptitude",label:"Aptitude"},{href:"/mock-interview",label:"Interview"},{href:"/login",label:"Sign In"}].map(n=>(
              <Link key={n.href} href={featureHref(n.href)} onClick={()=>setMenuOpen(false)} className="text-zinc-400 hover:text-white text-sm py-2.5 border-b border-white/5 last:border-0">{n.label}</Link>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className={`transition-all duration-700 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-7 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            AI-Powered Placement Prep
          </span>
        </div>

        <h1 className={`text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-5 transition-all duration-700 delay-100 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          <span className="text-white">Welcome to </span>
          <span className="text-gradient-animated text-glow-red">Skillora AI</span>
          <br />
          <span className="text-white text-3xl md:text-4xl font-bold mt-2 block">Navigate Your Future.</span>
          <span className="text-white text-3xl md:text-4xl font-bold block">Achieve Your Goals.</span>
        </h1>

        

        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-8 transition-all duration-700 delay-300 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-red text-base px-10 py-4 flex items-center justify-center gap-2 glow-red">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link href="/register" className="btn-red text-base px-10 py-4 flex items-center justify-center gap-2 glow-red">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Start for Free
              </Link>
              <Link href="/login" className="btn-ghost text-base px-10 py-4 flex items-center justify-center gap-2">
                Sign In
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
            </>
          )}
        </div>

        <p className="text-zinc-700 text-xs tracking-wide">100% free · No credit card · 30-second signup</p>

        {/* Hero stats strip */}
        <div className={`flex flex-wrap justify-center gap-10 mt-14 transition-all duration-700 delay-400 ${mounted?"opacity-100 translate-y-0":"opacity-0 translate-y-8"}`}>
          {STATS.map(s=>(
            <div key={s.label} className="flex items-center gap-4">
              <span className="text-4xl">{s.icon}</span>
              <div className="text-left">
                <p className="text-white font-black text-3xl md:text-4xl leading-none">{s.value}</p>
                <p className="text-zinc-400 text-base mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools Grid ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Everything you need. All free.</h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">12 powerful tools, zero paywalls. From first prep session to final offer.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {TOOLS.map((t,i)=>(
            <Link key={i} href="/login" className={`card border ${t.bg} p-5 group hover:scale-[1.02] transition-all`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{t.icon}</span>
                <span className="text-[9px] bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{t.tag}</span>
              </div>
              <h3 className={`text-sm font-bold mb-1 ${t.color} group-hover:brightness-125 transition-all`}>{t.title}</h3>
              <p className="text-zinc-600 text-xs leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">From signup to offer — 6 steps</h2>
          <p className="text-zinc-500 text-sm">A clear path from where you are to where you want to be.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map((s,i)=>(
            <div key={i} className="card p-6 relative overflow-hidden group hover:border-red-500/25 transition-all">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/40 transition-all duration-300" />
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-black text-red-500 tracking-widest">{s.n}</span>
              </div>
              <h3 className="text-white font-bold text-sm mb-1 group-hover:text-red-300 transition-colors">{s.title}</h3>
              <p className="text-zinc-600 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Students who got <span className="text-gradient">placed</span></h2>
          <p className="text-zinc-500 text-sm">Real feedback from real users.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t,i)=>(
            <div key={i} className="card p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center text-red-400 font-black text-base flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{t.name}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5 flex-shrink-0">
                  {[...Array(5)].map((_,j)=><span key={j} className="text-amber-400 text-xs">★</span>)}
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Frequently Asked Questions</h2>
          <p className="text-zinc-500 text-sm">Everything you need to know about Skillora AI</p>
        </div>
        <div className="space-y-3">
          {[
            {
              q: "Is Skillora AI enough to get a job?",
              a: "Yes — Skillora AI is more than enough to get placed. If you utilize the dashboard properly — practice mock interviews daily, solve coding problems, analyze your resume, and follow the AI roadmap — you will get placed. Thousands of students have cracked top companies using structured AI-powered prep."
            },
            {
              q: "Will Skillora provide me with job opportunities?",
              a: "Yes! Skillora has a dedicated Jobs section that connects you directly to Naukri, LinkedIn Jobs, Indeed India, Internshala, Glassdoor, Foundit (Monster), Shine.com, and Wellfound (startup jobs) — all with one search. You can filter by role, location, and experience level."
            },
            {
              q: "How many companies' preparation will be covered?",
              a: "Skillora covers preparation for all major Indian and global tech companies — TCS, Infosys, Wipro, Cognizant, Accenture, HCL, Amazon, Google, Microsoft, Flipkart, Zomato, Swiggy, Paytm, and 100+ more. The AI Roadmap generator creates a custom plan for any company you name."
            },
            {
              q: "I don't know any basics of aptitude or coding — can I still get placed?",
              a: "Absolutely! Skillora is designed for all levels — from complete beginners to experienced professionals. The Aptitude section has topic-wise practice with concept explanations (52 topics). The Coding section starts from basics. The AI Roadmap tells you exactly what to study and in what order."
            },
            {
              q: "I'm from a CS background but don't have good coding knowledge. What should I do?",
              a: "Start with the AI Roadmap — enter your target company and skill level. It will give you a step-by-step plan. Then use the Coding Assessment (500+ problems, Easy to Hard) and practice daily. Use the Mock Interview feature to practice explaining your approach. Consistency for 30-60 days is enough to crack most placements."
            },
            {
              q: "Will I get mock tests and test series?",
              a: "Yes! The Aptitude section has full mock tests (20Q, 30min timed) for Aptitude, Reasoning, and Verbal separately, plus a Full Mock test. Topic-wise practice tests are also available for all 52 topics with instant scoring and explanations."
            },
            {
              q: "Will I get a chance to face mock interviews?",
              a: "Yes — the AI Mock Interview feature gives you HR Round and Technical Round interviews. The AI asks real interview questions, evaluates your answers on confidence, communication, and technical depth, and gives you a grade (A/B/C/D) with detailed feedback. You can also practice in Voice Mode (speak your answers)."
            },
            {
              q: "Will I get a preparation plan for my target company?",
              a: "Yes! The AI Roadmap Generator creates a personalized, step-by-step preparation plan for any company and role. It includes a learning roadmap, resume tips specific to that company, and likely interview questions — all generated by AI in seconds."
            },
            {
              q: "Will I get previously asked questions from major companies?",
              a: "Yes — the Mock Interview section generates company-specific questions when you enter your target company (e.g., TCS, Amazon, Google). The Prep Hub also has company-specific preparation material. The AI generates the most commonly asked HR and Technical questions for each company."
            },
            {
              q: "What is the duration of preparation needed?",
              a: "It depends on your current level. For freshers with basics: 45-60 days of consistent daily practice (2-3 hours/day) is enough. For experienced candidates switching roles: 30 days is typically sufficient. Use the AI Roadmap to get a timeline personalized to your target company and current skill level."
            },
            {
              q: "Will I get resume help and ATS optimization?",
              a: "Yes — Skillora has two resume tools: (1) Resume Builder with 10+ ATS-friendly templates, and (2) ATS Analyzer that matches your resume to any job description and gives you a score, missing keywords, skill gaps, improvement tips, and a roadmap to close those gaps."
            },
            {
              q: "Is Skillora AI completely free?",
              a: "Yes — 100% free. No credit card required. No paywalls. All 10+ tools including AI Mock Interviews, Coding Judge, ATS Analyzer, LinkedIn Optimizer, GitHub Optimizer, Aptitude Tests, and Voice Coach are completely free. Just sign up and start."
            },
          ].map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24 w-full">
        <div className="relative card anim-border-glow overflow-hidden p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950/25 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-red-600/8 rounded-full blur-3xl pointer-events-none anim-float" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-red-700/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              100% Free · No Credit Card
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3">
              Ready to get <span className="text-gradient">placed?</span>
            </h2>
            <p className="text-zinc-500 mb-8 text-sm max-w-md mx-auto">
              Join students who are preparing smarter with AI. Start your journey today — every tool is completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="btn-red px-10 py-4 text-base flex items-center justify-center gap-2 glow-red">
                Create Free Account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </Link>
              <Link href="/login" className="btn-ghost px-10 py-4 text-base flex items-center justify-center gap-2">
                Explore Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <SkilloraLogo size={28} />
            <span className="font-bold"><span className="brand-skill">Skill</span><span className="brand-ora">ora</span></span>
            <span className="text-zinc-700 text-xs ml-1">© 2026 · Built to get you placed</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-600">
            {[{href:"/prep-hub",l:"Prep Hub"},{href:"/coding",l:"Coding"},{href:"/aptitude",l:"Aptitude"},{href:"/mock-interview",l:"Interview"},{href:"/resume-builder",l:"Resume Builder"},{href:"/skillmap",l:"SkillMap"},{href:"/login",l:"Sign In"},{href:"/register",l:"Register"}].map(n=>(
              <Link key={n.href} href={n.href} className="hover:text-zinc-300 transition-colors">{n.l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
