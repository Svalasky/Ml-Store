import React from "react";
import { Zap, ShieldCheck, Headphones, Wallet, CheckCircle } from "lucide-react";

export function WhyChooseUs() {
  const perks = [
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "Proses Cepat 1-5 Menit",
      description:
        "Tidak perlu menunggu lama. Begitu bukti pembayaran Anda kirimkan ke WhatsApp, akun langsung disiapkan dan dikirim seketika.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
      title: "100% Legal & Bergaransi",
      description:
        "Semua akun diperoleh dari sumber resmi. Kami memberikan jaminan Full Replace jika ada kendala selama masa aktif berlangsung.",
    },
    {
      icon: <Wallet className="h-6 w-6 text-blue-600" />,
      title: "Harga Paling Terjangkau",
      description:
        "Dapatkan harga hemat hingga 80% dibandingkan berlangganan harga normal kartu kredit perseorangan tanpa biaya admin tambahan.",
    },
    {
      icon: <Headphones className="h-6 w-6 text-purple-600" />,
      title: "Customer Support Ramah",
      description:
        "Admin kami siap melayani dan memandu Anda dari awal pemilihan akun sampai cara login ke aplikasi dengan sabar dan responsif.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800">
            Mengapa Memilih Kami
          </span>
          <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight">
            Keunggulan Belanja di Toko Kami
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Kami memprioritaskan keamanan, kenyamanan, dan kepuasan setiap pelanggan akun digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-sm hover:border-slate-700 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 mb-4">
                {perk.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{perk.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
