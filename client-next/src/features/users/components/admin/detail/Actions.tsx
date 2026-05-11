"use client";

import React from "react";
import { User } from "@/types/models";
import { Button } from "@/components/ui/Button";
import { Ban, CheckCircle2, Trash2, Mail, ShieldAlert } from "lucide-react";
import { UserStatus } from "@/types/enums";
import { 
  useUpdateUser, 
  useResetPassword, 
  useDeleteUser 
} from "../../../hooks";
import { cn } from "@/utils/cn";

interface ActionsProps {
  user: User;
  onEdit: () => void;
}

export function Actions({ user, onEdit }: ActionsProps) {
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const toggleStatus = () => {
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE;
    updateUser({ id: user.id, data: { status: newStatus } });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          Hành động nhanh
        </h3>
      </div>
      <div className="p-4 space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
          onClick={onEdit}
        >
          <Ban className="h-4 w-4 text-slate-400" />
          Chỉnh sửa tài khoản
        </Button>
        
        <Button 
          variant="outline" 
          className={cn(
            "w-full justify-start gap-2 rounded-xl font-bold border-slate-200 hover:bg-slate-50",
            user.status === UserStatus.ACTIVE ? "text-amber-600" : "text-emerald-600"
          )}
          onClick={toggleStatus}
          disabled={isUpdating}
        >
          {user.status === UserStatus.ACTIVE ? (
            <>
              <Ban className="h-4 w-4" />
              Vô hiệu hóa tài khoản
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Kích hoạt tài khoản
            </>
          )}
        </Button>

        <div className="my-2 border-t border-slate-100" />

        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 rounded-xl font-bold text-rose-600 border-slate-200 hover:bg-rose-50 hover:border-rose-100"
          onClick={() => {
            if (confirm(`Bạn có chắc muốn xóa tài khoản ${user.email}?`)) {
              deleteUser(user.id);
            }
          }}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          Xóa vĩnh viễn
        </Button>
      </div>
    </div>
  );
}
