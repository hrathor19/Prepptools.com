"use client";

import { useState } from "react";
import { Plus, Trash2, Download, Loader2, ChevronLeft, ChevronRight, Eye, Edit3, FileText } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
type Exp   = { id: string; title: string; company: string; location: string; period: string; bullets: string };
type Edu   = { id: string; degree: string; university: string; year: string; gpa: string };
type Skill = { id: string; category: string; items: string };
type Proj  = { id: string; name: string; bullets: string };

type ResumeData = {
  name: string; email: string; phone: string; linkedin: string; github: string; location: string;
  summary: string;
  experience: Exp[];
  education: Edu[];
  skills: Skill[];
  projects: Proj[];
  certifications: string;
};

type StrKey = keyof Pick<ResumeData, "name"|"email"|"phone"|"linkedin"|"github"|"location"|"summary"|"certifications">;

const uid = () => Math.random().toString(36).slice(2, 9);

const INIT: ResumeData = {
  name: "", email: "", phone: "", linkedin: "", github: "", location: "",
  summary: "",
  experience: [{ id: uid(), title: "", company: "", location: "", period: "", bullets: "" }],
  education:  [{ id: uid(), degree: "", university: "", year: "", gpa: "" }],
  skills:     [{ id: uid(), category: "Technical Skills", items: "" }],
  projects:   [],
  certifications: "",
};

const STEPS = ["Personal", "Summary", "Experience", "Education", "Skills", "Extras"];

// ── Shared styles ──────────────────────────────────────────────────────────────
const inp = "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors";
const lbl = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

