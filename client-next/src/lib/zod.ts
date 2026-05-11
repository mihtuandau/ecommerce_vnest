import { z } from "zod";

// ── Shared Zod schemas — reusable across forms ──

export const emailSchema = z
  .string()
  .min(1, "Email là bắt buộc")
  .email("Email không hợp lệ");

export const passwordSchema = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .max(64, "Mật khẩu tối đa 64 ký tự");

export const phoneSchema = z
  .string()
  .regex(/^(0|\+84)\d{9}$/, "Số điện thoại không hợp lệ")
  .optional();

export const nameSchema = z
  .string()
  .min(2, "Tên tối thiểu 2 ký tự")
  .max(100, "Tên tối đa 100 ký tự");

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
