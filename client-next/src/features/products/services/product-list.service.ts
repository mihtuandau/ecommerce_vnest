import type { Product } from "@/types/models";

export type AdminProductFilters = {
  activeTab: string;
  searchTerm: string;
  categoryId: string;
  discountStatus: string;
  sortBy: string;
};

export function getProductStock(product: any) {
  return Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants.reduce(
        (sum: number, variant: any) => sum + (variant.stock || 0),
        0
      )
    : product.stock || 0;
}

export function isLowStockProduct(product: any) {
  const stock = getProductStock(product);
  return stock < 10 && stock > 0;
}

export function getAdminProductCounts(products: Product[]) {
  return {
    ALL: products.length,
    ACTIVE: products.filter((product: any) => product.isActive).length,
    HIDDEN: products.filter((product: any) => !product.isActive).length,
    LOW_STOCK: products.filter(isLowStockProduct).length,
  };
}

export function filterAdminProducts(
  products: Product[],
  { activeTab, searchTerm, categoryId, discountStatus }: AdminProductFilters
) {
  let result = products;

  if (activeTab === "ACTIVE") {
    result = result.filter((product: any) => product.isActive);
  } else if (activeTab === "HIDDEN") {
    result = result.filter((product: any) => !product.isActive);
  } else if (activeTab === "LOW_STOCK") {
    result = result.filter(isLowStockProduct);
  }

  if (categoryId !== "ALL") {
    result = result.filter(
      (product: any) => product.categoryId === Number(categoryId)
    );
  }

  if (discountStatus === "DISCOUNTED") {
    result = result.filter(
      (product: any) => product.originalPrice && product.originalPrice > product.basePrice
    );
  } else if (discountStatus === "NO_DISCOUNT") {
    result = result.filter(
      (product: any) => !product.originalPrice || product.originalPrice <= product.basePrice
    );
  }

  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    result = result.filter(
      (product: any) =>
        product.name?.toLowerCase().includes(lower) ||
        product.slug?.toLowerCase().includes(lower) ||
        product.category?.name?.toLowerCase().includes(lower)
    );
  }

  return result;
}

export function sortAdminProducts(products: Product[], sortBy: string) {
  const result = [...products] as any[];

  if (sortBy === "price_desc") {
    return result.sort((a, b) => b.basePrice - a.basePrice);
  }
  if (sortBy === "price_asc") {
    return result.sort((a, b) => a.basePrice - b.basePrice);
  }
  if (sortBy === "sold_desc") {
    return result.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
  }
  if (sortBy === "name_asc") {
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sortBy === "oldest") {
    return result.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getFilteredAdminProducts(
  products: Product[],
  filters: AdminProductFilters
) {
  return sortAdminProducts(filterAdminProducts(products, filters), filters.sortBy);
}
