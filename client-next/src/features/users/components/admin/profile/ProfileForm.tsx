"use client";

import React from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { UseFormReturn } from "react-hook-form";

interface ProfileFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

export function ProfileForm({ form, onSubmit, isPending }: ProfileFormProps) {
  return (
    <div className="md:col-span-2">
      <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-50 pb-6">
          <CardTitle className="text-xl font-bold text-slate-900">
            Chỉnh sửa thông tin
          </CardTitle>
          <CardDescription className="font-medium">
            Cập nhật thông tin chi tiết và cài đặt mật khẩu mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="Nguyễn Văn A"
                            className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/5 rounded-xl font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Địa chỉ Email
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
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="09xxxxxxx"
                            className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/5 rounded-xl font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Mật khẩu mới (Nếu cần đổi)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-11 border-slate-200 focus:border-primary focus:ring-primary/5 rounded-xl font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  onClick={() => form.reset()}
                >
                  Hủy thay đổi
                </Button>
                <Button
                  type="submit"
                  className="h-11 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2"
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
