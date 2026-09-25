import { StoreSettings } from "@/types/settings";
import { LocalStore } from "./storage";

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    return LocalStore.getSettings();
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = LocalStore.getSettings();
    const updated = {
      ...current,
      ...settings,
    };
    LocalStore.setSettings(updated);
    return updated;
  },
};
