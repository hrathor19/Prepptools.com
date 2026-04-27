"use client";

import { useState, useEffect, useCallback } from "react";

type BtnType = "num" | "op" | "fn" | "clear" | "del" | "eq" | "zero" | "paren";

interface Btn {
  label: string;
  value: string;
  type: BtnType;
  span?: number;
}

const ROWS: Btn[][] = [
  [
    { label: "sin",  value: "sin(",  type: "fn" },
    { label: "cos",  value: "cos(",  type: "fn" },
    { label: "tan",  value: "tan(",  type: "fn" },
    { label: "AC",   value: "C",     type: "clear" },
  ],
  [
    { label: "√",    value: "√(",    type: "fn" },
    { label: "log",  value: "log(",  type: "fn" },
    { label: "ln",   value: "ln(",   type: "fn" },
    { label: "⌫",    value: "⌫",     type: "del" },
  ],
  [
    { label: "π",    value: "π",     type: "fn" },
    { label: "e",    value: "ℯ",     type: "fn" },
    { label: "xʸ",   value: "^",     type: "fn" },
    { label: "÷",    value: "÷",     type: "op" },
  ],
  [
    { label: "7",    value: "7",     type: "num" },
    { label: "8",    value: "8",     type: "num" },
    { label: "9",    value: "9",     type: "num" },
    { label: "×",    value: "×",     type: "op" },
  ],
  [
    { label: "4",    value: "4",     type: "num" },
    { label: "5",    value: "5",     type: "num" },
    { label: "6",    value: "6",     type: "num" },
    { label: "−",    value: "−",     type: "op" },
  ],
  [
    { label: "1",    value: "1",     type: "num" },
    { label: "2",    value: "2",     type: "num" },
    { label: "3",    value: "3",     type: "num" },
    { label: "+",    value: "+",     type: "op" },
  ],
  [
    { label: "(",    value: "(",     type: "paren" },
    { label: ")",    value: ")",     type: "paren" },
    { label: ".",    value: ".",     type: "num" },
    { label: "=",    value: "=",     type: "eq" },
  ],
  [
    { label: "0",    value: "0",     type: "zero", span: 4 },
  ],
];

// Tokens that should be deleted as a whole unit on backspace
const MULTI_CHAR_TOKENS = ["sin(", "cos(", "tan(", "log(", "ln(", "√("];

// Values that replace the leading "0" rather than appending to it
const STARTS_EXPR = new Set(["sin(", "cos(", "tan(", "√(", "log(", "ln(", "(", "π", "ℯ"]);

function btnStyle(type: BtnType): string {
  switch (type) {
    case "clear":  return "bg-[#d4543a] hover:bg-[#e0604a] text-white";
    case "del":    return "bg-orange-500 hover:bg-orange-400 text-white";
    case "op":     return "bg-orange-500 hover:bg-orange-400 text-white text-2xl";
    case "eq":     return "bg-orange-500 hover:bg-orange-400 text-white text-2xl";
    case "fn":     return "bg-[#4a4a4a] hover:bg-[#5a5a5a] text-gray-100 text-[13px] font-medium";
    case "paren":  return "bg-[#4a4a4a] hover:bg-[#5a5a5a] text-gray-100 text-xl";
    case "zero":
    case "num":    return "bg-[#333333] hover:bg-[#444444] text-white text-2xl font-medium";
    default:       return "bg-[#333333] text-white";
  }
}

function evaluate(display: string): string {
  try {
    const expr = display
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-")
      .replace(/π/g, `(${Math.PI})`)
      .replace(/ℯ/g, `(${Math.E})`)
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/√\(/g, "Math.sqrt(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/\^/g, "**");
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ")")();
    if (!isFinite(result)) return "Error";
    return parseFloat(result.toFixed(10)).toString();
  } catch {
    return "Error";
  }
}

