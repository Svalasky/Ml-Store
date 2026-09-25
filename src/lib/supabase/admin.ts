import "server-only";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { env, serverEnv } from "@/config/env";

/**
 * Creates a privileged admin client using SUPABASE_SERVICE_ROLE_KEY.
 * MUST remain server-only. Never expose to browser/client components.
 */
export function createAdminClient() {
  if (!serverEnv.supabaseServiceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables."
    );
  }

  return createSupabaseAdminClient(
    env.supabaseUrl || "https://placeholder.supabase.co",
    serverEnv.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
