"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import {
  Pencil,
  Trash,
  CornerDownRight,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useDeleteCategory } from "@/features/categories/hooks";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CategoryTreeItem } from "@/features/categories/types";

export function CategoryTable({ data }: { data: CategoryTreeItem[] }) {
  const router = useRouter();
  const { mutate: deleteCategory } = useDeleteCategory();
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const isVisible = (item: CategoryTreeItem) => {
    if (!item.parentId) return true;
    let currentParentId: number | string | null | undefined = item.parentId;
    while (currentParentId) {
      if (!expandedIds.has(currentParentId)) return false;
      const parent = data.find((c) => c.id === currentParentId);
      if (!parent) break;
      currentParentId = parent.parentId;
    }
    return true;
  };

  const visibleData = data.filter(isVisible);

  const columns: ColumnDef<CategoryTreeItem>[] = [
    {
      id: "stt",
      header: "STT",
      cell: ({ row }) => {
        const depth = (row.original as any).depth || 0;
        if (depth > 0) return null;
        return (
          <span className="text-xs font-semibold text-slate-500">{row.index + 1}</span>
        );
      },
    },
    {
      accessorKey: "image",
      header: "Hình ảnh",
      cell: ({ row }) => {
        const depth = (row.original as any).depth || 0;
        return (
          <div
            className={cn(
              "relative rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50 group transition-all",
              depth === 0 ? "h-12 w-12" : "h-9 w-9"
            )}
            style={{ marginLeft: `${depth * 1.5}rem` }}
          >
            <Image
              src={row.getValue("image") || "/placeholder-category.png"}
              alt="Category"
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Tên danh mục",
      cell: ({ row }) => {
        const cat = row.original;
        const depth = cat.depth || 0;
        const hasChildren = data.some((c) => c.parentId === cat.id);
        const isExpanded = expandedIds.has(cat.id);

        return (
          <div
            className="flex items-center gap-2"
            style={{ paddingLeft: `${depth * 3.5}rem` }}
          >
            <div className="w-5 flex justify-center">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary transition-all"
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                depth > 0 && <CornerDownRight size={14} className="text-slate-300" />
              )}
            </div>
            <span
              className={cn(
                "tracking-tight",
                depth === 0
                  ? "text-slate-800 font-semibold text-sm"
                  : "text-slate-500 font-semibold text-[13px]"
              )}
            >
              {cat.name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "parent",
      header: "Danh mục cha",
      cell: ({ row }) => {
        const parent = row.original.parent;
        const depth = row.original.depth || 0;
        if (depth === 0)
          return <span className="text-xs text-slate-300 italic">Gốc</span>;

        return (
          <Badge
            variant="secondary"
            className="bg-slate-50 text-slate-500 border-none font-semibold text-[11px]"
          >
            {parent?.name || "N/A"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "slug",
      header: "Đường dẫn (Slug)",
      cell: ({ row }) => (
        <code
          className={cn(
            "px-2 py-0.5 rounded bg-slate-50 text-xs font-semibold border border-slate-100",
            (row.original as any).depth > 0 ? "text-slate-400" : "text-slate-600"
          )}
        >
          {row.getValue("slug") || "N/A"}
        </code>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const category = row.original;

        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin/categories/${category.id}`)}
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
            >
              <Pencil size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm(`Xác nhận xóa danh mục: ${category.name}?`)) {
                  deleteCategory(category.id);
                }
              }}
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <Trash size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="category-table-container">
      <DataTable
        columns={columns}
        data={visibleData}
        searchKey="name"
        hideSearch
        rowClassName={(row) =>
          (row.original as any).depth > 0 ? "bg-slate-50/30" : ""
        }
      />
    </div>
  );
}
