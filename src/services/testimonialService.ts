import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Testimonial } from "@/types/settings";

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    customerName: "Dimas Pratama",
    rating: 5,
    message: "Prosesnya super kilat! Beli Netflix 1 bulan langsung aktif dalam 3 menit. Profil bersih dan 4K jalan lancar di Smart TV.",
    imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    active: true,
  },
  {
    id: "t2",
    customerName: "Siti Rahmawati",
    rating: 5,
    message: "Canva Pro-nya langsung masuk ke email pribadi saya. Semua template kebuka dan magic eraser-nya ngebantu banget kerjaan.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    active: true,
  },
  {
    id: "t3",
    customerName: "Rian Hidayat",
    rating: 5,
    message: "ChatGPT Plus mantap, GPT-4o kencang tanpa limit antrean. Admin ramah dan responsif saat tanya-tanya panduan login.",
    imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    active: true,
  },
  {
    id: "t4",
    customerName: "Nadya Putri",
    rating: 5,
    message: "Langganan Spotify 1 tahun di Mole Store jauh lebih hemat dibanding bayar bulanan. Sudah 4 bulan jalan aman.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    active: true,
  },
  {
    id: "t5",
    customerName: "Faisal Akbar",
    rating: 5,
    message: "Recommended seller untuk akun digital legal. Fast response, ada invoice jelas, dan garansi benar-benar dipertanggungjawabkan.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    active: true,
  },
];

export const testimonialService = {
  async getActive(): Promise<Testimonial[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return MOCK_TESTIMONIALS;

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_TESTIMONIALS;
      }

      return data.map((t) => ({
        id: t.id,
        customerName: t.customer_name,
        rating: t.rating,
        message: t.message,
        imageUrl: t.image_url || undefined,
        active: t.active,
        createdAt: t.created_at,
      }));
    } catch {
      return MOCK_TESTIMONIALS;
    }
  },

  async getAll(): Promise<Testimonial[]> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return MOCK_TESTIMONIALS;

    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data) return MOCK_TESTIMONIALS;

      return data.map((t) => ({
        id: t.id,
        customerName: t.customer_name,
        rating: t.rating,
        message: t.message,
        imageUrl: t.image_url || undefined,
        active: t.active,
        createdAt: t.created_at,
      }));
    } catch {
      return MOCK_TESTIMONIALS;
    }
  },
};
