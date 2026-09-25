import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Category } from "@/types/category";
import { LocalStore } from "./storage";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || "",
            image: c.image_url || "",
            icon: "Layers",
            active: c.active,
          }));
        }
      } catch (e) {
        console.error("Supabase categories error:", e);
      }
    }
    return LocalStore.getCategories();
  },

  async getById(id: string): Promise<Category | null> {
    const categories = await this.getAll();
    return categories.find((c) => c.id === id) || null;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = await this.getAll();
    return categories.find((c) => c.slug === slug) || null;
  },

  async create(data: Omit<Category, "id">): Promise<Category> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data: created, error } = await supabase
          .from("categories")
          .insert({
            name: data.name,
            slug: data.slug,
            description: data.description,
            image_url: data.image,
            active: data.active !== undefined ? data.active : true,
          })
          .select()
          .single();

        if (!error && created) {
          return {
            id: created.id,
            name: created.name,
            slug: created.slug,
            description: created.description || "",
            image: created.image_url || "",
            icon: data.icon || "Layers",
            active: created.active,
          };
        }
      } catch (err) {
        console.error("Supabase create category error:", err);
      }
    }
    return LocalStore.saveCategory(data);
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const payload: any = {};
        if (data.name !== undefined) payload.name = data.name;
        if (data.slug !== undefined) payload.slug = data.slug;
        if (data.description !== undefined) payload.description = data.description;
        if (data.image !== undefined) payload.image_url = data.image;
        if (data.active !== undefined) payload.active = data.active;

        const { data: updated, error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", id)
          .select()
          .single();

        if (!error && updated) {
          return {
            id: updated.id,
            name: updated.name,
            slug: updated.slug,
            description: updated.description || "",
            image: updated.image_url || "",
            icon: data.icon || "Layers",
            active: updated.active,
          };
        }
      } catch (err) {
        console.error("Supabase update category error:", err);
      }
    }
    return LocalStore.updateCategory(id, data);
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from("categories")
          .update({ active: false })
          .eq("id", id);
        if (!error) return true;
      } catch (err) {
        console.error("Supabase delete category error:", err);
      }
    }
    return LocalStore.deleteCategory(id);
  },
};
