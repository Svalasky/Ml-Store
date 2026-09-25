"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, CheckCircle } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function TestimonialSection() {
  const { testimonials } = useStore();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Ulasan Pelanggan
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dipercaya Ribuan Pelanggan Setiap Bulan
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Berikut testimoni asli dari pelanggan yang telah berbelanja akun digital di Mole Store.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{item.message}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                {item.imageUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.customerName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {item.customerName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>{item.customerName}</span>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  </h4>
                  <span className="text-[11px] text-slate-500">Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
