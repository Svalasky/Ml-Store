"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { getProducts } from "@/services/productService";
import { getOrders } from "@/services/orderService";
import { formatIDR } from "@/lib/whatsapp";
import {
  Gamepad2,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Plus,
  Crown,
  Trophy,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [prods, ords] = await Promise.all([
        getProducts({ status: "all" }),
        getOrders(),
      ]);
      setProducts(prods);
      setOrders(ords);
      setLoading(false);
    }
    load();
  }, []);

  const totalAccounts = products.length;
  const availableAccounts = products.filter((p) => p.status === "available").length;
  const soldAccounts = products.filter((p) => p.status === "sold").length;
  const reservedAccounts = products.filter((p) => p.status === "reserved").length;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "waiting_payment"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid" || o.status === "completed")
    .reduce((sum, o) => sum + Number(o.price || 0), 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Dashboard Admin
          </h1>
          <p className="text-xs text-muted-foreground font-mono">
            Ringkasan performa penjualan akun Mobile Legends dan pesanan WhatsApp.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Kelola Akun MLBB</span>
        </Link>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold font-mono">TOTAL AKUN</span>
            <Gamepad2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {totalAccounts}
          </div>
          <div className="text-[11px] text-muted-foreground flex gap-2">
            <span className="text-emerald-400 font-semibold">{availableAccounts} Tersedia</span>
            <span>•</span>
            <span className="text-red-400 font-semibold">{soldAccounts} Terjual</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold font-mono">TOTAL PESANAN</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-mono">
            {totalOrders}
          </div>
          <div className="text-[11px] text-muted-foreground flex gap-2">
            <span className="text-amber-400 font-semibold">{pendingOrders} Pending</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{completedOrders} Selesai</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold font-mono">TOTAL PENDAPATAN</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {formatIDR(totalRevenue)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Dari pesanan selesai & lunas
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold font-mono">STATUS AKUN</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {reservedAccounts}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Akun sedang di-booking / reserved
          </div>
        </div>
      </div>

      {/* TWO COLUMN SUMMARY: Recent Orders & Recent Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT ORDERS */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span>Pesanan Terbaru</span>
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {orders.slice(0, 5).map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-foreground line-clamp-1">
                    {ord.product_name}
                  </div>
                  <div className="text-muted-foreground font-mono text-[11px]">
                    {ord.order_number} • {ord.customer_name || "Buyer"}
                  </div>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <span className="font-bold text-emerald-400 block font-mono">
                    {formatIDR(ord.price)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ord.status === "completed"
                        ? "bg-emerald-950 text-emerald-300"
                        : ord.status === "paid"
                        ? "bg-blue-950 text-blue-300"
                        : "bg-amber-950 text-amber-300"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACCOUNTS */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>Koleksi Akun MLBB</span>
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Kelola Semua <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {products.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-foreground line-clamp-1">
                    {prod.name}
                  </div>
                  <div className="text-muted-foreground font-mono text-[11px] flex items-center gap-2">
                    <span className="text-amber-300 font-semibold">{prod.rank}</span>
                    <span>•</span>
                    <span>{prod.skin_count} Skins</span>
                    {prod.collector_count > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400">{prod.collector_count} Collector</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-1 shrink-0">
                  <span className="font-bold text-emerald-400 block font-mono">
                    {formatIDR(prod.price)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      prod.status === "available"
                        ? "bg-emerald-950 text-emerald-300"
                        : prod.status === "sold"
                        ? "bg-red-950 text-red-300"
                        : "bg-amber-950 text-amber-300"
                    }`}
                  >
                    {prod.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
