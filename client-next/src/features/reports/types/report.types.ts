export type ReportQueryParams = Record<string, string | number | undefined>;

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: number | string;
  productName: string;
  image: string;
  totalQuantity: number;
  totalRevenue: number;
}
