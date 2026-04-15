"use client";
import { useState } from "react";

const DICE_FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function CoinFlip() {
  const [coinResult, setCoinResult] = useState<"heads" | "tails" | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ total: 0, heads: 0, tails: 0 });
  const [diceCount, setDiceCount] = useState(2);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  function flipCoin() {
    setFlipping(true);
    setTimeout(() => {
      const result = Math.random() > 0.5 ? "heads" : "tails";
      setCoinResult(result);
      setStats(s => ({ total: s.total + 1, heads: s.heads + (result === "heads" ? 1 : 0), tails: s.tails + (result === "tails" ? 1 : 0) }));
      setFlipping(false);
    }, 600);
  }

  function rollDice() {
    setRolling(true);
    setTimeout(() => {
      setDiceResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6)));
      setRolling(false);
    }, 400);
  }

  return (
    <div className="space-y-8">
      {/* Coin Flip */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Coin Flip</h3>
        <div className="flex flex-col items-center gap-4">
          <div
            className={`w-28 h-28 rounded-full border-4 flex items-center justify-center text-3xl font-bold select-none transition-all duration-300 ${
              flipping ? "animate-spin opacity-50" : ""
            } ${
              coinResult === "heads" ? "bg-yellow-100 border-yellow-400 text-yellow-700" :
              coinResult === "tails" ? "bg-slate-100 border-slate-400 text-slate-700" :
              "bg-gray-100 border-gray-300 text-gray-400"
            }`}>
            {flipping ? "?" : coinResult === "heads" ? "H" : coinResult === "tails" ? "T" : "?"}
          </div>
          {coinResult && !flipping && (
            <p className="text-lg font-bold capitalize text-gray-800">{coinResult}!</p>
          )}
          <button onClick={flipCoin} disabled={flipping}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors">
            Flip Coin
          </button>
          {stats.total > 0 && (
            <div className="flex gap-6 text-sm text-gray-600">
              <span>Flips: <strong>{stats.total}</strong></span>
              <span>Heads: <strong>{stats.heads}</strong></span>
              <span>Tails: <strong>{stats.tails}</strong></span>
              <span>H%: <strong>{Math.round(stats.heads / stats.total * 100)}%</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Dice Roller */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Dice Roller</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Number of dice:</label>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <button key={n} onClick={() => setDiceCount(n)}
              className={`w-8 h-8 rounded-lg border text-sm font-semibold transition-colors ${diceCount === n ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}>
              {n}
            </button>
          ))}
        </div>

        {diceResults.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center py-2">
            {diceResults.map((v, i) => (
              <span key={i} className={`text-5xl select-none transition-all ${rolling ? "opacity-0" : "opacity-100"}`}>
                {DICE_FACES[v]}
              </span>
            ))}
          </div>
        )}
        {diceResults.length > 0 && !rolling && (
          <p className="text-center text-sm font-semibold text-gray-700">
            Sum: <span className="text-emerald-600 text-lg">{diceResults.reduce((a, b) => a + b + 1, 0)}</span>
          </p>
        )}

        <div className="flex justify-center">
          <button onClick={rollDice} disabled={rolling}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors">
            Roll {diceCount} {diceCount === 1 ? "Die" : "Dice"}
          </button>
        </div>
      </div>
    </div>
  );
}
