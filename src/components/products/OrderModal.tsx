"use client";

import React, { useState } from "react";
import { MessageCircle, CheckCircle2, ShieldCheck, Loader2, Tag } from "lucide-react";
import { Product, ProductVariant } from "@/types/product";
import { useStore } from "@/context/StoreContext";
import { orderService } from "@/services/orderService";
import { buildWhatsAppUrl, generateOrderWhatsAppMessage } from "@/lib/whatsapp";
import { formatRupiah } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant?: ProductVariant;
}

export function OrderModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
}: OrderModalProps) {
  const { settings } = useStore();
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentDuration = selectedVariant ? (selectedVariant.duration || selectedVariant.name) : (product.duration || "1 Bulan");

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = whatsappNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMsg("Harap masukkan nomor WhatsApp yang valid (minimal 9 digit).");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create order in persistent DB
      const result = await orderService.createOrder({
        customerName: customerName.trim() || "Customer",
        whatsappNumber: cleanPhone,
        productId: product.id,
        variantId: selectedVariant?.id,
        customerNote: customerNote.trim() || undefined,
        discountCode: discountCode.trim() || undefined,
      });

      // 2. Generate WhatsApp message matching requirement format
      const waMsg = generateOrderWhatsAppMessage({
        orderNumber: result.orderNumber,
        productName: result.productName,
        variantName: result.variantName || currentDuration,
        price: result.total,
        customerName: customerName.trim() || undefined,
        customerNote: customerNote.trim() || undefined,
      });

      // 3. Build target WhatsApp URL
      const waUrl = buildWhatsAppUrl(settings.whatsappNumber, waMsg);

      // Close modal and redirect
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }, 600);
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setErrorMsg(err.message || "Gagal membuat pesanan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Pesanan via WhatsApp"
      description="Lengkapi data pemesanan di bawah ini untuk mendapatkan Order ID resmi."
      size="md"
    >
      <form onSubmit={handleSubmitOrder} className="space-y-4 pt-1">
        {/* Order Summary Pill */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium">Produk Dipilih:</p>
              <h4 className="text-sm font-bold text-slate-900">{product.name}</h4>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                Paket: {selectedVariant ? selectedVariant.name : currentDuration}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total:</span>
              <span className="text-base font-extrabold text-emerald-600">
                {formatRupiah(currentPrice)}
              </span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap / Panggilan <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Contoh: Budi Santoso"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nomor WhatsApp Pembeli <span className="text-rose-500">*</span>
            </label>
            <Input
              type="tel"
              placeholder="Contoh: 081234567890"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              disabled={isLoading}
              className="text-sm"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Digunakan Admin untuk konfirmasi status & pengiriman akun.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Pesanan (Opsional)
            </label>
            <Input
              placeholder="Contoh: Tolong invite ke email saya@gmail.com"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              disabled={isLoading}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kode Promo (Opsional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Contoh: MOLELAUNCH"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="pl-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Security / Guarantee Assurance */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Garansi 100% replace & pesanan tercatat resmi di sistem database.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="whatsapp"
            disabled={isLoading}
            className="gap-2 px-5"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Membuat Pesanan...</span>
              </>
            ) : (
              <>
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>Lanjut ke WhatsApp</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