function F({ l, children }: { l: string; children: React.ReactNode }) {
  return <div><label className={lbl}>{l}</label>{children}</div>;
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function ResumeBuilderClient() {
  const [step, setStep]       = useState(0);
  const [data, setData]       = useState<ResumeData>(INIT);
  const [mTab, setMTab]       = useState<"edit"|"preview">("edit");
  const [loading, setLoading]       = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  function str(k: StrKey) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData(d => ({ ...d, [k]: e.target.value }));
  }

  // Experience
  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: uid(), title: "", company: "", location: "", period: "", bullets: "" }] }));
  const delExp = (id: string) => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const setExp = (id: string, f: keyof Exp, v: string) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [f]: v } : e) }));

  // Education
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { id: uid(), degree: "", university: "", year: "", gpa: "" }] }));
  const delEdu = (id: string) => setData(d => ({ ...d, education: d.education.filter(e => e.id !== id) }));
  const setEdu = (id: string, f: keyof Edu, v: string) => setData(d => ({ ...d, education: d.education.map(e => e.id === id ? { ...e, [f]: v } : e) }));

  // Skills
  const addSkill = () => setData(d => ({ ...d, skills: [...d.skills, { id: uid(), category: "", items: "" }] }));
  const delSkill = (id: string) => setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }));
  const setSkill = (id: string, f: keyof Skill, v: string) => setData(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, [f]: v } : s) }));

  // Projects
  const addProj = () => setData(d => ({ ...d, projects: [...d.projects, { id: uid(), name: "", bullets: "" }] }));
  const delProj = (id: string) => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  const setProj = (id: string, f: keyof Proj, v: string) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, [f]: v } : p) }));

  const contactStr = [data.email, data.phone, data.linkedin, data.github, data.location].filter(Boolean).join("  |  ");

  async function download() {
    setLoading(true);
    try { await generateDocx(data, contactStr); } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function downloadPdf() {
    setLoadingPdf(true);
    try { await generatePdf(data, contactStr); } catch (e) { console.error(e); } finally { setLoadingPdf(false); }
  }

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 64px)" }}>
      {/* Header bar */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Resume Builder</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Fill in each section · live preview updates as you type</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadPdf}
            disabled={loadingPdf || !data.name.trim()}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {loadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span className="hidden sm:inline">{loadingPdf ? "Preparing…" : "Download PDF"}</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={download}
            disabled={loading || !data.name.trim()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">{loading ? "Generating…" : "Download .docx"}</span>
            <span className="sm:hidden">{loading ? "…" : ".docx"}</span>
          </button>
        </div>
      </div>

      {/* Mobile tab toggle */}
      <div className="shrink-0 lg:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        {(["edit", "preview"] as const).map(t => (
          <button
            key={t}
            onClick={() => setMTab(t)}
            className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${mTab === t ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 dark:text-gray-400"}`}
          >
            {t === "edit" ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {t === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      {/* Two-panel body */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── FORM PANEL ── */}
        <div className={`${mTab === "preview" ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-[44%] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900`}>

          {/* Step tabs */}
          <div className="shrink-0 flex overflow-x-auto gap-1 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${step === i ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* Step 0 — Personal */}
            {step === 0 && <>
              <p className="text-xs text-gray-400 dark:text-gray-500">Your contact details appear at the top of the resume.</p>
              <F l="Full Name *">
                <input className={inp} placeholder="Priya Sharma" value={data.name} onChange={str("name")} />
              </F>
              <div className="grid grid-cols-2 gap-3">
                <F l="Email">
                  <input className={inp} type="email" placeholder="you@email.com" value={data.email} onChange={str("email")} />
                </F>
                <F l="Phone">
                  <input className={inp} placeholder="+91 98765 43210" value={data.phone} onChange={str("phone")} />
                </F>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F l="LinkedIn URL">
                  <input className={inp} placeholder="linkedin.com/in/yourname" value={data.linkedin} onChange={str("linkedin")} />
                </F>
                <F l="GitHub / Portfolio">
                  <input className={inp} placeholder="github.com/yourname" value={data.github} onChange={str("github")} />
                </F>
              </div>
              <F l="Location">
                <input className={inp} placeholder="Bangalore, India" value={data.location} onChange={str("location")} />
              </F>
            </>}

            {/* Step 1 — Summary */}
            {step === 1 && <>
              <p className="text-xs text-gray-400 dark:text-gray-500">3–4 sentences: your experience level, top strengths, and what you're looking for.</p>
              <F l="Professional Summary">
                <textarea
                  className={`${inp} h-44 resize-none`}
                  placeholder="Software engineer with 4 years of experience building scalable backend systems in Go and Node.js. Delivered APIs serving 5M+ daily requests with p99 latency under 50ms. Passionate about clean architecture and developer experience."
                  value={data.summary}
                  onChange={str("summary")}
                />
              </F>
              <p className="text-right text-xs text-gray-400">{data.summary.length} chars</p>
            </>}

            {/* Step 2 — Experience */}
            {step === 2 && <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Position {i + 1}</span>
                    {data.experience.length > 1 && (
                      <button onClick={() => delExp(exp.id)} className="text-gray-400 hover:text-red-500 transition-colors p-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <F l="Job Title *"><input className={inp} placeholder="Software Engineer" value={exp.title} onChange={e => setExp(exp.id, "title", e.target.value)} /></F>
                    <F l="Company *"><input className={inp} placeholder="Acme Corp" value={exp.company} onChange={e => setExp(exp.id, "company", e.target.value)} /></F>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <F l="Location"><input className={inp} placeholder="Bangalore, India" value={exp.location} onChange={e => setExp(exp.id, "location", e.target.value)} /></F>
                    <F l="Period"><input className={inp} placeholder="Jan 2022 – Present" value={exp.period} onChange={e => setExp(exp.id, "period", e.target.value)} /></F>
                  </div>
                  <F l="Key Achievements — one per line">
                    <textarea
                      className={`${inp} h-28 resize-none`}
                      placeholder={"Led a team of 5 to deliver a payments platform\nReduced API latency from 340ms to 48ms\nMentored 3 junior engineers"}
                      value={exp.bullets}
                      onChange={e => setExp(exp.id, "bullets", e.target.value)}
                    />
                  </F>
                </div>
              ))}
              <button onClick={addExp} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="w-4 h-4" /> Add another position
              </button>
            </div>}

            {/* Step 3 — Education */}
            {step === 3 && <div className="space-y-5">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Qualification {i + 1}</span>
                    {data.education.length > 1 && (
                      <button onClick={() => delEdu(edu.id)} className="text-gray-400 hover:text-red-500 transition-colors p-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <F l="Degree / Qualification *"><input className={inp} placeholder="B.Tech in Computer Science" value={edu.degree} onChange={e => setEdu(edu.id, "degree", e.target.value)} /></F>
                  <F l="University / School *"><input className={inp} placeholder="IIT Bombay" value={edu.university} onChange={e => setEdu(edu.id, "university", e.target.value)} /></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F l="Graduation Year"><input className={inp} placeholder="2022" value={edu.year} onChange={e => setEdu(edu.id, "year", e.target.value)} /></F>
                    <F l="GPA / Percentage"><input className={inp} placeholder="8.7/10" value={edu.gpa} onChange={e => setEdu(edu.id, "gpa", e.target.value)} /></F>
                  </div>
                </div>
              ))}
              <button onClick={addEdu} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="w-4 h-4" /> Add another qualification
              </button>
            </div>}

            {/* Step 4 — Skills */}
            {step === 4 && <div className="space-y-5">
              <p className="text-xs text-gray-400 dark:text-gray-500">Group by category for better ATS parsing (e.g. "Languages: Python, Go, SQL").</p>
              {data.skills.map((s, i) => (
                <div key={s.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Category {i + 1}</span>
                    {data.skills.length > 1 && (
                      <button onClick={() => delSkill(s.id)} className="text-gray-400 hover:text-red-500 transition-colors p-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <F l="Category Name"><input className={inp} placeholder="Languages / Frameworks / Tools" value={s.category} onChange={e => setSkill(s.id, "category", e.target.value)} /></F>
                  <F l="Skills (comma separated)"><input className={inp} placeholder="Python, JavaScript, Go, SQL, React" value={s.items} onChange={e => setSkill(s.id, "items", e.target.value)} /></F>
                </div>
              ))}
              <button onClick={addSkill} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="w-4 h-4" /> Add skill category
              </button>
            </div>}

            {/* Step 5 — Extras */}
            {step === 5 && <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Projects <span className="font-normal text-gray-400">(optional)</span>
                </h3>
                <div className="space-y-4">
                  {data.projects.map((p, i) => (
                    <div key={p.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Project {i + 1}</span>
                        <button onClick={() => delProj(p.id)} className="text-gray-400 hover:text-red-500 transition-colors p-0.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <F l="Project Name / Title"><input className={inp} placeholder="Job Portal (github.com/you/repo)" value={p.name} onChange={e => setProj(p.id, "name", e.target.value)} /></F>
                      <F l="Key Points — one per line">
                        <textarea
                          className={`${inp} h-20 resize-none`}
                          placeholder={"Built with React and Node.js, 200+ listings\nImplemented JWT auth and search filters"}
                          value={p.bullets}
                          onChange={e => setProj(p.id, "bullets", e.target.value)}
                        />
                      </F>
                    </div>
                  ))}
                  <button onClick={addProj} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add project
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Certifications <span className="font-normal text-gray-400">(optional)</span>
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">One per line, e.g. "AWS Developer Associate, 2023"</p>
                <textarea
                  className={`${inp} h-28 resize-none`}
                  placeholder={"AWS Certified Developer – Associate, 2023\nGoogle Data Analytics Certificate, 2022"}
                  value={data.certifications}
                  onChange={str("certifications")}
                />
              </div>
            </div>}
          </div>

          {/* Step navigation footer */}
          <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center justify-between">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-blue-600 w-4" : "bg-gray-200 dark:bg-gray-700"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              disabled={step === STEPS.length - 1}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-30 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── PREVIEW PANEL ── */}
        <div className={`${mTab === "edit" ? "hidden lg:flex" : "flex"} flex-col flex-1 bg-gray-100 dark:bg-gray-950 overflow-hidden`}>
          <div className="shrink-0 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Live Preview — updates as you type</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-[680px] mx-auto bg-white shadow-xl">
              <ResumePreview data={data} contactStr={contactStr} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Preview component ──────────────────────────────────────────────────────────
function SecHead({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: "1.5px solid #3a3a3a", marginBottom: 5, marginTop: 14, paddingBottom: 2 }}>
      <span style={{ fontWeight: 700, fontSize: 10, textTransform: "uppercase" as const, color: "#1a1a1a", letterSpacing: "0.06em" }}>
        {title}
      </span>
    </div>
  );
}

function ResumePreview({ data, contactStr }: { data: ResumeData; contactStr: string }) {
  const hasExp    = data.experience.some(e => e.title || e.company);
  const hasEdu    = data.education.some(e => e.degree || e.university);
  const hasSkills = data.skills.some(s => s.items);
  const hasProj   = data.projects.some(p => p.name);
  const hasCerts  = !!data.certifications.trim();

  if (!data.name && !contactStr && !data.summary && !hasExp && !hasEdu && !hasSkills) {
    return (
      <div style={{ padding: "48px 36px", fontFamily: "Arial, sans-serif", textAlign: "center", color: "#aaa" }}>
        <p style={{ fontSize: 13 }}>Start filling in the form to see your resume preview here.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 36px", fontFamily: "Arial, sans-serif", fontSize: 12, color: "#111", minHeight: 500 }}>
      {data.name && (
        <h1 style={{ fontSize: 22, fontWeight: 700, textAlign: "center", margin: "0 0 4px" }}>{data.name}</h1>
      )}
      {contactStr && (
        <p style={{ fontSize: 10, textAlign: "center", color: "#666", margin: "0 0 6px", lineHeight: 1.6 }}>{contactStr}</p>
      )}
      <hr style={{ borderColor: "#ccc", borderTop: "none", margin: "0 0 4px" }} />

      {data.summary && <>
        <SecHead title="Professional Summary" />
        <p style={{ fontSize: 11, color: "#444", lineHeight: 1.6, margin: "0 0 2px" }}>{data.summary}</p>
      </>}

      {hasExp && <>
        <SecHead title="Work Experience" />
        {data.experience.map(e => (e.title || e.company) ? (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 12 }}>{e.title}</span>
              <span style={{ fontSize: 10, color: "#777", whiteSpace: "nowrap" }}>{e.period}</span>
            </div>
            {(e.company || e.location) && (
              <div style={{ fontSize: 11, color: "#444", marginBottom: 3 }}>
                {[e.company, e.location].filter(Boolean).join("  |  ")}
              </div>
            )}
            {e.bullets && e.bullets.split("\n").filter(Boolean).map((b, i) => (
              <div key={i} style={{ fontSize: 11, color: "#555", paddingLeft: 10, lineHeight: 1.55 }}>
                • {b.replace(/^[-•*]\s*/, "")}
              </div>
            ))}
          </div>
        ) : null)}
      </>}

      {hasEdu && <>
        <SecHead title="Education" />
        {data.education.map(e => (e.degree || e.university) ? (
          <div key={e.id} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{e.degree}</div>
            <div style={{ fontSize: 11, color: "#444" }}>
              {[e.university, e.year, e.gpa ? `GPA: ${e.gpa}` : ""].filter(Boolean).join("  |  ")}
            </div>
          </div>
        ) : null)}
      </>}

      {hasProj && <>
        <SecHead title="Projects" />
        {data.projects.map(p => p.name ? (
          <div key={p.id} style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{p.name}</div>
            {p.bullets && p.bullets.split("\n").filter(Boolean).map((b, i) => (
              <div key={i} style={{ fontSize: 11, color: "#555", paddingLeft: 10, lineHeight: 1.55 }}>
                • {b.replace(/^[-•*]\s*/, "")}
              </div>
            ))}
          </div>
        ) : null)}
      </>}

      {hasSkills && <>
        <SecHead title="Skills" />
        {data.skills.map(s => s.items ? (
          <div key={s.id} style={{ fontSize: 11, color: "#444", marginBottom: 4 }}>
            {s.category && <span style={{ fontWeight: 700, color: "#222" }}>{s.category}: </span>}
            {s.items}
          </div>
        ) : null)}
      </>}

      {hasCerts && <>
        <SecHead title="Certifications" />
        {data.certifications.split("\n").filter(Boolean).map((c, i) => (
          <div key={i} style={{ fontSize: 11, color: "#555", paddingLeft: 10, lineHeight: 1.55 }}>
            • {c.replace(/^[-•*]\s*/, "")}
          </div>
        ))}
      </>}
    </div>
  );
}

// ── PDF via jsPDF (no browser print dialog — no headers/footers) ───────────────
async function generatePdf(data: ResumeData, contactStr: string) {
  const { jsPDF } = await import("jspdf");

  const ML   = 18;   // margin left  (mm)
  const MR   = 18;   // margin right (mm)
  const MT   = 15;   // margin top   (mm)
  const MB   = 15;   // margin bottom(mm)
  const PW   = 210;  // A4 width     (mm)
  const PH   = 297;  // A4 height    (mm)
  const CW   = PW - ML - MR;   // 174 mm content width
  const MAXY = PH - MB;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = MT;

  const newPage = () => { doc.addPage(); y = MT; };
  const gap = (mm: number) => { y += mm; };
  const ensure = (mm: number) => { if (y + mm > MAXY) newPage(); };

  // pt → mm line height
  const lh = (pt: number, factor = 1.45) => pt * 0.3528 * factor;

  // Wrapped text block — returns after last line
  const wText = (
    text: string,
    x: number,
    size: number,
    style: "normal" | "bold",
    rgb: [number, number, number],
    maxW = CW,
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...rgb);
    const lines = doc.splitTextToSize(text, maxW);
    for (const line of lines) {
      ensure(lh(size));
      doc.text(line, x, y);
      y += lh(size);
    }
  };

  const sectionHead = (title: string) => {
    ensure(10);
    gap(2);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 26, 26);
    doc.text(title.toUpperCase(), ML, y);
    y += 2;
    doc.setDrawColor(58, 58, 58);
    doc.setLineWidth(0.5);
    doc.line(ML, y, PW - MR, y);
    y += 3.5;
  };

  // ── Name ──────────────────────────────────────────────────────────────────
  if (data.name) {
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(data.name, PW / 2, y, { align: "center" });
    y += lh(22);
  }

  // ── Contact line ──────────────────────────────────────────────────────────
  if (contactStr) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    const clines = doc.splitTextToSize(contactStr, CW);
    for (const line of clines) {
      doc.text(line, PW / 2, y, { align: "center" });
      y += lh(9);
    }
  }

  // ── Divider ───────────────────────────────────────────────────────────────
  gap(1);
  doc.setDrawColor(190, 190, 190);
  doc.setLineWidth(0.3);
  doc.line(ML, y, PW - MR, y);
  gap(3);

  // ── Summary ───────────────────────────────────────────────────────────────
  if (data.summary.trim()) {
    sectionHead("Professional Summary");
    wText(data.summary, ML, 10, "normal", [68, 68, 68]);
    gap(1);
  }

  // ── Experience ────────────────────────────────────────────────────────────
  const exps = data.experience.filter(e => e.title || e.company);
  if (exps.length) {
    sectionHead("Work Experience");
    for (const e of exps) {
      ensure(7);
      // Title + period
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(e.title || "", ML, y);
      if (e.period) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 120);
        doc.text(e.period, PW - MR, y, { align: "right" });
      }
      y += lh(11);

      if (e.company || e.location) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(68, 68, 68);
        doc.text([e.company, e.location].filter(Boolean).join("  |  "), ML, y);
        y += lh(10);
      }

      for (const b of e.bullets.split("\n").filter(Boolean))
        wText("•  " + b.replace(/^[-•*]\s*/, ""), ML + 3, 10, "normal", [80, 80, 80], CW - 3);

      gap(2);
    }
  }

  // ── Education ─────────────────────────────────────────────────────────────
  const edus = data.education.filter(e => e.degree || e.university);
  if (edus.length) {
    sectionHead("Education");
    for (const e of edus) {
      ensure(6);
      wText(e.degree || "", ML, 11, "bold", [20, 20, 20]);
      const sub = [e.university, e.year, e.gpa ? `GPA: ${e.gpa}` : ""].filter(Boolean).join("  |  ");
      if (sub) wText(sub, ML, 10, "normal", [68, 68, 68]);
      gap(2);
    }
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  const projs = data.projects.filter(p => p.name);
  if (projs.length) {
    sectionHead("Projects");
    for (const p of projs) {
      ensure(6);
      wText(p.name, ML, 11, "bold", [20, 20, 20]);
      for (const b of p.bullets.split("\n").filter(Boolean))
        wText("•  " + b.replace(/^[-•*]\s*/, ""), ML + 3, 10, "normal", [80, 80, 80], CW - 3);
      gap(2);
    }
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  const skls = data.skills.filter(s => s.items);
  if (skls.length) {
    sectionHead("Skills");
    for (const s of skls) {
      ensure(5);
      if (s.category) {
        const label = s.category + ": ";
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text(label, ML, y);
        const lw = doc.getTextWidth(label);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(68, 68, 68);
        const wrapped = doc.splitTextToSize(s.items, CW - lw);
        doc.text(wrapped[0] ?? "", ML + lw, y);
        y += lh(10);
        for (let i = 1; i < wrapped.length; i++) {
          ensure(lh(10));
          doc.text(wrapped[i], ML, y);
          y += lh(10);
        }
      } else {
        wText(s.items, ML, 10, "normal", [68, 68, 68]);
      }
      gap(1);
    }
  }

  // ── Certifications ────────────────────────────────────────────────────────
  const certs = data.certifications.split("\n").filter(Boolean);
  if (certs.length) {
    sectionHead("Certifications");
    for (const c of certs)
      wText("•  " + c.replace(/^[-•*]\s*/, ""), ML + 3, 10, "normal", [80, 80, 80], CW - 3);
  }

  const filename = data.name
    ? `${data.name.toLowerCase().replace(/\s+/g, "-")}-resume.pdf`
    : "my-resume.pdf";
  doc.save(filename);
}

// ── DOCX generation ────────────────────────────────────────────────────────────
async function generateDocx(data: ResumeData, contactStr: string) {
  const { Document, Paragraph, TextRun, Packer, AlignmentType, BorderStyle, TabStopType } = await import("docx");

  const INDENT    = 360;
  const RIGHT_TAB = 10080;

  type Para = InstanceType<typeof Paragraph>;

  function divider(): Para {
    return new Paragraph({
      border: { bottom: { color: "CCCCCC", space: 1, style: BorderStyle.SINGLE, size: 4 } },
      spacing: { after: 100 },
      children: [],
    });
  }

  function secHead(title: string): Para {
    return new Paragraph({
      border: { bottom: { color: "3a3a3a", space: 1, style: BorderStyle.SINGLE, size: 4 } },
      spacing: { before: 220, after: 80 },
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: "1E1E1E" })],
    });
  }

  const ch: Para[] = [];

  if (data.name) {
    ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: data.name, bold: true, size: 40, color: "141414" })] }));
  }
  if (contactStr) {
    ch.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: contactStr, size: 17, color: "555555" })] }));
  }
  ch.push(divider());

  if (data.summary) {
    ch.push(secHead("Professional Summary"));
    ch.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: data.summary, size: 19, color: "404040" })] }));
  }

  const exps = data.experience.filter(e => e.title || e.company);
  if (exps.length) {
    ch.push(secHead("Work Experience"));
    for (const e of exps) {
      ch.push(new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        spacing: { after: 40 },
        children: [
          new TextRun({ text: e.title, bold: true, size: 21, color: "141414" }),
          new TextRun({ text: "\t" }),
          new TextRun({ text: e.period, size: 18, color: "777777" }),
        ],
      }));
      if (e.company || e.location) {
        ch.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: [e.company, e.location].filter(Boolean).join("  |  "), size: 19, color: "333333" })] }));
      }
      for (const b of e.bullets.split("\n").filter(Boolean)) {
        ch.push(new Paragraph({ indent: { left: INDENT }, spacing: { after: 40 }, children: [new TextRun({ text: `•  ${b.replace(/^[-•*]\s*/, "")}`, size: 19, color: "444444" })] }));
      }
      ch.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
    }
  }

  const edus = data.education.filter(e => e.degree || e.university);
  if (edus.length) {
    ch.push(secHead("Education"));
    for (const e of edus) {
      ch.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: e.degree, bold: true, size: 21, color: "141414" })] }));
      ch.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: [e.university, e.year, e.gpa ? `GPA: ${e.gpa}` : ""].filter(Boolean).join("  |  "), size: 19, color: "444444" })] }));
    }
  }

  const projs = data.projects.filter(p => p.name);
  if (projs.length) {
    ch.push(secHead("Projects"));
    for (const p of projs) {
      ch.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: p.name, bold: true, size: 21, color: "141414" })] }));
      for (const b of p.bullets.split("\n").filter(Boolean)) {
        ch.push(new Paragraph({ indent: { left: INDENT }, spacing: { after: 40 }, children: [new TextRun({ text: `•  ${b.replace(/^[-•*]\s*/, "")}`, size: 19, color: "444444" })] }));
      }
      ch.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
    }
  }

  const skls = data.skills.filter(s => s.items);
  if (skls.length) {
    ch.push(secHead("Skills"));
    for (const s of skls) {
      ch.push(new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: s.category ? `${s.category}: ` : "", bold: true, size: 19, color: "222222" }),
          new TextRun({ text: s.items, size: 19, color: "444444" }),
        ],
      }));
    }
  }

  const certs = data.certifications.split("\n").filter(Boolean);
  if (certs.length) {
    ch.push(secHead("Certifications"));
    for (const c of certs) {
      ch.push(new Paragraph({ indent: { left: INDENT }, spacing: { after: 60 }, children: [new TextRun({ text: `•  ${c.replace(/^[-•*]\s*/, "")}`, size: 19, color: "444444" })] }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children: ch,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = data.name ? `${data.name.toLowerCase().replace(/\s+/g, "-")}-resume.docx` : "my-resume.docx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
