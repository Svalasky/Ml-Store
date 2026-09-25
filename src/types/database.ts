export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  message: string;
  screenshot_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface StoreSettings {
  id?: string;
  store_name: string;
  whatsapp_number: string;
  whatsapp_message_template?: string;
  instagram?: string;
  tiktok?: string;
  telegram?: string;
  email?: string;
  logo_url?: string;
}
