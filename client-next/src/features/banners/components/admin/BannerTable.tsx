"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Banner } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash, ExternalLink, Image as ImageIcon, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useDeleteBanner } from "../../hooks";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Banner>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-slate-500">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => (
      <div className="relative h-16 w-32 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group">
        <img
          src={row.getValue("image")}
          alt="Banner"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Thông tin Banner",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800 tracking-tight text-sm">{row.getValue("title")}</span>
        <div className="flex items-center gap-2">
           <ImageIcon className="h-3 w-3 text-slate-500" />
           <span className="text-xs font-medium text-slate-500 tracking-wide">Thứ tự: {row.original.order || 0}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "link",
    header: "Đường dẫn",
    cell: ({ row }) => {
      const link = row.getValue("link") as string;
      return link ? (
        <a 
          href={link} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all text-xs font-semibold border border-slate-100"
        >
          Truy cập <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="text-slate-400 text-xs font-medium italic tracking-wide">Chưa cập nhật</span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge 
          className={cn(
            "px-2.5 py-0.5 rounded-lg font-semibold text-xs border-none tracking-wide",
            isActive 
              ? "bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100" 
              : "bg-slate-100 text-slate-600"
          )}
        >
          {isActive ? "Đang hiển thị" : "Đã ẩn"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const banner = row.original;
      const router = useRouter();
      const { mutate: deleteBanner } = useDeleteBanner();

      return (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg border border-slate-100 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
            onClick={() => router.push(`/admin/banners/${banner.id}`)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border border-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
            onClick={() => {
              if (confirm(`Xác nhận xóa banner: ${banner.title}?`)) {
                deleteBanner(banner.id);
              }
            }}
          >
            <Trash className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    },
  },
];

interface BannerTableProps {
  data: Banner[];
}

export function BannerTable({ data }: BannerTableProps) {
  return (
    <DataTable columns={columns} data={data} searchKey="title" hideSearch />
  );
}
