"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserForm } from "@/features/users/components/admin/create/UserForm";
import { useCreateUser } from "@/features/users/hooks";
import type { UserFormValues } from "@/features/users/schemas";

export function AdminUserCreateView() {
  const router = useRouter();
  const { mutate: createUser, isPending } = useCreateUser();

  const handleSubmit = (data: UserFormValues) => {
    createUser(data as any, {
      onSuccess: () => router.push("/admin/users"),
    });
  };

  return (
    <div className="space-y-4 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit pl-0 hover:bg-transparent text-slate-400 hover:text-primary gap-1 font-semibold text-xs tracking-wider"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Quay lại danh sách
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tạo tài khoản mới
            </h1>
            <p className="text-slate-500 text-sm">
              Điền thông tin để đăng ký thành viên mới cho hệ thống.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        <UserForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
