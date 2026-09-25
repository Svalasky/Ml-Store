export type AccountStatus = "available" | "reserved" | "sold" | "inactive";

export type SkinType =
  | "collector"
  | "legend"
  | "epic"
  | "special"
  | "elite"
  | "season"
  | "other";

export type MLRank =
  | "Warrior"
  | "Elite"
  | "Master"
  | "Grandmaster"
  | "Epic"
  | "Legend"
  | "Mythic"
  | "Mythical Honor"
  | "Mythical Glory"
  | "Mythical Immortal";

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface ProductSkin {
  id: string;
  product_id: string;
  skin_name: string;
  hero_name?: string;
  skin_type: SkinType;
  image_url?: string;
  created_at?: string;
}

export interface ProductHero {
  id: string;
  product_id: string;
  hero_name: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  original_price?: number;
  status: AccountStatus;
  featured: boolean;
  
  // Account Information
  level?: number;
  rank?: string;
  server?: string;
  battle_id?: string;
  win_rate?: number;
  total_matches?: number;
  
  // Account Content Breakdown
  hero_count: number;
  skin_count: number;
  collector_count: number;
  legend_count: number;
  epic_count: number;
  special_count: number;
  elite_count: number;
  season_skin_count: number;
  
  terms?: string;
  created_at?: string;
  updated_at?: string;

  // Joined Relations
  images?: ProductImage[];
  skins?: ProductSkin[];
  heroes?: ProductHero[];
  primary_image?: string;
}

export interface ProductFilterOptions {
  search?: string;
  rank?: string;
  minPrice?: number;
  maxPrice?: number;
  minSkins?: number;
  minCollector?: number;
  minLegend?: number;
  status?: AccountStatus | "all";
  sortBy?: "newest" | "price_asc" | "price_desc" | "skins_desc" | "winrate_desc";
}
