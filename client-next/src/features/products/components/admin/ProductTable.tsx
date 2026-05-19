"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product, ProductVariant } from "@/types/models";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Package,
  History,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/Badge";
import { useDeleteProduct } from "../../hooks";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface CellActionProps {
  data: Product;
}

const CellAction = ({ data }: CellActionProps) => {
  const { mutate: deleteProduct } = useDeleteProduct();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-2xl p-2 shadow-2xl border-slate-200"
        >
          <DropdownMenuLabel className="text-xs font-semibold tracking-wide text-slate-500 px-2 py-1.5 uppercase">
            Hành động
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="rounded-xl cursor-pointer gap-3 py-2.5 text-sm focus:bg-slate-100 focus:text-slate-900"
            asChild
          >
            <Link href={`${ROUTES.ADMIN_PRODUCTS}/${data.id}`}>
              <Pencil className="h-4 w-4" />
              Chỉnh sửa
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-xl cursor-pointer gap-3 py-2.5 text-sm"
            asChild
          >
            <Link href={ROUTES.PRODUCT_DETAIL(data.slug)} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Xem trang khách
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl cursor-pointer gap-3 py-2.5 text-sm text-amber-600 focus:bg-amber-50">
            <History className="h-4 w-4" />
            Lịch sử kho
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 bg-slate-100" />
          <DropdownMenuItem
            className="rounded-xl cursor-pointer gap-3 py-2.5 text-sm text-red-600 focus:bg-red-50 focus:text-red-700 font-medium"
            onClick={() => {
              if (
                confirm(
                  "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
                )
              ) {
                deleteProduct(data.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Xóa sản phẩm
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "stt",
    header: "STT",
    cell: ({ row }) => (
      <span className="text-xs font-semibold text-slate-500">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Sản phẩm",
    cell: ({ row }) => {
      const product = row.original;
      const images = product.images || [];
      const imageUrl = (images[0] as { url?: string })?.url || images[0] || "";

      return (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden border border-muted-foreground/10 shrink-0 shadow-sm relative">
            {imageUrl && typeof imageUrl === "string" ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                unoptimized
                className="object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <Package className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 max-w-[200px]">
            <span
              className="font-semibold text-sm truncate leading-none text-slate-800"
              title={product.name}
            >
              {product.name}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Danh mục",
    cell: ({ row }) => {
      const product = row.original;
      const categoryName = product.category?.name || product.category?.slug || "—";
      return (
        <Badge
          variant="outline"
          className="rounded-lg px-2.5 py-1 font-semibold text-xs bg-slate-50 text-slate-600 border-slate-200"
        >
          {categoryName}
        </Badge>
      );
    },
  },

  {
    accessorKey: "basePrice",
    header: "Giá bán",
    cell: ({ row }) => {
      const product = row.original;
      const price = product.basePrice || 0;
      const originalPrice = product.originalPrice;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-[14px] font-serif text-slate-800">
            {formatCurrency(price)}
          </span>
          {originalPrice && originalPrice > 0 && (
            <span className="text-xs text-slate-500 line-through decoration-destructive/50 mt-0.5 font-medium">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Tồn kho",
    cell: ({ row }) => {
      const product = row.original;
      let stock = product.stock;

      // Calculate total stock from variants if available
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        stock = product.variants.reduce(
          (sum: number, v: ProductVariant) => sum + (v.stock || 0),
          0
        );
      }

      const isLowStock = stock !== undefined && stock < 10 && stock > 0;
      const isOutOfStock = stock !== undefined && stock <= 0;

      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              isOutOfStock
                ? "bg-destructive"
                : isLowStock
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            )}
          />
          <span
            className={cn(
              "text-sm font-semibold",
              isOutOfStock
                ? "text-destructive"
                : isLowStock
                  ? "text-amber-600"
                  : "text-slate-800"
            )}
          >
            {stock ?? 0}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "soldCount",
    header: "Đã bán",
    cell: ({ row }) => {
      const soldCount = (row.original as { soldCount?: number }).soldCount || 0;
      return <span className="font-semibold text-sm text-slate-800">{soldCount}</span>;
    },
  },
  {
    accessorKey: "rating",
    header: "Đánh giá",
    cell: ({ row }) => {
      const rating = (row.original as { averageRating?: number }).averageRating || 0;
      return (
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-slate-800">
            {Number(rating).toFixed(1)}
          </span>
          <span className="text-amber-400">★</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-lg px-2.5 py-1 font-semibold text-xs tracking-wide",
            product.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-100"
          )}
        >
          {product.isActive ? "Hiển thị" : "Đã ẩn"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <span className="text-xs text-slate-500 font-medium">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

interface ProductTableProps {
  data: Product[];
}

export function ProductTable({ data }: ProductTableProps) {
  return <DataTable columns={columns} data={data} searchKey="name" hideSearch={true} />;
}
