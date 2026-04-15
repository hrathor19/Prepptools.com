"use client";

import { useState } from "react";
import FileDropZone from "./shared/FileDropZone";
import { Loader2, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

// ─── Stop words to ignore when extracting keywords ───────────────────────────
const STOP = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by",
  "from","up","is","was","are","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","shall","can",
  "this","that","these","those","we","you","your","our","their","its","my",
  "as","if","it","he","she","they","all","any","each","more","also","than",
  "then","so","just","about","into","out","over","after","before","between",
  "through","during","under","while","when","where","who","which","what","how",
  "not","no","nor","very","well","per","etc","ie","eg","via","us","am",
]);

const SECTION_PATTERNS: { name: string; patterns: RegExp[] }[] = [
  { name: "Work Experience",  patterns: [/\b(work experience|experience|employment|work history|professional experience)\b/i] },
  { name: "Education",        patterns: [/\b(education|academic|qualification|degree|university|college)\b/i] },
  { name: "Skills",           patterns: [/\b(skills|technical skills|core competencies|competencies|expertise|proficiencies)\b/i] },
  { name: "Summary / Objective", patterns: [/\b(summary|objective|profile|about me|professional summary|career objective)\b/i] },
  { name: "Contact Info",     patterns: [/[\w.+-]+@[\w-]+\.[a-z]{2,}/i, /(\+?\d[\d\s\-().]{7,}\d)/, /\b(linkedin\.com|github\.com)\b/i] },
  { name: "Certifications",   patterns: [/\b(certification|certificate|certified|license|award)\b/i] },
  { name: "Projects",         patterns: [/\b(project|projects|portfolio|open.?source)\b/i] },
];

const ACTION_VERBS = [
  "achieved","built","created","delivered","designed","developed","drove","engineered",
  "established","executed","grew","implemented","improved","increased","launched","led",
  "managed","optimized","owned","reduced","saved","scaled","shipped","solved","spearheaded",
  "streamlined","transformed","accelerated","automated","collaborated","coordinated",
  "deployed","enhanced","founded","generated","handled","initiated","mentored","migrated",
  "produced","published","researched","resolved","reviewed","tested","trained","wrote",
];

function extractKeywords(text: string): string[] {
  return [...new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s#+.]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP.has(w))
  )];
}

