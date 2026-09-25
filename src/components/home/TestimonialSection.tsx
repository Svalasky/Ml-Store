"use client";

import React, { useState, useEffect } from "react";
import { Testimonial } from "@/types/database";
import { getTestimonials } from "@/services/settingService";
import { Star, MessageSquareQuote, CheckCircle2 } from "lucide-react";

export function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials().then((data) => {
      if (data && data.length > 0) setTestimonials(data);
    });
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="space-y-8 scroll-mt-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Apa Kata Pembeli Kami?
        </h2>
        <p className="text-sm text-muted-foreground">
          Ratusan pemain Mobile Legends telah membeli akun impian mereka secara aman dan nyaman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-card border border-border space-y-4 flex flex-col justify-between shadow-sm"
          >
            <div className="space-y-3">
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Message */}
              <p className="text-sm text-foreground/90 italic leading-relaxed">
                &ldquo;{t.message}&rdquo;
              </p>
            </div>

            {/* Customer Info */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">{t.customer_name}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Buyer
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
