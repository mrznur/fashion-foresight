import type { Product, ProductGender } from './types';

// ─── Product Catalog ──────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // ── T-Shirts ──────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 49,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'T-Shirts',
    description: 'Essential white t-shirt crafted from premium cotton. Perfect fit and exceptional comfort for everyday wear.',
    details: ['100% Premium Cotton', 'Crew neck', 'Regular fit', 'Pre-shrunk', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 50,
  },
  {
    id: 2,
    name: 'Black Essential T-Shirt',
    price: 49,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'T-Shirts',
    description: 'Timeless black t-shirt that pairs with everything. Soft, durable, and designed to last.',
    details: ['100% Premium Cotton', 'Crew neck', 'Regular fit', 'Fade-resistant', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 45,
  },
  {
    id: 3,
    name: 'Navy Blue T-Shirt',
    price: 49,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1622445275463-afa2ab738c34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'T-Shirts',
    description: 'Versatile navy t-shirt for a refined casual look. Premium fabric with superior comfort.',
    details: ['100% Pima Cotton', 'Crew neck', 'Slim fit', 'Breathable', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 40,
  },

  // ── Polo Shirts ───────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Classic White Polo',
    price: 79,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Polo Shirts',
    description: 'Sophisticated white polo shirt perfect for smart casual occasions. Premium pique cotton construction.',
    details: ['100% Pique Cotton', 'Two-button placket', 'Ribbed collar and cuffs', 'Regular fit', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 35,
  },
  {
    id: 5,
    name: 'Navy Polo Shirt',
    price: 79,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Polo Shirts',
    description: 'Elegant navy polo that transitions seamlessly from office to weekend. Refined and comfortable.',
    details: ['Premium Cotton Blend', 'Three-button placket', 'Ribbed details', 'Slim fit', 'Easy care'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 30,
  },
  {
    id: 6,
    name: 'Burgundy Polo Shirt',
    price: 79,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Polo Shirts',
    description: 'Rich burgundy polo for a distinctive look. Premium quality with exceptional attention to detail.',
    details: ['Mercerized Cotton', 'Two-button placket', 'Contrast details', 'Regular fit', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 25,
  },

  // ── Denim Jeans ───────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Classic Blue Denim',
    price: 129,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Denim Jeans',
    description: 'Timeless blue denim jeans with perfect fit and durability. A wardrobe essential for every man.',
    details: ['100% Premium Denim', 'Five-pocket design', 'Regular fit', 'Button fly', 'Machine washable'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    isNew: true,
    inStock: true,
    stockCount: 40,
  },
  {
    id: 8,
    name: 'Black Slim Fit Jeans',
    price: 139,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Denim Jeans',
    description: 'Sleek black jeans with a modern slim fit. Versatile and stylish for any occasion.',
    details: ['Stretch Denim', 'Slim fit', 'Five-pocket styling', 'Zip fly', 'Machine washable'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    isNew: true,
    inStock: true,
    stockCount: 35,
  },
  {
    id: 9,
    name: 'Light Wash Denim',
    price: 129,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1475178626620-a4d074967452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Denim Jeans',
    description: 'Casual light wash jeans perfect for relaxed weekends. Comfortable and effortlessly cool.',
    details: ['Cotton Denim', 'Regular fit', 'Faded finish', 'Button fly', 'Machine washable'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    inStock: true,
    stockCount: 30,
  },

  // ── Cargo Pants ───────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Khaki Cargo Pants',
    price: 99,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Cargo Pants',
    description: 'Functional khaki cargo pants with multiple pockets. Perfect blend of utility and style.',
    details: ['Cotton Twill', 'Multiple cargo pockets', 'Regular fit', 'Belt loops', 'Machine washable'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    isNew: true,
    inStock: true,
    stockCount: 28,
  },
  {
    id: 11,
    name: 'Olive Green Cargo',
    price: 99,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1555689502-c4b22d76c56f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Cargo Pants',
    description: 'Military-inspired olive cargo pants. Durable construction with modern styling.',
    details: ['Ripstop Fabric', 'Six pockets', 'Relaxed fit', 'Reinforced stitching', 'Machine washable'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    inStock: true,
    stockCount: 25,
  },

  // ── Joggers ───────────────────────────────────────────────────────────────
  {
    id: 12,
    name: 'Black Athletic Joggers',
    price: 89,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Joggers',
    description: 'Comfortable black joggers for active lifestyle. Perfect for gym or casual wear.',
    details: ['Cotton-Poly Blend', 'Elastic waistband', 'Tapered fit', 'Side pockets', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 45,
  },
  {
    id: 13,
    name: 'Grey Comfort Joggers',
    price: 89,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Joggers',
    description: 'Soft grey joggers for ultimate comfort. Ideal for lounging or light activities.',
    details: ['French Terry', 'Drawstring waist', 'Relaxed fit', 'Ribbed cuffs', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 40,
  },

  // ── Twirl Pants ───────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Navy Twirl Pants',
    price: 119,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1594938291221-94f18cbb5660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Twirl Pants',
    description: 'Sophisticated navy twirl pants with elegant drape. Perfect for smart casual occasions.',
    details: ['Premium Cotton Blend', 'Pleated front', 'Regular fit', 'Side pockets', 'Machine washable'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    isNew: true,
    inStock: true,
    stockCount: 20,
  },
  {
    id: 15,
    name: 'Charcoal Twirl Pants',
    price: 119,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Twirl Pants',
    description: 'Refined charcoal twirl pants for the modern gentleman. Versatile and comfortable.',
    details: ['Wool Blend', 'Flat front', 'Slim fit', 'Belt loops', 'Dry clean recommended'],
    sizes: ['28', '30', '32', '34', '36', '38', '40'],
    inStock: true,
    stockCount: 18,
  },

  // ── Formal Shirts ─────────────────────────────────────────────────────────
  {
    id: 16,
    name: 'White Formal Shirt',
    price: 89,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1603252109303-2751441dd157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Formal Shirts',
    description: 'Crisp white formal shirt for professional settings. Impeccable tailoring and premium fabric.',
    details: ['100% Egyptian Cotton', 'Spread collar', 'Slim fit', 'French cuffs', 'Machine washable'],
    sizes: ['36', '38', '40', '42', '44', '46'],
    isNew: true,
    inStock: true,
    stockCount: 35,
  },
  {
    id: 17,
    name: 'Light Blue Formal Shirt',
    price: 89,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Formal Shirts',
    description: 'Classic light blue formal shirt. A versatile addition to any professional wardrobe.',
    details: ['Premium Cotton', 'Point collar', 'Regular fit', 'Button cuffs', 'Machine washable'],
    sizes: ['36', '38', '40', '42', '44', '46'],
    isNew: true,
    inStock: true,
    stockCount: 30,
  },
  {
    id: 18,
    name: 'Striped Formal Shirt',
    price: 99,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Formal Shirts',
    description: 'Sophisticated striped formal shirt for a distinguished look. Perfect for business meetings.',
    details: ['Cotton Poplin', 'Cutaway collar', 'Slim fit', 'Mother-of-pearl buttons', 'Machine washable'],
    sizes: ['36', '38', '40', '42', '44', '46'],
    inStock: true,
    stockCount: 25,
  },

  // ── Casual Shirts ─────────────────────────────────────────────────────────
  {
    id: 19,
    name: 'Denim Casual Shirt',
    price: 79,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1598032895397-b9c644f8d06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1598032895397-b9c644f8d06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Casual Shirts',
    description: 'Classic denim shirt for effortless casual style. Durable and versatile.',
    details: ['100% Cotton Denim', 'Button-down collar', 'Regular fit', 'Chest pockets', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 32,
  },
  {
    id: 20,
    name: 'Checked Casual Shirt',
    price: 69,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1596755389378-c31d21fd1273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Casual Shirts',
    description: 'Timeless checked casual shirt. Perfect for weekend outings and relaxed occasions.',
    details: ['Cotton Flannel', 'Button-down collar', 'Relaxed fit', 'Chest pocket', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 28,
  },
  {
    id: 21,
    name: 'Linen Casual Shirt',
    price: 89,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Casual Shirts',
    description: 'Breathable linen shirt for warm weather. Lightweight and comfortable.',
    details: ['100% Pure Linen', 'Spread collar', 'Regular fit', 'Breathable fabric', 'Machine washable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 24,
  },

  // ── Boxers ────────────────────────────────────────────────────────────────
  {
    id: 22,
    name: 'Premium Cotton Boxers (3-Pack)',
    price: 39,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Boxers',
    description: 'Essential cotton boxers in a convenient 3-pack. Comfortable and breathable for all-day wear.',
    details: ['100% Premium Cotton', 'Elastic waistband', 'Breathable fabric', 'Pack of 3', 'Machine washable'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 60,
  },
  {
    id: 23,
    name: 'Performance Boxers (3-Pack)',
    price: 49,
    gender: 'men',
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Boxers',
    description: 'High-performance boxers with moisture-wicking technology. Perfect for active lifestyles.',
    details: ['Moisture-wicking fabric', 'Anti-odor technology', 'Flexible waistband', 'Pack of 3', 'Machine washable'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    inStock: true,
    stockCount: 55,
  },

  // ── Women — Coming Soon ───────────────────────────────────────────────────
  {
    id: 101,
    name: 'Silk Evening Gown',
    price: 1199,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Dresses',
    description: 'An exquisite silk evening gown that drapes beautifully for the most special occasions.',
    details: ['100% pure silk', 'Floor-length silhouette', 'Hand-finished hem', 'Dry clean only'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isNew: true,
    inStock: false,
    stockCount: 0,
    comingSoon: true,
  },
  {
    id: 102,
    name: 'Tailored Blazer Dress',
    price: 549,
    gender: 'women',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Dresses',
    description: 'A power-dressing blazer dress that commands attention in any boardroom or event.',
    details: ['Italian wool blend', 'Structured shoulders', 'Belt included', 'Dry clean only'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: false,
    stockCount: 0,
    comingSoon: true,
  },

  // ── Kids — Coming Soon ────────────────────────────────────────────────────
  {
    id: 201,
    name: 'Mini Suit Set',
    price: 249,
    gender: 'kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200'],
    category: 'Suits',
    description: 'A perfectly tailored mini suit set for the little gentleman at special occasions.',
    details: ['Soft wool blend', 'Jacket + trousers', 'Adjustable waistband', 'Machine washable'],
    sizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y'],
    isNew: true,
    inStock: false,
    stockCount: 0,
    comingSoon: true,
  },
];

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
