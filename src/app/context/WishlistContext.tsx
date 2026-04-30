import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  fetchProductById,
} from '../../lib/db';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isLiked: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Local state — used for both guest (localStorage) and logged-in (DB) modes
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (user) return []; // will be loaded from DB
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  // Track the last user id we loaded for, to avoid duplicate fetches
  const loadedForRef = useRef<string | null>(null);

  // On mount / user change: load from DB if logged in, else from localStorage
  useEffect(() => {
    if (!user) {
      // Guest mode — read from localStorage
      loadedForRef.current = null;
      try {
        setItems(JSON.parse(localStorage.getItem('wishlist') || '[]'));
      } catch {
        setItems([]);
      }
      return;
    }

    // Logged-in mode — fetch from DB (only once per user session)
    if (loadedForRef.current === user.id) return;
    loadedForRef.current = user.id;

    fetchWishlist(user.id).then(async (productIds) => {
      if (productIds.length === 0) {
        setItems([]);
        return;
      }
      const products = await Promise.all(productIds.map((id) => fetchProductById(id)));
      const wishlistItems: WishlistItem[] = products
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map((p) => ({
          id:       p.id,
          name:     p.name,
          price:    p.price,
          image:    p.images?.[0] ?? p.image,
          category: p.category,
        }));
      setItems(wishlistItems);
    });
  }, [user]);

  // Persist to localStorage when guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, user]);

  const toggle = (item: WishlistItem) => {
    const alreadyLiked = items.some((i) => i.id === item.id);

    // Optimistic local update
    setItems((prev) =>
      alreadyLiked ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    );

    // Sync to DB if logged in
    if (user) {
      if (alreadyLiked) {
        removeFromWishlist(user.id, item.id);
      } else {
        addToWishlist(user.id, item.id);
      }
    }
  };

  const isLiked = (id: number) => items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isLiked }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
