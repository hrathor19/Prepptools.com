"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RotateCcw, ChevronDown } from "lucide-react";

// ─── Sample texts by difficulty ──────────────────────────────────────────────
const TEXTS: Record<string, string[]> = {
  easy: [
    "The quick brown fox jumps over the lazy dog. She sells sea shells by the sea shore. A stitch in time saves nine.",
    "All that glitters is not gold. Every cloud has a silver lining. Better late than never. Actions speak louder than words.",
    "The sun rises in the east and sets in the west. Birds fly south for the winter. Spring brings flowers and rain.",
    "Practice makes perfect. Hard work pays off in the end. Stay focused and never give up on your goals.",
  ],
  medium: [
    "Success is not final and failure is not fatal. It is the courage to continue that truly counts in life. Never stop learning because life never stops teaching.",
    "In the middle of every difficulty lies opportunity. Life is what happens when you are busy making other plans. Dream big and work hard every single day.",
    "The secret of getting ahead is getting started. You don't have to be great to start, but you have to start to be great.",
    "Technology is best when it brings people together. The internet has changed the way we communicate, learn, and share information across the globe.",
  ],
  hard: [
    "The implementation of asynchronous functions in JavaScript relies on the event loop, promises, and the async/await syntax introduced in ECMAScript 2017, which significantly simplified callback-heavy code patterns.",
    "Photosynthesis converts electromagnetic radiation from the sun into chemical energy stored in glucose molecules through light-dependent and light-independent reactions occurring within the chloroplasts of plant cells.",
    "The algorithm's time complexity of O(n log n) makes it significantly more efficient than the naive O(n²) approach for large datasets. Developers should always benchmark before premature optimization.",
    "Quantum entanglement describes a phenomenon where two or more particles become interconnected such that the quantum state of each particle cannot be described independently of the others, regardless of distance.",
  ],
};

type Difficulty = "easy" | "medium" | "hard";
type Status = "idle" | "running" | "finished";

