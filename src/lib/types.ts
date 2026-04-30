// ─── Domain Types ────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';
export type ProductGender = 'men' | 'women' | 'kids';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  gender: ProductGender;
  description?: string;
  details?: string[];
  sizes?: string[];
  isNew?: boolean;
  inStock?: boolean;
  stockCount?: number;
  comingSoon?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  size: string;
  quantity: number;
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress?: Address;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}
