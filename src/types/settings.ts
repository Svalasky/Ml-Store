export interface StoreSettings {
  id?: string;
  storeName: string;
  tagline?: string;
  description: string;
  logoUrl?: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  telegramUrl?: string;
  email?: string;
  updatedAt?: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number; // 1-5
  message: string;
  imageUrl?: string;
  active: boolean;
  createdAt?: string;
}

export interface Promotion {
  id: string;
  name: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase: number;
  startAt?: string;
  endAt?: string;
  active: boolean;
  createdAt?: string;
}
