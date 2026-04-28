import { X, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';

export interface QuickViewProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  onClose: () => void;
}

const sizes = ['36', '38', '40', '42', '44', '46'];

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();

  useEffect(() => {
    if (product) {
      setSelectedSize('');
      setSizeError(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!product) return null;

  const liked = isLiked(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, size: selectedSize });
    toast.success('Added to cart', { description: `${product.name} · Size ${selectedSize}` });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f5f5f5]">
            <p className="text-xs text-[#64020e] uppercase tracking-widest font-semibold">Quick View</p>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-all" aria-label="Close">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Image */}
            <div className="aspect-[3/4] bg-[#f5f5f5] overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col justify-between gap-6">
              <div>
                <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold mb-2">{product.category}</p>
                <h2 className="text-xl font-semibold text-[#1a0508] mb-2 leading-snug">{product.name}</h2>
                <p className="text-2xl font-bold text-[#1a0508]">${product.price.toFixed(2)}</p>
              </div>

              {/* Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1a0508]">Select Size</span>
                  {sizeError && <span className="text-xs text-[#64020e] font-medium">Please select a size</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setSizeError(false); }}
                      className={`w-11 h-11 border-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-[#64020e] bg-[#64020e] text-white'
                          : 'border-[#e5e5e5] text-[#1a0508] hover:border-[#64020e]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full btn-brand justify-center py-3 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => toggle(product)}
                  className={`w-full py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    liked
                      ? 'border-[#64020e] bg-[#fdf2f2] text-[#64020e]'
                      : 'border-[#e5e5e5] text-[#1a0508] hover:border-[#64020e] hover:text-[#64020e]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-[#64020e]' : ''}`} />
                  {liked ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 text-sm text-[#737373] hover:text-[#64020e] transition-colors py-1"
                >
                  View Full Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
