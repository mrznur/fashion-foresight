import type { Product, ProductGender } from './types';

// ─── Product Catalog ──────────────────────────────────────────────────────────
// Static products removed - all data now lives in Supabase.
// This array is kept as an empty fallback only.

export const PRODUCTS: Product[] = [];

export const CATEGORIES = ['All', 'T-Shirts', 'Polo Shirts', 'Denim Jeans', 'Cargo Pants', 'Joggers', 'Twirl Pants', 'Formal Shirts', 'Casual Shirts', 'Boxers', 'Dresses', 'Suits'] as const;
export type Category = typeof CATEGORIES[number];

export const GENDERS: ProductGender[] = ['men', 'women', 'kids'];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByGender(gender: ProductGender): Product[] {
  return PRODUCTS.filter((p) => p.gender === gender);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export function getRelatedProducts(productId: number, limit = 3): Product[] {
  const product = getProductById(productId);
  if (!product) return PRODUCTS.slice(0, limit);

  return PRODUCTS
    .filter((p) => p.id !== productId && p.category === product.category && p.gender === product.gender)
    .slice(0, limit)
    .concat(
      PRODUCTS.filter((p) => p.id !== productId && p.gender === product.gender && p.category !== product.category)
    )
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );
}
