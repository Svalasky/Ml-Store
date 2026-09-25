import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET_NAME = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export const storageService = {
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "Format file tidak didukung. Harap gunakan format JPG, JPEG, PNG, atau WEBP.",
      };
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "Ukuran file terlalu besar. Maksimal 5MB.",
      };
    }
    return { valid: true };
  },

  async uploadProductImage(file: File, pathPrefix = "products"): Promise<UploadResult> {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      return { url: "", path: "", error: validation.error };
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      // Fallback to data URL for preview/offline development
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            path: `local-${Date.now()}`,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split(".").pop() || "png";
      const fileName = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        return { url: "", path: "", error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        url: publicData.publicUrl,
        path: data.path,
      };
    } catch (err: any) {
      console.error("Storage upload exception:", err);
      return { url: "", path: "", error: err.message || "Gagal mengunggah gambar" };
    }
  },

  async deleteImage(pathOrUrl: string): Promise<boolean> {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !pathOrUrl) return true;

    try {
      let path = pathOrUrl;
      if (pathOrUrl.includes(BUCKET_NAME)) {
        path = pathOrUrl.split(`${BUCKET_NAME}/`)[1];
      }

      if (path) {
        const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
        if (error) {
          console.error("Failed to delete storage file:", error);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("Storage delete error:", err);
      return false;
    }
  },
};
