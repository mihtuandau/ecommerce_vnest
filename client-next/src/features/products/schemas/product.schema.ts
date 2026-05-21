import * as z from "zod";
import { nameSchema } from "@/lib/zod";

export const productSchema = z.object({
  name: nameSchema,
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  basePrice: z.coerce.number().min(0, "Giá không được âm"),
  originalPrice: z.coerce.number().min(0).optional(),
  categoryId: z.coerce.number().min(1, "Vui lòng chọn danh mục"),
  brandId: z.coerce.number().optional(),
  status: z.enum(["active", "draft", "inactive"]),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  packageWeight: z.coerce.number().min(0).optional(),
  packageLength: z.coerce.number().min(0).optional(),
  packageWidth: z.coerce.number().min(0).optional(),
  packageHeight: z.coerce.number().min(0).optional(),
  images: z.array(z.string()),
  variants: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        size: z.string().nullable().optional(),
        color: z.string().nullable().optional(),
        sku: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
        price: z.coerce.number().min(0).optional(),
        originalPrice: z.coerce.number().min(0).optional(),
        stock: z.coerce.number().min(0).default(0),
      })
    )
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
