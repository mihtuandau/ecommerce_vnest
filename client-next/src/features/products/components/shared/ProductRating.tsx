import { RatingStars } from "@/components/shared/RatingStars";

interface ProductRatingProps {
  rating?: number | null;
  reviewCount?: number;
}

export function ProductRating({ rating = 0, reviewCount }: ProductRatingProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-brand-taupe">
      <RatingStars rating={Number(rating || 0)} size={14} />
      {typeof reviewCount === "number" && <span>({reviewCount})</span>}
    </div>
  );
}
