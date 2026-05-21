import * as z from "zod";
import { emailSchema, nameSchema } from "@/lib/zod";
import { Role, UserStatus } from "@/types/enums";

export const userSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
  status: z.nativeEnum(UserStatus),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
