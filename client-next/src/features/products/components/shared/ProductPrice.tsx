import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

interface ProductPriceProps {
  price: number;
  originalPrice?: number | null;
  className?: string;
}

export function ProductPrice({ price, originalPrice, className }: ProductPriceProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="font-semibold text-brand-espresso">{formatCurrency(price)}</span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs text-brand-taupe line-through">
          {formatCurrency(originalPrice)}
        </span>
      )}
    </div>
  );
}
