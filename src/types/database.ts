export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "admin" | "staff";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "admin" | "staff";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "admin" | "staff";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          category_id: string | null;
          image_url: string | null;
          price: number;
          original_price: number | null;
          status: "available" | "out_of_stock" | "inactive";
          featured: boolean;
          duration: string | null;
          terms: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          category_id?: string | null;
          image_url?: string | null;
          price?: number;
          original_price?: number | null;
          status?: "available" | "out_of_stock" | "inactive";
          featured?: boolean;
          duration?: string | null;
          terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          category_id?: string | null;
          image_url?: string | null;
          price?: number;
          original_price?: number | null;
          status?: "available" | "out_of_stock" | "inactive";
          featured?: boolean;
          duration?: string | null;
          terms?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          duration: string | null;
          stock: number;
          status: "available" | "out_of_stock" | "inactive";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          duration?: string | null;
          stock?: number;
          status?: "available" | "out_of_stock" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          duration?: string | null;
          stock?: number;
          status?: "available" | "out_of_stock" | "inactive";
          created_at?: string;
          updated_at?: string;
        };
      };
      inventory: {
        Row: {
          id: string;
          variant_id: string;
          quantity: number;
          reserved_quantity: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          variant_id: string;
          quantity?: number;
          reserved_quantity?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          variant_id?: string;
          quantity?: number;
          reserved_quantity?: number;
          updated_at?: string;
        };
      };
      digital_accounts: {
        Row: {
          id: string;
          variant_id: string;
          username: string | null;
          credential_reference: string | null;
          status: "available" | "reserved" | "sold" | "expired" | "disabled";
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          variant_id: string;
          username?: string | null;
          credential_reference?: string | null;
          status?: "available" | "reserved" | "sold" | "expired" | "disabled";
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          variant_id?: string;
          username?: string | null;
          credential_reference?: string | null;
          status?: "available" | "reserved" | "sold" | "expired" | "disabled";
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string | null;
          whatsapp_number: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          whatsapp_number: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          whatsapp_number?: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          subtotal: number;
          discount: number;
          total: number;
          status: "pending" | "waiting_payment" | "paid" | "processing" | "completed" | "cancelled";
          payment_status: "unpaid" | "pending" | "paid" | "refunded";
          payment_method: "whatsapp" | "manual_transfer" | "other";
          customer_note: string | null;
          admin_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          subtotal?: number;
          discount?: number;
          total?: number;
          status?: "pending" | "waiting_payment" | "paid" | "processing" | "completed" | "cancelled";
          payment_status?: "unpaid" | "pending" | "paid" | "refunded";
          payment_method?: "whatsapp" | "manual_transfer" | "other";
          customer_note?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          subtotal?: number;
          discount?: number;
          total?: number;
          status?: "pending" | "waiting_payment" | "paid" | "processing" | "completed" | "cancelled";
          payment_status?: "unpaid" | "pending" | "paid" | "refunded";
          payment_method?: "whatsapp" | "manual_transfer" | "other";
          customer_note?: string | null;
          admin_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          price: number;
          quantity: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          price: number;
          quantity?: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name?: string;
          variant_name?: string | null;
          price?: number;
          quantity?: number;
          subtotal?: number;
          created_at?: string;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          old_status: string | null;
          new_status: string;
          note: string | null;
          changed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          old_status?: string | null;
          new_status: string;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          old_status?: string | null;
          new_status?: string;
          note?: string | null;
          changed_by?: string | null;
          created_at?: string;
        };
      };
      banners: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          button_text: string | null;
          button_url: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          button_text?: string | null;
          button_url?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          button_text?: string | null;
          button_url?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          name: string;
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          minimum_purchase: number;
          start_at: string | null;
          end_at: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          minimum_purchase?: number;
          start_at?: string | null;
          end_at?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          discount_type?: "percentage" | "fixed";
          discount_value?: number;
          minimum_purchase?: number;
          start_at?: string | null;
          end_at?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          rating: number;
          message: string;
          image_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          rating: number;
          message: string;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          rating?: number;
          message?: string;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: string;
          store_name: string;
          description: string | null;
          logo_url: string | null;
          whatsapp_number: string;
          whatsapp_message: string | null;
          instagram_url: string | null;
          tiktok_url: string | null;
          telegram_url: string | null;
          email: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_name?: string;
          description?: string | null;
          logo_url?: string | null;
          whatsapp_number?: string;
          whatsapp_message?: string | null;
          instagram_url?: string | null;
          tiktok_url?: string | null;
          telegram_url?: string | null;
          email?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_name?: string;
          description?: string | null;
          logo_url?: string | null;
          whatsapp_number?: string;
          whatsapp_message?: string | null;
          instagram_url?: string | null;
          tiktok_url?: string | null;
          telegram_url?: string | null;
          email?: string | null;
          updated_at?: string;
        };
      };
    };
    Functions: {
      create_whatsapp_order: {
        Args: {
          p_customer_name: string;
          p_whatsapp_number: string;
          p_product_id: string;
          p_variant_id?: string;
          p_customer_note?: string;
          p_discount_code?: string;
        };
        Returns: {
          order_id: string;
          order_number: string;
          total: number;
          product_name: string;
          variant_name: string | null;
          status: string;
        }[];
      };
      update_order_status: {
        Args: {
          p_order_id: string;
          p_new_status: string;
          p_payment_status?: string;
          p_admin_note?: string;
          p_note?: string;
        };
        Returns: boolean;
      };
    };
  };
};
