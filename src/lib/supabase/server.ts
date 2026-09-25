import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, serverEnv } from "@/config/env";
import { createAdminClient } from "./admin";

/**
 * Creates a server-side Supabase client using @supabase/ssr and Next.js cookies.
 * Falls back to admin client in single-user personal dashboard mode.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    env.supabaseUrl || "https://placeholder.supabase.co",
    env.supabaseAnonKey || "placeholder-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The setAll method was called from a Server Component where setting cookies is read-only.
          }
        },
      },
    }
  );

  // If user is signed in via auth session, return client to respect RLS
  try {
    const {
      data: { user },
    } = await client.auth.getUser();
    if (user) return client;
  } catch {
    // Auth check failed, fallback to single-user mode
  }

  // In single-user mode without login, use admin client to access single-user data
  if (serverEnv.supabaseServiceRoleKey) {
    try {
      return createAdminClient();
    } catch {
      // ignore
    }
  }

  return client;
}
