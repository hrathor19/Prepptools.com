"use client";

import { useState, useEffect, useRef } from "react";
import { X, Lightbulb } from "lucide-react";
import { tips } from "@/lib/tips-data";

const AUTO_DISMISS_MS = 15_000;
const NOTIF_KEY       = "prepptools_notif_date";

export default function MacNotification() {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);
  const [progress, setProgress] = useState(100);

  const timerRef    = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef    = useRef(false);

  const today = new Date().toDateString(); // e.g. "Wed May 07 2026"

  const tip = (() => {
    const d        = new Date();
    const dayOfYear = Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86_400_000,
    );
    return tips[dayOfYear % tips.length];
  })();

  function clearTimers() {
    if (timerRef.current)    clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function startCountdown() {
    let elapsed = 0;
    const tick  = 80;
    intervalRef.current = setInterval(() => {
      elapsed += tick;
      setProgress(Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100));
    }, tick);
    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
  }

  function showNotification() {
    if (firedRef.current) return;
    firedRef.current = true;
    localStorage.setItem(NOTIF_KEY, today);
    setVisible(true);
    startCountdown();
  }

  function dismiss() {
    clearTimers();
    setLeaving(true);
    setTimeout(() => setVisible(false), 380);
  }

  useEffect(() => {
    if (localStorage.getItem(NOTIF_KEY) === today) return;

    const t = setTimeout(showNotification, 800);
    return () => {
      clearTimeout(t);
      clearTimers();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed z-[9999] w-[360px] max-w-[calc(100vw-2rem)]"
      style={{
        top: "72px",
        right: "16px",
        animation: leaving
          ? "macSlideOut 0.38s cubic-bezier(0.4,0,0.6,1) forwards"
          : "macSlideIn 0.52s cubic-bezier(0.34,1.4,0.64,1) both",
      }}
    >
      <style>{`
        @keyframes macSlideIn {
          0%   { opacity: 0; transform: translateX(calc(100% + 28px)) scale(0.94); }
          55%  { opacity: 1; }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes macSlideOut {
          0%   { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(calc(100% + 28px)) scale(0.94); }
        }
      `}</style>

      <div
        className="relative overflow-hidden rounded-[18px]"
        style={{
          background: "rgba(255,255,255,0.84)",
          backdropFilter: "blur(48px) saturate(180%)",
          WebkitBackdropFilter: "blur(48px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.65)",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
        }}
      >
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-[2.5px] rounded-full bg-amber-400/70"
          style={{ width: `${progress}%`, transition: "width 80ms linear" }}
        />

        <div className="flex items-start gap-3 px-4 py-3.5">
          {/* Icon */}
          <div
            className="shrink-0 w-11 h-11 rounded-[12px] flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, #fbbf24 0%, #d97706 100%)",
              boxShadow: "0 2px 8px rgba(217,119,6,0.35)",
            }}
          >
            <Lightbulb className="w-5 h-5 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[10.5px] font-semibold text-gray-500 uppercase tracking-widest leading-none">
                PreppTools · Tip of the Day
              </span>
              <span className="text-[10px] text-gray-400 shrink-0">now</span>
            </div>
            <p className="text-[13px] leading-snug text-gray-800 line-clamp-3">{tip}</p>
          </div>

          {/* Close */}
          <button
            onClick={dismiss}
            className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-black/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
