"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/types/order";
import { getOrders } from "@/services/orderService";
import { formatIDR, getWhatsAppUrl } from "@/lib/whatsapp";
import { Users, MessageCircle, ShoppingBag, Search } from "lucide-react";

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  // Extract unique customers from orders
  const customerMap = new Map<
    string,
    { name: string; whatsapp: string; totalOrders: number; totalSpent: number; lastOrder: string }
  >();

  orders.forEach((o) => {
    const key = o.customer_whatsapp || o.customer_name || o.id;
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += Number(o.price || 0);
      if (new Date(o.created_at) > new Date(existing.lastOrder)) {
        existing.lastOrder = o.created_at;
      }
    } else {
      customerMap.set(key, {
        name: o.customer_name || "Guest Buyer",
        whatsapp: o.customer_whatsapp || "-",
        totalOrders: 1,
        totalSpent: Number(o.price || 0),
        lastOrder: o.created_at,
      });
    }
  });

  const customerList = Array.from(customerMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.whatsapp.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Daftar Pelanggan (Customers)
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Data pembeli akun Mobile Legends yang tercatat dari pesanan WhatsApp.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama atau nomor WhatsApp pembeli..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-mono uppercase">
            <tr>
              <th className="p-4">Nama Pelanggan</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Total Order</th>
              <th className="p-4">Total Belanja</th>
              <th className="p-4">Transaksi Terakhir</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {customerList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Belum ada data pelanggan.
                </td>
              </tr>
            ) : (
              customerList.map((c, i) => {
                const waUrl = getWhatsAppUrl("Halo Kak, ada update terbaru mengenai akun MLBB kami.", c.whatsapp);
                return (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{c.name}</td>
                    <td className="p-4 font-mono text-emerald-400">{c.whatsapp}</td>
                    <td className="p-4 font-mono">{c.totalOrders} Order</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">
                      {formatIDR(c.totalSpent)}
                    </td>
                    <td className="p-4 font-mono text-muted-foreground">
                      {new Date(c.lastOrder).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      {c.whatsapp !== "-" && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 font-semibold hover:bg-emerald-900/80 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
