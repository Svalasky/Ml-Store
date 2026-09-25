export type ProductStatus = "available" | "out_of_stock" | "inactive";

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration?: string; // e.g. "1 Bulan", "1 Tahun", "Lifetime"
  features: string[];
  status: ProductStatus;
  featured: boolean;
  terms?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProductFilterOptions = {
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "name_asc";
};
