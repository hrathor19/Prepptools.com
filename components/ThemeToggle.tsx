"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleClick = () => {
    if (phase !== "idle") return;
    setPhase("out");
    setTimeout(() => {
      toggle();
      setPhase("in");
      setTimeout(() => setPhase("idle"), 400);
    }, 300);
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  // Next icon (what we're switching TO) drives the visual
  const toLight = isDark;

  return (
    <button
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        // @ts-expect-error css variable
        "--pulse-color": toLight ? "rgba(251,191,36,0.5)" : "rgba(99,102,241,0.5)",
      }}
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        flex items-center justify-center
        overflow-hidden
        shadow-xl
        transition-all duration-500
        ${phase === "idle" ? "animate-[theme-pulse_0.6s_ease-out]" : ""}
        ${isDark
          ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/40"
          : "bg-gradient-to-br from-slate-700 to-indigo-900 shadow-indigo-500/30"
        }
        hover:scale-110 active:scale-95
      `}
    >
      {/* Sun scene — shown in dark mode (click to go light) */}
      {isDark && (
        <span
          style={{
            animation:
              phase === "out" ? "set 0.3s ease-in forwards" :
              phase === "in"  ? "rise 0.4s ease-out forwards" : "none",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <SunSVG />
        </span>
      )}

      {/* Moon scene — shown in light mode (click to go dark) */}
      {!isDark && (
        <span
          style={{
            animation:
              phase === "out" ? "set 0.3s ease-in forwards" :
              phase === "in"  ? "rise 0.4s ease-out forwards" : "none",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <MoonSVG />
        </span>
      )}
    </button>
  );
}

function SunSVG() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" fill="white" stroke="none" />
      <line x1="12" y1="2"  x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22"  x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12" x2="5"  y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonSVG() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      {/* Stars */}
      <circle cx="18" cy="5"  r="0.8" fill="white" opacity="0.9" />
      <circle cx="20" cy="9"  r="0.5" fill="white" opacity="0.7" />
      <circle cx="16" cy="3"  r="0.5" fill="white" opacity="0.8" />
    </svg>
  );
}
