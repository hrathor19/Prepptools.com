"use client";

import { useState, useEffect, useRef } from "react";

function playBeep(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, ctx.currentTime);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [label, setLabel] = useState("");
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const displayH = Math.floor(timeLeft / 3600).toString().padStart(2, "0");
  const displayM = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, "0");
  const displayS = (timeLeft % 60).toString().padStart(2, "0");
  const progress = total > 0 ? ((total - timeLeft) / total) * 100 : 0;

  function handleStart() {
    if (running) {
      setRunning(false);
      clearInterval(intervalRef.current!);
      return;
    }
    const t = hours * 3600 + minutes * 60 + seconds;
    if (t <= 0) return;
    if (timeLeft === 0 || finished) {
      setTimeLeft(t);
      setTotal(t);
      setFinished(false);
    }
    setRunning(true);
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
            playBeep(audioCtxRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function handleReset() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(0);
    setTotal(0);
    setFinished(false);
  }

  return (
    <div className="space-y-6">
      {/* Timer Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Timer Label (optional)</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. Study session, Cooking..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Time Inputs */}
      {!running && timeLeft === 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Hours", value: hours, set: setHours, max: 23 },
            { label: "Minutes", value: minutes, set: setMinutes, max: 59 },
            { label: "Seconds", value: seconds, set: setSeconds, max: 59 },
          ].map(({ label: lbl, value, set, max }) => (
            <div key={lbl} className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{lbl}</label>
              <input
                type="number"
                min={0}
                max={max}
                value={value}
                onChange={(e) => set(Math.min(max, Math.max(0, Number(e.target.value))))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Countdown Display */}
      {(running || timeLeft > 0 || finished) && (
        <div className="flex flex-col items-center gap-4 py-4">
          {label && <p className="text-gray-500 font-medium">{label}</p>}
          <div
            className={`text-7xl font-bold font-mono tracking-tight ${
              finished ? "text-red-500 animate-pulse" : "text-emerald-600"
            }`}
          >
            {displayH}:{displayM}:{displayS}
          </div>
          {finished && (
            <div className="text-2xl font-bold text-red-500 animate-pulse">Time&apos;s up!</div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0:00</span>
            <span>{Math.floor(total / 3600).toString().padStart(2, "0")}:{Math.floor((total % 3600) / 60).toString().padStart(2, "0")}:{(total % 60).toString().padStart(2, "0")}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleStart}
          className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
        >
          {running ? "Pause" : timeLeft > 0 && !finished ? "Resume" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
