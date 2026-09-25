"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana cara membeli akun Mobile Legends di website ini?",
      a: "Pilih akun yang Anda inginkan pada katalog, lalu klik tombol 'Beli via WhatsApp'. Masukkan nama dan nomor WhatsApp Anda, lalu sistem akan otomatis membuat Order ID dan membuka chat WhatsApp dengan admin untuk proses transaksi dan serah terima data.",
    },
    {
      q: "Apakah transaksi di toko ini aman dari hack-back?",
      a: "Sangat aman! Kami memberikan garansi Anti Hack-Back. Semua akun yang dijual berstatus Monsep (Moonton Sepaket) dengan Gmail awal atau All Unbind bersih, sehingga data dapat diganti 100% menjadi milik pembeli.",
    },
    {
      q: "Metode pembayaran apa saja yang diterima?",
      a: "Kami menerima transfer Bank (BCA, Mandiri, BRI, BNI), E-Wallet (Dana, OVO, GoPay, ShopeePay), serta pembayaran instan via QRIS.",
    },
    {
      q: "Berapa lama proses serah terima akun?",
      a: "Setelah pembayaran diverifikasi oleh admin via WhatsApp, data akun (Email & Password) akan langsung dikirimkan dalam kurun waktu 5 - 10 menit.",
    },
    {
      q: "Apakah admin akan membantu proses perubahan data akun?",
      a: "Ya, admin kami akan memandu langkah demi langkah cara mengganti email Moonton, password, hingga mengaktifkan verifikasi 2 langkah untuk memastikan akun Anda 100% aman.",
    },
  ];

  return (
    <section id="faq" className="space-y-8 max-w-3xl mx-auto scroll-mt-24">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
          <HelpCircle className="w-3.5 h-3.5 text-primary" />
          <span>PERTANYAAN UMUM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-sm text-muted-foreground">
          Semua hal yang perlu Anda ketahui seputar pembelian akun Mobile Legends.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-card border border-border overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-foreground text-sm sm:text-base hover:bg-secondary/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
