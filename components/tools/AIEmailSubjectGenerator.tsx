"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const TONES = ["Urgent", "Curious", "Professional", "Friendly", "Bold"];
const PURPOSES = ["Newsletter", "Cold Outreach", "Sales / Promo", "Re-engagement", "Product Launch", "Event Invite"];

const TEMPLATES: Record<string, Record<string, string[]>> = {
  "Newsletter": {
    Urgent:       ["You need to read this before Monday", "This week's insight: don't miss it", "⚠️ New edition — action required"],
    Curious:      ["Have you thought about {topic} this way?", "What nobody tells you about {topic}", "The {topic} question worth asking"],
    Professional: ["This week in {topic}: key trends and takeaways", "{topic} — your weekly briefing", "The {topic} update you've been waiting for"],
    Friendly:     ["Hey! We've got something good this week 👋", "Quick note about {topic} (worth 2 mins)", "Your weekly {topic} roundup is here ☕"],
    Bold:         ["{topic}: no fluff, just signal", "Stop ignoring {topic}. Here's why.", "This changes everything about {topic}"],
  },
  "Cold Outreach": {
    Urgent:       ["Quick question before you close this tab", "I need 2 minutes — this is worth it", "Last attempt: {topic} for {audience}"],
    Curious:      ["Noticed something interesting about your {topic}", "Had an idea for {audience} — worth a chat?", "How is {audience} handling {topic}?"],
    Professional: ["Proposal for {audience}: {topic} improvement", "Re: growth opportunity in {topic}", "Connecting {audience} with a better {topic} approach"],
    Friendly:     ["Hey — had an idea for you re: {topic}", "Not a generic pitch (I promise) — {topic}", "Quick intro + something useful about {topic}"],
    Bold:         ["I'll double your {topic} in 30 days or work for free", "Your competitor is already doing this for {topic}", "{audience}: here's what's slowing you down"],
  },
  "Sales / Promo": {
    Urgent:       ["⏰ 24 hours left: {topic} deal ends tonight", "Last chance to get {topic} at this price", "Selling out fast — {topic} promo ending soon"],
    Curious:      ["What if you could {topic} without the hassle?", "Can {topic} really do that? (short answer: yes)", "The unexpected way {topic} helps {audience}"],
    Professional: ["{topic}: special pricing for {audience} — limited seats", "Your exclusive {topic} offer inside", "Introducing the new {topic} — see what changed"],
    Friendly:     ["Treat yourself 🎉 — {topic} is on sale", "We've been saving this {topic} deal just for you", "Hey! Great news about {topic} 👇"],
    Bold:         ["{topic} that pays for itself in week one", "Don't buy {topic} elsewhere until you see this", "The {topic} that {audience} can't stop talking about"],
  },
  "Re-engagement": {
    Urgent:       ["We're about to remove you from this list — please read", "Final notice: your {topic} access is expiring", "Don't lose what you built with {topic}"],
    Curious:      ["Is this still relevant to you?", "We've been thinking about you — here's why", "What happened? We miss you 👀"],
    Professional: ["Checking in: {topic} update for {audience}", "We've improved {topic} since you left", "Your {topic} account — here's what's new"],
    Friendly:     ["Hey, it's been a while! 👋 Want to reconnect?", "Miss us? We miss you. Here's something new.", "We saved your {topic} — come back anytime"],
    Bold:         ["You ghosted us. We're not mad. (okay, a little)", "Still thinking about {topic}? Read this first.", "{audience}: this is your sign to come back"],
  },
  "Product Launch": {
    Urgent:       ["We're live. {topic} is now available 🚀", "Announcing: {topic} — early access closes in 48h", "It's here — {topic} just launched"],
    Curious:      ["Something we've been working on for months…", "Big news. Hint: it involves {topic}", "You asked for {topic}. We built it."],
    Professional: ["Introducing {topic}: the new standard for {audience}", "Launch announcement: {topic} is now available", "{topic} v2.0 — what's new"],
    Friendly:     ["We did it! 🎉 {topic} is finally live", "Say hello to {topic} — we're so excited!", "This is the moment — {topic} is here!"],
    Bold:         ["{topic}: nothing like it. See for yourself.", "The {audience} tool nobody asked for — but everyone needed", "{topic} is here. Your excuses aren't."],
  },
  "Event Invite": {
    Urgent:       ["Only 20 seats left — {topic} event on {audience}", "RSVP closes tonight: {topic} webinar", "Don't miss it — {topic} event this week"],
    Curious:      ["What if you could learn {topic} live with experts?", "Ever wondered how top {audience} handle {topic}?", "Join us for something different: {topic}"],
    Professional: ["You're invited: {topic} masterclass for {audience}", "Save your seat — {topic} live session", "Registration open: {topic} summit"],
    Friendly:     ["Join us! 🎉 {topic} event for {audience}", "You're on the guest list for {topic} 🙌", "We'd love to see you at {topic} — RSVP inside"],
    Bold:         ["The {topic} event your competitors don't want you to attend", "One day. {topic}. Everything changes.", "No more excuses — {topic} is happening now"],
  },
};

function fillTemplate(template: string, topic: string, audience: string): string {
  return template
    .replace(/\{topic\}/g, topic || "your goals")
    .replace(/\{audience\}/g, audience || "your audience");
}

export default function AIEmailSubjectGenerator() {
  const [topic, setTopic]       = useState("");
  const [audience, setAudience] = useState("");
  const [purpose, setPurpose]   = useState("Newsletter");
  const [tone, setTone]         = useState("Curious");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [copied, setCopied]     = useState<number | null>(null);

  const isReady = topic.trim().length > 0;

  function generate() {
    if (!isReady) return;
    const raw = TEMPLATES[purpose]?.[tone] ?? TEMPLATES["Newsletter"]["Curious"];
    setSubjects(raw.map(t => fillTemplate(t, topic.trim(), audience.trim())));
  }

  function copy(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Topic / Product</label>
          <input type="text" placeholder="e.g. productivity tips, our new SaaS feature"
            value={topic} onChange={(e) => { setTopic(e.target.value); setSubjects([]); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Target Audience <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. marketers, startup founders"
            value={audience} onChange={(e) => { setAudience(e.target.value); setSubjects([]); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Purpose</label>
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map((p) => (
            <button key={p} onClick={() => { setPurpose(p); setSubjects([]); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${purpose === p ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{p}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button key={t} onClick={() => { setTone(t); setSubjects([]); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tone === t ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{t}</button>
          ))}
        </div>
      </div>

      <button onClick={generate} disabled={!isReady}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Generate Subject Lines
      </button>

      {subjects.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">3 Subject Lines — pick your favourite</p>
            <button onClick={generate} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>
          <div className="space-y-3">
            {subjects.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3">
                <p className="text-sm text-gray-800 dark:text-gray-100 flex-1">{s}</p>
                <button onClick={() => copy(s, i)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-fuchsia-600 shrink-0 transition-colors">
                  {copied === i ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === i ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            Tip: Subject lines under 50 characters perform best on mobile. Keep emojis at the front for maximum attention.
          </p>
        </div>
      )}
    </div>
  );
}
