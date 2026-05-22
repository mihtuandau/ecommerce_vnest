import type { Discount } from "@/types/models";
import type { DiscountFormValues } from "@/features/discounts/schemas";

export function formatDiscountDateForInput(date: string | Date | undefined | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

export function mapDiscountToFormValues(initialData: Discount | any) {
  return {
    code: initialData.code || "",
    description: initialData.description || "",
    image: initialData.image || "",
    isFlashSale: !!initialData.isFlashSale,
    isActive: initialData.isActive ?? true,
    type: initialData.percentage
      ? "PERCENTAGE"
      : initialData.fixedAmount
        ? "FIXED"
        : initialData.type || "PERCENTAGE",
    value: initialData.percentage || initialData.fixedAmount || initialData.value || 0,
    minOrderAmount: initialData.minOrderValue || initialData.minOrderAmount || 0,
    maxDiscountAmount: initialData.maxDiscount || initialData.maxDiscountAmount || 0,
    usageLimit: initialData.usageLimit || 100,
    startDate: formatDiscountDateForInput(initialData.startDate),
    endDate: formatDiscountDateForInput(initialData.endDate),
    applicableToProducts: (initialData.applicableToProducts || []).map((p: any) => ({
      productId: String(p.productId || p),
      stockLimit: p.stockLimit || 0,
      percentage: p.percentage || null,
      fixedAmount: p.fixedAmount || null,
      badge: p.badge || null,
    })),
  };
}

export function mapDiscountFormToPayload(values: DiscountFormValues | any) {
  const submissionValues = {
    ...values,
    percentage: values.type === "PERCENTAGE" ? Number(values.value) : null,
    fixedAmount: values.type === "FIXED" ? Number(values.value) : null,
    applicableToProducts: (values.applicableToProducts || []).map((p: any) => ({
      productId: Number(p.productId),
      stockLimit:
        p.stockLimit !== "" && p.stockLimit !== null ? Number(p.stockLimit) : 0,
      percentage:
        p.percentage !== "" && p.percentage !== null ? Number(p.percentage) : null,
      fixedAmount:
        p.fixedAmount !== "" && p.fixedAmount !== null ? Number(p.fixedAmount) : null,
      badge: p.badge || null,
    })),
  };

  delete (submissionValues as any).type;
  delete (submissionValues as any).value;

  return submissionValues;
}

export function mapDiscountMutationValues(values: DiscountFormValues | any) {
  const { type, value, ...rest } = values;

  return {
    ...rest,
    percentage: type === "PERCENTAGE" ? value : null,
    fixedAmount: type === "FIXED" ? value : null,
  };
}
