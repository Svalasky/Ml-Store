import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

/**
 * Universal Supabase client using @supabase/supabase-js.
 * Safe to import and call in both Server Components and Client Components.
 */
export function createClient() {
  return createSupabaseJsClient(
    env.supabaseUrl || "https://placeholder.supabase.co",
    env.supabaseAnonKey || "placeholder-key"
  );
}
