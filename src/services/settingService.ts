import { createClient } from "@/lib/supabase/client";
import { Banner, Testimonial, StoreSettings } from "@/types/database";
import { MOCK_BANNERS, MOCK_TESTIMONIALS } from "@/data/mock-products";
import { env } from "@/config/env";

const isSupabaseConfigured = () => {
  return (
    Boolean(env.supabaseUrl) &&
    !env.supabaseUrl.includes("placeholder") &&
    Boolean(env.supabaseAnonKey) &&
    !env.supabaseAnonKey.includes("placeholder")
  );
};

export async function getBanners(): Promise<Banner[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase banners fallback:", e);
    }
  }
  return MOCK_BANNERS;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase testimonials fallback:", e);
    }
  }
  return MOCK_TESTIMONIALS;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("store_settings")
        .select("*")
        .limit(1)
        .single();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn("Supabase settings fallback:", e);
    }
  }

  return {
    store_name: env.storeName,
    whatsapp_number: env.whatsappNumber,
    instagram: env.instagram,
    tiktok: env.tiktok,
    email: "support@mlbb-store.com",
  };
}
