import { Star } from "lucide-react";

type Props = {
  rating: number;
  size?: "sm" | "md" | "lg";
};

const sizes: Record<string, { cls: string; px: number }> = {
  sm:  { cls: "w-3 h-3",   px: 12 },
  md:  { cls: "w-3.5 h-3.5", px: 14 },
  lg:  { cls: "w-5 h-5",   px: 20 },
};

export default function StarRating({ rating, size = "sm" }: Props) {
  const { cls, px } = sizes[size];

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.min(1, Math.max(0, rating - (star - 1)));
        const pct = Math.round(fill * 100);

        return (
          <span
            key={star}
            className="relative inline-block shrink-0"
            style={{ width: px, height: px }}
          >
            <Star
              className={`${cls} absolute inset-0 text-gray-200`}
              fill="currentColor"
            />
            {pct > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${pct}%` }}
              >
                <Star
                  className={`${cls} text-yellow-400 absolute inset-0`}
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
