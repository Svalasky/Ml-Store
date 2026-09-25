/**
 * Centralized, validated environment configuration for public application settings.
 * Safe to import across client and server components.
 */
export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "MLBB Account Store",
  storeName: process.env.NEXT_PUBLIC_STORE_NAME ?? "Jual Akun Mobile Legends",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6281234567890",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "@mlbb_store",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK ?? "@mlbb_store",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

/**
 * Server-only environment configuration for secrets.
 * Do not import or expose to client-side bundles.
 */
export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};
