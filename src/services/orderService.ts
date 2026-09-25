import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Order, OrderFilterOptions, CreateOrderPayload, OrderStatus, PaymentStatus } from "@/types/order";
import { DashboardStats } from "@/types/admin";
import { productService } from "./productService";

// Helper to format ID
function generateFallbackOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomSuffix}`;
}

const LOCAL_ORDERS_KEY = "mole_store_orders";

function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse local orders", e);
  }
  return [];
}

function saveLocalOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save local orders", e);
  }
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<{
    orderId: string;
    orderNumber: string;
    total: number;
    productName: string;
    variantName?: string;
  }> {
    const supabase = getSupabaseBrowserClient();

    // 1. Try Supabase RPC
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("create_whatsapp_order", {
          p_customer_name: payload.customerName,
          p_whatsapp_number: payload.whatsappNumber,
          p_product_id: payload.productId,
          p_variant_id: payload.variantId || undefined,
          p_customer_note: payload.customerNote || undefined,
          p_discount_code: payload.discountCode || undefined,
        });

        if (!error && data && data.length > 0) {
          const res = data[0];
          return {
            orderId: res.order_id,
            orderNumber: res.order_number,
            total: Number(res.total),
            productName: res.product_name,
            variantName: res.variant_name || undefined,
          };
        }
        console.warn("RPC create_whatsapp_order fallback to client query:", error?.message);
      } catch (rpcErr) {
        console.warn("RPC error:", rpcErr);
      }
    }

    // 2. Fallback direct or local order creation
    const product = await productService.getById(payload.productId);
    const variant = payload.variantId && product?.variants
      ? product.variants.find((v) => v.id === payload.variantId)
      : undefined;

    const productName = product ? product.name : "Produk Digital";
    const variantName = variant ? variant.name : undefined;
    const price = variant ? variant.price : (product ? product.price : 0);
    const orderNumber = generateFallbackOrderNumber();
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer: {
        id: `cust-${Date.now()}`,
        name: payload.customerName,
        whatsappNumber: payload.whatsappNumber,
        email: payload.customerEmail,
      },
      subtotal: price,
      discount: 0,
      total: price,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "whatsapp",
      customerNote: payload.customerNote,
      items: [
        {
          id: `item-${Date.now()}`,
          orderId,
          productId: payload.productId,
          variantId: payload.variantId,
          productName,
          variantName,
          price,
          quantity: 1,
          subtotal: price,
        },
      ],
      history: [
        {
          id: `hist-${Date.now()}`,
          orderId,
          newStatus: "pending",
          note: "Order dibuat melalui WhatsApp Checkout",
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = getLocalOrders();
    saveLocalOrders([newOrder, ...current]);

    return {
      orderId,
      orderNumber,
      total: price,
      productName,
      variantName,
    };
  },

  async getAll(options: OrderFilterOptions = {}): Promise<Order[]> {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      try {
        let query = supabase
          .from("orders")
          .select(`
            id,
            order_number,
            customer_id,
            subtotal,
            discount,
            total,
            status,
            payment_status,
            payment_method,
            customer_note,
            admin_note,
            created_at,
            updated_at,
            customer:customers(id, name, whatsapp_number, email),
            items:order_items(id, order_id, product_id, variant_id, product_name, variant_name, price, quantity, subtotal),
            history:order_status_history(id, order_id, old_status, new_status, note, created_at)
          `)
          .order("created_at", { ascending: false });

        if (options.status && options.status !== "all") {
          query = query.eq("status", options.status);
        }
        if (options.paymentStatus && options.paymentStatus !== "all") {
          query = query.eq("payment_status", options.paymentStatus);
        }
        if (options.startDate) {
          query = query.gte("created_at", options.startDate);
        }
        if (options.endDate) {
          query = query.lte("created_at", options.endDate);
        }

        const { data, error } = await query;

        if (!error && data) {
          let list: Order[] = data.map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number,
            customerId: o.customer_id,
            customer: o.customer
              ? {
                  id: o.customer.id,
                  name: o.customer.name,
                  whatsappNumber: o.customer.whatsapp_number,
                  email: o.customer.email,
                }
              : undefined,
            subtotal: Number(o.subtotal),
            discount: Number(o.discount),
            total: Number(o.total),
            status: o.status as OrderStatus,
            paymentStatus: o.payment_status as PaymentStatus,
            paymentMethod: o.payment_method,
            customerNote: o.customer_note,
            adminNote: o.admin_note,
            items: o.items?.map((item: any) => ({
              id: item.id,
              orderId: item.order_id,
              productId: item.product_id,
              variantId: item.variant_id,
              productName: item.product_name,
              variantName: item.variant_name,
              price: Number(item.price),
              quantity: item.quantity,
              subtotal: Number(item.subtotal),
            })),
            history: o.history?.map((h: any) => ({
              id: h.id,
              orderId: h.order_id,
              oldStatus: h.old_status,
              newStatus: h.new_status,
              note: h.note,
              createdAt: h.created_at,
            })),
            createdAt: o.created_at,
            updatedAt: o.updated_at,
          }));

          if (options.search) {
            const s = options.search.toLowerCase();
            list = list.filter(
              (o) =>
                o.orderNumber.toLowerCase().includes(s) ||
                o.customer?.name?.toLowerCase().includes(s) ||
                o.customer?.whatsappNumber.includes(s) ||
                o.items?.some((i) => i.productName.toLowerCase().includes(s))
            );
          }

          return list;
        }
      } catch (err) {
        console.error("Supabase order fetch error:", err);
      }
    }

    // Fallback to local
    let local = getLocalOrders();
    if (options.status && options.status !== "all") {
      local = local.filter((o) => o.status === options.status);
    }
    if (options.paymentStatus && options.paymentStatus !== "all") {
      local = local.filter((o) => o.paymentStatus === options.paymentStatus);
    }
    if (options.search) {
      const s = options.search.toLowerCase();
      local = local.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customer?.name?.toLowerCase().includes(s) ||
          o.customer?.whatsappNumber.includes(s)
      );
    }
    return local;
  },

  async getById(id: string): Promise<Order | null> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            order_number,
            customer_id,
            subtotal,
            discount,
            total,
            status,
            payment_status,
            payment_method,
            customer_note,
            admin_note,
            created_at,
            updated_at,
            customer:customers(id, name, whatsapp_number, email),
            items:order_items(id, order_id, product_id, variant_id, product_name, variant_name, price, quantity, subtotal),
            history:order_status_history(id, order_id, old_status, new_status, note, created_at)
          `)
          .eq("id", id)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            orderNumber: data.order_number,
            customerId: data.customer_id,
            customer: data.customer
              ? {
                  id: (data.customer as any).id,
                  name: (data.customer as any).name,
                  whatsappNumber: (data.customer as any).whatsapp_number,
                  email: (data.customer as any).email,
                }
              : undefined,
            subtotal: Number(data.subtotal),
            discount: Number(data.discount),
            total: Number(data.total),
            status: data.status as OrderStatus,
            paymentStatus: data.payment_status as PaymentStatus,
            paymentMethod: data.payment_method,
            customerNote: data.customer_note,
            adminNote: data.admin_note,
            items: (data.items as any[])?.map((item) => ({
              id: item.id,
              orderId: item.order_id,
              productId: item.product_id,
              variantId: item.variant_id,
              productName: item.product_name,
              variantName: item.variant_name,
              price: Number(item.price),
              quantity: item.quantity,
              subtotal: Number(item.subtotal),
            })),
            history: (data.history as any[])
              ?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
              .map((h) => ({
                id: h.id,
                orderId: h.order_id,
                oldStatus: h.old_status,
                newStatus: h.new_status,
                note: h.note,
                createdAt: h.created_at,
              })),
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.error("Order fetch detail error:", e);
      }
    }

    const local = getLocalOrders();
    return local.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    paymentStatus?: PaymentStatus,
    adminNote?: string,
    historyNote?: string
  ): Promise<boolean> {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.rpc("update_order_status", {
          p_order_id: orderId,
          p_new_status: newStatus,
          p_payment_status: paymentStatus || undefined,
          p_admin_note: adminNote || undefined,
          p_note: historyNote || undefined,
        });

        if (!error && data) return true;
      } catch (err) {
        console.error("Update order status RPC error:", err);
      }
    }

    // Fallback local update
    const list = getLocalOrders();
    const idx = list.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const oldStatus = list[idx].status;
      list[idx].status = newStatus;
      if (paymentStatus) list[idx].paymentStatus = paymentStatus;
      if (adminNote !== undefined) list[idx].adminNote = adminNote;
      list[idx].updatedAt = new Date().toISOString();

      if (!list[idx].history) list[idx].history = [];
      list[idx].history!.push({
        id: `hist-${Date.now()}`,
        orderId,
        oldStatus,
        newStatus,
        note: historyNote || `Status diubah menjadi ${newStatus}`,
        createdAt: new Date().toISOString(),
      });

      saveLocalOrders(list);
      return true;
    }
    return false;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const orders = await this.getAll();
    const products = await productService.getAll();

    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthStr = now.toISOString().slice(0, 7);

    let totalOrders = orders.length;
    let pendingOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let todayRevenue = 0;
    let thisMonthRevenue = 0;

    const salesByDayMap: Record<string, { amount: number; count: number }> = {};
    const productSalesMap: Record<string, { name: string; salesCount: number; revenue: number }> = {};

    // Initialize last 7 days keys
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      salesByDayMap[k] = { amount: 0, count: 0 };
    }

    orders.forEach((o) => {
      const orderDate = o.createdAt.slice(0, 10);
      const isPaidOrCompleted = o.paymentStatus === "paid" || o.status === "completed";

      if (o.status === "pending") pendingOrders++;
      if (o.status === "completed") completedOrders++;
      if (o.status === "cancelled") cancelledOrders++;

      if (isPaidOrCompleted) {
        if (orderDate === todayStr) {
          todayRevenue += o.total;
        }
        if (orderDate.startsWith(thisMonthStr)) {
          thisMonthRevenue += o.total;
        }
        if (salesByDayMap[orderDate]) {
          salesByDayMap[orderDate].amount += o.total;
          salesByDayMap[orderDate].count += 1;
        }

        // Product stats
        o.items?.forEach((item) => {
          const pId = item.productId || item.productName;
          if (!productSalesMap[pId]) {
            productSalesMap[pId] = {
              name: item.productName,
              salesCount: 0,
              revenue: 0,
            };
          }
          productSalesMap[pId].salesCount += item.quantity;
          productSalesMap[pId].revenue += item.subtotal;
        });
      }
    });

    const salesLast7Days = Object.entries(salesByDayMap).map(([date, val]) => ({
      date: date.slice(5), // MM-DD
      amount: val.amount,
      count: val.count,
    }));

    const topSellingProducts = Object.entries(productSalesMap)
      .map(([id, val]) => ({
        id,
        name: val.name,
        salesCount: val.salesCount,
        revenue: val.revenue,
      }))
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    const outOfStockProducts = products.filter((p) => p.status === "out_of_stock").length;

    const ordersByStatus = [
      { status: "Pending", count: pendingOrders, color: "#f59e0b" },
      { status: "Processing", count: orders.filter((o) => o.status === "processing").length, color: "#3b82f6" },
      { status: "Completed", count: completedOrders, color: "#10b981" },
      { status: "Cancelled", count: cancelledOrders, color: "#ef4444" },
    ];

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      todayRevenue,
      thisMonthRevenue,
      totalProducts: products.length,
      outOfStockProducts,
      salesLast7Days,
      salesLast30Days: salesLast7Days, // can expand if needed
      ordersByStatus,
      topSellingProducts,
    };
  },
};
