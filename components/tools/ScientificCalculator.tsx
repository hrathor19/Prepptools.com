"use client";

import { useState } from "react";

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);

  function handleButton(val: string) {
    if (val === "C") {
      setDisplay("0");
      setExpression("");
      setJustEvaluated(false);
      return;
    }

    if (val === "⌫") {
      if (justEvaluated) { setDisplay("0"); setJustEvaluated(false); return; }
      const next = display.length > 1 ? display.slice(0, -1) : "0";
      setDisplay(next);
      return;
    }

    if (val === "=") {
      try {
        const expr = display
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/π/g, String(Math.PI))
          .replace(/e/g, String(Math.E))
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/√\(/g, "Math.sqrt(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/ln\(/g, "Math.log(")
          .replace(/\^/g, "**");
        // eslint-disable-next-line no-new-func
        const result = Function('"use strict"; return (' + expr + ")")();
        const resultStr = parseFloat(result.toFixed(10)).toString();
        setExpression(display + " =");
        setDisplay(resultStr);
        setJustEvaluated(true);
      } catch {
        setDisplay("Error");
        setJustEvaluated(true);
      }
      return;
    }

    if (justEvaluated && !isNaN(Number(val))) {
      setDisplay(val);
      setExpression("");
      setJustEvaluated(false);
      return;
    }

    if (justEvaluated) {
      setJustEvaluated(false);
    }

    if (display === "0" && !isNaN(Number(val))) {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  }

  const buttons = [
    ["sin(", "cos(", "tan(", "C"],
    ["√(", "log(", "ln(", "⌫"],
    ["π", "e", "^", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", ".", "(", ")"],
    ["="],
  ];

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
        {/* Display */}
        <div className="bg-gray-800 rounded-xl p-4 mb-4 text-right">
          <p className="text-gray-400 text-sm h-5 truncate">{expression}</p>
          <p className="text-white text-3xl font-mono mt-1 truncate">{display}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          {buttons.map((row, ri) => (
            <div key={ri} className={`grid gap-2 ${row.length === 1 ? "grid-cols-1" : `grid-cols-${row.length}`}`}>
              {row.map((btn) => {
                const isOp = ["÷", "×", "−", "+"].includes(btn);
                const isEq = btn === "=";
                const isFunc = ["sin(", "cos(", "tan(", "√(", "log(", "ln(", "π", "e"].includes(btn);
                return (
                  <button
                    key={btn}
                    onClick={() => handleButton(btn)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-colors active:scale-95 ${
                      isEq
                        ? "bg-blue-600 text-white hover:bg-blue-700 col-span-4"
                        : isOp
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : isFunc
                        ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                        : btn === "C"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : btn === "⌫"
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
