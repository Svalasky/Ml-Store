import { StoreSettings } from "@/types/settings";

export const MOCK_SETTINGS: StoreSettings = {
  storeName: "Mole Store",
  tagline: "Pusat Akun Digital Legal, Murah & Bergaransi",
  description: "Platform penyedia akun digital streaming, game, AI tools, dan software resmi terlengkap di Indonesia dengan pemrosesan instan via WhatsApp.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890",
  whatsappMessage: "Halo Admin Mole Store, saya ingin bertanya seputar produk...",
  instagram: "molestore.id",
  tiktok: "molestore.official",
  telegram: "molestore_channel",
  email: "support@molestore.com",
  address: "Jakarta Selatan, DKI Jakarta, Indonesia",
  logo: "/logo.svg",
};
