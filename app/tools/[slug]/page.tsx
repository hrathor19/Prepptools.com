import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight, ArrowLeft,
  AlignLeft, CaseSensitive, FileText, Repeat,
  Percent, Receipt, Calculator, Ruler, Thermometer, Scale,
  Landmark, TrendingUp, Activity, Cake, Flame,
  Braces, Binary, ShieldCheck, Pipette, CalendarDays,
  Type, ArrowLeftRight, Heart, Code2, Palette, Clock,
  // PDF & Image
  ImageDown, FilePlus2, Scissors, PackageOpen, RotateCw,
  FileX, Stamp, FileImage, Minimize2, Maximize2, RefreshCw,
  FlipHorizontal, Keyboard,
} from "lucide-react";
import { getToolBySlug, getCategoryById, getToolsByCategory, tools } from "@/lib/tools-data";
import ToolCard from "@/components/ToolCard";
import ToolRunner from "./ToolRunner";

const iconMap: Record<string, React.ReactNode> = {
  AlignLeft: <AlignLeft className="w-7 h-7" />,
  CaseSensitive: <CaseSensitive className="w-7 h-7" />,
  FileText: <FileText className="w-7 h-7" />,
  Repeat: <Repeat className="w-7 h-7" />,
  Percent: <Percent className="w-7 h-7" />,
  Receipt: <Receipt className="w-7 h-7" />,
  Calculator: <Calculator className="w-7 h-7" />,
  Ruler: <Ruler className="w-7 h-7" />,
  Thermometer: <Thermometer className="w-7 h-7" />,
  Scale: <Scale className="w-7 h-7" />,
  Landmark: <Landmark className="w-7 h-7" />,
  TrendingUp: <TrendingUp className="w-7 h-7" />,
  Activity: <Activity className="w-7 h-7" />,
  Cake: <Cake className="w-7 h-7" />,
  Flame: <Flame className="w-7 h-7" />,
  Braces: <Braces className="w-7 h-7" />,
  Binary: <Binary className="w-7 h-7" />,
  ShieldCheck: <ShieldCheck className="w-7 h-7" />,
  Pipette: <Pipette className="w-7 h-7" />,
  CalendarDays: <CalendarDays className="w-7 h-7" />,
  ImageDown: <ImageDown className="w-7 h-7" />,
  FilePlus2: <FilePlus2 className="w-7 h-7" />,
  Scissors: <Scissors className="w-7 h-7" />,
  PackageOpen: <PackageOpen className="w-7 h-7" />,
  RotateCw: <RotateCw className="w-7 h-7" />,
  FileX: <FileX className="w-7 h-7" />,
  Stamp: <Stamp className="w-7 h-7" />,
  FileImage: <FileImage className="w-7 h-7" />,
  Minimize2: <Minimize2 className="w-7 h-7" />,
  Maximize2: <Maximize2 className="w-7 h-7" />,
  RefreshCw: <RefreshCw className="w-7 h-7" />,
  FlipHorizontal: <FlipHorizontal className="w-7 h-7" />,
  Keyboard: <Keyboard className="w-7 h-7" />,
};

const categoryIconMap: Record<string, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  math: <Calculator className="w-4 h-4" />,
  converters: <ArrowLeftRight className="w-4 h-4" />,
  finance: <TrendingUp className="w-4 h-4" />,
  health: <Heart className="w-4 h-4" />,
  developer: <Code2 className="w-4 h-4" />,
  color: <Palette className="w-4 h-4" />,
  datetime: <Clock className="w-4 h-4" />,
  pdf: <FileImage className="w-4 h-4" />,
  image: <Palette className="w-4 h-4" />,
};

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };
  return {
    title: tool.name,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const category = getCategoryById(tool.category);
  const related = getToolsByCategory(tool.category)
    .filter((t) => t.slug !== tool.slug)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tools" className="hover:text-gray-600 transition-colors">Tools</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/tools?category=${tool.category}`} className="hover:text-gray-600 transition-colors">
          {category?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-600 font-medium">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${category?.bgColor ?? "bg-blue-50"} ${category?.color ?? "text-blue-600"}`}>
          {iconMap[tool.icon] ?? <Calculator className="w-7 h-7" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/tools?category=${tool.category}`}
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${category?.bgColor} ${category?.color} ${category?.borderColor} border`}
            >
              {categoryIconMap[tool.category]}
              {category?.name}
            </Link>
            <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2.5 py-1 rounded-full font-medium">
              Free
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">{tool.description}</p>
        </div>
      </div>

      {/* Tool Panel */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-10">
        <ToolRunner slug={slug} />
      </div>

      {/* Back link */}
      <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-10">
        <ArrowLeft className="w-4 h-4" />
        Back to all tools
      </Link>

      {/* Related Tools */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            More {category?.name} Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
