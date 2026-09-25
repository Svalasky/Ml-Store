import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Product, ProductFilterOptions, ProductVariant } from "@/types/product";
import { LocalStore } from "./storage";

export const productService = {
  async getAll(options: ProductFilterOptions = {}): Promise<Product[]> {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      try {
        let query = supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            category_id,
            description,
            short_description,
            image_url,
            price,
            original_price,
            status,
            featured,
            duration,
            terms,
            created_at,
            updated_at,
            variants:product_variants(*)
          `)
          .order("created_at", { ascending: false });

        if (options.status && options.status !== "all") {
          query = query.eq("status", options.status);
        }
        if (options.categoryId && options.categoryId !== "all") {
          query = query.eq("category_id", options.categoryId);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          let list: Product[] = data.map((p: any) => {
            const parsedFeatures = p.short_description
              ? p.short_description.split(",").map((s: string) => s.trim())
              : [];
            const parsedTerms = p.terms
              ? p.terms.split(",").map((s: string) => s.trim())
              : [];

            const variants: ProductVariant[] = (p.variants || []).map((v: any) => ({
              id: v.id,
              productId: v.product_id,
              name: v.name,
              description: v.description,
              price: Number(v.price),
              originalPrice: v.original_price ? Number(v.original_price) : undefined,
              duration: v.duration,
              stock: v.stock,
              status: v.status,
              createdAt: v.created_at,
              updatedAt: v.updated_at,
            }));

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              categoryId: p.category_id || "",
              description: p.description || "",
              shortDescription: p.short_description || undefined,
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              image: p.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
              duration: p.duration || undefined,
              features: parsedFeatures.length > 0 ? parsedFeatures : [p.name, "Garansi Full Durasi"],
              status: p.status,
              featured: p.featured,
              terms: parsedTerms,
              variants: variants.length > 0 ? variants : undefined,
              createdAt: p.created_at,
              updatedAt: p.updated_at,
            };
          });

          if (options.search) {
            const s = options.search.toLowerCase();
            list = list.filter(
              (p) =>
                p.name.toLowerCase().includes(s) ||
                p.description.toLowerCase().includes(s)
            );
          }

          if (options.sortBy) {
            if (options.sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
            if (options.sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
            if (options.sortBy === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
            if (options.sortBy === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          }

          return list;
        }
      } catch (err) {
        console.error("Supabase product fetch error:", err);
      }
    }

    // Fallback to local storage
    return LocalStore.getProducts(options);
  },

  async getById(id: string): Promise<Product | null> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            category_id,
            description,
            short_description,
            image_url,
            price,
            original_price,
            status,
            featured,
            duration,
            terms,
            created_at,
            updated_at,
            variants:product_variants(*)
          `)
          .eq("id", id)
          .single();

        if (!error && data) {
          const variants: ProductVariant[] = (data.variants as any[] || []).map((v) => ({
            id: v.id,
            productId: v.product_id,
            name: v.name,
            description: v.description,
            price: Number(v.price),
            originalPrice: v.original_price ? Number(v.original_price) : undefined,
            duration: v.duration,
            stock: v.stock,
            status: v.status,
            createdAt: v.created_at,
            updatedAt: v.updated_at,
          }));

          return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            categoryId: data.category_id || "",
            description: data.description || "",
            shortDescription: data.short_description || undefined,
            price: Number(data.price),
            originalPrice: data.original_price ? Number(data.original_price) : undefined,
            image: data.image_url || "",
            duration: data.duration || undefined,
            features: data.short_description ? data.short_description.split(",") : [],
            status: data.status,
            featured: data.featured,
            terms: data.terms ? data.terms.split(",") : [],
            variants: variants.length > 0 ? variants : undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.error("Supabase getById error:", err);
      }
    }

    const localList = LocalStore.getProducts();
    return localList.find((p) => p.id === id) || null;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            category_id,
            description,
            short_description,
            image_url,
            price,
            original_price,
            status,
            featured,
            duration,
            terms,
            created_at,
            updated_at,
            variants:product_variants(*)
          `)
          .eq("slug", slug)
          .single();

        if (!error && data) {
          const variants: ProductVariant[] = (data.variants as any[] || []).map((v) => ({
            id: v.id,
            productId: v.product_id,
            name: v.name,
            description: v.description,
            price: Number(v.price),
            originalPrice: v.original_price ? Number(v.original_price) : undefined,
            duration: v.duration,
            stock: v.stock,
            status: v.status,
            createdAt: v.created_at,
            updatedAt: v.updated_at,
          }));

          return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            categoryId: data.category_id || "",
            description: data.description || "",
            shortDescription: data.short_description || undefined,
            price: Number(data.price),
            originalPrice: data.original_price ? Number(data.original_price) : undefined,
            image: data.image_url || "",
            duration: data.duration || undefined,
            features: data.short_description ? data.short_description.split(",") : [],
            status: data.status,
            featured: data.featured,
            terms: data.terms ? data.terms.split(",") : [],
            variants: variants.length > 0 ? variants : undefined,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (err) {
        console.error("Supabase getBySlug error:", err);
      }
    }

    const localList = LocalStore.getProducts();
    return localList.find((p) => p.slug === slug) || null;
  },

  async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const { data: created, error } = await supabase
          .from("products")
          .insert({
            name: data.name,
            slug: data.slug,
            category_id: data.categoryId || null,
            description: data.description,
            short_description: data.features?.join(", ") || data.shortDescription,
            image_url: data.image,
            price: data.price,
            original_price: data.originalPrice || null,
            status: data.status,
            featured: data.featured,
            duration: data.duration || null,
            terms: data.terms?.join(", ") || null,
          })
          .select()
          .single();

        if (!error && created) {
          // If variants provided, insert them
          if (data.variants && data.variants.length > 0) {
            const variantInserts = data.variants.map((v) => ({
              product_id: created.id,
              name: v.name,
              description: v.description || null,
              price: v.price,
              original_price: v.originalPrice || null,
              duration: v.duration || null,
              stock: v.stock || 0,
              status: v.status,
            }));
            await supabase.from("product_variants").insert(variantInserts);
          }

          return {
            id: created.id,
            name: created.name,
            slug: created.slug,
            categoryId: created.category_id || "",
            description: created.description || "",
            price: Number(created.price),
            originalPrice: created.original_price ? Number(created.original_price) : undefined,
            image: created.image_url || "",
            duration: created.duration || undefined,
            features: data.features || [],
            status: created.status,
            featured: created.featured,
            terms: data.terms,
            variants: data.variants,
            createdAt: created.created_at,
            updatedAt: created.updated_at,
          };
        }
      } catch (err) {
        console.error("Supabase create product error:", err);
      }
    }

    return LocalStore.saveProduct(data);
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        const updatePayload: any = {};
        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.slug !== undefined) updatePayload.slug = data.slug;
        if (data.categoryId !== undefined) updatePayload.category_id = data.categoryId || null;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.features !== undefined) updatePayload.short_description = data.features.join(", ");
        if (data.image !== undefined) updatePayload.image_url = data.image;
        if (data.price !== undefined) updatePayload.price = data.price;
        if (data.originalPrice !== undefined) updatePayload.original_price = data.originalPrice;
        if (data.status !== undefined) updatePayload.status = data.status;
        if (data.featured !== undefined) updatePayload.featured = data.featured;
        if (data.duration !== undefined) updatePayload.duration = data.duration;
        if (data.terms !== undefined) updatePayload.terms = data.terms.join(", ");

        const { data: updated, error } = await supabase
          .from("products")
          .update(updatePayload)
          .eq("id", id)
          .select()
          .single();

        if (!error && updated) {
          // If variants supplied, sync variants
          if (data.variants) {
            // Upsert / delete old
            await supabase.from("product_variants").delete().eq("product_id", id);
            if (data.variants.length > 0) {
              const variantInserts = data.variants.map((v) => ({
                product_id: id,
                name: v.name,
                description: v.description || null,
                price: v.price,
                original_price: v.originalPrice || null,
                duration: v.duration || null,
                stock: v.stock || 0,
                status: v.status,
              }));
              await supabase.from("product_variants").insert(variantInserts);
            }
          }

          return {
            id: updated.id,
            name: updated.name,
            slug: updated.slug,
            categoryId: updated.category_id || "",
            description: updated.description || "",
            price: Number(updated.price),
            originalPrice: updated.original_price ? Number(updated.original_price) : undefined,
            image: updated.image_url || "",
            duration: updated.duration || undefined,
            features: data.features || (updated.short_description ? updated.short_description.split(",") : []),
            status: updated.status,
            featured: updated.featured,
            terms: data.terms,
            variants: data.variants,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
          };
        }
      } catch (err) {
        console.error("Supabase update product error:", err);
      }
    }

    return LocalStore.updateProduct(id, data);
  },

  async delete(id: string): Promise<boolean> {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      try {
        // Soft delete / inactive protection for orders
        const { error } = await supabase
          .from("products")
          .update({ status: "inactive" })
          .eq("id", id);

        if (!error) return true;
      } catch (err) {
        console.error("Supabase delete product error:", err);
      }
    }

    return LocalStore.deleteProduct(id);
  },
};
