import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { Heart, ShoppingCart, Truck, RotateCcw, Shield, Plus, Minus, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { useProduct, useRelatedProducts } from '../../lib/productsApi';
import { parseProductId } from '../../lib/validation';

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();

  const productId = parseProductId(id);
  const { product, loading } = useProduct(productId ?? 0);
  const relatedProducts = useRelatedProducts(productId ?? 0);

  if (!productId || (!loading && !product)) return <Navigate to="/shop" replace />;
  if (loading || !product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#f5f5f5] border-t-[#64020e] rounded-full animate-spin" />
    </div>
  );

  const liked = isLiked(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    addItem({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] ?? product.image, category: product.category, size: selectedSize });
    toast.success(`${product.name} added to cart`, { description: `Size ${selectedSize} · Qty ${quantity}` });
  };

  const handleWishlist = () => {
    toggle({ id: productId!, name: product.name, price: product.price, image: product.images?.[0] ?? product.image, category: product.category });
    if (!liked) toast.success('Added to wishlist');
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#737373] mb-10">
          <Link to="/" className="hover:text-[#64020e] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-[#64020e] transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1a0508] font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mb-24">
          {/* Image */}
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-[#f5f5f5] rounded-3xl">
              <img
                src={product.images?.[0] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            <div className="mb-7">
              <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-4 leading-tight">{product.name}</h1>
              <p className="text-3xl font-bold text-[#1a0508]">${product.price.toFixed(2)}</p>
            </div>

            <p className="text-[#737373] mb-8 leading-relaxed text-sm">{product.description}</p>

            {/* Size */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#1a0508]">
                  Select Size
                  {sizeError && <span className="ml-2 text-[#64020e] text-xs font-normal">— Please select a size</span>}
                </span>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-[#64020e] hover:underline font-medium transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes ?? []).map((size) => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`min-w-[3rem] h-12 px-3 border-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-[#64020e] bg-[#64020e] text-white'
                        : 'border-[#e5e5e5] text-[#1a0508] hover:border-[#64020e]'
                    }`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="block text-sm font-semibold text-[#1a0508] mb-3">Quantity</span>
              <div className="flex items-center border-2 border-[#e5e5e5] rounded-xl w-fit overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors" aria-label="Decrease">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-[#1a0508]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors" aria-label="Increase">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button onClick={handleAddToCart}
                className="flex-1 btn-brand justify-center py-4 text-sm">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button onClick={handleWishlist}
                className={`w-14 h-14 border-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  liked ? 'border-[#64020e] bg-[#fdf2f2] text-[#64020e]' : 'border-[#e5e5e5] text-[#737373] hover:border-[#64020e] hover:text-[#64020e]'
                }`}
                aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-[#64020e]' : ''}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="space-y-3 border-t border-[#f5f5f5] pt-6">
              {[
                { icon: Truck, text: 'Free shipping on orders over $200' },
                { icon: RotateCcw, text: '30-day return policy' },
                { icon: Shield, text: 'Authenticity guaranteed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-[#737373]">
                  <div className="w-8 h-8 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#64020e]" />
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="mt-8 border-t border-[#f5f5f5] pt-6">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#737373] mb-4">Product Details</h3>
              <ul className="space-y-2.5">
                {(product.details ?? []).map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#737373]">
                    <span className="mt-2 w-1.5 h-1.5 bg-[#64020e] rounded-full flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="border-t border-[#f5f5f5] pt-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-2">Discover More</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1a0508]">You May Also Like</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      </div>

      <SizeGuideModal 
        isOpen={sizeGuideOpen} 
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}
