"use client";

import { useState, useMemo } from "react";

interface Match {
  index: number;
  text: string;
  groups: (string | undefined)[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState("");

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: "" };
    try {
      // Always include 'g' for match-all; add 'd' only if available
      const f = flagString.includes("g") ? flagString : flagString + "g";
      return { regex: new RegExp(pattern, f), error: "" };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flagString]);

  const matches: Match[] = useMemo(() => {
    if (!regex || !testString) return [];
    const results: Match[] = [];
    let m: RegExpExecArray | null;
    regex.lastIndex = 0;
    while ((m = regex.exec(testString)) !== null) {
      results.push({
        index: m.index,
        text: m[0],
        groups: m.slice(1),
      });
      if (!flags.g) break;
      if (m[0].length === 0) regex.lastIndex++;
    }
    return results;
  }, [regex, testString, flags.g]);

  // Build highlighted segments
  const segments = useMemo(() => {
    if (!testString || matches.length === 0) {
      return [{ text: testString, highlight: false }];
    }
    const parts: { text: string; highlight: boolean }[] = [];
    let cursor = 0;
    for (const m of matches) {
      if (m.index > cursor) {
        parts.push({ text: testString.slice(cursor, m.index), highlight: false });
      }
      parts.push({ text: m.text, highlight: true });
      cursor = m.index + m.text.length;
    }
    if (cursor < testString.length) {
      parts.push({ text: testString.slice(cursor), highlight: false });
    }
    return parts;
  }, [testString, matches]);

  function toggleFlag(flag: "g" | "i" | "m") {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }

  return (
    <div className="space-y-6">
      {/* Pattern + flags row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Regex Pattern
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="e.g. \d+ or [a-z]+"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Flags
          </label>
          <div className="flex gap-2">
            {(["g", "i", "m"] as const).map((flag) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`px-3 py-2.5 rounded-xl text-sm font-mono font-semibold border transition-colors ${
                  flags[flag]
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                }`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 font-mono">
          Invalid regex: {error}
        </p>
      )}

      {/* Test string */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Test String
        </label>
        <textarea
          rows={5}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test the regex against…"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full font-mono"
        />
      </div>

      {/* Match count */}
      {pattern && !error && testString && (
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
            matches.length > 0
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {matches.length > 0
            ? `${matches.length} match${matches.length !== 1 ? "es" : ""} found`
            : "No matches"}
        </div>
      )}

      {/* Highlighted preview */}
      {testString && matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Highlighted Matches
          </label>
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
            {segments.map((seg, i) =>
              seg.highlight ? (
                <mark
                  key={i}
                  className="bg-yellow-300 text-gray-900 rounded px-0.5"
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Match list */}
      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Match Details
          </label>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div
                key={i}
                className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm flex flex-wrap gap-x-6 gap-y-1"
              >
                <span>
                  <span className="text-gray-400">#{i + 1}</span>
                </span>
                <span>
                  <span className="text-gray-400">index: </span>
                  {m.index}
                </span>
                <span>
                  <span className="text-gray-400">match: </span>
                  <span className="text-yellow-300">&quot;{m.text}&quot;</span>
                </span>
                {m.groups.length > 0 && m.groups[0] !== undefined && (
                  <span>
                    <span className="text-gray-400">groups: </span>
                    {m.groups.map((g, gi) => (
                      <span key={gi} className="text-purple-300 mr-2">
                        &quot;{g}&quot;
                      </span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
