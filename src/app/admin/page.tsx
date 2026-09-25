"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  AlertTriangle,
  CheckCircle,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Settings,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  XCircle,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { DashboardStats } from "@/types/admin";
import { Order } from "@/types/order";
import { formatRupiah, formatDate } from "@/lib/utils";
import { StockBadge } from "@/components/common/StockBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { CategoryFormModal } from "@/components/admin/CategoryFormModal";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { products, categories, getCategoryById } = useStore();
  const { user } = useAuth();

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayRevenue: 0,
    thisMonthRevenue: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    salesLast7Days: [],
    salesLast30Days: [],
    ordersByStatus: [],
    topSellingProducts: [],
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const [statsData, ordersList] = await Promise.all([
        orderService.getDashboardStats(),
        orderService.getAll({}),
      ]);
      setStats(statsData);
      setRecentOrders(ordersList.slice(0, 5));
    } catch (e) {
      console.error("Failed to load dashboard metrics", e);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData, products]);

  // Max sales amount for bar scaling
  const maxSales = Math.max(...stats.salesLast7Days.map((d) => d.amount), 100000);

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sistem Database Persistent Aktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Kelola pesanan customer, update stok akun digital, dan monitor performa pendapatan toko secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setProductModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl gap-2 shadow-md text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Produk</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setCategoryModalOpen(true)}
              className="border-slate-700 bg-slate-800/80 text-white hover:bg-slate-700 rounded-xl gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Kategori</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Revenue */}
        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Omzet Hari Ini
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-700">
            {formatRupiah(stats.todayRevenue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Total pembayaran terverifikasi hari ini</p>
        </Card>

        {/* This Month Revenue */}
        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Omzet Bulan Ini
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">
            {formatRupiah(stats.thisMonthRevenue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Akumulasi penjualan bulan berjalan</p>
        </Card>

        {/* Pending Orders */}
        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pesanan Pending
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600">
            {stats.pendingOrders}
          </div>
          <Link
            href="/admin/orders?status=pending"
            className="mt-1 text-[11px] text-amber-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Proses pesanan masuk &rarr;</span>
          </Link>
        </Card>

        {/* Completed Orders */}
        <Card className="p-5 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Transaksi Sukses
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">
            {stats.completedOrders}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Dari {stats.totalOrders} total pesanan masuk</p>
        </Card>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Total Katalog Produk</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{products.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Total Kategori</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{categories.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Stok Kosong</span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {products.filter((p) => p.status === "out_of_stock").length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">Pesanan Dibatalkan</span>
          <div className="text-xl font-bold text-rose-600 mt-1">
            {stats.cancelledOrders}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart (7 Days) - 8 cols */}
        <Card className="lg:col-span-8 p-5 bg-white border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Penjualan 7 Hari Terakhir</h3>
              <p className="text-xs text-slate-500">Grafik omzet harian transaksi selesai</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Live Data
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-48 pt-6 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
            {stats.salesLast7Days.map((day, idx) => {
              const heightPercent = maxSales > 0 ? Math.max(8, (day.amount / maxSales) * 100) : 8;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {formatRupiah(day.amount)}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                      day.amount > 0
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                        : "bg-slate-100"
                    }`}
                  />
                  <span className="text-[11px] font-semibold text-slate-600">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top Selling Products - 4 cols */}
        <Card className="lg:col-span-4 p-5 bg-white border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Produk Terlaris</h3>
          <div className="divide-y divide-slate-100">
            {stats.topSellingProducts.length > 0 ? (
              stats.topSellingProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between">
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{p.name}</p>
                    <p className="text-[11px] text-slate-400">{p.salesCount} terjual</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 whitespace-nowrap">
                    {formatRupiah(p.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Belum ada data penjualan tercatat.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="overflow-hidden border-slate-200 shadow-xs bg-white">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pesanan Masuk Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5 transaksi pesanan terakhir yang perlu diproses
            </p>
          </div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1">
              <span>Semua Pesanan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">ID Pesanan</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                return (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {order.customer?.name || "Customer"}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {firstItem?.productName || "Akun Digital"}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "success"
                            : order.status === "cancelled"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSuccess={(msg) => toast.success(msg)}
      />
      <CategoryFormModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSuccess={(msg) => toast.success(msg)}
      />
    </div>
  );
}