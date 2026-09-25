"use client";

import React, { useState } from "react";
import { MOCK_FAQS } from "@/data/mock-faqs";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Pusat Bantuan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Temukan jawaban cepat seputar legalitas, metode pembayaran, dan klaim garansi akun kami.
          </p>
        </div>

        <div className="space-y-3">
          {MOCK_FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={cn(
                  "rounded-2xl border transition-all duration-200 overflow-hidden",
                  isOpen
                    ? "border-emerald-200 bg-emerald-50/20 shadow-xs"
                    : "border-slate-200/80 bg-white hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-transform duration-200",
                      isOpen && "rotate-180 bg-emerald-100 text-emerald-700"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/60 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
