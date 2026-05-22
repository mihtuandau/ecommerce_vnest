export interface DashboardMetric {
  today?: number;
  total?: number;
  new?: number;
  change?: number;
  lowStock?: number;
}

export interface DashboardOrderSummary extends DashboardMetric {
  pending?: number;
  processing?: number;
  shipped?: number;
  delivered?: number;
  cancelled?: number;
  returned?: number;
  returning?: number;
}

export interface DashboardStatsSummary {
  revenue?: DashboardMetric;
  orders?: DashboardOrderSummary;
  users?: DashboardMetric;
  products?: DashboardMetric;
}

export interface DashboardRevenuePoint {
  date?: string;
  label?: string;
  revenue?: number;
}

export interface DashboardTopProduct {
  productName?: string;
  image?: string;
  totalQuantity?: number;
  totalRevenue?: number;
  rating?: number;
}

export interface DashboardPendingReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
  };
}
