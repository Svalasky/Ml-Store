import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Banner } from "@/types/settings";

const MOCK_BANNERS: Banner[] = [
  {
    id: "b1000000-0000-0000-0000-000000000001",
    title: "Mega Promo Akun Premium Streaming & AI",
    description: "Dapatkan diskon hingga 70% untuk Netflix, Spotify, ChatGPT Plus, dan Canva Pro resmi bergaransi.",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Lihat Promo",
    buttonUrl: "/products",
    active: true,
    sortOrder: 1,
  },
  {
    id: "b1000000-0000-0000-0000-000000000002",
    title: "Akun AI & Produktivitas Siap Pakai",
    description: "Upgrade cara kerja kamu dengan ChatGPT-4o, Midjourney Pro, dan GitHub Copilot tanpa ribet.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80",
    buttonText: "Jelajahi AI Tools",
    buttonUrl: "/products",
    active: true,
    sortOrder: 2,
  },
];

export const bannerService = {
  async getActive(): Promise<Banner[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return MOCK_BANNERS;

    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true });

      if (error || !data || data.length === 0) {
        return MOCK_BANNERS;
      }

      return data.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description || undefined,
        imageUrl: b.image_url || undefined,
        buttonText: b.button_text || undefined,
        buttonUrl: b.button_url || undefined,
        active: b.active,
        sortOrder: b.sort_order,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
    } catch {
      return MOCK_BANNERS;
    }
  },

  async getAll(): Promise<Banner[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return MOCK_BANNERS;

    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error || !data) return MOCK_BANNERS;

      return data.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description || undefined,
        imageUrl: b.image_url || undefined,
        buttonText: b.button_text || undefined,
        buttonUrl: b.button_url || undefined,
        active: b.active,
        sortOrder: b.sort_order,
        createdAt: b.created_at,
        updatedAt: b.updated_at,
      }));
    } catch {
      return MOCK_BANNERS;
    }
  },
};
