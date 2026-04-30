"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const PLATFORMS = ["Instagram", "Twitter / X", "LinkedIn", "GitHub", "YouTube"];
const TONES = ["Professional", "Witty", "Inspiring", "Casual", "Bold"];

function generateBio(name: string, role: string, skills: string, platform: string, tone: string): string {
  const n = name.trim() || "I";
  const r = role.trim() || "creator";
  const skillArr = skills.split(",").map(s => s.trim()).filter(Boolean);
  const s1 = skillArr[0] ?? "problem-solving";
  const s2 = skillArr[1] ?? "innovation";
  const s3 = skillArr[2] ?? "great work";

  const bios: Record<string, Record<string, string>> = {
    "Instagram": {
      Professional: `${r} | Passionate about ${s1} & ${s2}\n📍 Building things that matter\n💼 Open to collaborations\n👇 Work & contact`,
      Witty:        `Part ${r}, part coffee addict ☕\nI ${s1} for fun (and money)\nHere for the good vibes + ${s2} 🌀\nDMs open, judge-free zone`,
      Inspiring:    `${n} • ${r} on a mission 🚀\nTurning ${s1} into impact\nBelieve in ${s2} every day\n✨ Your story isn't over yet`,
      Casual:       `just a ${r} figuring things out 🤷\nlove ${s1}, ${s2}, and long walks through Twitter\nhmu for collabs or just to chat 💬`,
      Bold:         `${r.toUpperCase()}. ${s1.toUpperCase()}. ${s2.toUpperCase()}.\nI don't do average.\nDMs open if you're serious. 🔥`,
    },
    "Twitter / X": {
      Professional: `${r} | Writing about ${s1}, ${s2}, and ${s3}. Building in public. Views my own.`,
      Witty:        `${r} by day, overthinker by night. Tweets about ${s1} & ${s2}. Mostly harmless.`,
      Inspiring:    `${r} chasing ${s1}. Documenting the journey. Sharing everything I learn about ${s2}. Let's grow together. 🌱`,
      Casual:       `${r}. Love ${s1}. Bad at ${s2} (working on it). Always online.`,
      Bold:         `${r}. I write about ${s1}. No fluff. If that bothers you — unfollow. Everyone else: welcome. 🤝`,
    },
    "LinkedIn": {
      Professional: `${r} specialising in ${s1} and ${s2}.\n\nHelping teams ${s3} through strategic thinking, clear communication, and a bias for action.\n\nOpen to new opportunities and meaningful conversations. Let's connect.`,
      Witty:        `${r} who ${s1}s for a living. Also known to ${s2} under pressure.\n\nI write about the intersection of ${s3} and real-world impact.\n\nFun fact: I've never actually read my own LinkedIn bio. Until now, apparently.`,
      Inspiring:    `I believe that great ${s1} changes lives.\n\nAs a ${r}, I've dedicated my career to ${s2} — and helping others do the same.\n\nIf you're building something meaningful, I'd love to connect.`,
      Casual:       `${r} who loves ${s1}, ${s2}, and being genuinely helpful.\n\nCurrently exploring ${s3}. Always learning. Usually caffeinated.\n\nLet's connect — I promise I don't send cold pitches.`,
      Bold:         `${r}. I specialise in ${s1}.\n\nMost people overcomplicate ${s2}. I make it simple.\n\nIf you want ${s3}, my DMs are open.`,
    },
    "GitHub": {
      Professional: `${r} | Focused on ${s1} and ${s2}. Building open-source tools. Check my pinned repos. ⭐`,
      Witty:        `${r} who writes ${s1} code (sometimes) and breaks things on purpose. Also into ${s2}. Stars appreciated 😅`,
      Inspiring:    `${r} building with ${s1}. Believer in open source and ${s2}. Sharing everything I learn. ⚡`,
      Casual:       `just here to ${s1} and ${s2}. mostly ${s2}. don't judge my commit messages.`,
      Bold:         `${r}. ${s1}. ${s2}. Clean code or don't commit. 🚀`,
    },
    "YouTube": {
      Professional: `${r} creating content about ${s1} and ${s2}.\nNew videos every week. Subscribe for ${s3}. 🎬`,
      Witty:        `Making videos about ${s1} so you don't have to Google it yourself 😂\nAlso ${s2}. Sometimes ${s3}. Subscribe!`,
      Inspiring:    `${r} on a mission to simplify ${s1}.\nI believe ${s2} can change your life — let me show you how.\nNew video every week 🎥`,
      Casual:       `hey! I'm ${n}, making videos about ${s1} and ${s2}.\nnew video every [insert optimistic schedule here]. subscribe if you vibe with it 🙌`,
      Bold:         `${r.toUpperCase()} • ${s1.toUpperCase()} • ${s2.toUpperCase()}\nNo filler. Just value.\nSubscribe or don't. Your loss. 🔥`,
    },
  };

  return bios[platform]?.[tone] ?? bios["Instagram"]["Professional"];
}

export default function AIBioGenerator() {
  const [name, setName]         = useState("");
  const [role, setRole]         = useState("");
  const [skills, setSkills]     = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone]         = useState("Professional");
  const [bio, setBio]           = useState("");
  const [copied, setCopied]     = useState(false);

  const isReady = role && skills;

  function generate() {
    if (!isReady) return;
    setBio(generateBio(name, role, skills, platform, tone));
  }

  function copy() {
    navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. Priya, Alex"
            value={name} onChange={(e) => { setName(e.target.value); setBio(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role / Profession</label>
          <input type="text" placeholder="e.g. UX Designer, Marketing Manager, Developer"
            value={role} onChange={(e) => { setRole(e.target.value); setBio(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Key Skills / Interests (comma-separated)</label>
        <input type="text" placeholder="e.g. product design, user research, Figma"
          value={skills} onChange={(e) => { setSkills(e.target.value); setBio(""); }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((pl) => (
            <button key={pl} onClick={() => { setPlatform(pl); setBio(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${platform === pl ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{pl}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button key={t} onClick={() => { setTone(t); setBio(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${tone === t ? "bg-fuchsia-600 text-white border-fuchsia-600" : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400"}`}
            >{t}</button>
          ))}
        </div>
      </div>

      <button onClick={generate} disabled={!isReady}
        className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Generate Bio
      </button>

      {bio && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your {platform} Bio</p>
            <div className="flex gap-2">
              <button onClick={generate} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-fuchsia-600 transition-colors">
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">{bio}</pre>
          <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            Tip: Add a link, emoji, or location line to make your bio feel more complete and personal.
          </p>
        </div>
      )}
    </div>
  );
}
