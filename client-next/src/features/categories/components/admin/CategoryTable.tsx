"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useDeleteCategory } from "../../hooks";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Category>[] = [
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
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => (
      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group">
        <img
          src={row.getValue("image") || "/placeholder-category.png"}
          alt="Category"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Img";
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên danh mục",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-slate-900 tracking-tight">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: "Đường dẫn (Slug)",
    cell: ({ row }) => (
      <code className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 text-[11px] font-bold border border-slate-100">
        {row.getValue("slug") || "N/A"}
      </code>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const router = useRouter();
      const { mutate: deleteCategory } = useDeleteCategory();

      return (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-lg border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm transition-all"
            onClick={() => router.push(`/admin/categories/${category.id}`)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all"
            onClick={() => {
              if (confirm(`Xác nhận xóa danh mục: ${category.name}?`)) {
                deleteCategory(category.id);
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

interface CategoryTableProps {
  data: Category[];
}

export function CategoryTable({ data }: CategoryTableProps) {
  return (
    <DataTable columns={columns} data={data} searchKey="name" hideSearch />
  );
}
