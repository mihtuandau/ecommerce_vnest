import type { Order } from "@/types/models";

/**
 * Transform API response to normalized order data
 */
export function normalizeOrderResponse(body: any): Order {
  return body?.data || body;
}

/**
 * Transform API response to order list
 */
export function normalizeOrderListResponse(body: any): Order[] {
  if (Array.isArray(body)) return body;
  if (body?.data && Array.isArray(body.data)) return body.data;
  if (body?.orders && Array.isArray(body.orders)) return body.orders;
  return [];
}

/**
 * Extract image URL from variant/product
 */
export function extractOrderItemImage(item: any): string {
  const getUrl = (img: any) => (typeof img === "string" ? img : img?.url);
  return (
    getUrl(item.variantSnapshot?.image) ||
    getUrl(item.variant?.images?.[0]) ||
    getUrl(item.variant?.product?.images?.[0]) ||
    "/placeholder.png"
  );
}
