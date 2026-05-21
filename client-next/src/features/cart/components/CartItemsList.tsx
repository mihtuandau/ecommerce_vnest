import { CartItem } from "@/features/cart/components/CartItem";
import { groupCartItemsByProduct } from "@/features/cart/services";
import type { CartItem as CartItemType } from "@/store/useCartStore";

interface CartItemsListProps {
  items: CartItemType[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  toggleSelectItem: (id: string) => void;
}

export function CartItemsList({
  items,
  updateQuantity,
  removeItem,
  toggleSelectItem,
}: CartItemsListProps) {
  const groups = groupCartItemsByProduct(items);

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groups).map(([key, groupItems]) => (
        <div
          key={key}
          className="bg-white rounded-[24px] border border-brand-sand shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-espresso/5"
        >
          <div className="px-6 py-4 border-b border-brand-cream bg-brand-cream/30">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-brand-espresso rounded-full" />
              <h3 className="font-serif font-bold text-brand-espresso text-[15px] leading-snug tracking-tight">
                {groupItems[0].name}
              </h3>
            </div>
          </div>

          <div className="divide-y divide-brand-cream">
            {groupItems.map((item) => (
              <CartItem
                key={item.variantId}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                toggleSelectItem={toggleSelectItem}
                isGrouped
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
