"use client";

import { Mail, Phone, Save, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";

interface ProfileFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function ProfileForm({ form, onSubmit, isPending }: ProfileFormProps) {
  return (
    <div className="md:col-span-2">
      <Card className="border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-5">
          <CardTitle className="text-base font-semibold text-slate-800">
            Chỉnh sửa thông tin
          </CardTitle>
          <CardDescription className="text-sm font-normal text-slate-500">
            Cập nhật thông tin chi tiết và cài đặt mật khẩu mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="Nguyễn Văn A"
                            className="pl-10 h-11 border-slate-200 focus:border-teal-600 focus:ring-teal-600/10 rounded-xl font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Địa chỉ email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            disabled
                            className="pl-10 h-11 border-slate-200 bg-slate-50 text-slate-500 rounded-xl font-medium cursor-not-allowed"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="09xxxxxxx"
                            className="pl-10 h-11 border-slate-200 focus:border-teal-600 focus:ring-teal-600/10 rounded-xl font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">
                        Mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-11 border-slate-200 focus:border-teal-600 focus:ring-teal-600/10 rounded-xl font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-slate-200 font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => form.reset()}
                >
                  Hủy thay đổi
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-8 rounded-xl font-medium bg-teal-700 hover:bg-teal-800 shadow-sm flex items-center gap-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner size="sm" variant="white" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
