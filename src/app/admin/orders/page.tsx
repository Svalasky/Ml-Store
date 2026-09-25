"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { getOrders, updateOrderStatus, updatePaymentStatus } from "@/services/orderService";
import { formatIDR, getWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShoppingBag,
  Search,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  const handlePaymentStatusChange = async (
    orderId: string,
    paymentStatus: PaymentStatus
  ) => {
    await updatePaymentStatus(orderId, paymentStatus);
    loadOrders();
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer_whatsapp && o.customer_whatsapp.includes(search));
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Kelola Pesanan (Orders)
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Daftar transaksi pesanan akun via WhatsApp, update status bayar dan serah terima akun.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Order ID, Pembeli, Nomor WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Semua" },
            { id: "pending", label: "Pending" },
            { id: "waiting_payment", label: "Menunggu Bayar" },
            { id: "paid", label: "Lunas" },
            { id: "completed", label: "Selesai" },
            { id: "cancelled", label: "Batal" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-mono uppercase">
              <tr>
                <th className="p-4">Order ID & Tanggal</th>
                <th className="p-4">Akun MLBB</th>
                <th className="p-4">Pembeli (Customer)</th>
                <th className="p-4">Harga Akun</th>
                <th className="p-4">Pembayaran</th>
                <th className="p-4">Status Pesanan</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Belum ada data pesanan.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => {
                  const buyerWaUrl = ord.customer_whatsapp
                    ? getWhatsAppUrl(
                        `Halo ${ord.customer_name || "Kak"}, kami dari Admin MLBB Store mengenai Order ${ord.order_number}.`,
                        ord.customer_whatsapp
                      )
                    : "#";

                  return (
                    <tr key={ord.id} className="hover:bg-secondary/20 transition-colors">
                      {/* Order Number & Date */}
                      <td className="p-4 space-y-1 font-mono">
                        <span className="font-bold text-foreground block">
                          {ord.order_number}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(ord.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Account Name */}
                      <td className="p-4 max-w-xs space-y-1">
                        <span className="font-bold text-foreground block line-clamp-1">
                          {ord.product_name}
                        </span>
                        {ord.customer_note && (
                          <span className="text-[11px] text-muted-foreground italic line-clamp-1">
                            Note: &quot;{ord.customer_note}&quot;
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="p-4 space-y-1">
                        <span className="font-semibold text-foreground block">
                          {ord.customer_name || "Guest Buyer"}
                        </span>
                        {ord.customer_whatsapp && (
                          <a
                            href={buyerWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <MessageCircle className="w-3 h-3" />
                            {ord.customer_whatsapp}
                          </a>
                        )}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-mono font-bold text-emerald-400 text-sm">
                        {formatIDR(ord.price)}
                      </td>

                      {/* Payment Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={ord.payment_status}
                          onChange={(e) =>
                            handlePaymentStatusChange(
                              ord.id,
                              e.target.value as PaymentStatus
                            )
                          }
                          className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase cursor-pointer border ${
                            ord.payment_status === "paid"
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                              : ord.payment_status === "pending"
                              ? "bg-amber-950/60 text-amber-300 border-amber-700/60"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700"
                          }`}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Order Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as OrderStatus)
                          }
                          className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase cursor-pointer border ${
                            ord.status === "completed"
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                              : ord.status === "paid" || ord.status === "processing"
                              ? "bg-blue-950/60 text-blue-300 border-blue-700/60"
                              : ord.status === "cancelled"
                              ? "bg-red-950/60 text-red-300 border-red-700/60"
                              : "bg-amber-950/60 text-amber-300 border-amber-700/60"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="waiting_payment">Waiting Payment</option>
                          <option value="paid">Paid</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
