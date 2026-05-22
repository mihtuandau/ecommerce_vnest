"use client";

import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
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
    <div className="space-y-6 pb-10">
      <AdminPageHeader
        title="Tạo tài khoản mới"
        description="Điền thông tin để đăng ký thành viên mới cho hệ thống."
        eyebrow="Người dùng"
        onBack={() => router.back()}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        <UserForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