function scoreColor(score: number) {
  if (score >= 80) return { ring: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", bar: "bg-emerald-500", label: "Excellent", desc: "Your resume is well-optimised for ATS." };
  if (score >= 60) return { ring: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    bar: "bg-blue-500",    label: "Good",      desc: "A few improvements will boost your chances." };
  if (score >= 40) return { ring: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   bar: "bg-amber-500",   label: "Fair",      desc: "Significant gaps — follow the suggestions below." };
  return            { ring: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    bar: "bg-red-500",    label: "Poor",      desc: "Your resume needs major ATS optimisation." };
}

type Section = { name: string; found: boolean };
type Result = {
  overall: number;
  keywordScore: number | null;
  sectionScore: number;
  contactScore: number;
  actionVerbScore: number;
  lengthScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  sections: Section[];
  foundVerbs: string[];
  wordCount: number;
  tips: string[];
  hasJD: boolean;
};

export default function ATSScore() {
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [jobDesc, setJobDesc]         = useState("");
  const [result, setResult]           = useState<Result | null>(null);
  const [processing, setProcessing]   = useState(false);
  const [error, setError]             = useState("");
  const [showMissing, setShowMissing] = useState(false);
  const [showMatched, setShowMatched] = useState(false);

  async function extractPDFText(file: File): Promise<string> {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    const buffer = await file.arrayBuffer();
    const pdf    = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    const parts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parts.push(content.items.map((item: any) => item.str).join(" "));
    }
    return parts.join("\n");
  }

  async function analyze() {
    if (!resumeFiles[0]) { setError("Please upload your resume PDF first."); return; }
    setProcessing(true); setError(""); setResult(null);

    try {
      const resumeText = await extractPDFText(resumeFiles[0]);
      const resumeLower = resumeText.toLowerCase();

      const hasJD = jobDesc.trim().length > 0;

      // ── 1. Keyword match (40 pts — only when JD provided) ────────────────
      const jdKeywords    = hasJD ? extractKeywords(jobDesc) : [];
      const matched       = jdKeywords.filter(k => resumeLower.includes(k));
      const missing       = jdKeywords.filter(k => !resumeLower.includes(k))
                              .sort((a, b) => b.length - a.length)
                              .slice(0, 30);
      const keywordScore  = jdKeywords.length
        ? Math.round((matched.length / jdKeywords.length) * 100)
        : null; // null = not evaluated

      // ── 2. Standard sections ─────────────────────────────────────────────
      const sections: Section[] = SECTION_PATTERNS.map(s => ({
        name:  s.name,
        found: s.patterns.some(p => p.test(resumeText)),
      }));
      const foundSections = sections.filter(s => s.found).length;
      const sectionScore  = Math.round((foundSections / SECTION_PATTERNS.length) * 100);

      // ── 3. Contact info ───────────────────────────────────────────────────
      const hasEmail    = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(resumeText);
      const hasPhone    = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
      const hasLinkedIn = /linkedin\.com/i.test(resumeText);
      const contactScore = Math.round(((+hasEmail + +hasPhone + +hasLinkedIn) / 3) * 100);

      // ── 4. Action verbs ───────────────────────────────────────────────────
      const foundVerbs      = ACTION_VERBS.filter(v => resumeLower.includes(v));
      const actionVerbScore = Math.min(100, Math.round((foundVerbs.length / 8) * 100));

      // ── 5. Resume length ──────────────────────────────────────────────────
      const wordCount  = resumeText.trim().split(/\s+/).filter(Boolean).length;
      const lengthScore = wordCount < 200 ? 20
        : wordCount < 350 ? 60
        : wordCount <= 800 ? 100
        : wordCount <= 1200 ? 80
        : 50;

      // ── Weighted overall score ────────────────────────────────────────────
      // With JD:    keyword 40% · sections 25% · contact 15% · verbs 10% · length 10%
      // Without JD: sections 40% · contact 25% · verbs 20% · length 15%
      const overall = hasJD
        ? Math.round(
            (keywordScore ?? 0) * 0.40 +
            sectionScore        * 0.25 +
            contactScore        * 0.15 +
            actionVerbScore     * 0.10 +
            lengthScore         * 0.10
          )
        : Math.round(
            sectionScore    * 0.40 +
            contactScore    * 0.25 +
            actionVerbScore * 0.20 +
            lengthScore     * 0.15
          );

      // ── Tips ──────────────────────────────────────────────────────────────
      const tips: string[] = [];
      if (keywordScore !== null && keywordScore < 50)
        tips.push(`Add more job-specific keywords — you matched ${matched.length} of ${jdKeywords.length}. Include the missing keywords naturally in your experience bullets.`);
      if (!hasEmail)           tips.push("Add your email address — ATS systems need it to contact you.");
      if (!hasPhone)           tips.push("Add your phone number to your contact section.");
      if (!hasLinkedIn)        tips.push("Add your LinkedIn URL — many ATS parsers extract it.");
      if (foundVerbs.length < 5) tips.push("Start bullet points with strong action verbs (e.g. Led, Built, Increased, Optimised).");
      if (wordCount < 350)     tips.push("Your resume seems short. Aim for 400–700 words to give ATS enough content to parse.");
      if (wordCount > 1000)    tips.push("Your resume may be too long. Keep it under 1–2 pages (≈700 words) for best ATS results.");
      if (!sections.find(s => s.name === "Skills")?.found) tips.push("Add a dedicated Skills section listing your technical and soft skills.");
      if (!sections.find(s => s.name === "Summary / Objective")?.found) tips.push("Add a 2–3 line professional summary at the top tailored to the job description.");
      if (!hasJD) tips.push("Paste a job description for a full analysis — including keyword match rate and missing skills specific to that role.");
      if (tips.length === (hasJD ? 0 : 1)) tips.push("Great job! Keep tailoring your resume for each application.");

      setResult({ overall, keywordScore, sectionScore, contactScore, actionVerbScore,
        lengthScore, matchedKeywords: matched.slice(0, 40), missingKeywords: missing,
        sections, foundVerbs, wordCount, tips, hasJD });
    } catch (e) {
      console.error(e);
      setError("Failed to parse the PDF. Make sure it's a text-based PDF (not a scanned image).");
    } finally {
      setProcessing(false);
    }
  }

  const c = result ? scoreColor(result.overall) : null;

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
          <FileDropZone accept=".pdf,application/pdf" files={resumeFiles}
            onFiles={f => { setResumeFiles(f); setResult(null); }}
            label="Click or drag your resume PDF here" maxSizeMB={10} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
          <textarea value={jobDesc} onChange={e => { setJobDesc(e.target.value); setResult(null); }}
            rows={9} placeholder="Paste the full job description here…"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
        </div>
      </div>

      <button onClick={analyze} disabled={processing}
        className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
        {processing ? <><Loader2 className="w-5 h-5 animate-spin" />Analysing…</> : "Analyse ATS Score"}
      </button>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

      {result && c && (
        <div className="space-y-5">
          {/* Overall score */}
          <div className={`${c.bg} ${c.border} border rounded-2xl p-5 flex items-center gap-6`}>
            <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  className={c.ring}
                  strokeDasharray={`${result.overall} ${100 - result.overall}`}
                  strokeDashoffset="0" />
              </svg>
              <span className={`absolute text-2xl font-bold ${c.ring}`}>{result.overall}</span>
            </div>
            <div>
              <p className={`text-2xl font-bold ${c.ring}`}>{c.label}</p>
              <p className="text-sm text-gray-600 mt-0.5">{c.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{result.wordCount} words · {result.sections.filter(s => s.found).length}/{SECTION_PATTERNS.length} sections found</p>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Score Breakdown</p>
              {!result.hasJD && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  No JD — keyword match skipped
                </span>
              )}
            </div>
            {[
              result.hasJD ? { label: "Keyword Match", score: result.keywordScore ?? 0, weight: "40%", info: `${result.matchedKeywords.length} of ${result.matchedKeywords.length + result.missingKeywords.length} keywords found` } : null,
              { label: "Resume Sections",  score: result.sectionScore,    weight: result.hasJD ? "25%" : "40%", info: `${result.sections.filter(s=>s.found).length}/${SECTION_PATTERNS.length} sections detected` },
              { label: "Contact Info",     score: result.contactScore,    weight: result.hasJD ? "15%" : "25%", info: "Email, phone, LinkedIn" },
              { label: "Action Verbs",     score: result.actionVerbScore, weight: result.hasJD ? "10%" : "20%", info: `${result.foundVerbs.length} strong verbs found` },
              { label: "Resume Length",    score: result.lengthScore,     weight: result.hasJD ? "10%" : "15%", info: `${result.wordCount} words` },
            ].filter(Boolean).map((row) => {
              const { label, score, weight, info } = row!;
              const col = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{label} <span className="text-gray-400 font-normal">({weight})</span></span>
                    <span className="font-semibold text-gray-900">{score}/100 <span className="text-xs text-gray-400 font-normal">— {info}</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${col}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sections */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Section Detection</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {result.sections.map(s => (
                <div key={s.name} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm ${s.found ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 border-gray-200 text-gray-400"}`}>
                  {s.found ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-gray-300 shrink-0" />}
                  {s.name}
                </div>
              ))}
            </div>
          </div>

          {/* Keywords — only shown when JD was provided */}
          {result.hasJD && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched */}
            <div className="border border-emerald-200 rounded-xl overflow-hidden">
              <button onClick={() => setShowMatched(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 text-sm font-semibold text-emerald-800">
                <span>✅ Matched Keywords ({result.matchedKeywords.length})</span>
                {showMatched ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showMatched && (
                <div className="px-4 py-3 flex flex-wrap gap-1.5">
                  {result.matchedKeywords.map(k => (
                    <span key={k} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">{k}</span>
                  ))}
                </div>
              )}
            </div>
            {/* Missing */}
            <div className="border border-red-200 rounded-xl overflow-hidden">
              <button onClick={() => setShowMissing(v => !v)}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-sm font-semibold text-red-800">
                <span>❌ Missing Keywords ({result.missingKeywords.length})</span>
                {showMissing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showMissing && (
                <div className="px-4 py-3 flex flex-wrap gap-1.5">
                  {result.missingKeywords.map(k => (
                    <span key={k} className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">{k}</span>
                  ))}
                </div>
              )}
            </div>
          </div>}

          {/* Tips */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Recommendations</p>
            {result.tips.map((tip, i) => (
              <div key={i} className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{tip}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
            This analysis is rule-based and checks keyword density, section structure, contact info, and formatting signals.
            Results are a guide — actual ATS systems vary by vendor.
          </p>
        </div>
      )}
    </div>
  );
}
