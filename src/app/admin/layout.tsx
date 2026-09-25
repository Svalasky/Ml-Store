"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  // If on login page, render children directly without admin layout frame
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while verifying auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-emerald-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getPageTitle = () => {
    if (pathname === "/admin") return "Ringkasan Dashboard";
    if (pathname.startsWith("/admin/products")) return "Manajemen Produk";
    if (pathname.startsWith("/admin/categories")) return "Manajemen Kategori";
    if (pathname.startsWith("/admin/settings")) return "Pengaturan Toko";
    return "Admin Panel";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          title={getPageTitle()}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
