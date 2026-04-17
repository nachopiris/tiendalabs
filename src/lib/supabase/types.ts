// Auto-generated types will be placed here by Supabase CLI
// Run: npx supabase gen types typescript --linked > src/lib/supabase/types.ts
// For now, we define the database schema manually

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          slug: string;
          domain: string | null;
          branding: StoreBranding;
          template_id: string;
          config: StoreConfig;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          domain?: string | null;
          branding?: StoreBranding;
          template_id?: string;
          config?: StoreConfig;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          domain?: string | null;
          branding?: StoreBranding;
          template_id?: string;
          config?: StoreConfig;
          owner_id?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          store_id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          compare_at_price: number | null;
          images: string[];
          variants: ProductVariant[];
          is_active: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          compare_at_price?: number | null;
          images?: string[];
          variants?: ProductVariant[];
          is_active?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          images?: string[];
          variants?: ProductVariant[];
          is_active?: boolean;
          position?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          store_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          items: OrderItem[];
          total: number;
          payment_status: PaymentStatus;
          payment_id: string | null;
          access_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          items: OrderItem[];
          total: number;
          payment_status?: PaymentStatus;
          payment_id?: string | null;
          access_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          items?: OrderItem[];
          total?: number;
          payment_status?: PaymentStatus;
          payment_id?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      payment_status: PaymentStatus;
    };
  };
}

// --- Domain types ---

export interface StoreBranding {
  palette_id: string;
  logo_url: string | null;
}

export interface StoreSocialLinks {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  whatsapp: string | null;
}

export interface StoreConversionFeatures {
  urgency_timer: boolean;
  social_proof: boolean;
  trust_badges: boolean;
  stock_counter: boolean;
}

export interface StoreTestimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
}

export interface StoreConfig {
  mercadopago_access_token: string | null;
  mercadopago_public_key: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: StoreSocialLinks;
  conversion_features: StoreConversionFeatures;
  announcement_messages: string[];
  testimonials: StoreTestimonial[];
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  variant_selections: Record<string, string>;
}

const PAYMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export { PAYMENT_STATUS };

// --- Convenience aliases ---

export type Store = Database["public"]["Tables"]["stores"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
