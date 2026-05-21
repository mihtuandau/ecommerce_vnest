import * as z from "zod";

export const discountSchema = z.object({
  code: z.string().min(3, "Ma phai co it nhat 3 ky tu").toUpperCase(),
  description: z.string().optional(),
  image: z.string().optional(),
  isFlashSale: z.boolean().default(false),
  isActive: z.boolean().default(true),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().min(1, "Vui long nhap gia tri giam gia"),
  minOrderAmount: z.coerce.number().min(0).default(0),
  maxDiscountAmount: z.coerce.number().min(0).optional(),
  usageLimit: z.coerce.number().min(1).optional(),
  startDate: z.string().min(1, "Vui long chon ngay bat dau"),
  endDate: z.string().optional(),
  applicableToProducts: z.array(z.any()).default([]),
});

export type DiscountFormValues = z.infer<typeof discountSchema>;
