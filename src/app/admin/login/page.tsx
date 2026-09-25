"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Shield, ArrowLeft, KeyRound, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login berhasil! Selamat datang Admin.");
        router.push("/admin");
      } else {
        setError("Email/username atau password salah. Cek demo credentials di bawah.");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@molestore.com");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Toko</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Admin Authentication
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Masuk ke panel manajemen produk dan pengaturan toko
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-950/60 border border-red-800 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="admin@molestore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <KeyRound className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl h-11 shadow-md shadow-emerald-600/20"
              isLoading={isLoading}
            >
              Masuk Dashboard
            </Button>
          </form>

          {/* Demo helper badge & quick fill */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 mb-2 font-medium">
              Demo Credentials:
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
                admin@molestore.com
              </span>
              <span>/</span>
              <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300">
                admin123
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-medium underline-offset-4 hover:underline"
            >
              Klik di sini untuk Isi Otomatis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
