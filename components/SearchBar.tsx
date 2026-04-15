"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, X, Calculator,
  AlignLeft, CaseSensitive, FileText, Repeat,
  Percent, Receipt, Ruler, Thermometer, Scale,
  Landmark, TrendingUp, Activity, Cake, Flame,
  Braces, Binary, ShieldCheck, Pipette, CalendarDays,
  ImageDown, FilePlus2, Scissors, PackageOpen, RotateCw,
  FileX, Stamp, FileImage, Minimize2, Maximize2, RefreshCw, FlipHorizontal,
  GitCompare, ListFilter, Link as LinkIcon, FileCode, Replace, RemoveFormatting,
  Tag, Fuel, LetterText, PiggyBank, DollarSign, Briefcase, Banknote,
  GlassWater, Moon, Weight, Baby, HeartPulse, Link2, Code, Key,
  AlarmClock, Fingerprint, Globe, Crop, QrCode, Timer, Hourglass,
  Dice5, CircleDot, BookOpen, TextCursorInput, Globe2, RectangleHorizontal,
  BarChart2, Clock3, PenLine, LockOpen, Hash, FilePen, ListOrdered,
  AlignVerticalSpaceBetween, Layers, Circle, FileOutput, FileType2,
  Table2, Sheet, FileSpreadsheet, FileSearch, FileInput, Lock, FileBox, Keyboard,
  ArrowRight,
} from "lucide-react";
import { searchTools, categories } from "@/lib/tools-data";
import type { Tool } from "@/lib/tools-data";
import Link from "next/link";

const iconMap: Record<string, React.ReactNode> = {
  AlignLeft: <AlignLeft className="w-4 h-4" />,
  CaseSensitive: <CaseSensitive className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  Repeat: <Repeat className="w-4 h-4" />,
  Percent: <Percent className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Ruler: <Ruler className="w-4 h-4" />,
  Thermometer: <Thermometer className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Cake: <Cake className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  Braces: <Braces className="w-4 h-4" />,
  Binary: <Binary className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Pipette: <Pipette className="w-4 h-4" />,
  CalendarDays: <CalendarDays className="w-4 h-4" />,
  ImageDown: <ImageDown className="w-4 h-4" />,
  FilePlus2: <FilePlus2 className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
  PackageOpen: <PackageOpen className="w-4 h-4" />,
  RotateCw: <RotateCw className="w-4 h-4" />,
  FileX: <FileX className="w-4 h-4" />,
  Stamp: <Stamp className="w-4 h-4" />,
  FileImage: <FileImage className="w-4 h-4" />,
  Minimize2: <Minimize2 className="w-4 h-4" />,
  Maximize2: <Maximize2 className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  FlipHorizontal: <FlipHorizontal className="w-4 h-4" />,
  GitCompare: <GitCompare className="w-4 h-4" />,
  ListFilter: <ListFilter className="w-4 h-4" />,
  Link: <LinkIcon className="w-4 h-4" />,
  FileCode: <FileCode className="w-4 h-4" />,
  Replace: <Replace className="w-4 h-4" />,
  RemoveFormatting: <RemoveFormatting className="w-4 h-4" />,
  Tag: <Tag className="w-4 h-4" />,
  Fuel: <Fuel className="w-4 h-4" />,
  LetterText: <LetterText className="w-4 h-4" />,
  PiggyBank: <PiggyBank className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  Banknote: <Banknote className="w-4 h-4" />,
  GlassWater: <GlassWater className="w-4 h-4" />,
  Moon: <Moon className="w-4 h-4" />,
  Weight: <Weight className="w-4 h-4" />,
  Baby: <Baby className="w-4 h-4" />,
  HeartPulse: <HeartPulse className="w-4 h-4" />,
  Link2: <Link2 className="w-4 h-4" />,
  Code: <Code className="w-4 h-4" />,
  Key: <Key className="w-4 h-4" />,
  AlarmClock: <AlarmClock className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Fingerprint: <Fingerprint className="w-4 h-4" />,
  Globe: <Globe className="w-4 h-4" />,
  Crop: <Crop className="w-4 h-4" />,
  QrCode: <QrCode className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  Hourglass: <Hourglass className="w-4 h-4" />,
  Dice5: <Dice5 className="w-4 h-4" />,
  CircleDot: <CircleDot className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  TextCursorInput: <TextCursorInput className="w-4 h-4" />,
  Globe2: <Globe2 className="w-4 h-4" />,
  RectangleHorizontal: <RectangleHorizontal className="w-4 h-4" />,
  BarChart2: <BarChart2 className="w-4 h-4" />,
  Clock3: <Clock3 className="w-4 h-4" />,
  PenLine: <PenLine className="w-4 h-4" />,
  LockOpen: <LockOpen className="w-4 h-4" />,
  Hash: <Hash className="w-4 h-4" />,
  FilePen: <FilePen className="w-4 h-4" />,
  ListOrdered: <ListOrdered className="w-4 h-4" />,
  AlignVerticalSpaceBetween: <AlignVerticalSpaceBetween className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Circle: <Circle className="w-4 h-4" />,
  FileOutput: <FileOutput className="w-4 h-4" />,
  FileType2: <FileType2 className="w-4 h-4" />,
  Table2: <Table2 className="w-4 h-4" />,
  Sheet: <Sheet className="w-4 h-4" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4" />,
  FileSearch: <FileSearch className="w-4 h-4" />,
  FileInput: <FileInput className="w-4 h-4" />,
  Lock: <Lock className="w-4 h-4" />,
  FileBox: <FileBox className="w-4 h-4" />,
  Keyboard: <Keyboard className="w-4 h-4" />,
};

