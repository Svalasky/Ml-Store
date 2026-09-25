"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  History,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Search,
  Calendar,
  Eye,
  RefreshCw,
  CreditCard,
  DollarSign,
  Package,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { Order } from "@/types/order";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingState";

type PeriodTab = "all" | "today" | "week" | "month" | "completed" | "cancelled";

export default function PurchasesHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PeriodTab>("all");
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await orderService.getAll();
      setOrders(all);
    } catch (e) {
      console.error("Failed to load purchases", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter orders by tab
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  const filteredOrders = orders.filter((o) => {
    // Search match
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchSearch =
        o.orderNumber.toLowerCase().includes(s) ||
        o.customer?.name?.toLowerCase().includes(s) ||
        o.customer?.whatsappNumber.includes(s) ||
        o.items?.some((i) => i.productName.toLowerCase().includes(s));
      if (!matchSearch) return false;
    }

    const orderDate = new Date(o.createdAt);

    switch (activeTab) {
      case "today":
        return o.createdAt.slice(0, 10) === todayStr;
      case "week":
        return orderDate >= oneWeekAgo;
      case "month":
        return orderDate >= oneMonthAgo;
      case "completed":
        return o.status === "completed";
      case "cancelled":
        return o.status === "cancelled";
      case "all":
      default:
        return true;
    }
  });

  // Calculate metrics
  const completedList = filteredOrders.filter((o) => o.status === "completed" || o.paymentStatus === "paid");
  const totalRevenue = completedList.reduce((acc, curr) => acc + curr.total, 0);
  const completedCount = filteredOrders.filter((o) => o.status === "completed").length;
  const cancelledCount = filteredOrders.filter((o) => o.status === "cancelled").length;
  const avgOrderValue = completedList.length > 0 ? Math.round(totalRevenue / completedList.length) : 0;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Pembelian & Penjualan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi seluruh riwayat transaksi pesanan dan performa omzet toko.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Omzet Transaksi</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-700">
            {formatRupiah(totalRevenue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Dari pesanan terbayar/selesai</p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Transaksi Selesai</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900">
            {completedCount} Pesanan
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Akun telah terkirim</p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-rata Nilai Order</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-slate-900">
            {formatRupiah(avgOrderValue)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Nilai rata-rata / transaksi</p>
        </Card>

        <Card className="p-4 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pesanan Dibatalkan</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-600">
            {cancelledCount} Pesanan
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Gagal / Dibatalkan</p>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Period Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: "all", label: "Semua" },
              { id: "today", label: "Hari Ini" },
              { id: "week", label: "7 Hari Terakhir" },
              { id: "month", label: "30 Hari Terakhir" },
              { id: "completed", label: "Selesai" },
              { id: "cancelled", label: "Dibatalkan" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PeriodTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Cari ID, Pelanggan, Produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner size="md" text="Memuat riwayat transaksi..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Tidak ada transaksi pada filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">ID Pesanan</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Produk & Varian</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status Bayar</th>
                  <th className="px-4 py-3">Status Order</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">
                          {order.customer?.name || "Customer"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {order.customer?.whatsappNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">
                          {firstItem?.productName || "Akun Digital"}
                        </div>
                        {firstItem?.variantName && (
                          <div className="text-[11px] text-slate-500">
                            {firstItem.variantName}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={order.paymentStatus === "paid" ? "success" : "warning"}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "success"
                              : order.status === "cancelled"
                              ? "danger"
                              : "info"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            <span>Lihat</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}