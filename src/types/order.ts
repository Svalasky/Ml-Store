export type OrderStatus =
  | "pending"
  | "waiting_payment"
  | "paid"
  | "processing"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp_number: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  product_id?: string;
  customer_id?: string;
  product_name: string;
  price: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_name?: string;
  customer_whatsapp?: string;
  customer_note?: string;
  admin_note?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  history?: OrderStatusHistory[];
  product?: {
    id: string;
    slug: string;
    rank?: string;
    skin_count?: number;
    collector_count?: number;
    legend_count?: number;
    primary_image?: string;
  };
}

export interface CreateOrderPayload {
  product_id: string;
  product_name: string;
  price: number;
  customer_name: string;
  customer_whatsapp: string;
  customer_note?: string;
}
