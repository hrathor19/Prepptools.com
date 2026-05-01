"use client";

import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import {
  AlignLeft, CaseSensitive, FileText, Repeat,
  Percent, Receipt, Calculator, Ruler, Thermometer, Scale,
  Landmark, TrendingUp, Activity, Cake, Flame,
  Braces, Binary, ShieldCheck, Pipette, CalendarDays,
  ImageDown, FilePlus2, Scissors, PackageOpen, RotateCw,
  FileX, Stamp, FileImage, Minimize2, Maximize2, RefreshCw, FlipHorizontal,
  ArrowRight, GitCompare, ListFilter, Link as LinkIcon, FileCode, Replace,
  RemoveFormatting, Tag, Fuel, LetterText, PiggyBank, DollarSign,
  Briefcase, Banknote, GlassWater, Moon, Weight, Baby, HeartPulse,
  Link2, Code, Key, AlarmClock, Search, Fingerprint, Globe, Crop,
  QrCode, Timer, Hourglass, Dice5, CircleDot, BookOpen, TextCursorInput,
  Globe2, RectangleHorizontal, BarChart2, Clock3, PenLine, LockOpen,
  Hash, FilePen, ListOrdered, AlignVerticalSpaceBetween, Layers, Circle,
  FileOutput, FileType2, Table2, Sheet, FileSpreadsheet, FileSearch,
  FileInput, Lock, FileSearch2, FileBox, Keyboard,
  Wand2, SpellCheck, ScanText, IndianRupee,
} from "lucide-react";
import type { Tool } from "@/lib/tools-data";
import { categories } from "@/lib/tools-data";

const iconMap: Record<string, React.ReactNode> = {
  AlignLeft: <AlignLeft className="w-5 h-5" />,
  CaseSensitive: <CaseSensitive className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Repeat: <Repeat className="w-5 h-5" />,
  Percent: <Percent className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Ruler: <Ruler className="w-5 h-5" />,
  Thermometer: <Thermometer className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Cake: <Cake className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Braces: <Braces className="w-5 h-5" />,
  Binary: <Binary className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Pipette: <Pipette className="w-5 h-5" />,
  CalendarDays: <CalendarDays className="w-5 h-5" />,
  ImageDown: <ImageDown className="w-5 h-5" />,
  FilePlus2: <FilePlus2 className="w-5 h-5" />,
  Scissors: <Scissors className="w-5 h-5" />,
  PackageOpen: <PackageOpen className="w-5 h-5" />,
  RotateCw: <RotateCw className="w-5 h-5" />,
  FileX: <FileX className="w-5 h-5" />,
  Stamp: <Stamp className="w-5 h-5" />,
  FileImage: <FileImage className="w-5 h-5" />,
  Minimize2: <Minimize2 className="w-5 h-5" />,
  Maximize2: <Maximize2 className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  FlipHorizontal: <FlipHorizontal className="w-5 h-5" />,
  GitCompare: <GitCompare className="w-5 h-5" />,
  ListFilter: <ListFilter className="w-5 h-5" />,
  Link: <LinkIcon className="w-5 h-5" />,
  FileCode: <FileCode className="w-5 h-5" />,
  Replace: <Replace className="w-5 h-5" />,
  RemoveFormatting: <RemoveFormatting className="w-5 h-5" />,
  Tag: <Tag className="w-5 h-5" />,
  Fuel: <Fuel className="w-5 h-5" />,
  LetterText: <LetterText className="w-5 h-5" />,
  PiggyBank: <PiggyBank className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Banknote: <Banknote className="w-5 h-5" />,
  GlassWater: <GlassWater className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  Weight: <Weight className="w-5 h-5" />,
  Baby: <Baby className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
  Link2: <Link2 className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Key: <Key className="w-5 h-5" />,
  AlarmClock: <AlarmClock className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Fingerprint: <Fingerprint className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Crop: <Crop className="w-5 h-5" />,
  QrCode: <QrCode className="w-5 h-5" />,
  Timer: <Timer className="w-5 h-5" />,
  Hourglass: <Hourglass className="w-5 h-5" />,
  Dice5: <Dice5 className="w-5 h-5" />,
  CircleDot: <CircleDot className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  TextCursorInput: <TextCursorInput className="w-5 h-5" />,
  Globe2: <Globe2 className="w-5 h-5" />,
  RectangleHorizontal: <RectangleHorizontal className="w-5 h-5" />,
  BarChart2: <BarChart2 className="w-5 h-5" />,
  Clock3: <Clock3 className="w-5 h-5" />,
  PenLine: <PenLine className="w-5 h-5" />,
  LockOpen: <LockOpen className="w-5 h-5" />,
  Hash: <Hash className="w-5 h-5" />,
  FilePen: <FilePen className="w-5 h-5" />,
  ListOrdered: <ListOrdered className="w-5 h-5" />,
  AlignVerticalSpaceBetween: <AlignVerticalSpaceBetween className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Circle: <Circle className="w-5 h-5" />,
  FileOutput: <FileOutput className="w-5 h-5" />,
  FileType2: <FileType2 className="w-5 h-5" />,
  Table2: <Table2 className="w-5 h-5" />,
  Sheet: <Sheet className="w-5 h-5" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5" />,
  FileSearch: <FileSearch className="w-5 h-5" />,
  FileInput: <FileInput className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  FileSearch2: <FileSearch2 className="w-5 h-5" />,
  FileBox: <FileBox className="w-5 h-5" />,
  Keyboard: <Keyboard className="w-5 h-5" />,
  Wand2: <Wand2 className="w-5 h-5" />,
  SpellCheck: <SpellCheck className="w-5 h-5" />,
  ScanText: <ScanText className="w-5 h-5" />,
  IndianRupee: <IndianRupee className="w-5 h-5" />,
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const category = categories.find((c) => c.id === tool.category);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
    >
      {/* Favorite button */}
      <div className="absolute top-3 right-3">
        <FavoriteButton slug={tool.slug} />
      </div>

      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${category?.bgColor ?? "bg-blue-50"} ${category?.color ?? "text-blue-600"}`}
        >
          {iconMap[tool.icon] ?? <Calculator className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
            {tool.name}
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transform duration-200" />
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
