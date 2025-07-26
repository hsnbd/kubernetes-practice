export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
  // Extended properties for detailed view
  images?: string[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockCount?: number;
  features?: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  weight?: string;
  dimensions?: string;
  brand?: string;
  sku?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count?: number;
  verified_purchase?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface NavigationLink {
  href: string;
  label: string;
}

export interface FeatureItem {
  icon: React.ReactNode;
  text: string;
}
