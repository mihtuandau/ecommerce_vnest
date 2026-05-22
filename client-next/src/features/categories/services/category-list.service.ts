import type { Category } from "@/types/models";
import type { CategoryTreeItem } from "@/features/categories/types";

export function normalizeCategories(data: unknown): Category[] {
  if (Array.isArray(data)) return data as Category[];
  return ((data as any)?.data || []) as Category[];
}

export function flattenCategoryTree(categories: Category[]): CategoryTreeItem[] {
  const result: CategoryTreeItem[] = [];

  const flatten = (items: Category[], depth = 0, parent: Category | null = null) => {
    items.forEach((category) => {
      const item = { ...category, depth, parent };
      result.push(item as CategoryTreeItem);

      if (category.children?.length) {
        flatten(category.children, depth + 1, category);
      }
    });
  };

  flatten(categories);
  return result;
}

export function filterCategories(
  categories: CategoryTreeItem[],
  searchTerm: string
) {
  if (!searchTerm) return categories;

  const lowerSearch = searchTerm.toLowerCase();
  return categories.filter((category) =>
    category.name?.toLowerCase().includes(lowerSearch)
  );
}
