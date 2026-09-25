import { Product, ProductFilterOptions } from "@/types/product";
import { LocalStore } from "./storage";

export const productService = {
  async getAll(options?: ProductFilterOptions): Promise<Product[]> {
    let products = LocalStore.getProducts();

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (options?.categoryId && options.categoryId !== "all") {
      products = products.filter((p) => p.categoryId === options.categoryId);
    }

    if (options?.status && options.status !== "all") {
      products = products.filter((p) => p.status === options.status);
    }

    if (options?.sortBy) {
      if (options.sortBy === "price_asc") {
        products = [...products].sort((a, b) => a.price - b.price);
      } else if (options.sortBy === "price_desc") {
        products = [...products].sort((a, b) => b.price - a.price);
      } else if (options.sortBy === "newest") {
        products = [...products].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (options.sortBy === "name_asc") {
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return products;
  },

  async getFeatured(): Promise<Product[]> {
    const products = LocalStore.getProducts();
    return products.filter((p) => p.featured && p.status !== "inactive");
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const products = LocalStore.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getById(id: string): Promise<Product | null> {
    const products = LocalStore.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const products = LocalStore.getProducts();
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    LocalStore.setProducts([newProduct, ...products]);
    return newProduct;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const products = LocalStore.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }

    const updated: Product = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    const newProducts = [...products];
    newProducts[index] = updated;
    LocalStore.setProducts(newProducts);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const products = LocalStore.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    LocalStore.setProducts(filtered);
    return true;
  },
};
