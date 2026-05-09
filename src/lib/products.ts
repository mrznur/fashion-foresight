// ─── Product Categories ───────────────────────────────────────────────────────
// All product data lives in Supabase. This file only exports static constants.

export const CATEGORIES = [
  'All',
  'T-Shirts',
  'Polo Shirts',
  'Denim Jeans',
  'Cargo Pants',
  'Joggers',
  'Twirl Pants',
  'Formal Shirts',
  'Casual Shirts',
  'Boxers',
  'Dresses',
  'Suits',
] as const;

export type Category = typeof CATEGORIES[number];
