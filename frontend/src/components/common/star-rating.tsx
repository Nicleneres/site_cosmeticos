import { Star } from "lucide-react";

type StarRatingProps = {
  value: number;
};

export function StarRating({ value }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < value ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`}
        />
      ))}
    </div>
  );
}
