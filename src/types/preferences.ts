import { CurrencyCode } from "./currency";

export type LanguageCode = "en" | "id";

export interface UserPreferences {
  language: LanguageCode;
  currency: CurrencyCode;
  theme: "light" | "dark" | "system";
  timezone: string;
}
