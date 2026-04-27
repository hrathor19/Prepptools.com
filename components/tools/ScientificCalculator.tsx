"use client";

import { useState } from "react";

type BtnType = "num" | "op" | "fn" | "clear" | "del" | "eq" | "zero";

interface Btn {
  label: string;
  value: string;
  type: BtnType;
  span?: number;
}

const ROWS: Btn[][] = [
  [
    { label: "sin", value: "sin(", type: "fn" },
    { label: "cos", value: "cos(", type: "fn" },
    { label: "tan", value: "tan(", type: "fn" },
    { label: "AC",  value: "C",    type: "clear" },
  ],
  [
    { label: "√",   value: "√(",   type: "fn" },
    { label: "log", value: "log(", type: "fn" },
    { label: "ln",  value: "ln(",  type: "fn" },
    { label: "⌫",   value: "⌫",    type: "del" },
  ],
  [
    { label: "π",   value: "π",    type: "fn" },
    { label: "e",   value: "e",    type: "fn" },
    { label: "xʸ",  value: "^",    type: "fn" },
    { label: "÷",   value: "÷",    type: "op" },
  ],
  [
    { label: "7",   value: "7",    type: "num" },
    { label: "8",   value: "8",    type: "num" },
    { label: "9",   value: "9",    type: "num" },
    { label: "×",   value: "×",    type: "op" },
  ],
  [
    { label: "4",   value: "4",    type: "num" },
    { label: "5",   value: "5",    type: "num" },
    { label: "6",   value: "6",    type: "num" },
    { label: "−",   value: "−",    type: "op" },
  ],
  [
    { label: "1",   value: "1",    type: "num" },
    { label: "2",   value: "2",    type: "num" },
    { label: "3",   value: "3",    type: "num" },
    { label: "+",   value: "+",    type: "op" },
  ],
  [
    { label: "0",   value: "0",    type: "zero", span: 2 },
    { label: ".",   value: ".",    type: "num" },
    { label: "=",   value: "=",    type: "eq" },
  ],
];

function btnStyle(type: BtnType): string {
  switch (type) {
    case "clear": return "bg-red-500 hover:bg-red-400 text-white";
    case "del":   return "bg-orange-500 hover:bg-orange-400 text-white";
    case "op":    return "bg-orange-500 hover:bg-orange-400 text-white text-xl font-semibold";
    case "eq":    return "bg-orange-500 hover:bg-orange-400 text-white text-xl font-semibold";
    case "fn":    return "bg-[#4a4a4a] hover:bg-[#5a5a5a] text-gray-100 text-[13px]";
    case "zero":
    case "num":   return "bg-[#333333] hover:bg-[#444444] text-white text-xl font-medium";
    default:      return "bg-[#333333] text-white";
  }
}

export default function ScientificCalculator() {
  const [display, setDisplay]           = useState("0");
  const [expression, setExpression]     = useState("");
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
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }

    if (val === "=") {
      try {
        const expr = display
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-")
          .replace(/π/g, String(Math.PI))
          .replace(/e(?!\d)/g, String(Math.E))
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
    if (justEvaluated) setJustEvaluated(false);

    if (display === "0" && !isNaN(Number(val)) && val !== ".") {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  }

  return (
    <div className="flex justify-center">
      <div
        className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#1c1c1e" }}
      >
        {/* ── Display ── */}
        <div className="px-5 pt-6 pb-4 text-right min-h-[110px] flex flex-col justify-end">
          <p className="text-gray-500 text-sm h-5 truncate mb-1">{expression}</p>
          <p
            className="text-white font-light truncate"
            style={{ fontSize: display.length > 12 ? "1.8rem" : "3rem", lineHeight: 1.1 }}
          >
            {display}
          </p>
        </div>

        {/* ── Button grid ── */}
        <div className="px-3 pb-5 space-y-2">
          {ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-2">
              {row.map((btn) => (
                <button
                  key={btn.value + btn.label}
                  onClick={() => handleButton(btn.value)}
                  style={btn.span ? { gridColumn: `span ${btn.span}` } : undefined}
                  className={`
                    h-[68px] rounded-full
                    flex items-center justify-center
                    text-lg select-none
                    transition-all duration-75 active:scale-95 active:opacity-80
                    ${btnStyle(btn.type)}
                    ${btn.span === 2 ? "justify-start pl-7" : ""}
                  `}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
