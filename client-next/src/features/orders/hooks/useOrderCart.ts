import { useState, useCallback, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Product, ProductVariant } from "@/types/models";
import { toast } from "sonner";
import { discountsApi } from "@/features/discounts/api";

const orderFormSchema = z.object({
  userId: z.number().optional(),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
  shippingAddress: z.string(),
  paymentMethod: z.string(),
  status: z.string(),
  shippingFee: z.number(),
  discountCode: z.string().optional(),
  items: z.array(z.object({
    variantId: z.string(),
    quantity: z.number().min(1),
    productName: z.string(),
    price: z.number(),
    image: z.string().optional(),
    stock: z.number().optional(),
  })).min(1, "Vui lòng chọn ít nhất 1 sản phẩm"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export function useOrderCart(): {
  form: UseFormReturn<OrderFormValues>;
  items: OrderFormValues["items"];
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedDiscount: any;
  isValidatingDiscount: boolean;
  addVariantToCart: (product: Product, variant: ProductVariant) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeListItem: (index: number) => void;
  validateDiscount: (code: string) => Promise<void>;
  setAppliedDiscount: (discount: any) => void;
} {
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      paymentMethod: "CASH",
      status: "DELIVERED",
      shippingFee: 0,
      items: [],
      shippingAddress: "Mua tại quầy",
    },
  });

  const items = form.watch("items") || [];

  const addVariantToCart = useCallback((product: Product, variant: ProductVariant) => {
    if (variant.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    
    const currentItems = form.getValues("items") || [];
    const existingIndex = currentItems.findIndex((i: any) => i.variantId === String(variant.id));
    const variantLabel = [variant.size, variant.color].filter(Boolean).join(" • ");
    const productName = variantLabel ? `${product.name} (${variantLabel})` : product.name;

    if (existingIndex > -1) {
      const currentQty = currentItems[existingIndex].quantity;
      if (currentQty + 1 > variant.stock) {
        toast.error("Vượt quá số lượng tồn kho");
        return;
      }
      form.setValue(`items.${existingIndex}.quantity`, currentQty + 1);
    } else {
      form.setValue("items", [
        ...currentItems,
        {
          variantId: String(variant.id),
          quantity: 1,
          productName,
          price: variant.price,
          image: (variant.images?.[0] as any)?.url || (product.images?.[0] as any)?.url,
          stock: variant.stock
        }
      ]);
    }
    toast.success(`Đã thêm ${product.name}`);
  }, [form]);

  const updateQuantity = useCallback((index: number, delta: number) => {
    const currentItems = form.getValues("items");
    const item = currentItems[index];
    const stock = item.stock || 999;
    const next = item.quantity + delta;
    
    if (next >= 1 && next <= stock) {
      form.setValue(`items.${index}.quantity`, next);
    } else if (next > stock) {
      toast.error("Vượt quá số lượng tồn kho");
    }
  }, [form]);

  const removeListItem = useCallback((index: number) => {
    const currentItems = form.getValues("items");
    form.setValue("items", currentItems.filter((_, i) => i !== index));
  }, [form]);

  const subtotal = useMemo(() => 
    items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    [items]
  );

  const calculateDiscountAmount = useCallback(() => {
    if (!appliedDiscount) return 0;
    
    const minOrder = Number(appliedDiscount.minOrderAmount || appliedDiscount.minOrderValue || 0);
    const maxDiscount = Number(appliedDiscount.maxDiscountAmount || appliedDiscount.maxDiscount || 0);
    const discountVal = Number(appliedDiscount.discountValue || appliedDiscount.value || 0);

    if (minOrder && subtotal < minOrder) return 0;

    let amount = 0;
    if (appliedDiscount.discountType === 'PERCENTAGE' || appliedDiscount.type === 'PERCENTAGE') {
      amount = Math.round((subtotal * discountVal) / 100);
    } else {
      amount = discountVal;
    }

    if (maxDiscount && amount > maxDiscount) amount = maxDiscount;
    return Math.min(amount, subtotal);
  }, [appliedDiscount, subtotal]);

  const discountAmount = useMemo(() => calculateDiscountAmount(), [calculateDiscountAmount]);
  const total = useMemo(() => subtotal - discountAmount, [subtotal, discountAmount]);

  const validateDiscount = async (code: string) => {
    if (!code) {
      setAppliedDiscount(null);
      return;
    }

    try {
      setIsValidatingDiscount(true);
      const res: any = await discountsApi.validateDiscount(code);

      if (res.statusCode >= 400 || res.isValid === false) {
        toast.error(res.message || "Mã không hợp lệ");
        setAppliedDiscount(null);
      } else {
        setAppliedDiscount(res.discount);
        toast.success(`Đã áp dụng mã: ${res.discount.code}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể kiểm tra mã giảm giá");
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  return {
    form,
    items,
    subtotal,
    discountAmount,
    total,
    appliedDiscount,
    isValidatingDiscount,
    addVariantToCart,
    updateQuantity,
    removeListItem,
    validateDiscount,
    setAppliedDiscount
  };
}
