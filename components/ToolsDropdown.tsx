"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Type, Calculator, ArrowLeftRight, TrendingUp, Heart, Code2,
  Palette, Clock, FileImage, ImageIcon, FileBox, Zap, Wrench,
  ChevronDown,
  AlignLeft, CaseSensitive, FileText, Repeat,
  Percent, Receipt, Ruler, Thermometer, Scale,
  Landmark, Activity, Cake, Flame,
  Braces, Binary, ShieldCheck, Pipette, CalendarDays,
  ImageDown, FilePlus2, Scissors, PackageOpen, RotateCw,
  FileX, Stamp, Minimize2, Maximize2, RefreshCw, FlipHorizontal,
  GitCompare, ListFilter, Link as LinkIcon, FileCode, Replace,
  RemoveFormatting, Tag, Fuel, LetterText, PiggyBank, DollarSign,
  Briefcase, Banknote, GlassWater, Moon, Weight, Baby, HeartPulse,
  Link2, Code, Key, AlarmClock, Search, Fingerprint, Globe, Crop,
  QrCode, Timer, Hourglass, Dice5, CircleDot, BookOpen, TextCursorInput,
  Globe2, RectangleHorizontal, BarChart2, Clock3, PenLine, LockOpen,
  Hash, FilePen, ListOrdered, AlignVerticalSpaceBetween, Layers, Circle,
  FileOutput, FileType2, Table2, Sheet, FileSpreadsheet, FileSearch,
  FileInput, Lock, FileSearch2, Keyboard,
} from "lucide-react";
import { categories, getToolsByCategory } from "@/lib/tools-data";

const categoryIconMap: Record<string, React.ReactNode> = {
  Type: <Type className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  ArrowLeftRight: <ArrowLeftRight className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  FileType: <FileImage className="w-4 h-4" />,
  ImageIcon: <ImageIcon className="w-4 h-4" />,
  FileBox: <FileBox className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
};

const toolIconMap: Record<string, React.ReactNode> = {
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
  FileSearch2: <FileSearch2 className="w-4 h-4" />,
  Keyboard: <Keyboard className="w-4 h-4" />,
  PresentationIcon: <FileText className="w-4 h-4" />,
};

export default function ToolsDropdown({ isActive }: { isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  const activeCat = categories.find((c) => c.id === activeCategory)!;
  const activeTools = getToolsByCategory(activeCategory);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive || open
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        All Tools
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Mega dropdown */}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-[820px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 flex overflow-hidden">
          {/* Left: category list */}
          <div className="w-52 shrink-0 border-r border-gray-100 dark:border-gray-700 py-2 overflow-y-auto max-h-[480px]">
            {categories.map((cat) => {
              const isSelected = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                    isSelected
                      ? `${cat.bgColor} ${cat.color} font-semibold`
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className={`shrink-0 ${isSelected ? cat.color : "text-gray-400 dark:text-gray-500"}`}>
                    {categoryIconMap[cat.icon] ?? <Zap className="w-4 h-4" />}
                  </span>
                  <span className="text-sm truncate">{cat.name}</span>
                  {isSelected && <span className="ml-auto w-1 h-4 rounded-full bg-current opacity-60" />}
                </button>
              );
            })}
          </div>

          {/* Right: tools grid */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[480px]">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={`${activeCat.color}`}>
                {categoryIconMap[activeCat.icon] ?? <Zap className="w-4 h-4" />}
              </span>
              <h3 className={`text-sm font-bold ${activeCat.color}`}>{activeCat.name}</h3>
              <Link
                href={`/tools?category=${activeCat.id}`}
                className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                onClick={() => setOpen(false)}
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {activeTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <span className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg ${activeCat.bgColor} ${activeCat.color}`}>
                    {toolIconMap[tool.icon] ?? <Calculator className="w-4 h-4" />}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium leading-tight">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
