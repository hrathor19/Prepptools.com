"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown, Lightbulb, MessageSquare, Search,
  Code2, LayoutDashboard, Megaphone, Users, BarChart2,
  Target, TrendingUp, FlaskConical, Palette, PenTool,
  Workflow, ShieldCheck, ClipboardList, Brain,
  Globe, Layers, Smartphone, Bug, Cloud, Headphones,
  Calendar, Gauge, UserCheck, Briefcase, RefreshCw,
  Wallet, PenLine, Share2, UserPlus, GraduationCap, Truck,
} from "lucide-react";
import { roles } from "@/lib/interview-data";

const roleIconMap: Record<string, React.ReactNode> = {
  "software-engineer":      <Code2          className="w-4 h-4" />,
  "product-manager":        <LayoutDashboard className="w-4 h-4" />,
  "marketing":              <Megaphone       className="w-4 h-4" />,
  "hr":                     <Users           className="w-4 h-4" />,
  "finance":                <BarChart2       className="w-4 h-4" />,
  "sales":                  <Target          className="w-4 h-4" />,
  "data-analyst":           <TrendingUp      className="w-4 h-4" />,
  "data-scientist":         <FlaskConical    className="w-4 h-4" />,
  "graphic-designer":       <Palette         className="w-4 h-4" />,
  "ux-designer":            <PenTool         className="w-4 h-4" />,
  "devops-engineer":        <Workflow        className="w-4 h-4" />,
  "cybersecurity":          <ShieldCheck     className="w-4 h-4" />,
  "business-analyst":       <ClipboardList   className="w-4 h-4" />,
  "ml-engineer":            <Brain           className="w-4 h-4" />,
  "frontend-developer":     <Globe           className="w-4 h-4" />,
  "full-stack-developer":   <Layers          className="w-4 h-4" />,
  "mobile-developer":       <Smartphone      className="w-4 h-4" />,
  "qa-engineer":            <Bug             className="w-4 h-4" />,
  "cloud-architect":        <Cloud           className="w-4 h-4" />,
  "it-support":             <Headphones      className="w-4 h-4" />,
  "project-manager":        <Calendar        className="w-4 h-4" />,
  "operations-manager":     <Gauge           className="w-4 h-4" />,
  "customer-success":       <UserCheck       className="w-4 h-4" />,
  "account-manager":        <Briefcase       className="w-4 h-4" />,
  "scrum-master":           <RefreshCw       className="w-4 h-4" />,
  "investment-analyst":     <TrendingUp      className="w-4 h-4" />,
  "financial-advisor":      <Wallet          className="w-4 h-4" />,
  "content-writer":         <PenLine         className="w-4 h-4" />,
  "social-media-manager":   <Share2          className="w-4 h-4" />,
  "seo-specialist":         <Search          className="w-4 h-4" />,
  "recruiter":              <UserPlus        className="w-4 h-4" />,
  "teacher-trainer":        <GraduationCap   className="w-4 h-4" />,
  "supply-chain":           <Truck           className="w-4 h-4" />,
  "consultant":             <Lightbulb       className="w-4 h-4" />,
};

const roleGroups = [
  { label: "Technology", ids: ["software-engineer", "frontend-developer", "full-stack-developer", "mobile-developer", "devops-engineer", "cloud-architect", "qa-engineer", "ml-engineer", "cybersecurity", "it-support"] },
  { label: "Business & Management", ids: ["product-manager", "project-manager", "operations-manager", "customer-success", "account-manager", "scrum-master", "supply-chain", "consultant"] },
  { label: "Marketing & Content", ids: ["marketing", "content-writer", "social-media-manager", "seo-specialist"] },
  { label: "HR & Talent", ids: ["hr", "recruiter"] },
  { label: "Finance & Data", ids: ["finance", "investment-analyst", "financial-advisor", "data-analyst", "data-scientist"] },
  { label: "Design", ids: ["graphic-designer", "ux-designer"] },
  { label: "Education & Sales", ids: ["teacher-trainer", "sales", "business-analyst"] },
];

export default function QuestionBank() {
  const [activeRole, setActiveRole] = useState(roles[0].id);
  const [openIdx, setOpenIdx]       = useState<number | null>(null);
  const [showSample, setShowSample] = useState<number | null>(null);
  const [search, setSearch]         = useState("");

  const role       = roles.find((r) => r.id === activeRole)!;
  const categories = [...new Set(role.questions.map((q) => q.category))];

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return roleGroups;
    const q = search.toLowerCase();
    return roleGroups
      .map((g) => ({
        ...g,
        ids: g.ids.filter((id) => roles.find((r) => r.id === id)?.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.ids.length > 0);
  }, [search]);

  function selectRole(id: string) {
    setActiveRole(id);
    setOpenIdx(null);
    setShowSample(null);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* ── Sidebar ── */}
      <aside className="lg:w-56 xl:w-64 shrink-0">
        <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:flex lg:flex-col">
          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {filteredGroups.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-gray-500 px-1 py-2">No roles match &quot;{search}&quot;</p>
          )}

          <nav className="space-y-5 lg:overflow-y-auto lg:flex-1 lg:pr-1" style={{ scrollbarWidth: "thin" }}>
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 px-1">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.ids.map((id) => {
                    const r      = roles.find((r) => r.id === id)!;
                    const active = activeRole === id;
                    return (
                      <button
                        key={id}
                        onClick={() => selectRole(id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                          active
                            ? `${r.bg} ${r.color} shadow-sm`
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <span className={`shrink-0 ${active ? r.color : "text-gray-500 dark:text-gray-400"}`}>
                          {roleIconMap[r.id]}
                        </span>
                        <span className="leading-snug truncate">{r.label}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* ── Questions panel ── */}
      <div className="flex-1 min-w-0">
        {/* Role header */}
        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl border mb-5 ${role.bg}`}>
          <div className={`w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center shrink-0 ${role.color}`}>
            {roleIconMap[role.id]}
          </div>
          <div>
            <h3 className={`font-bold ${role.color}`}>{role.label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {role.questions.length} questions · {categories.length} categor{categories.length === 1 ? "y" : "ies"}: {categories.join(", ")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {role.questions.map((q, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => { setOpenIdx(openIdx === i ? null : i); setShowSample(null); }}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${role.bg} ${role.color}`}>
                    {q.category}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{q.q}</span>
                </div>
                <ChevronDown className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 ${openIdx === i ? "rotate-180" : ""}`} />
              </button>

              {openIdx === i && (
                <div className="px-5 pb-5 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-4 py-3">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-300">{q.tip}</p>
                  </div>

                  <button
                    onClick={() => setShowSample(showSample === i ? null : i)}
                    className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {showSample === i ? "Hide" : "See"} sample answer
                  </button>

                  {showSample === i && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-1 uppercase tracking-wide">Sample Answer</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{q.sample}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
