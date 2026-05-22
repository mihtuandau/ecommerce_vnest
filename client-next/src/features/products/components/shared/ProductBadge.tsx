import { Badge } from "@/components/ui/Badge";

interface ProductBadgeProps {
  isActive?: boolean;
  stock?: number;
}

export function ProductBadge({ isActive = true, stock }: ProductBadgeProps) {
  if (typeof stock === "number" && stock <= 0) {
    return <Badge variant="destructive">Hết hàng</Badge>;
  }

  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Đang bán" : "Đã ẩn"}
    </Badge>
  );
}
