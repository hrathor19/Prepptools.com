"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Settings, X } from "lucide-react";

type Phase = "work" | "shortBreak" | "longBreak";

const PHASE_LABELS: Record<Phase, string> = {
  work: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const PHASE_COLORS: Record<Phase, string> = {
  work: "text-emerald-600",
  shortBreak: "text-blue-500",
  longBreak: "text-purple-500",
};

const PHASE_STROKE: Record<Phase, string> = {
  work: "#059669",
  shortBreak: "#3b82f6",
  longBreak: "#8b5cf6",
};

function playBeep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.6);
}

const CIRCUMFERENCE = 2 * Math.PI * 90;

export default function PomodoroTimer() {
  const [durations, setDurations] = useState({ work: 25, shortBreak: 5, longBreak: 15 });
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [tempDurations, setTempDurations] = useState({ work: 25, shortBreak: 5, longBreak: 15 });
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = durations[phase] * 60;
  const progress = secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const switchPhase = useCallback((newPhase: Phase, newCompleted: number) => {
    setPhase(newPhase);
    setSecondsLeft(durations[newPhase] * 60);
    setRunning(false);
    setCompleted(newCompleted);
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    playBeep(audioCtxRef.current);
  }, [durations]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            const newCompleted = phase === "work" ? completed + 1 : completed;
            if (phase === "work") {
              if ((newCompleted) % 4 === 0) switchPhase("longBreak", newCompleted);
              else switchPhase("shortBreak", newCompleted);
            } else {
              switchPhase("work", newCompleted);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, completed, switchPhase]);

  function handleReset() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(durations[phase] * 60);
  }

  function handlePhaseSelect(p: Phase) {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase(p);
    setSecondsLeft(durations[p] * 60);
  }

  function saveSettings() {
    setDurations(tempDurations);
    setSecondsLeft(tempDurations[phase] * 60);
    setRunning(false);
    setShowSettings(false);
  }

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="space-y-6">
      {/* Phase Tabs */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        {(["work", "shortBreak", "longBreak"] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePhaseSelect(p)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              phase === p ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p === "work" ? "Focus" : p === "shortBreak" ? "Short Break" : "Long Break"}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <svg width="220" height="220" className="-rotate-90">
            <circle cx="110" cy="110" r="90" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="110" cy="110" r="90"
              fill="none"
              stroke={PHASE_STROKE[phase]}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold font-mono ${PHASE_COLORS[phase]}`}>{mins}:{secs}</span>
            <span className="text-sm text-gray-500 mt-1">{PHASE_LABELS[phase]}</span>
          </div>
        </div>

        {/* Pomodoro dots */}
        <div className="flex gap-2 items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full border-2 ${
                i < (completed % 4) ? "bg-emerald-500 border-emerald-500" : "border-gray-300 bg-white"
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">{completed} completed</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setRunning((r) => !r)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors w-32"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => { setTempDurations(durations); setShowSettings(true); }}
          className="bg-gray-100 text-gray-700 p-3 rounded-xl hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Timer Settings</h3>
              <button onClick={() => setShowSettings(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            {([["work", "Focus Duration (min)"], ["shortBreak", "Short Break (min)"], ["longBreak", "Long Break (min)"]] as [Phase, string][]).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={tempDurations[key]}
                  onChange={(e) => setTempDurations((d) => ({ ...d, [key]: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
            <button
              onClick={saveSettings}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
