"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function SalaryScript() {
  const [offer, setOffer]         = useState("");
  const [expected, setExpected]   = useState("");
  const [experience, setExperience] = useState("");
  const [role, setRole]           = useState("");
  const [script, setScript]       = useState("");
  const [copied, setCopied]       = useState(false);

  function generate() {
    const offerNum    = parseFloat(offer);
    const expectNum   = parseFloat(expected);
    if (isNaN(offerNum) || isNaN(expectNum) || !role.trim()) return;

    const diff      = Math.round(((expectNum - offerNum) / offerNum) * 100);
    const midpoint  = Math.round((offerNum + expectNum) / 2);
    const expLine   = experience ? ` With ${experience} years of experience in this domain,` : "";

    const scriptText = `Thank you so much for the offer — I'm genuinely excited about this opportunity and the team.

I've done some research on market rates for ${role.trim()} roles at this level, and I was hoping we could discuss the compensation a bit.${expLine} I was expecting something closer to ₹${expectNum.toLocaleString("en-IN")} LPA based on what I've seen in the market and the scope of the role.

I understand there may be constraints, so if ₹${expectNum.toLocaleString("en-IN")} isn't possible right now, would you be open to meeting in the middle at around ₹${midpoint.toLocaleString("en-IN")} LPA? ${diff > 20 ? "I'd also be happy to discuss other elements of the package — performance bonus, equity, or an early review after 6 months." : "I want to make sure we both feel good about moving forward."}

I'm very keen to join the team and I want to make this work. Is there flexibility here?`;

    setScript(scriptText);
  }

  function copy() {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details and get a professional, proven salary negotiation script you can use in your next conversation.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Offer Received (LPA)</label>
          <input
            type="number" min="0" placeholder="e.g. 12"
            value={offer} onChange={(e) => { setOffer(e.target.value); setScript(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Expected CTC (LPA)</label>
          <input
            type="number" min="0" placeholder="e.g. 16"
            value={expected} onChange={(e) => { setExpected(e.target.value); setScript(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Job Role / Title</label>
          <input
            type="text" placeholder="e.g. Senior Software Engineer"
            value={role} onChange={(e) => { setRole(e.target.value); setScript(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Years of Experience</label>
          <input
            type="number" min="0" max="40" placeholder="e.g. 5"
            value={experience} onChange={(e) => { setExperience(e.target.value); setScript(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!offer || !expected || !role}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Generate My Negotiation Script
      </button>

      {script && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your Negotiation Script</p>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line">{script}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            Tip: Deliver this conversationally — don't read it word for word. Pause after the ask and let the silence work for you.
          </p>
        </div>
      )}
    </div>
  );
}
