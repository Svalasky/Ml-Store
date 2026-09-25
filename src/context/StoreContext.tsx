"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, ProductFilterOptions } from "@/types/product";
import { Category } from "@/types/category";
import { StoreSettings } from "@/types/settings";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { settingsService } from "@/services/settingsService";
import { LocalStore } from "@/services/storage";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  addCategory: (category: Omit<Category, "id">) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<StoreSettings>;
  resetToDefault: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "Mole Store",
    tagline: "Pusat Akun Digital Legal, Murah & Bergaransi",
    description: "Platform penyedia akun digital streaming, game, AI tools, dan software resmi terlengkap di Indonesia.",
    whatsappNumber: "6281234567890",
    whatsappMessage: "Halo Admin Mole Store, saya ingin bertanya seputar produk...",
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const [p, c, s] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        settingsService.getSettings(),
      ]);
      setProducts(p);
      setCategories(c);
      setSettings(s);
    } catch (err) {
      console.error("Error loading store data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();

    const handleProductsUpdate = () => {
      productService.getAll().then(setProducts);
    };
    const handleCategoriesUpdate = () => {
      categoryService.getAll().then(setCategories);
    };
    const handleSettingsUpdate = () => {
      settingsService.getSettings().then(setSettings);
    };

    window.addEventListener("mole_store_products_updated", handleProductsUpdate);
    window.addEventListener("mole_store_categories_updated", handleCategoriesUpdate);
    window.addEventListener("mole_store_settings_updated", handleSettingsUpdate);

    return () => {
      window.removeEventListener("mole_store_products_updated", handleProductsUpdate);
      window.removeEventListener("mole_store_categories_updated", handleCategoriesUpdate);
      window.removeEventListener("mole_store_settings_updated", handleSettingsUpdate);
    };
  }, [loadAll]);

  const getProductBySlug = useCallback(
    (slug: string) => {
      return products.find((p) => p.slug === slug);
    },
    [products]
  );

  const getCategoryById = useCallback(
    (id: string) => {
      return categories.find((c) => c.id === id);
    },
    [categories]
  );

  const addProduct = async (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const res = await productService.create(data);
    await loadAll();
    return res;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const res = await productService.update(id, data);
    await loadAll();
    return res;
  };

  const deleteProduct = async (id: string) => {
    const res = await productService.delete(id);
    await loadAll();
    return res;
  };

  const addCategory = async (data: Omit<Category, "id">) => {
    const res = await categoryService.create(data);
    await loadAll();
    return res;
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    const res = await categoryService.update(id, data);
    await loadAll();
    return res;
  };

  const deleteCategory = async (id: string) => {
    const res = await categoryService.delete(id);
    await loadAll();
    return res;
  };

  const updateSettings = async (data: Partial<StoreSettings>) => {
    const res = await settingsService.updateSettings(data);
    await loadAll();
    return res;
  };

  const resetToDefault = () => {
    LocalStore.resetToDefault();
    loadAll();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        isLoading,
        refreshData: loadAll,
        getProductBySlug,
        getCategoryById,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSettings,
        resetToDefault,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
