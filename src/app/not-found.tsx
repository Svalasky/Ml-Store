import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 sm:p-10 border border-slate-200 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
            <FileQuestion className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="mt-2 text-lg font-bold text-slate-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Halaman yang Anda tuju mungkin sudah dipindahkan, dihapus, atau alamat URL yang Anda masukkan salah.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2 rounded-xl">
                <Home className="h-4 w-4" />
                <span>Ke Beranda</span>
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl">
                <ArrowLeft className="h-4 w-4" />
                <span>Lihat Katalog</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
