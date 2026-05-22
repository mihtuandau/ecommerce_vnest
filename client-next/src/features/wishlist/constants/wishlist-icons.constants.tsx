import {
  Coffee,
  Compass,
  Crown,
  FolderOpen,
  Gift,
  Heart,
  Laptop,
  Palette,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const WISHLIST_ICON_MAP: Record<string, LucideIcon> = {
  Coffee,
  Compass,
  Crown,
  FolderOpen,
  Gift,
  Heart,
  Laptop,
  Palette,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Zap,
};

export const WISHLIST_COLLECTION_ICON_OPTIONS = [
  { name: "Shirt", label: "Thời trang", Icon: Shirt },
  { name: "ShoppingBag", label: "Giày & Túi", Icon: ShoppingBag },
  { name: "Sparkles", label: "Mỹ phẩm", Icon: Sparkles },
  { name: "Gift", label: "Quà tặng", Icon: Gift },
  { name: "Heart", label: "Đặc biệt", Icon: Heart },
  { name: "Crown", label: "Cao cấp", Icon: Crown },
  { name: "Zap", label: "Nổi bật", Icon: Zap },
  { name: "Star", label: "Yêu thích nhất", Icon: Star },
  { name: "Laptop", label: "Công nghệ", Icon: Laptop },
  { name: "Coffee", label: "Đồ uống", Icon: Coffee },
  { name: "Palette", label: "Nghệ thuật", Icon: Palette },
  { name: "Compass", label: "Du lịch", Icon: Compass },
] as const;

export function isEmojiIcon(name: string) {
  return (
    /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g.test(
      name
    ) || name.length <= 2
  );
}
