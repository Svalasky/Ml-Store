import { createClient } from "@/lib/supabase/client";
import { Product, ProductFilterOptions, AccountStatus } from "@/types/product";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { env } from "@/config/env";

const isSupabaseConfigured = () => {
  return (
    Boolean(env.supabaseUrl) &&
    !env.supabaseUrl.includes("placeholder") &&
    Boolean(env.supabaseAnonKey) &&
    !env.supabaseAnonKey.includes("placeholder")
  );
};

// In-memory store for fallback mode when Supabase is not connected
let localProducts: Product[] = [...MOCK_PRODUCTS];

export async function getProducts(options: ProductFilterOptions = {}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select(
          `
          *,
          images:product_images(*),
          skins:product_skins(*),
          heroes:product_heroes(*)
        `
        );

      if (options.status && options.status !== "all") {
        query = query.eq("status", options.status);
      }

      if (options.rank && options.rank !== "all") {
        query = query.ilike("rank", `%${options.rank}%`);
      }

      if (options.minPrice !== undefined) {
        query = query.gte("price", options.minPrice);
      }
      if (options.maxPrice !== undefined) {
        query = query.lte("price", options.maxPrice);
      }

      if (options.minSkins !== undefined) {
        query = query.gte("skin_count", options.minSkins);
      }

      if (options.minCollector !== undefined) {
        query = query.gte("collector_count", options.minCollector);
      }

      if (options.minLegend !== undefined) {
        query = query.gte("legend_count", options.minLegend);
      }

      if (options.search) {
        const s = options.search.toLowerCase();
        query = query.or(
          `name.ilike.%${s}%,battle_id.ilike.%${s}%,rank.ilike.%${s}%,description.ilike.%${s}%`
        );
      }

      // Sorting
      if (options.sortBy === "price_asc") {
        query = query.order("price", { ascending: true });
      } else if (options.sortBy === "price_desc") {
        query = query.order("price", { ascending: false });
      } else if (options.sortBy === "skins_desc") {
        query = query.order("skin_count", { ascending: false });
      } else if (options.sortBy === "winrate_desc") {
        query = query.order("win_rate", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Supabase query error, fallback to mock data:", error.message);
        return filterLocalProducts(localProducts, options);
      }

      if (data && data.length > 0) {
        return data.map((p: any) => {
          const primaryImg = p.images?.find((img: any) => img.is_primary)?.image_url;
          return {
            ...p,
            primary_image: primaryImg || p.images?.[0]?.image_url || "/placeholder-ml.jpg",
          };
        });
      }
    } catch (err) {
      console.warn("Supabase connection failed, using local products:", err);
    }
  }

  return filterLocalProducts(localProducts, options);
}

function filterLocalProducts(products: Product[], options: ProductFilterOptions): Product[] {
  let list = [...products];

  if (options.status && options.status !== "all") {
    list = list.filter((p) => p.status === options.status);
  }

  if (options.rank && options.rank !== "all") {
    list = list.filter((p) => p.rank?.toLowerCase().includes(options.rank!.toLowerCase()));
  }

  if (options.minPrice !== undefined) {
    list = list.filter((p) => p.price >= options.minPrice!);
  }
  if (options.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= options.maxPrice!);
  }

  if (options.minSkins !== undefined) {
    list = list.filter((p) => p.skin_count >= options.minSkins!);
  }

  if (options.minCollector !== undefined) {
    list = list.filter((p) => (p.collector_count || 0) >= options.minCollector!);
  }

  if (options.minLegend !== undefined) {
    list = list.filter((p) => (p.legend_count || 0) >= options.minLegend!);
  }

  if (options.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.battle_id?.toLowerCase().includes(s) ||
        p.rank?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.skins?.some((sk) => sk.skin_name.toLowerCase().includes(s)) ||
        p.heroes?.some((h) => h.hero_name.toLowerCase().includes(s))
    );
  }

  // Sorting
  if (options.sortBy === "price_asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sortBy === "price_desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (options.sortBy === "skins_desc") {
    list.sort((a, b) => b.skin_count - a.skin_count);
  } else if (options.sortBy === "winrate_desc") {
    list.sort((a, b) => (b.win_rate || 0) - (a.win_rate || 0));
  } else {
    list.sort(
      (a, b) =>
        new Date(b.created_at || "2026-01-01").getTime() -
        new Date(a.created_at || "2026-01-01").getTime()
    );
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          images:product_images(*),
          skins:product_skins(*),
          heroes:product_heroes(*)
        `
        )
        .eq("slug", slug)
        .single();

      if (!error && data) {
        const primaryImg = data.images?.find((img: any) => img.is_primary)?.image_url;
        return {
          ...data,
          primary_image: primaryImg || data.images?.[0]?.image_url || "/placeholder-ml.jpg",
        };
      }
    } catch (e) {
      console.warn("Product by slug fallback to local:", e);
    }
  }

  const found = localProducts.find((p) => p.slug === slug);
  return found || null;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const isEdit = Boolean(product.id);
  const id = product.id || crypto.randomUUID();
  const slug =
    product.slug ||
    (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : `mlbb-${Date.now()}`);

  const item: Product = {
    id,
    name: product.name || "Akun Mobile Legends",
    slug,
    description: product.description || "",
    price: product.price || 0,
    original_price: product.original_price,
    status: product.status || "available",
    featured: Boolean(product.featured),
    level: product.level || 50,
    rank: product.rank || "Mythic",
    server: product.server || "1001",
    battle_id: product.battle_id || String(Math.floor(100000000 + Math.random() * 900000000)),
    win_rate: product.win_rate || 60,
    total_matches: product.total_matches || 2000,
    hero_count: product.hero_count || 80,
    skin_count: product.skin_count || 50,
    collector_count: product.collector_count || 0,
    legend_count: product.legend_count || 0,
    epic_count: product.epic_count || 0,
    special_count: product.special_count || 0,
    elite_count: product.elite_count || 0,
    season_skin_count: product.season_skin_count || 0,
    terms: product.terms || "Garansi Anti Hack-Back Seumur Hidup.",
    primary_image: product.primary_image || product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    images: product.images || [],
    skins: product.skins || [],
    heroes: product.heroes || [],
    created_at: product.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const dbPayload = {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        status: item.status,
        featured: item.featured,
        level: item.level,
        rank: item.rank,
        server: item.server,
        battle_id: item.battle_id,
        win_rate: item.win_rate,
        total_matches: item.total_matches,
        hero_count: item.hero_count,
        skin_count: item.skin_count,
        collector_count: item.collector_count,
        legend_count: item.legend_count,
        epic_count: item.epic_count,
        special_count: item.special_count,
        elite_count: item.elite_count,
        season_skin_count: item.season_skin_count,
        terms: item.terms,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        await supabase.from("products").update(dbPayload).eq("id", id);
      } else {
        await supabase.from("products").insert(dbPayload);
      }
    } catch (e) {
      console.warn("Error persisting product to Supabase, updated in-memory:", e);
    }
  }

  // Update local
  const index = localProducts.findIndex((p) => p.id === id);
  if (index >= 0) {
    localProducts[index] = item;
  } else {
    localProducts.unshift(item);
  }

  return item;
}

export async function updateProductStatus(id: string, status: AccountStatus): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("products").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    } catch (e) {
      console.warn("Failed updating product status in Supabase:", e);
    }
  }

  const p = localProducts.find((item) => item.id === id);
  if (p) {
    p.status = status;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("id", id);
    } catch (e) {
      console.warn("Failed deleting product from Supabase:", e);
    }
  }

  localProducts = localProducts.filter((p) => p.id !== id);
}
