export type AdminRole = "admin" | "staff";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  todayRevenue: number;
  thisMonthRevenue: number;
  totalProducts: number;
  outOfStockProducts: number;
  salesLast7Days: { date: string; amount: number; count: number }[];
  salesLast30Days: { date: string; amount: number; count: number }[];
  ordersByStatus: { status: string; count: number; color: string }[];
  topSellingProducts: { id: string; name: string; salesCount: number; revenue: number }[];
}