function smartBackspace(prev: string): string {
  if (prev === "0" || prev === "") return "0";
  for (const token of MULTI_CHAR_TOKENS) {
    if (prev.endsWith(token)) {
      const next = prev.slice(0, -token.length);
      return next || "0";
    }
  }
  const next = prev.slice(0, -1);
  return next || "0";
}

export default function ScientificCalculator() {
  const [display, setDisplay]             = useState("0");
  const [expression, setExpression]       = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleButton = useCallback((val: string) => {
    if (val === "C") {
      setDisplay("0");
      setExpression("");
      setJustEvaluated(false);
      return;
    }

    if (val === "⌫") {
      if (justEvaluated) {
        setDisplay("0");
        setExpression("");
        setJustEvaluated(false);
        return;
      }
      setDisplay(smartBackspace);
      return;
    }

    if (val === "=") {
      const result = evaluate(display);
      setExpression(display + " =");
      setDisplay(result);
      setJustEvaluated(true);
      return;
    }

    const isDigit = val.length === 1 && val >= "0" && val <= "9";
    const isDecimal = val === ".";

    // After evaluation: digit or decimal starts fresh; operator/function continues from result
    if (justEvaluated) {
      setJustEvaluated(false);
      if (isDigit) {
        setDisplay(val);
        setExpression("");
        return;
      }
      if (isDecimal) {
        setDisplay("0.");
        setExpression("");
        return;
      }
      // operator or function continues chaining from result — fall through
    }

    setDisplay((prev) => {
      // Replace leading "0" for digits (but keep for "0.")
      if (prev === "0" && isDigit) return val;
      // Replace leading "0" for expressions that start fresh (sin(, π, etc.)
      if (prev === "0" && STARTS_EXPR.has(val)) return val;
      // Prevent double decimal in the current number segment
      if (isDecimal) {
        const lastOp = Math.max(
          prev.lastIndexOf("+"), prev.lastIndexOf("−"),
          prev.lastIndexOf("×"), prev.lastIndexOf("÷"),
          prev.lastIndexOf("("), prev.lastIndexOf("^"),
        );
        const currentSegment = prev.slice(lastOp + 1);
        if (currentSegment.includes(".")) return prev;
      }
      return prev + val;
    });
  }, [display, justEvaluated]);

  // Keyboard support
  useEffect(() => {
    const MAP: Record<string, string> = {
      "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
      ".":".", "+":"+", "-":"−", "*":"×", "/":"÷", "^":"^",
      "(":"(", ")":")",
      "Enter":"=", "=":"=",
      "Backspace":"⌫", "Escape":"C",
    };
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const mapped = MAP[e.key];
      if (mapped) { e.preventDefault(); handleButton(mapped); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleButton]);

  // Auto-shrink font based on display length
  const fontSize =
    display.length > 18 ? "1.2rem" :
    display.length > 12 ? "1.7rem" :
    display.length > 8  ? "2.2rem" : "3rem";

  return (
    <div className="flex justify-center">
      <div
        className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl select-none"
        style={{ background: "#1c1c1e" }}
      >
        {/* ── Display ── */}
        <div className="px-5 pt-6 pb-3 text-right min-h-[120px] flex flex-col justify-end gap-1">
          <p className="text-gray-500 text-sm min-h-[20px] truncate">
            {expression || " "}
          </p>
          <p
            className="text-white font-light break-all leading-tight"
            style={{ fontSize, lineHeight: 1.15 }}
          >
            {display}
          </p>
        </div>

        {/* ── Buttons ── */}
        <div className="px-3 pb-5 space-y-[10px]">
          {ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-[10px]">
              {row.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleButton(btn.value)}
                  style={btn.span ? { gridColumn: `span ${btn.span}` } : undefined}
                  className={[
                    "h-[68px] rounded-full flex items-center",
                    "transition-all duration-75 active:scale-95 active:brightness-75",
                    btnStyle(btn.type),
                    btn.span === 4 ? "justify-start pl-8" : "justify-center",
                  ].join(" ")}
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
