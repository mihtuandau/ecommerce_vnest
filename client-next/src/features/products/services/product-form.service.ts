import type { ProductFormValues } from "@/features/products/schemas";
import type { Product } from "@/types/models";

export function cleanProductNumber(value: string | number | undefined | null) {
  if (typeof value === "string") {
    const cleaned = value.replace(/[.,\s]/g, "");
    return cleaned ? Number(cleaned) : 0;
  }

  return Number(value || 0);
}

export function getProductFormImageUrl(
  image: string | { url?: string } | null | undefined
) {
  if (!image) return "";
  return typeof image === "string" ? image : image.url || "";
}

export function normalizeProductImages(images?: Array<string | { url: string }>) {
  return images?.map(getProductFormImageUrl).filter(Boolean) || [];
}

export function getProductCategoryId(product: Product) {
  const category = (product as Product & { category?: { id?: number } | number })
    .category;

  return Number(
    product.categoryId ||
      (typeof category === "number" ? category : category?.id) ||
      0
  );
}

export function mapProductToFormValues(product: Product) {
  const categoryId = getProductCategoryId(product);
  const images = normalizeProductImages(product.images as any);

  return {
    values: {
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      basePrice: product.basePrice || 0,
      originalPrice: product.originalPrice || 0,
      categoryId,
      status:
        (product as any).status ||
        ((product.isActive ? "active" : "inactive") as any),
      metaTitle: product.metaTitle || "",
      metaDesc: product.metaDesc || "",
      packageWeight: product.variants?.[0]?.weight || 0,
      packageLength: product.variants?.[0]?.length || 0,
      packageWidth: product.variants?.[0]?.width || 0,
      packageHeight: product.variants?.[0]?.height || 0,
      images,
      variants: (product.variants || []).map((variant: any) => ({
        ...variant,
        price: variant.price || 0,
        stock: variant.stock || 0,
        image:
          variant.images && variant.images.length > 0
            ? getProductFormImageUrl(variant.images[0])
            : getProductFormImageUrl(variant.image),
      })),
    },
    images,
    categoryId,
  };
}

export function normalizeProductFormSubmit(
  data: ProductFormValues,
  images: string[]
) {
  const basePrice = cleanProductNumber(data.basePrice || 0);
  const originalPrice = cleanProductNumber(data.originalPrice);

  const variants = (data.variants || []).map((variant) => ({
    ...variant,
    price:
      cleanProductNumber(variant.price) > 0
        ? cleanProductNumber(variant.price)
        : basePrice,
    originalPrice: variant.originalPrice
      ? cleanProductNumber(variant.originalPrice)
      : null,
    stock: Number(variant.stock || 0),
    weight: Number(data.packageWeight || 0),
    packageLength: Number(data.packageLength || 0),
    width: Number(data.packageWidth || 0),
    height: Number(data.packageHeight || 0),
  }));

  return {
    ...data,
    basePrice,
    originalPrice,
    images,
    variants,
    categoryId: Number(data.categoryId),
    status: data.status || "active",
  } as ProductFormValues;
}

export function mapProductFormToCreateDto(data: any) {
  return {
    name: String(data.name || ""),
    slug: String(data.slug || ""),
    description: String(data.description || ""),
    basePrice: cleanProductNumber(data.basePrice),
    originalPrice: cleanProductNumber(data.originalPrice),
    categoryId: Number(data.categoryId || 0),
    status: data.status || "active",
    metaTitle: data.metaTitle,
    metaDesc: data.metaDesc,
    images: data.images || [],
    variants: data.variants || [],
  };
}

export function mapProductFormToUpdateDto(data: any) {
  const updateData: any = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    basePrice: cleanProductNumber(data.basePrice),
    categoryId: Number(data.categoryId),
    status: data.status,
    metaTitle: data.metaTitle,
    metaDesc: data.metaDesc,
    images: data.images || [],
    variants: data.variants || [],
  };

  const originalPrice = cleanProductNumber(data.originalPrice);
  if (originalPrice > 0) {
    updateData.originalPrice = originalPrice;
  }

  return updateData;
}
