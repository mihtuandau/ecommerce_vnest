import { ColumnDef } from "@tanstack/react-table";
import { Discount } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash2, MoreHorizontal, Zap, Ticket, Calendar, History } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useDeleteDiscount } from "../../hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Discount>[] = [
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
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => {
      const discount = row.original;
      return (
        <Badge className="bg-slate-900 text-white font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
          {discount.code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
        {row.getValue("description") || "—"}
      </span>
    ),
  },
  {
    id: "type",
    header: "Loại",
    cell: ({ row }) => {
      const discount = row.original;
      return (
        <Badge variant="outline" className={cn(
          "text-[9px] font-bold uppercase",
          discount.isFlashSale ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-600 border-slate-100"
        )}>
          {discount.isFlashSale ? "Flash Sale" : "Voucher"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Giảm giá",
    cell: ({ row }) => {
      const discount = row.original;
      const isPercentage = !!discount.percentage;
      const value = discount.percentage || discount.fixedAmount || 0;
      
      return (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900">
            {isPercentage ? `${value}%` : formatCurrency(value)}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
            {isPercentage ? "Phần trăm" : "Cố định"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "usageLimit",
    header: "Đã dùng",
    cell: ({ row }) => {
      const discount = row.original;
      const used = discount.usageCount || 0;
      const limit = discount.usageLimit || 0;
      const percent = limit > 0 ? (used / limit) * 100 : 0;
      
      return (
        <div className="flex flex-col gap-1 w-24">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tighter">
            <span className="text-slate-400">{used}/{limit}</span>
            <span className={cn(percent > 90 ? "text-rose-500" : "text-slate-900")}>{Math.round(percent)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-500",
                percent > 90 ? "bg-rose-500" : "bg-slate-900"
              )} 
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Bắt đầu",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-slate-700">
        {formatDate(row.getValue("startDate"))}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Kết thúc",
    cell: ({ row }) => (
      <span className="text-xs text-slate-400 font-medium">
        {row.getValue("endDate") ? formatDate(row.getValue("endDate")) : "Vô thời hạn"}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const discount = row.original;
      const now = new Date();
      const end = discount.endDate ? new Date(discount.endDate) : null;
      const isExpired = end ? end < now : false;

      if (isExpired) {
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-200 rounded-lg px-2 py-0.5 font-bold text-[9px] uppercase">
            Hết hạn
          </Badge>
        );
      }

      return (
        <Badge 
          variant="outline" 
          className={cn(
            "rounded-lg px-2 py-0.5 font-bold text-[9px] uppercase",
            discount.isActive 
              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
              : "bg-rose-50 text-rose-600 border-rose-100"
          )}
        >
          {discount.isActive ? "Đang chạy" : "Tạm dừng"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const discount = row.original;
      const router = useRouter();
      const { mutate: deleteDiscount } = useDeleteDiscount();

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
                onClick={() => router.push(`/admin/discounts/${discount.id}`)}
              >
                <Pencil className="h-4 w-4 text-slate-400" />
                Chỉnh sửa mã
              </DropdownMenuItem>
              <div className="my-1 border-t border-slate-100" />
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer gap-2 py-2.5 text-sm font-medium text-rose-600 focus:bg-rose-50"
                onClick={() => {
                  if (confirm(`Bạn có chắc chắn muốn xóa mã giảm giá ${discount.code}?`)) {
                    deleteDiscount(discount.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Xóa chương trình
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

interface DiscountTableProps {
  data: Discount[];
}

export function DiscountTable({ data }: DiscountTableProps) {
  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={data} searchKey="code" hideSearch={true} />
    </div>
  );
}
