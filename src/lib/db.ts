import { supabase, isSupabaseConfigured } from './supabase';
import type { Product, Order, CartItem, ApiResult } from './types';
import { PRODUCTS as STATIC_PRODUCTS } from './products';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): Product {
  const price = Number(row.price);
  const discount = row.discount ? Number(row.discount) : undefined;
  const discountedPrice = discount && discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
  return {
    id:            row.id as number,
    name:          row.name as string,
    price:         discountedPrice,
    originalPrice: discount && discount > 0 ? price : undefined,
    discount:      discount,
    image:         row.image as string,
    images:        (row.images as string[]) ?? [],
    category:      row.category as string,
    gender:        row.gender as Product['gender'],
    description:   row.description as string | undefined,
    details:       (row.details as string[]) ?? [],
    sizes:         (row.sizes as string[]) ?? [],
    isNew:         row.is_new as boolean | undefined,
    inStock:       row.in_stock as boolean | undefined,
    stockCount:    row.stock_count as number | undefined,
    comingSoon:    row.coming_soon as boolean | undefined,
  };
}

function productToRow(p: Partial<Product>) {
  return {
    name:        p.name,
    price:       p.price,
    image:       p.image ?? '',
    images:      p.images ?? [],
    category:    p.category,
    gender:      p.gender,
    description: p.description ?? null,
    details:     p.details ?? [],
    sizes:       p.sizes ?? [],
    is_new:      p.isNew ?? false,
    in_stock:    p.inStock ?? true,
    stock_count: p.stockCount ?? 0,
    coming_soon: p.comingSoon ?? false,
    discount:    p.discount ?? 0,
  };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return STATIC_PRODUCTS;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id');

  if (error) {
    console.warn('[db] fetchProducts:', error.message);
    return STATIC_PRODUCTS;
  }

  return (data ?? []).map(rowToProduct);
}

export async function fetchProductById(id: number): Promise<Product | null> {
  if (!isSupabaseConfigured)
    return STATIC_PRODUCTS.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return rowToProduct(data);
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<ApiResult<Product>> {
  if (!isSupabaseConfigured) return { data: null, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('products')
    .insert(productToRow(product))
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToProduct(data), error: null };
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<ApiResult<Product>> {
  if (!isSupabaseConfigured) return { data: null, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('products')
    .update(productToRow(updates))
    .eq('id', id)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: rowToProduct(data), error: null };
}

export async function deleteProduct(id: number): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: 'Supabase not configured' };

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface DbOrder {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: Order['status'];
  created_at: string;
  customer_name: string;
  customer_email: string;
}

// Admin: fetch all orders
export async function fetchAllOrders(): Promise<DbOrder[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('id, user_id, items, total, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[db] fetchAllOrders:', error.message);
    return [];
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id:             row.id as string,
    user_id:        row.user_id as string,
    items:          (row.items as CartItem[]) ?? [],
    total:          Number(row.total),
    status:         row.status as Order['status'],
    created_at:     row.created_at as string,
    customer_name:  'Guest',
    customer_email: '',
  }));
}

// User: fetch own orders
export async function fetchUserOrders(userId: string): Promise<DbOrder[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('id, user_id, items, total, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];

  return (data ?? []).map((row: Record<string, unknown>) => ({
    id:             row.id as string,
    user_id:        row.user_id as string,
    items:          (row.items as CartItem[]) ?? [],
    total:          Number(row.total),
    status:         row.status as Order['status'],
    created_at:     row.created_at as string,
    customer_name:  '',
    customer_email: '',
  }));
}

export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
  shippingAddress?: Record<string, string>
): Promise<ApiResult<DbOrder>> {
  if (!isSupabaseConfigured) return { data: null, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, items, total, status: 'pending', shipping_address: shippingAddress ?? null })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return {
    data: {
      id:             data.id,
      user_id:        data.user_id,
      items:          data.items,
      total:          Number(data.total),
      status:         data.status,
      created_at:     data.created_at,
      customer_name:  '',
      customer_email: '',
    },
    error: null,
  };
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: 'Supabase not configured' };

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export async function fetchWishlist(userId: string): Promise<number[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId);

  if (error) return [];
  return (data ?? []).map((r: { product_id: number }) => r.product_id);
}

export async function addToWishlist(userId: string, productId: number): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const { error } = await supabase
    .from('wishlists')
    .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' });

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

export async function removeFromWishlist(userId: string, productId: number): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, subscribed: true }, { onConflict: 'email' });

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export async function submitContactMessage(msg: {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: null };

  const { error } = await supabase.from('contact_messages').insert(msg);
  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type Settings = Record<string, string>;

export async function fetchSettings(): Promise<Settings> {
  if (!isSupabaseConfigured) return {};

  const { data, error } = await supabase
    .from('settings')
    .select('key, value');

  if (error || !data) {
    console.warn('[db] fetchSettings:', error?.message);
    return {};
  }

  return Object.fromEntries(
    (data as { key: string; value: string }[]).map((r) => [r.key, r.value])
  );
}

export async function saveSettings(settings: Settings): Promise<ApiResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: 'Supabase not configured' };

  const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));

  const { error } = await supabase
    .from('settings')
    .upsert(rows, { onConflict: 'key' });

  if (error) {
    console.error('[db] saveSettings:', error.message);
    return { data: null, error: error.message };
  }
  return { data: null, error: null };
}
