import React from "react";
import { ShieldCheck, Zap, HeartHandshake, RefreshCw, Lock, Sparkles } from "lucide-react";

export function WhyChooseUs() {
  const benefits = [
    {
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
      title: "Garansi Anti Hack-Back",
      desc: "Semua akun Mobile Legends dijamin aman dengan garansi anti hack-back. Data pembeli terlindungi 100%.",
    },
    {
      icon: Zap,
      color: "text-amber-400 bg-amber-950/40 border-amber-800/40",
      title: "Proses Cepat 5 Menit",
      desc: "Setelah order dan konfirmasi pembayaran via WhatsApp, admin langsung memberikan data akun tanpa menunggu lama.",
    },
    {
      icon: Lock,
      color: "text-purple-400 bg-purple-950/40 border-purple-800/40",
      title: "Moonton Sepaket & All Unbind",
      desc: "Akun diserahkan lengkap dengan akses Gmail/Email awal dan semua sosial media pihak ketiga sudah di-unbind bersih.",
    },
    {
      icon: HeartHandshake,
      color: "text-blue-400 bg-blue-950/40 border-blue-800/40",
      title: "Dipandu Sampai Tuntas",
      desc: "Admin mendampingi proses perubahan email, password, hingga pengaktifan verifikasi sekunder akun pribadi pembeli.",
    },
  ];

  return (
    <section id="benefits" className="space-y-8 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>KEUNGGULAN TOKO KAMI</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Kenapa Harus Beli Akun MLBB di Sini?
        </h2>
        <p className="text-sm text-muted-foreground">
          Kami mengutamakan keamanan dan kepuasan pembeli dengan standar keamanan tertinggi di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-card border border-border/80 space-y-3 hover:border-primary/50 transition-all shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${b.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-foreground text-base">{b.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
