"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ShoppingCart,
  MessageCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/common/LoadingState";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAll({
        search: search.trim() || undefined,
        status: statusFilter as any,
        paymentStatus: paymentFilter as any,
      });
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, paymentFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "processing":
        return <Badge variant="info">Processing</Badge>;
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      case "waiting_payment":
        return <Badge variant="warning">Waiting Payment</Badge>;
      case "cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      case "pending":
      default:
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Lunas</span>;
      case "refunded":
        return <span className="inline-flex items-center text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">Refund</span>;
      case "pending":
        return <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">Pending</span>;
      case "unpaid":
      default:
        return <span className="inline-flex items-center text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">Belum Bayar</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Kelola Pesanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau dan proses semua transaksi pesanan akun digital dari pelanggan.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadOrders}
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari ID Pesanan, Nama, atau No. WA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Status Pesanan</option>
              <option value="pending">Pending</option>
              <option value="waiting_payment">Waiting Payment</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="sm:col-span-3">
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Status Bayar</option>
              <option value="unpaid">Belum Bayar (Unpaid)</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="refunded">Refund</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden border-slate-200 shadow-xs bg-white">
        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner size="lg" text="Memuat daftar pesanan..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-800">
              Tidak ada pesanan ditemukan
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau filter status Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3.5">ID Pesanan</th>
                  <th className="px-4 py-3.5">Pelanggan</th>
                  <th className="px-4 py-3.5">Produk & Varian</th>
                  <th className="px-4 py-3.5">Total</th>
                  <th className="px-4 py-3.5">Pembayaran</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Waktu</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Order Number */}
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">
                          {order.customer?.name || "Customer"}
                        </div>
                        {order.customer?.whatsappNumber && (
                          <a
                            href={buildWhatsAppUrl(order.customer.whatsappNumber, `Halo Kak ${order.customer.name || ""}, mengenai pesanan ${order.orderNumber}...`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline mt-0.5"
                          >
                            <MessageCircle className="h-3 w-3" />
                            <span>{order.customer.whatsappNumber}</span>
                          </a>
                        )}
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 line-clamp-1">
                          {firstItem ? firstItem.productName : "Produk Digital"}
                        </div>
                        {firstItem?.variantName && (
                          <div className="text-[11px] text-slate-500">
                            Paket: {firstItem.variantName}
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-extrabold text-slate-900">
                        {formatRupiah(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        {getPaymentBadge(order.paymentStatus)}
                      </td>

                      {/* Order Status */}
                      <td className="px-4 py-3.5">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                            <Eye className="h-3.5 w-3.5" />
                            <span>Detail</span>
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
