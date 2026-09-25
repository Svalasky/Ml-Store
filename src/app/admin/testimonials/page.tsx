"use client";

import React, { useState, useEffect } from "react";
import { Testimonial } from "@/types/database";
import { getTestimonials } from "@/services/settingService";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Kelola Testimoni Pembeli
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Review dan testimoni kepuasan pelanggan yang tampil di homepage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-foreground italic leading-relaxed">
                &ldquo;{t.message}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">{t.customer_name}</span>
              <span className="text-emerald-400 font-semibold font-mono text-[10px]">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
