import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductById } from './db';
import type { Product } from './types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return { products, loading };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchProductById(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  return { product, loading };
}

export function useRelatedProducts(productId: number, limit = 3) {
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (!productId) return;
    fetchProducts().then((all) => {
      const current = all.find((p) => p.id === productId);
      if (!current) return;
      const same = all.filter((p) => p.id !== productId && p.category === current.category).slice(0, limit);
      const others = all.filter((p) => p.id !== productId && p.gender === current.gender && p.category !== current.category);
      setRelated([...same, ...others].slice(0, limit));
    });
  }, [productId, limit]);

  return related;
}
