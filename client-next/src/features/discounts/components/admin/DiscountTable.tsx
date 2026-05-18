import { ColumnDef } from "@tanstack/react-table";
import { Discount } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  Zap,
  Ticket,
  Calendar,
  History,
} from "lucide-react";
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

interface CellActionProps {
  data: Discount;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const { mutate: deleteDiscount } = useDeleteDiscount();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-slate-500 hover:text-slate-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl p-1 shadow-xl border-slate-200"
        >
          <DropdownMenuItem
            className="rounded-lg cursor-pointer gap-2 py-2.5 text-sm font-medium text-slate-600 focus:bg-slate-100 focus:text-slate-900"
            onClick={() => router.push(`/admin/discounts/${data.id}`)}
          >
            <Pencil className="h-4 w-4 text-slate-500" />
            Chỉnh sửa mã
          </DropdownMenuItem>
          <div className="my-1 border-t border-slate-100" />
          <DropdownMenuItem
            className="rounded-lg cursor-pointer gap-2 py-2.5 text-sm font-medium text-rose-600 focus:bg-rose-50"
            onClick={() => {
              if (
                confirm(`Bạn có chắc chắn muốn xóa mã giảm giá ${data.code}?`)
              ) {
                deleteDiscount(data.id);
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
};

export const columns: ColumnDef<Discount>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-slate-500">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "code",
    header: "Mã",
    cell: ({ row }) => {
      const discount = row.original;
      return (
        <Badge className="bg-slate-800 text-white font-mono text-xs font-semibold tracking-wide px-2.5 py-1 rounded-md">
          {discount.code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 font-medium truncate max-w-[150px]">
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
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-semibold tracking-wide px-2.5 py-1 rounded-lg",
            discount.isFlashSale
              ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-slate-50 text-slate-600 border-slate-100"
          )}
        >
          {discount.isFlashSale ? "Flash Sale" : "Voucher"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "value",
    header: "Giảm giá",
    cell: ({ row }) => {
      const discount = row.original as any;
      
      // New priority logic for schema
      const isPercentage = discount.percentage !== null && discount.percentage !== undefined;
      const isFixed = discount.fixedAmount !== null && discount.fixedAmount !== undefined;
      
      const value = isPercentage 
        ? discount.percentage 
        : isFixed 
          ? discount.fixedAmount 
          : discount.value || 0;

      const typeLabel = isPercentage || (!isFixed && discount.type === "PERCENTAGE") 
        ? "Phần trăm" 
        : "Cố định";

      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800">
            {isPercentage || (!isFixed && discount.type === "PERCENTAGE") 
              ? `${value}%` 
              : formatCurrency(value)}
          </span>
          <span className="text-xs font-semibold text-slate-500 tracking-tight mt-0.5">
            {typeLabel}
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
      const used = discount.usedCount || 0;
      const limit = discount.usageLimit || 0;
      const percent = limit > 0 ? (used / limit) * 100 : 0;

      return (
        <div className="flex flex-col gap-1 w-24">
          <div className="flex items-center justify-between text-xs font-semibold tracking-tight">
            <span className="text-slate-600">
              {used}/{limit}
            </span>
            <span className={cn(percent > 90 ? "text-rose-600" : "text-slate-800")}>
              {Math.round(percent)}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                percent > 90 ? "bg-rose-500" : "bg-slate-800"
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
      <span className="text-xs font-semibold text-slate-700">
        {formatDate(row.getValue("startDate"))}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Kết thúc",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500 font-medium">
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
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-600 border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-xs tracking-wide"
          >
            Hết hạn
          </Badge>
        );
      }

      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg px-2.5 py-1 font-semibold text-xs tracking-wide",
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
    cell: ({ row }) => <CellAction data={row.original} />,
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
