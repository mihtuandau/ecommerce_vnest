import * as z from "zod";

export const bannerSchema = z.object({
  title: z.string().min(3, "Tieu de phai co it nhat 3 ky tu"),
  link: z.string().optional(),
  displayOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
