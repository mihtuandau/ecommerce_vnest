import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, Shield, User as UserIcon, MoreHorizontal, Mail, Phone, Ban, CheckCircle2, Warehouse, BadgeDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useDeleteUser, useUpdateUser } from "../../hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Role, UserStatus } from "@/types/enums";

const roleConfig: Record<string, { label: string; color: string; icon: any }> = {
  [Role.ADMIN]: { label: "Quản trị viên", color: "bg-slate-900 text-white border-slate-900", icon: Shield },
  [Role.CUSTOMER]: { label: "Khách hàng", color: "bg-blue-50 text-blue-600 border-blue-100", icon: UserIcon },
  [Role.KHO]: { label: "Kho", color: "bg-amber-50 text-amber-700 border-amber-100", icon: Warehouse },
  [Role.BAN_HANG]: { label: "Bán hàng", color: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: BadgeDollarSign },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  [UserStatus.ACTIVE]: { label: "Đang hoạt động", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  [UserStatus.SUSPENDED]: { label: "Đã vô hiệu", color: "bg-rose-50 text-rose-700 border-rose-200" },
  [UserStatus.PENDING]: { label: "Chờ xác minh", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

export const columns: ColumnDef<User>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => (
      <span className="text-[10px] font-bold text-slate-400">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Người dùng",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity group">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 group-hover:border-primary/30">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-slate-400">{user.name?.charAt(0) || "U"}</span>
            )}
          </div>
          <span className="font-bold text-sm text-slate-900 truncate group-hover:text-primary">{user.name || "Chưa đặt tên"}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Mail className="h-3.5 w-3.5 text-slate-400" />
        <span className="truncate">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => {
      const phone = row.original.phone;
      return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          <span className={cn(!phone && "text-slate-400 italic")}>{phone || "Chưa cập nhật"}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      const config = roleConfig[role] || { label: role, color: "bg-slate-50 text-slate-500", icon: UserIcon };
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={cn("rounded-lg px-2 py-0.5 gap-1.5 font-bold text-[10px] uppercase tracking-wider", config.color)}>
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus || UserStatus.ACTIVE;
      const config = statusConfig[status] || statusConfig[UserStatus.ACTIVE];
      return (
        <Badge variant="outline" className={cn("rounded-full px-2 py-0.5 font-bold text-[10px]", config.color)}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tham gia",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500 font-medium">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const router = useRouter();
      const { mutate: deleteUser } = useDeleteUser();
      const { mutate: updateUser } = useUpdateUser();

      const toggleStatus = () => {
        const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE;
        updateUser({ id: user.id, data: { status: newStatus } });
      };

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-200">
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer gap-2 py-2.5 text-sm font-medium text-slate-600 focus:text-primary"
                onClick={() => router.push(`/admin/users/${user.id}`)}
              >
                <Pencil className="h-4 w-4 text-slate-400" />
                Xem chi tiết & Sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(
                  "rounded-lg cursor-pointer gap-2 py-2.5 text-sm font-medium focus:bg-slate-50",
                  user.status === UserStatus.ACTIVE ? "text-amber-600" : "text-emerald-600"
                )}
                onClick={toggleStatus}
              >
                {user.status === UserStatus.ACTIVE ? (
                  <>
                    <Ban className="h-4 w-4" />
                    Vô hiệu hóa
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Kích hoạt lại
                  </>
                )}
              </DropdownMenuItem>
              <div className="my-1 border-t border-slate-100" />
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer gap-2 py-2.5 text-sm font-medium text-rose-600 focus:bg-rose-50"
                onClick={() => {
                  if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.email}? Hành động này không thể hoàn tác.`)) {
                    deleteUser(user.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Xóa tài khoản
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface UserTableProps {
  data: User[];
}

export function UserTable({ data }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={data} searchKey="email" hideSearch={true} />
    </div>
  );
}
