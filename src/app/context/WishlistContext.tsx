import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const toggle = (item: WishlistItem) => {
    setItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
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
