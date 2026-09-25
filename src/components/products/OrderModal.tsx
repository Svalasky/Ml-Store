"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { formatIDR, buildWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { createOrder } from "@/services/orderService";
import { X, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

    setLoading(true);
    try {
      // 1. Create order record
      const order = await createOrder({
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        customer_name: name.trim(),
        customer_whatsapp: whatsapp.trim(),
        customer_note: note.trim() || undefined,
      });

      // 2. Build WhatsApp message with order number
      const waMsg = buildWhatsAppMessage({
        orderNumber: order.order_number,
        product,
      });

      // 3. Open WhatsApp link
      const waUrl = getWhatsAppUrl(waMsg);
      window.open(waUrl, "_blank");

      onClose();
    } catch (err) {
      console.error("Order creation error:", err);
      // Fallback direct WA open
      const fallbackMsg = buildWhatsAppMessage({
        orderNumber: `ORD-${Date.now()}`,
        product,
      });
      window.open(getWhatsAppUrl(fallbackMsg), "_blank");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>Pemesanan Akun via WhatsApp</span>
          </div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            Konfirmasi Beli Akun
          </h3>
        </div>

        {/* Account Snapshot Summary */}
        <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/80 space-y-2 text-xs">
          <div className="font-bold text-foreground text-sm line-clamp-1">
            {product.name}
          </div>
          <div className="flex items-center justify-between text-muted-foreground font-mono">
            <span>Rank: {product.rank}</span>
            <span>{product.skin_count} Skins</span>
          </div>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-muted-foreground">Total Harga Akun:</span>
            <span className="text-sm font-black text-emerald-400">
              {formatIDR(product.price)}
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nama Lengkap Pembeli <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Nomor WhatsApp Pembeli <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Contoh: 081234567890"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Catatan Pembelian (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Mau tanya opsi pembayaran via BCA / QRIS"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Order ID otomatis terbuat. Transaksi & serah terima data dipandu langsung oleh Admin via WhatsApp.
            </span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Beli Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
