export type ProductStatus = "available" | "out_of_stock" | "inactive";
export type AccountStatus = "available" | "reserved" | "sold" | "expired" | "disabled";

export interface ProductVariant {
  id: string;
  productId: string;
  name: string; // e.g. "1 Bulan", "3 Bulan", "Lifetime"
  description?: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  stock: number;
  status: ProductStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DigitalAccount {
  id: string;
  variantId: string;
  username?: string;
  credentialReference?: string;
  status: AccountStatus;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryItem {
  id: string;
  variantId: string;
  quantity: number;
  reservedQuantity: number;
  availableStock: number;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  image: string; // mapped to image_url
  duration?: string; // e.g. "1 Bulan", "1 Tahun", "Lifetime"
  features: string[];
  status: ProductStatus;
  featured: boolean;
  terms?: string[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export type ProductFilterOptions = {
  search?: string;
  categoryId?: string;
  status?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "name_asc";
};
