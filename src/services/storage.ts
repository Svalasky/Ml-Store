import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { StoreSettings } from "@/types/settings";
import { MOCK_PRODUCTS } from "@/data/mock-products";
import { MOCK_CATEGORIES } from "@/data/mock-categories";
import { MOCK_SETTINGS } from "@/data/mock-settings";

const STORAGE_KEYS = {
  PRODUCTS: "mole_store_products_v1",
  CATEGORIES: "mole_store_categories_v1",
  SETTINGS: "mole_store_settings_v1",
  AUTH: "mole_store_admin_auth_v1",
};

// Helper to check if browser window is defined
const isBrowser = typeof window !== "undefined";

export const LocalStore = {
  getProducts(): Product[] {
    if (!isBrowser) return MOCK_PRODUCTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
        return MOCK_PRODUCTS;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_PRODUCTS;
    }
  },

  setProducts(products: Product[]): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      // Dispatch custom event so any listener updates automatically
      window.dispatchEvent(new Event("mole_store_products_updated"));
    } catch (e) {
      console.error("Failed to save products to localStorage", e);
    }
  },

  getCategories(): Category[] {
    if (!isBrowser) return MOCK_CATEGORIES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
        return MOCK_CATEGORIES;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  setCategories(categories: Category[]): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      window.dispatchEvent(new Event("mole_store_categories_updated"));
    } catch (e) {
      console.error("Failed to save categories to localStorage", e);
    }
  },

  getSettings(): StoreSettings {
    if (!isBrowser) return MOCK_SETTINGS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(MOCK_SETTINGS));
        return MOCK_SETTINGS;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_SETTINGS;
    }
  },

  setSettings(settings: StoreSettings): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      window.dispatchEvent(new Event("mole_store_settings_updated"));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  },

  resetToDefault(): void {
    if (!isBrowser) return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(MOCK_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(MOCK_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(MOCK_SETTINGS));
    window.dispatchEvent(new Event("mole_store_products_updated"));
    window.dispatchEvent(new Event("mole_store_categories_updated"));
    window.dispatchEvent(new Event("mole_store_settings_updated"));
  },
};
