import type { Metadata } from "next";
import Link from "next/link";
import { Download, CheckCircle2, ArrowRight, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Resume Templates — ATS-Friendly | PreppTools",
  description: "Download free ATS-friendly resume templates in plain format. Works with all major ATS systems. No sign-up needed.",
  alternates: { canonical: "https://www.prepptools.com/resume-templates" },
};

const templates = [
  {
    name: "Classic Professional",
    desc: "Single-column layout. Maximum ATS compatibility. Ideal for corporate, finance, and government roles.",
    tags: ["ATS-Safe", "Single Column", "All Industries"],
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-700",
    features: ["No tables or columns", "Standard section headings", "Clean serif font", "1-page format"],
  },
  {
    name: "Modern Clean",
    desc: "Subtle design with a header accent. Good balance of aesthetics and ATS readability for tech and creative roles.",
    tags: ["ATS-Friendly", "Two Section", "Tech / Creative"],
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-700",
    features: ["Minimal colour accents", "Skill section included", "Works in Google Docs", "Easy to customise"],
  },
  {
    name: "Fresher / Entry Level",
    desc: "Highlights education, projects, and skills over experience. Perfect for students and recent graduates.",
    tags: ["Students", "Entry Level", "ATS-Safe"],
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-700",
    features: ["Education first layout", "Projects section", "Skills & certifications", "Internship-ready"],
  },
  {
    name: "Executive / Senior",
    desc: "Spacious layout for 10+ years of experience. Emphasises leadership, impact metrics, and key achievements.",
    tags: ["Senior", "Leadership", "2-Page"],
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-700",
    features: ["2-page format", "Executive summary", "Achievement-focused", "Metrics & impact"],
  },
];

const atsRules = [
  "Use standard section headings: Work Experience, Education, Skills",
  "Avoid tables, text boxes, headers/footers, and columns",
  "Save as .docx or plain PDF — not image-based PDF",
  "Include keywords exactly as they appear in the job description",
  "Use a standard font: Arial, Calibri, Times New Roman, or Garamond",
  "Dates should be in Month YYYY format (e.g., Jan 2023)",
  "Spell out abbreviations at least once (e.g., AI (Artificial Intelligence))",
  "Don't put contact info in the document header — ATS systems often skip it",
];

export default function ResumeTemplatesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">Free Download</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          ATS-Friendly Resume Templates
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Templates built to pass Applicant Tracking Systems. Free, no sign-up. After downloading, check your resume score with our ATS tool.
        </p>
      </div>

      {/* ATS tip banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl px-5 py-4 mb-10">
        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">💡 Why ATS matters</p>
        <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
          Over 95% of Fortune 500 companies use ATS software to filter resumes before a human reads them. A beautifully designed resume can score 0% on ATS if it uses tables, images, or non-standard formatting. These templates are built to pass the scan.
        </p>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {templates.map((t) => (
          <div key={t.name} className={`rounded-2xl border p-6 ${t.bg} ${t.border}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${t.color}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className={`font-bold text-base ${t.color}`}>{t.name}</h2>
                <div className="flex flex-wrap gap-1 mt-1">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-white/60 dark:bg-gray-900/40 border border-white/80 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{t.desc}</p>
            <ul className="space-y-1.5 mb-5">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${t.color}`} /> {f}
                </li>
              ))}
            </ul>
            <a
              href="#coming-soon"
              className={`inline-flex items-center gap-2 bg-white dark:bg-gray-800 border ${t.border} ${t.color} font-semibold text-sm px-4 py-2 rounded-xl hover:shadow-sm transition-all`}
            >
              <Download className="w-4 h-4" /> Download .docx
            </a>
          </div>
        ))}
      </div>

      {/* ATS rules */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">ATS Resume Rules — Quick Checklist</h2>
        <ul className="space-y-2.5">
          {atsRules.map((rule, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Done editing? Check how well your resume matches a job description.</p>
        <Link
          href="/tools/ats-score"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Check My ATS Score <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
