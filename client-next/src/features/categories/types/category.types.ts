import type { Category } from "@/types/models";

export interface CategoryTreeItem extends Category {
  depth: number;
  parent?: Category | null;
  children?: CategoryTreeItem[];
}

export type CategoryTab = "ALL";
