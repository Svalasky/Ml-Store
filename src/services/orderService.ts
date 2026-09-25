import { createClient } from "@/lib/supabase/client";
import { Order, OrderStatus, PaymentStatus, CreateOrderPayload } from "@/types/order";
import { generateOrderNumber } from "@/lib/whatsapp";
import { env } from "@/config/env";

const isSupabaseConfigured = () => {
  return (
    Boolean(env.supabaseUrl) &&
    !env.supabaseUrl.includes("placeholder") &&
    Boolean(env.supabaseAnonKey) &&
    !env.supabaseAnonKey.includes("placeholder")
  );
};

let localOrders: Order[] = [
  {
    id: "ord-1",
    order_number: "ORD-20260925-1001",
    product_id: "a0000000-0000-0000-0000-000000000000",
    product_name: "MLBB Akun All-Star Sultan - 15 Collector + 4 Legend",
    price: 3200000,
    status: "completed",
    payment_status: "paid",
    customer_name: "Aldo Saputra",
    customer_whatsapp: "081299887766",
    customer_note: "Mohon diproses cepat untuk kado turnamen.",
    admin_note: "Data akun sudah diserahkan dan email diganti ke pembeli.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    history: [
      {
        id: "h-1",
        order_id: "ord-1",
        status: "pending",
        notes: "Order dibuat via WhatsApp",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "h-2",
        order_id: "ord-1",
        status: "paid",
        notes: "Pembayaran transfer bank diterima",
        created_at: new Date(Date.now() - 86400000 * 2 + 1800000).toISOString(),
      },
      {
        id: "h-3",
        order_id: "ord-1",
        status: "completed",
        notes: "Serah terima data Moonton dan Gmail selesai",
        created_at: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
      },
    ],
  },
  {
    id: "ord-2",
    order_number: "ORD-20260925-1002",
    product_id: "a2222222-2222-2222-2222-222222222222",
    product_name: "MLBB Semi-Sultan - 5 Collector + 2 Legend",
    price: 1200000,
    status: "waiting_payment",
    payment_status: "pending",
    customer_name: "Rizky Ramadhan",
    customer_whatsapp: "085711223344",
    customer_note: "Mau bayar lewat QRIS / BCA",
    admin_note: "Menunggu bukti transfer",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    history: [
      {
        id: "h-21",
        order_id: "ord-2",
        status: "pending",
        notes: "Order dibuat via WhatsApp",
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "h-22",
        order_id: "ord-2",
        status: "waiting_payment",
        notes: "Menunggu pembayaran dari buyer",
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ],
  },
];

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const orderNumber = generateOrderNumber();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newOrder: Order = {
    id,
    order_number: orderNumber,
    product_id: payload.product_id,
    product_name: payload.product_name,
    price: payload.price,
    status: "pending",
    payment_status: "unpaid",
    customer_name: payload.customer_name,
    customer_whatsapp: payload.customer_whatsapp,
    customer_note: payload.customer_note,
    created_at: now,
    updated_at: now,
    history: [
      {
        id: crypto.randomUUID(),
        order_id: id,
        status: "pending",
        notes: "Order dibuat via WhatsApp Checkout",
        created_at: now,
      },
    ],
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      // Optional customer record
      let customerId: string | undefined;
      const { data: custData } = await supabase
        .from("customers")
        .insert({
          name: payload.customer_name,
          whatsapp_number: payload.customer_whatsapp,
        })
        .select("id")
        .single();

      if (custData) {
        customerId = custData.id;
      }

      await supabase.from("orders").insert({
        id,
        order_number: orderNumber,
        product_id: payload.product_id,
        customer_id: customerId,
        product_name: payload.product_name,
        price: payload.price,
        status: "pending",
        payment_status: "unpaid",
        customer_name: payload.customer_name,
        customer_whatsapp: payload.customer_whatsapp,
        customer_note: payload.customer_note,
        created_at: now,
        updated_at: now,
      });

      await supabase.from("order_status_history").insert({
        order_id: id,
        status: "pending",
        notes: "Order dibuat via WhatsApp Checkout",
        created_at: now,
      });
    } catch (e) {
      console.warn("Error creating order in Supabase:", e);
    }
  }

  localOrders.unshift(newOrder);
  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          history:order_status_history(*),
          product:products(id, slug, rank, skin_count, collector_count, legend_count)
        `
        )
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase orders query fallback to local:", e);
    }
  }

  return localOrders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          history:order_status_history(*),
          product:products(*)
        `
        )
        .eq("id", id)
        .single();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase getOrderById fallback:", e);
    }
  }

  return localOrders.find((o) => o.id === id || o.order_number === id) || null;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<void> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase
        .from("orders")
        .update({ status, updated_at: now })
        .eq("id", orderId);

      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status,
        notes: notes || `Status diubah menjadi ${status}`,
        created_at: now,
      });
    } catch (e) {
      console.warn("Failed updating order status in Supabase:", e);
    }
  }

  const order = localOrders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    order.updated_at = now;
    if (!order.history) order.history = [];
    order.history.unshift({
      id: crypto.randomUUID(),
      order_id: orderId,
      status,
      notes: notes || `Status diubah menjadi ${status}`,
      created_at: now,
    });
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<void> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase
        .from("orders")
        .update({ payment_status: paymentStatus, updated_at: now })
        .eq("id", orderId);
    } catch (e) {
      console.warn("Failed updating payment status in Supabase:", e);
    }
  }

  const order = localOrders.find((o) => o.id === orderId);
  if (order) {
    order.payment_status = paymentStatus;
    order.updated_at = now;
  }
}
