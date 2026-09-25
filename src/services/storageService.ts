import { createClient } from "@/lib/supabase/client";
import { env } from "@/config/env";

export const ML_BUCKET_NAME = "ml-account-images";

export async function uploadAccountScreenshot(
  file: File,
  productId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const isSupabaseConfigured =
      Boolean(env.supabaseUrl) &&
      !env.supabaseUrl.includes("placeholder") &&
      Boolean(env.supabaseAnonKey) &&
      !env.supabaseAnonKey.includes("placeholder");

    if (!isSupabaseConfigured) {
      // Return a dummy placeholder for local development
      const dummyUrl = URL.createObjectURL(file);
      return { url: dummyUrl, error: null };
    }

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(ML_BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from(ML_BUCKET_NAME)
      .getPublicUrl(fileName);

    return { url: publicData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || "Failed uploading file" };
  }
}
