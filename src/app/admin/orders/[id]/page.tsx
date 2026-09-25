"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  User,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Loader2,
  Edit3,
  Save,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { formatRupiah, formatDate } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { LoadingSpinner } from "@/components/common/LoadingState";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Admin note state
  const [adminNote, setAdminNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Dialog state
  const [dialogAction, setDialogAction] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    targetStatus?: OrderStatus;
    targetPayment?: PaymentStatus;
    variant?: "destructive" | "default";
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getById(orderId);
      setOrder(data);
      if (data) {
        setAdminNote(data.adminNote || "");
      }
    } catch (err) {
      console.error("Failed to fetch order", err);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleUpdateStatus = async (
    newStatus: OrderStatus,
    paymentStatus?: PaymentStatus,
    historyNote?: string
  ) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      await orderService.updateStatus(
        order.id,
        newStatus,
        paymentStatus,
        adminNote,
        historyNote
      );
      await loadOrder();
    } catch (e) {
      console.error("Failed to update status", e);
    } finally {
      setIsUpdating(false);
      setDialogAction({ isOpen: false, title: "", message: "" });
    }
  };

  const handleSaveAdminNote = async () => {
    if (!order) return;
    setIsSavingNote(true);
    try {
      await orderService.updateStatus(
        order.id,
        order.status,
        order.paymentStatus,
        adminNote,
        "Catatan internal admin diperbarui"
      );
      await loadOrder();
    } catch (e) {
      console.error("Failed to save note", e);
    } finally {
      setIsSavingNote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner size="lg" text="Memuat detail pesanan..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center space-y-4">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">
          ID pesanan tidak valid atau telah dihapus dari sistem.
        </p>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            Kembali ke Daftar Pesanan
          </Button>
        </Link>
      </div>
    );
  }

  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";
  const isPaid = order.paymentStatus === "paid";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialogAction.isOpen}
        onClose={() => setDialogAction({ ...dialogAction, isOpen: false })}
        title={dialogAction.title}
        message={dialogAction.message}
        variant={dialogAction.variant || "default"}
        confirmText="Ya, Lanjutkan"
        onConfirm={() => {
          if (dialogAction.targetStatus) {
            handleUpdateStatus(
              dialogAction.targetStatus,
              dialogAction.targetPayment,
              `Status diubah menjadi ${dialogAction.targetStatus}`
            );
          }
        }}
      />

      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {order.orderNumber}
              </h1>
              <Badge
                variant={
                  isCompleted
                    ? "success"
                    : isCancelled
                    ? "danger"
                    : "warning"
                }
              >
                {order.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dibuat pada {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!isPaid && !isCancelled && (
            <Button
              size="sm"
              variant="outline"
              className="text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold"
              onClick={() =>
                setDialogAction({
                  isOpen: true,
                  title: "Konfirmasi Pembayaran",
                  message: "Pastikan dana telah masuk ke rekening / QRIS sebelum menandai pesanan sebagai Paid.",
                  targetStatus: "paid",
                  targetPayment: "paid",
                  variant: "default",
                })
              }
              disabled={isUpdating}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Tandai Lunas</span>
            </Button>
          )}

          {order.status !== "processing" && !isCompleted && !isCancelled && (
            <Button
              size="sm"
              variant="outline"
              className="text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100 text-xs font-semibold"
              onClick={() =>
                handleUpdateStatus("processing", isPaid ? "paid" : undefined, "Sedang menyiapkan akun untuk customer")
              }
              disabled={isUpdating}
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Proses Pesanan</span>
            </Button>
          )}

          {!isCompleted && !isCancelled && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              onClick={() =>
                setDialogAction({
                  isOpen: true,
                  title: "Selesaikan Pesanan",
                  message: "Pastikan akun digital dan detail login telah dikirimkan ke pelanggan via WhatsApp.",
                  targetStatus: "completed",
                  targetPayment: "paid",
                  variant: "default",
                })
              }
              disabled={isUpdating}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              <span>Selesaikan Pesanan</span>
            </Button>
          )}

          {!isCancelled && !isCompleted && (
            <Button
              size="sm"
              variant="ghost"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs"
              onClick={() =>
                setDialogAction({
                  isOpen: true,
                  title: "Batalkan Pesanan",
                  message: "Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini akan dicatat dalam riwayat.",
                  targetStatus: "cancelled",
                  variant: "destructive",
                })
              }
              disabled={isUpdating}
            >
              <XCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>Batalkan</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Items & Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Purchased Items Card */}
          <Card className="p-5 border-slate-200 bg-white shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <span>Detail Produk Transaksi</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {item.productName}
                      </h4>
                      {item.variantName && (
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                          Paket: {item.variantName}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: {item.quantity} x {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-2 text-xs text-slate-500">Tidak ada rincian item.</div>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk:</span>
                <span className="font-semibold">{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskon Promo:</span>
                  <span className="font-semibold">-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Pembayaran:</span>
                <span className="text-emerald-700">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Timeline Status History */}
          <Card className="p-5 border-slate-200 bg-white shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span>Timeline Riwayat Status Pesanan</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.history && order.history.length > 0 ? (
                order.history.map((h, i) => (
                  <div key={h.id || i} className="relative">
                    <span className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 uppercase">
                        Status: {h.newStatus}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(h.createdAt)}
                      </span>
                    </div>
                    {h.note && (
                      <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {h.note}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">Belum ada riwayat tercatat.</div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Customer info, notes (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <Card className="p-5 border-slate-200 bg-white shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" />
              <span>Informasi Pelanggan</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <User className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Nama:</span>
                  <span className="font-semibold text-slate-900">
                    {order.customer?.name || "Customer WhatsApp"}
                  </span>
                </div>
              </div>

              {order.customer?.whatsappNumber && (
                <div className="flex items-start gap-2.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">WhatsApp:</span>
                    <span className="font-semibold text-slate-900">
                      {order.customer.whatsappNumber}
                    </span>
                  </div>
                </div>
              )}

              {order.customer?.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email:</span>
                    <span className="font-semibold text-slate-900">
                      {order.customer.email}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {order.customer?.whatsappNumber && (
              <a
                href={buildWhatsAppUrl(
                  order.customer.whatsappNumber,
                  `Halo Kak ${order.customer?.name || ""}, update pesanan ${order.orderNumber}: status pesanan saat ini *${order.status.toUpperCase()}*.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="whatsapp"
                  size="sm"
                  className="w-full gap-2 text-xs font-semibold py-2"
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-white" />
                  <span>Chat Pelanggan di WhatsApp</span>
                </Button>
              </a>
            )}
          </Card>

          {/* Customer Note */}
          {order.customerNote && (
            <Card className="p-4 border-amber-200 bg-amber-50/50 shadow-xs space-y-1.5">
              <span className="text-[11px] font-bold text-amber-900 uppercase">
                Catatan dari Pelanggan:
              </span>
              <p className="text-xs text-amber-800 leading-relaxed">
                &ldquo;{order.customerNote}&rdquo;
              </p>
            </Card>
          )}

          {/* Internal Admin Note Card */}
          <Card className="p-5 border-slate-200 bg-white shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-slate-500" />
              <span>Catatan Internal Admin</span>
            </h3>
            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Contoh: Akun Netflix profil #4 terkirim, PIN 1234..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveAdminNote}
              disabled={isSavingNote}
              className="w-full text-xs font-semibold gap-1.5"
            >
              {isSavingNote ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan Catatan Admin</span>
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}