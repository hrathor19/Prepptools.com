"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";

const TONES = ["Professional", "Enthusiastic", "Confident", "Concise"];

function generateLetter({
  name, role, company, experience, skills, achievement, tone,
}: {
  name: string; role: string; company: string;
  experience: string; skills: string; achievement: string; tone: string;
}): string {
  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const skillStr  = skillList.length > 1
    ? `${skillList.slice(0, -1).join(", ")} and ${skillList[skillList.length - 1]}`
    : skillList[0] ?? "relevant skills";

  const openers: Record<string, string> = {
    Professional:  `I am writing to express my interest in the ${role} position at ${company}.`,
    Enthusiastic:  `I was genuinely excited to come across the ${role} opportunity at ${company} — it's exactly the kind of role I've been building towards.`,
    Confident:     `With ${experience} years of hands-on experience, I am confident I would make an immediate impact as ${role} at ${company}.`,
    Concise:       `I am applying for the ${role} role at ${company}.`,
  };

  const closers: Record<string, string> = {
    Professional:  `I would welcome the opportunity to discuss how my background aligns with your needs. Thank you for your time and consideration.`,
    Enthusiastic:  `I'd love to bring this energy and experience to ${company}. I'd be thrilled to connect and learn more about the team. Thank you!`,
    Confident:     `I am ready to hit the ground running and make a measurable impact from day one. I look forward to speaking with you.`,
    Concise:       `I'd welcome a conversation at your convenience. Thank you.`,
  };

  return `Dear Hiring Manager,

${openers[tone] ?? openers["Professional"]}

With ${experience} years of experience, I bring a strong foundation in ${skillStr}. ${
    achievement
      ? `In my most recent role, ${achievement}.`
      : `Throughout my career, I have consistently delivered results by applying these skills in real-world environments.`
  }

What draws me to ${company} is the opportunity to contribute to a team that values ${tone === "Enthusiastic" ? "innovation and growth" : "quality and impact"}. I am eager to bring my expertise to a role where I can make a meaningful contribution from day one.

${closers[tone] ?? closers["Professional"]}

Sincerely,
${name}`;
}

export default function CoverLetterGenerator() {
  const [name, setName]               = useState("");
  const [role, setRole]               = useState("");
  const [company, setCompany]         = useState("");
  const [experience, setExperience]   = useState("");
  const [skills, setSkills]           = useState("");
  const [achievement, setAchievement] = useState("");
  const [tone, setTone]               = useState("Professional");
  const [letter, setLetter]           = useState("");
  const [copied, setCopied]           = useState(false);

  const isReady = name && role && company && experience && skills;

  function generate() {
    if (!isReady) return;
    setLetter(generateLetter({ name, role, company, experience, skills, achievement, tone }));
  }

  function copy() {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Full Name</label>
          <input type="text" placeholder="e.g. Priya Sharma"
            value={name} onChange={(e) => { setName(e.target.value); setLetter(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Job Role Applying For</label>
          <input type="text" placeholder="e.g. Senior Marketing Manager"
            value={role} onChange={(e) => { setRole(e.target.value); setLetter(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label>
          <input type="text" placeholder="e.g. Infosys"
            value={company} onChange={(e) => { setCompany(e.target.value); setLetter(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Years of Experience</label>
          <input type="number" min="0" max="40" placeholder="e.g. 4"
            value={experience} onChange={(e) => { setExperience(e.target.value); setLetter(""); }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Key Skills (comma-separated)</label>
        <input type="text" placeholder="e.g. SEO, Content Strategy, Google Analytics, Copywriting"
          value={skills} onChange={(e) => { setSkills(e.target.value); setLetter(""); }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Top Achievement <span className="text-gray-400 font-normal">(optional but recommended)</span></label>
        <input type="text" placeholder="e.g. increased organic traffic by 120% in 6 months, reducing CPL by 40%"
          value={achievement} onChange={(e) => { setAchievement(e.target.value); setLetter(""); }}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              onClick={() => { setTone(t); setLetter(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                tone === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!isReady}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
      >
        Generate Cover Letter
      </button>

      {letter && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Your Cover Letter</p>
            <div className="flex gap-2">
              <button
                onClick={generate}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerate
              </button>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">{letter}</pre>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
            Tip: Personalise the letter further by adding a specific reason you want to join this company — it makes a big difference.
          </p>
        </div>
      )}
    </div>
  );
}
