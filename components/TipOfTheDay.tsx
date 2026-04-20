import { Lightbulb } from "lucide-react";
import { tips } from "@/lib/tips-data";

export default function TipOfTheDay() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const tip = tips[dayOfYear % tips.length];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-start gap-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-5 py-4">
        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-800/40 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">
            Tip of the Day
          </p>
          <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">{tip}</p>
        </div>
      </div>
    </section>
  );
}
