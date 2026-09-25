import { Category } from "@/types/category";
import { LocalStore } from "./storage";

export const categoryService = {
  async getAll(onlyActive = false): Promise<Category[]> {
    const categories = LocalStore.getCategories();
    if (onlyActive) {
      return categories.filter((c) => c.active);
    }
    return categories;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const categories = LocalStore.getCategories();
    return categories.find((c) => c.slug === slug) || null;
  },

  async getById(id: string): Promise<Category | null> {
    const categories = LocalStore.getCategories();
    return categories.find((c) => c.id === id) || null;
  },

  async create(data: Omit<Category, "id">): Promise<Category> {
    const categories = LocalStore.getCategories();
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
    };
    LocalStore.setCategories([...categories, newCategory]);
    return newCategory;
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const categories = LocalStore.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }

    const updated: Category = {
      ...categories[index],
      ...data,
    };
    const newCategories = [...categories];
    newCategories[index] = updated;
    LocalStore.setCategories(newCategories);
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const categories = LocalStore.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    LocalStore.setCategories(filtered);
    return true;
  },
};
