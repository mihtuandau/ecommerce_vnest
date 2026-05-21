"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { ROLE_CONFIG } from "@/features/permissions/constants/index";
import { userSchema, type UserFormValues } from "@/features/users/schemas";
import { Role, UserStatus } from "@/types/enums";
import type { User } from "@/types/models";

interface UserFormProps {
  initialData?: User | null;
  onSubmit: (data: UserFormValues) => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role || Role.CUSTOMER,
        status: initialData.status || UserStatus.ACTIVE,
        password: "",
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-wide text-slate-600">
                    Họ và tên
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Nguyễn Văn A"
                      {...field}
                      className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-wide text-slate-600">
                    Email liên hệ
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      {...field}
                      className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-wide text-slate-600">
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0987xxxxxx"
                      {...field}
                      className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-wide text-slate-600">
                    Vai trò
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl admin-theme">
                      {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold tracking-wide text-slate-600">
                    Trạng thái
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-xl h-12 border-slate-200 focus:ring-primary/20">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl admin-theme">
                      <SelectItem value={UserStatus.ACTIVE}>Đang hoạt động</SelectItem>
                      <SelectItem value={UserStatus.SUSPENDED}>Vô hiệu hóa</SelectItem>
                      <SelectItem value={UserStatus.PENDING}>Chờ xác minh</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-semibold tracking-wide text-slate-600">
                Mật khẩu {initialData && "(Để trống nếu không muốn đổi)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  className="rounded-xl h-12 border-slate-200 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl px-6 h-12 font-semibold text-slate-600 hover:bg-slate-50"
            onClick={() => window.history.back()}
          >
            <X className="h-4 w-4 mr-2" /> Hủy
          </Button>
          <Button
            type="submit"
            className="rounded-xl px-8 h-12 font-semibold bg-primary text-white hover:bg-slate-800 shadow-sm gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              "Đang xử lý..."
            ) : (
              <>
                <Save className="h-4 w-4" />
                {initialData ? "Lưu thay đổi" : "Tạo người dùng"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
