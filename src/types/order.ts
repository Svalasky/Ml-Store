export type OrderStatus =
  | "pending"
  | "waiting_payment"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";

export type PaymentMethod = "whatsapp" | "manual_transfer" | "other";

export interface Customer {
  id: string;
  name?: string;
  whatsappNumber: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
  createdAt?: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  oldStatus?: string;
  newStatus: OrderStatus;
  note?: string;
  changedBy?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ORD-20260925-0001
  customerId?: string;
  customer?: Customer;
  subtotal: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  customerNote?: string;
  adminNote?: string;
  items?: OrderItem[];
  history?: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterOptions {
  search?: string; // order number, customer name, phone
  status?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  startDate?: string;
  endDate?: string;
  sortBy?: "newest" | "oldest" | "total_desc" | "total_asc";
}

export interface CreateOrderPayload {
  customerName: string;
  whatsappNumber: string;
  customerEmail?: string;
  productId: string;
  variantId?: string;
  customerNote?: string;
  discountCode?: string;
}
