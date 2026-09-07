"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SkilloraLogo from "@/components/SkilloraLogo";

type Theme = "dark" | "light";

export default function ThemeSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Theme | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const apply = (theme: Theme) => {
    setSelected(theme);
  };

  const confirm = () => {
    if (!selected) return;
    setConfirming(true);
    localStorage.setItem("skillora_theme", selected);
    document.documentElement.setAttribute("data-theme", selected);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  const themes = [
    {
      id: "dark" as Theme,
      label: "Dark",
      tagline: "Easy on the eyes",
      bg: "bg-[#080808]",
      preview: (
        <div className="w-full h-full bg-[#080808] rounded-xl overflow-hidden p-4 flex flex-col gap-2">
          {/* mock nav */}
          <div className="flex items-center justify-between mb-1">
            <div className="w-16 h-3 bg-red-600/80 rounded-full" />
            <div className="flex gap-1.5">
              <div className="w-8 h-3 bg-white/10 rounded-full" />
              <div className="w-12 h-3 bg-red-600/60 rounded-full" />
            </div>
          </div>
          {/* mock hero */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-32 h-4 bg-white/90 rounded-full" />
            <div className="w-20 h-4 bg-red-500/80 rounded-full" />
            <div className="w-24 h-2 bg-white/20 rounded-full mt-1" />
            <div className="flex gap-2 mt-2">
              <div className="w-14 h-5 bg-red-600 rounded-lg" />
              <div className="w-12 h-5 bg-white/10 rounded-lg border border-white/10" />
            </div>
          </div>
          {/* mock cards */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-10 bg-[#0f0f0f] border border-white/5 rounded-lg p-1.5">
                <div className="w-4 h-4 bg-red-500/20 rounded mb-1" />
                <div className="w-full h-1.5 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "light" as Theme,
      label: "Light",
      tagline: "Clean & bright",
      bg: "bg-[#f8f8f8]",
      preview: (
        <div className="w-full h-full bg-[#f8f8f8] rounded-xl overflow-hidden p-4 flex flex-col gap-2">
          {/* mock nav */}
          <div className="flex items-center justify-between mb-1">
            <div className="w-16 h-3 bg-red-600/90 rounded-full" />
            <div className="flex gap-1.5">
              <div className="w-8 h-3 bg-black/10 rounded-full" />
              <div className="w-12 h-3 bg-red-600/70 rounded-full" />
            </div>
          </div>
          {/* mock hero */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-32 h-4 bg-black/80 rounded-full" />
            <div className="w-20 h-4 bg-red-500/80 rounded-full" />
            <div className="w-24 h-2 bg-black/15 rounded-full mt-1" />
            <div className="flex gap-2 mt-2">
              <div className="w-14 h-5 bg-red-600 rounded-lg" />
              <div className="w-12 h-5 bg-black/8 rounded-lg border border-black/10" />
            </div>
          </div>
          {/* mock cards */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-10 bg-white border border-black/8 rounded-lg p-1.5 shadow-sm">
                <div className="w-4 h-4 bg-red-500/20 rounded mb-1" />
                <div className="w-full h-1.5 bg-black/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-red-700/5 rounded-full blur-[120px] pointer-events-none" />

      <div className={`relative z-10 w-full max-w-2xl transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Logo */}
        <div className="flex justify-center mb-8 anim-fade-up">
          <div className="flex items-center gap-3">
            <SkilloraLogo size={44} />
            <span className="text-2xl font-black tracking-tight">
              <span className="brand-skill">Skill</span>
              <span className="brand-ora">ora</span>
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 anim-fade-up delay-100">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Choose your <span className="text-gradient-animated">theme</span>
          </h1>
          <p className="text-zinc-500 text-sm">
            Pick how Skillora looks for you. You can change it anytime from settings.
          </p>
        </div>

        {/* Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {themes.map((theme, i) => {
            const isSelected = selected === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => apply(theme.id)}
                className={`relative group rounded-2xl overflow-hidden text-left transition-all duration-300 focus:outline-none anim-fade-up delay-${(i + 2) * 100} ${
                  isSelected
                    ? "ring-2 ring-red-500 shadow-2xl shadow-red-500/20 scale-[1.02]"
                    : "ring-1 ring-white/8 hover:ring-red-500/40 hover:scale-[1.01]"
                }`}
              >
                {/* Preview area */}
                <div className={`relative h-48 ${theme.bg} p-3`}>
                  {theme.preview}

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center shadow-lg anim-scale-pop">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Label area */}
                <div className={`px-5 py-4 flex items-center justify-between transition-colors duration-300 ${
                  isSelected ? "bg-red-600/10 border-t border-red-500/20" : "bg-[#0f0f0f] border-t border-white/5"
                }`}>
                  <div>
                    <p className={`font-bold text-base transition-colors ${isSelected ? "text-white" : "text-zinc-300"}`}>
                      {theme.label}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">{theme.tagline}</p>
                  </div>

                  {/* Theme icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isSelected ? "bg-red-500/20 border border-red-500/30" : "bg-white/5 border border-white/8"
                  }`}>
                    {theme.id === "dark" ? (
                      <svg className={`w-4 h-4 ${isSelected ? "text-red-400" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    ) : (
                      <svg className={`w-4 h-4 ${isSelected ? "text-red-400" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        <div className="flex flex-col items-center gap-3 anim-fade-up delay-400">
          <button
            onClick={confirm}
            disabled={!selected || confirming}
            className={`w-full max-w-xs btn-red py-3.5 flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${
              selected ? "glow-red opacity-100" : "opacity-40 cursor-not-allowed"
            }`}
          >
            {confirming ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Applying theme…
              </>
            ) : (
              <>
                Continue to Dashboard
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>

          {!selected && (
            <p className="text-zinc-700 text-xs">Select a theme to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