// ─── Stats bar item ───────────────────────────────────────────────────────────
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl min-w-[80px]">
      <span className={`text-2xl font-bold tabular-nums ${accent ?? "text-gray-900 dark:text-white"}`}>
        {value}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">{label}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TypingSpeedTest() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [targetText, setTargetText] = useState("");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);          // seconds
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [showDiffMenu, setShowDiffMenu] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const diffMenuRef = useRef<HTMLDivElement>(null);

  // ── Pick a random text for the chosen difficulty ──────────────────────────
  const pickText = useCallback((diff: Difficulty) => {
    const list = TEXTS[diff];
    return list[Math.floor(Math.random() * list.length)];
  }, []);

  // ── Initialise / reset ────────────────────────────────────────────────────
  const reset = useCallback((diff: Difficulty = difficulty) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTargetText(pickText(diff));
    setTyped("");
    setStatus("idle");
    setElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [difficulty, pickText]);

  useEffect(() => { reset(difficulty); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close diff menu on outside click ─────────────────────────────────────
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (diffMenuRef.current && !diffMenuRef.current.contains(e.target as Node)) {
        setShowDiffMenu(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── Live WPM / accuracy calculation ──────────────────────────────────────
  const calcStats = useCallback((typedStr: string, secs: number) => {
    if (!typedStr.length) return;

    let correct = 0;
    let errs = 0;
    for (let i = 0; i < typedStr.length; i++) {
      typedStr[i] === targetText[i] ? correct++ : errs++;
    }

    const minutes = secs / 60 || 0.001;
    const currentWpm = Math.round((correct / 5) / minutes);
    const currentAccuracy = Math.round((correct / typedStr.length) * 100);

    setWpm(Math.max(0, currentWpm));
    setAccuracy(currentAccuracy);
    setErrors(errs);
  }, [targetText]);

  // ── Handle typing ─────────────────────────────────────────────────────────
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;

    // Don't allow typing past the target text length
    if (value.length > targetText.length) return;

    // Start timer on first keystroke
    if (status === "idle" && value.length === 1) {
      startTimeRef.current = Date.now();
      setStatus("running");
      intervalRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(secs);
        calcStats(value, secs);  // pass current value via closure issue — use ref instead
      }, 500);
    }

    setTyped(value);

    const secs = status === "running"
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;
    calcStats(value, Math.max(secs, 1));

    // Finished?
    if (value.length === targetText.length) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const finalSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsed(finalSecs);
      calcStats(value, Math.max(finalSecs, 1));
      setStatus("finished");
    }
  }

  // ── Format elapsed time ───────────────────────────────────────────────────
  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  // ── Difficulty config ─────────────────────────────────────────────────────
  const diffConfig: Record<Difficulty, { label: string; color: string }> = {
    easy:   { label: "Easy",   color: "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" },
    medium: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400" },
    hard:   { label: "Hard",   color: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" },
  };

  function changeDifficulty(d: Difficulty) {
    setDifficulty(d);
    setShowDiffMenu(false);
    reset(d);
  }

  // ── Accuracy colour ───────────────────────────────────────────────────────
  const accColor = accuracy >= 95 ? "text-green-600 dark:text-green-400"
    : accuracy >= 80 ? "text-amber-600 dark:text-amber-400"
    : "text-red-500 dark:text-red-400";

  // ── WPM rating ────────────────────────────────────────────────────────────
  function wpmRating(w: number) {
    if (w >= 80) return { label: "Expert",      color: "text-purple-600 dark:text-purple-400" };
    if (w >= 60) return { label: "Advanced",    color: "text-blue-600 dark:text-blue-400" };
    if (w >= 40) return { label: "Intermediate",color: "text-green-600 dark:text-green-400" };
    if (w >= 20) return { label: "Beginner",    color: "text-amber-600 dark:text-amber-400" };
    return               { label: "Novice",      color: "text-gray-500 dark:text-gray-400" };
  }

  const rating = wpmRating(wpm);

  // ── Character-level rendering ─────────────────────────────────────────────
  function renderText() {
    return targetText.split("").map((char, i) => {
      let cls = "text-gray-300 dark:text-gray-600"; // not yet typed
      if (i < typed.length) {
        cls = typed[i] === char
          ? "text-gray-800 dark:text-gray-100"         // correct
          : char === " "
            ? "bg-red-200 dark:bg-red-900/50 text-gray-800 dark:text-gray-100 rounded" // wrong space
            : "text-red-500 dark:text-red-400";          // wrong char
      }
      const isCursor = i === typed.length && status !== "finished";
      return (
        <span
          key={i}
          className={`${cls} ${isCursor ? "border-l-2 border-blue-500 animate-pulse" : ""} leading-relaxed`}
        >
          {char}
        </span>
      );
    });
  }

  return (
    <div className="space-y-5">

      {/* ── Top bar: difficulty + new text ── */}
      <div className="flex items-center justify-between">
        <div className="relative" ref={diffMenuRef}>
          <button
            onClick={() => setShowDiffMenu((v) => !v)}
            className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg border ${diffConfig[difficulty].color} transition-colors`}
          >
            {diffConfig[difficulty].label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showDiffMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden min-w-[120px]">
              {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => changeDifficulty(d)}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    difficulty === d ? diffConfig[d].color + " font-semibold" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {diffConfig[d].label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => reset(difficulty)}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> New Text
        </button>
      </div>

      {/* ── Live stats ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <Stat label="WPM" value={wpm} accent="text-blue-600 dark:text-blue-400" />
        <Stat label="Accuracy" value={`${accuracy}%`} accent={accColor} />
        <Stat label="Errors" value={errors} accent={errors > 0 ? "text-red-500 dark:text-red-400" : "text-gray-900 dark:text-white"} />
        <Stat label="Time" value={status === "idle" ? "–" : formatTime(elapsed)} />
      </div>

      {/* ── Text display ── */}
      <div
        className="relative bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <p className="font-mono text-lg leading-relaxed tracking-wide select-none break-words">
          {renderText()}
        </p>

        {/* Idle overlay */}
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-[1px]">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Click here or start typing to begin
            </p>
          </div>
        )}
      </div>

      {/* ── Hidden textarea (captures all keyboard input) ── */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        disabled={status === "finished"}
        className="opacity-0 absolute w-0 h-0 pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Typing input"
      />

      {/* ── Progress bar ── */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-200"
          style={{ width: `${targetText ? (typed.length / targetText.length) * 100 : 0}%` }}
        />
      </div>

      {/* ── Finished result card ── */}
      {status === "finished" && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center space-y-4">
          <div>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">{wpm} WPM</p>
            <p className={`text-sm font-semibold mt-1 ${rating.color}`}>{rating.label}</p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div>
              <p className={`text-xl font-bold ${accColor}`}>{accuracy}%</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Accuracy</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{errors}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Errors</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{formatTime(elapsed)}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Time</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => reset(difficulty)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            {(["easy", "medium", "hard"] as Difficulty[]).filter(d => d !== difficulty).slice(0, 1).map(d => (
              <button
                key={d}
                onClick={() => changeDifficulty(d)}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-600 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Try {diffConfig[d].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Tip ── */}
      {status === "idle" && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Average typing speed is 40 WPM. Professional typists hit 65–75 WPM. Aim for 80+ WPM!
        </p>
      )}
    </div>
  );
}
