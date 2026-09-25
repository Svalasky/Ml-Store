"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { getOrderById, updateOrderStatus, updatePaymentStatus } from "@/services/orderService";
import { formatIDR, getWhatsAppUrl } from "@/lib/whatsapp";
import {
  ChevronLeft,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Gamepad2,
  DollarSign,
  User,
  ShieldCheck,
  Send,
} from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending");
  const [statusNote, setStatusNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadOrder = async () => {
    if (!id) return;
    const data = await getOrderById(id);
    if (data) {
      setOrder(data);
      setNewStatus(data.status);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-muted-foreground font-mono">
        Memuat detail pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-foreground">Pesanan Tidak Ditemukan</h2>
        <Link href="/admin/orders" className="text-xs text-primary underline">
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await updateOrderStatus(order.id, newStatus, statusNote || undefined);
    setStatusNote("");
    await loadOrder();
    setSubmitting(false);
  };

  const handlePaymentChange = async (paymentStatus: PaymentStatus) => {
    await updatePaymentStatus(order.id, paymentStatus);
    await loadOrder();
  };

  const buyerWaUrl = order.customer_whatsapp
    ? getWhatsAppUrl(
        `Halo Kak ${order.customer_name || ""}, update pesanan Order ${order.order_number}: Status saat ini adalah "${order.status}".`,
        order.customer_whatsapp
      )
    : "#";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button & Order Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Pesanan</span>
          </Link>
          <h1 className="text-2xl font-black text-foreground tracking-tight font-mono">
            {order.order_number}
          </h1>
          <p className="text-xs text-muted-foreground">
            Dibuat pada{" "}
            {new Date(order.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {order.customer_whatsapp && (
          <a
            href={buyerWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi Pembeli di WhatsApp</span>
          </a>
        )}
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Order Snapshot & Customer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Account Snapshot */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>INFORMASI AKUN YANG DIBELI</span>
            </h3>

            <div className="space-y-2">
              <div className="font-bold text-base text-foreground">
                {order.product_name}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs font-mono">
                <span className="text-muted-foreground">Harga Akun (Snapshot):</span>
                <span className="text-lg font-black text-emerald-400">
                  {formatIDR(order.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>DATA PEMBELI</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Nama Lengkap</span>
                <span className="font-bold text-foreground">
                  {order.customer_name || "Guest"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Nomor WhatsApp</span>
                <span className="font-mono font-bold text-emerald-400">
                  {order.customer_whatsapp || "-"}
                </span>
              </div>
              {order.customer_note && (
                <div className="col-span-2 p-3 rounded-xl bg-secondary/50 border border-border">
                  <span className="text-muted-foreground block text-[11px]">Catatan Pembeli:</span>
                  <p className="text-foreground italic mt-1">&quot;{order.customer_note}&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Status History Timeline (Section 22) */}
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>STATUS HISTORY TIMELINE</span>
            </h3>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {order.history && order.history.length > 0 ? (
                order.history.map((hist, idx) => (
                  <div key={hist.id || idx} className="relative space-y-1 text-xs">
                    <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground uppercase tracking-wider font-mono">
                        {hist.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {new Date(hist.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {hist.notes && (
                      <p className="text-muted-foreground text-[11px]">{hist.notes}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground">Belum ada riwayat status.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Manage Status Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
            <h3 className="font-bold text-foreground text-xs uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>UPDATE STATUS PESANAN</span>
            </h3>

            {/* Payment Status Quick Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status Pembayaran</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "unpaid", label: "Unpaid" },
                  { id: "pending", label: "Pending" },
                  { id: "paid", label: "Paid / Lunas" },
                  { id: "refunded", label: "Refunded" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePaymentChange(p.id as PaymentStatus)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      order.payment_status === p.id
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-600 shadow-sm"
                        : "bg-secondary text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Update Order Status */}
            <form onSubmit={handleUpdateStatus} className="space-y-3 pt-3 border-t border-border">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Status Pesanan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border text-xs font-bold uppercase cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="waiting_payment">Waiting Payment</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing (Serah Terima Akun)</option>
                  <option value="completed">Completed (Selesai)</option>
                  <option value="cancelled">Cancelled (Batal)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Catatan Perubahan (Timeline Note)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Bukti transfer BCA diterima, proses pengiriman data Moonton & Gmail..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Status</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
