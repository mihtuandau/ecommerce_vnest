"use client";

import { ChevronDown, Filter, LayoutGrid, List, Search } from "lucide-react";
import { Button, Input } from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { SHOP_SORT_OPTIONS } from "@/features/products/constants/product.constants";
import { cn } from "@/utils/cn";

interface ShopToolbarProps {
  currentSearch: string | null;
  currentSort: string;
  onFilterChange: (key: string, value: string | null) => void;
  onFilterOpen: () => void;
  onViewChange: (view: "grid" | "list") => void;
  totalProducts: number;
  view: "grid" | "list";
}

export function ShopToolbar({
  currentSearch,
  currentSort,
  onFilterChange,
  onFilterOpen,
  onViewChange,
  totalProducts,
  view,
}: ShopToolbarProps) {
  const activeSortLabel =
    SHOP_SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Sắp xếp";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-ivory pb-6">
      <div className="flex items-center gap-6">
        <button
          onClick={onFilterOpen}
          className="flex lg:hidden items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-primary"
        >
          <Filter size={14} /> Bộ lọc
        </button>
        <div className="text-[13px] text-brand-taupe font-medium">
          Hiển thị <span className="text-primary font-bold">{totalProducts}</span>{" "}
          sản phẩm
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = new FormData(e.currentTarget).get("search") as string;
            onFilterChange("search", val || null);
          }}
          className="relative hidden md:block"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-taupe/40 z-10" />
          <Input
            name="search"
            type="text"
            defaultValue={currentSearch || ""}
            placeholder="Tìm kiếm..."
            className="h-10 pl-9 pr-4 w-48 bg-white border border-brand-sand rounded-full text-[12px] focus:outline-none focus:border-brand-bronze shadow-sm"
          />
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 px-4 h-10 border border-brand-sand rounded-full text-[12px] font-bold text-primary bg-white hover:border-brand-bronze transition-all shadow-none"
            >
              <span>{activeSortLabel}</span>
              <ChevronDown size={14} className="text-brand-taupe/40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl">
            {SHOP_SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                className={cn(
                  "rounded-xl h-10 text-[13px] font-medium cursor-pointer mb-1",
                  currentSort === opt.value
                    ? "bg-primary text-white"
                    : "text-brand-taupe hover:bg-brand-cream"
                )}
                onClick={() => onFilterChange("sortBy", opt.value)}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center border border-brand-sand rounded-full p-1">
          <button
            onClick={() => onViewChange("grid")}
            className={cn(
              "p-1.5 rounded-full",
              view === "grid" ? "bg-primary text-white shadow-md" : "text-brand-taupe/40"
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "p-1.5 rounded-full",
              view === "list" ? "bg-primary text-white shadow-md" : "text-brand-taupe/40"
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
