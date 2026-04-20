import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { tools, getCategoryById } from "@/lib/tools-data";

export default function ToolOfTheDay() {
  const featured = tools.filter((t) => t.featured);
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const tool = featured[dayOfYear % featured.length];
  const category = getCategoryById(tool.category);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl overflow-hidden">
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 py-6 sm:px-8">
          {/* Left */}
          <div className="flex items-center gap-5">
            <div className="flex-shrink-0 w-14 h-14 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-200 uppercase tracking-widest mb-1">
                Tool of the Day
              </p>
              <h2 className="text-xl font-extrabold text-white">{tool.name}</h2>
              <p className="text-sm text-purple-100/80 mt-0.5 max-w-sm leading-snug line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 shrink-0">
            {category && (
              <span className="hidden sm:inline-flex text-xs bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full font-medium">
                {category.name}
              </span>
            )}
            <Link
              href={`/tools/${tool.slug}`}
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-sm shadow-lg"
            >
              Try it free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
