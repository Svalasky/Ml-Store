import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { StoreSettings } from "@/types/settings";
import { LocalStore } from "./storage";

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("*")
          .limit(1)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            storeName: data.store_name,
            tagline: "Pusat Akun Digital Legal, Murah & Bergaransi",
            description: data.description || "Platform penyedia akun digital streaming, game, AI tools, dan software resmi terlengkap di Indonesia.",
            logoUrl: data.logo_url || undefined,
            whatsappNumber: data.whatsapp_number,
            whatsappMessage: data.whatsapp_message || "Halo Admin Mole Store, saya ingin bertanya seputar produk...",
            instagramUrl: data.instagram_url || undefined,
            tiktokUrl: data.tiktok_url || undefined,
            telegramUrl: data.telegram_url || undefined,
            email: data.email || undefined,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.error("Supabase settings error:", err);
      }
    }
    return LocalStore.getSettings();
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const current = await this.getSettings();
        const payload: any = {};
        if (data.storeName !== undefined) payload.store_name = data.storeName;
        if (data.description !== undefined) payload.description = data.description;
        if (data.logoUrl !== undefined) payload.logo_url = data.logoUrl;
        if (data.whatsappNumber !== undefined) payload.whatsapp_number = data.whatsappNumber;
        if (data.whatsappMessage !== undefined) payload.whatsapp_message = data.whatsappMessage;
        if (data.instagramUrl !== undefined) payload.instagram_url = data.instagramUrl;
        if (data.tiktokUrl !== undefined) payload.tiktok_url = data.tiktokUrl;
        if (data.telegramUrl !== undefined) payload.telegram_url = data.telegramUrl;
        if (data.email !== undefined) payload.email = data.email;

        if (current.id) {
          const { data: updated, error } = await supabase
            .from("store_settings")
            .update(payload)
            .eq("id", current.id)
            .select()
            .single();

          if (!error && updated) {
            return {
              id: updated.id,
              storeName: updated.store_name,
              tagline: "Pusat Akun Digital Legal, Murah & Bergaransi",
              description: updated.description || "",
              logoUrl: updated.logo_url || undefined,
              whatsappNumber: updated.whatsapp_number,
              whatsappMessage: updated.whatsapp_message || "",
              instagramUrl: updated.instagram_url || undefined,
              tiktokUrl: updated.tiktok_url || undefined,
              telegramUrl: updated.telegram_url || undefined,
              email: updated.email || undefined,
              updatedAt: updated.updated_at,
            };
          }
        }
      } catch (err) {
        console.error("Supabase update settings error:", err);
      }
    }
    return LocalStore.saveSettings(data);
  },
};
