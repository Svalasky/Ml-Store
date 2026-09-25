import React from "react";
import { MousePointerClick, MessageCircle, UserCheck, CreditCard, Send } from "lucide-react";

export function HowToOrder() {
  const steps = [
    {
      number: "01",
      icon: <MousePointerClick className="h-5 w-5 text-emerald-600" />,
      title: "Pilih Produk",
      description: "Pilih produk dan paket akun digital yang Anda inginkan pada katalog.",
    },
    {
      number: "02",
      icon: <MessageCircle className="h-5 w-5 text-emerald-600" />,
      title: "Klik Beli via WhatsApp",
      description: "Sistem otomatis menyiapkan template pesan pembelian yang sudah terformat rapi.",
    },
    {
      number: "03",
      icon: <UserCheck className="h-5 w-5 text-emerald-600" />,
      title: "Hubungi Admin",
      description: "Kirim pesan tersebut ke WhatsApp admin kami untuk konfirmasi ketersediaan.",
    },
    {
      number: "04",
      icon: <CreditCard className="h-5 w-5 text-emerald-600" />,
      title: "Lakukan Pembayaran",
      description: "Bayar menggunakan QRIS instan atau Transfer Bank sesuai arahan admin.",
    },
    {
      number: "05",
      icon: <Send className="h-5 w-5 text-emerald-600" />,
      title: "Akun Dikirim",
      description: "Admin mengirimkan data login akun dan panduan penggunaan dalam 1-5 menit.",
    },
  ];

  return (
    <section id="how-to-order" className="py-16 md:py-20 bg-slate-50/70 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Mudah & Praktis
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            5 Langkah Mudah Memesan Akun
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Tanpa perlu registrasi akun atau isi form checkout yang berbelit-belit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="absolute -top-3 left-4 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white tracking-widest">
                STEP {step.number}
              </div>

              <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 mb-3">
                {step.icon}
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
