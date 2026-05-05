import { Star } from "lucide-react";

type Props = {
  rating: number;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm:  { cls: "w-3 h-3",     gap: "gap-0.5" },
  md:  { cls: "w-3.5 h-3.5", gap: "gap-0.5" },
  lg:  { cls: "w-5 h-5",     gap: "gap-1" },
};

export default function StarRating({ rating, size = "sm" }: Props) {
  const { cls, gap } = sizes[size];
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <div
      className={`relative inline-flex ${gap}`}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {/* Gray background row */}
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${cls} text-gray-200 shrink-0`} fill="currentColor" />
      ))}

      {/* Yellow foreground row — clipped to pct% width.
          Uses top-0 left-0 (not inset-0) so the inline width isn't overridden by right:0 */}
      <div
        className={`absolute top-0 left-0 h-full overflow-hidden flex ${gap}`}
        style={{ width: `${pct}%` }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`${cls} text-yellow-400 shrink-0`} fill="currentColor" />
        ))}
      </div>
    </div>
  );
}