function ToolIcon({ tool }: { tool: Tool }) {
  const category = categories.find((c) => c.id === tool.category);
  return (
    <div
      className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
        category?.bgColor ?? "bg-blue-50"
      } ${category?.color ?? "text-blue-600"}`}
    >
      {iconMap[tool.icon] ?? <Calculator className="w-4 h-4" />}
    </div>
  );
}

export default function SearchBar({ large = false }: { large?: boolean }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const found = searchTools(query.trim());
    setResults(found.slice(0, 6));
    setOpen(true);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full text-left">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 ${large ? "w-5 h-5" : "w-4 h-4"}`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setOpen(true)}
            placeholder="Search tools… (e.g. BMI, password, JSON)"
            className={`w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl pl-11 pr-10 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-left ${
              large ? "py-3.5 text-base" : "py-2.5 text-sm"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
              Tools
            </p>
          </div>
          {results.map((tool, i) => {
            const category = categories.find((c) => c.id === tool.category);
            return (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                onClick={() => { setOpen(false); setQuery(""); }}
                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-700/60 transition-colors group ${
                  i < results.length - 1 ? "" : ""
                }`}
              >
                {/* Tool icon with category color */}
                <ToolIcon tool={tool} />

                {/* Name + description */}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate">
                    {tool.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {tool.description}
                  </p>
                </div>

                {/* Category badge */}
                <span className={`hidden sm:inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${category?.bgColor ?? "bg-gray-100"} ${category?.color ?? "text-gray-500"}`}>
                  {category?.name}
                </span>

                <ArrowRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 shrink-0 transition-colors" />
              </Link>
            );
          })}

          {/* Footer */}
          <div className="border-t border-gray-100 dark:border-gray-700 mx-3 my-1" />
          <div className="px-3 pb-2.5">
            <Link
              href={`/tools?q=${encodeURIComponent(query)}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/60 font-medium transition-colors"
            >
              <Search className="w-4 h-4" />
              See all results for &quot;{query}&quot;
              <ArrowRight className="w-3.5 h-3.5 ml-auto" />
            </Link>
          </div>
        </div>
      )}

      {/* No results */}
      {open && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            No tools found for &quot;{query}&quot;
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Try a different keyword
          </p>
        </div>
      )}
    </div>
  );
}
