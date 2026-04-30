import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { Heart, ShoppingCart, Truck, RotateCcw, Shield, Plus, Minus, ChevronRight, ZoomIn, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useProduct, useRelatedProducts } from '../../lib/productsApi';
import { parseProductId } from '../../lib/validation';
import { useCurrency } from '../../lib/useCurrency';
import { useSettings } from '../../lib/useSettings';

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();
  const { user } = useAuth();
  const { format, freeShippingThreshold } = useCurrency();
  const settings = useSettings();
  const isAdmin = user?.role === 'admin';

  const productId = parseProductId(id);
  const { product, loading } = useProduct(productId ?? 0);
  const relatedProducts = useRelatedProducts(productId ?? 0);

  if (!productId || (!loading && !product)) return <Navigate to="/shop" replace />;
  if (loading || !product) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#f5f5f5] border-t-[#64020e] rounded-full animate-spin" />
    </div>
  );

  const allImages = [product.images?.[0] ?? product.image, ...(product.images?.slice(1) ?? [])].filter(Boolean);
  const liked = isLiked(product.id);
  const isOutOfStock = product.inStock === false || (product.stockCount !== undefined && product.stockCount !== null && product.stockCount === 0);
  const isLowStock = !isOutOfStock && product.stockCount !== undefined && product.stockCount >= 1 && product.stockCount <= 5;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!selectedSize) { setSizeError(true); return; }
    addItem({ id: product.id, name: product.name, price: product.price, image: product.images?.[0] ?? product.image, category: product.category, size: selectedSize, maxStock: product.stockCount });
    toast.success(`${product.name} added to cart`, { description: `Size ${selectedSize} · Qty ${quantity}` });
  };

  // Full size range per category — show all, grey out unavailable
  const FULL_SIZES: Record<string, string[]> = {
    'T-Shirts':     ['XS','S','M','L','XL','XXL'],
    'Polo Shirts':  ['XS','S','M','L','XL','XXL'],
    'Casual Shirts':['XS','S','M','L','XL','XXL'],
    'Joggers':      ['XS','S','M','L','XL','XXL'],
    'Boxers':       ['S','M','L','XL','XXL'],
    'Denim Jeans':  ['28','30','32','34','36','38','40'],
    'Cargo Pants':  ['28','30','32','34','36','38','40'],
    'Twirl Pants':  ['28','30','32','34','36','38','40'],
    'Formal Shirts':['36','38','40','42','44','46'],
  };
  const availableSizes = new Set(product.sizes ?? []);
  const displaySizes = FULL_SIZES[product.category] ?? product.sizes ?? [];

  const handleWishlist = () => {
    toggle({ id: productId!, name: product.name, price: product.price, image: product.images?.[0] ?? product.image, category: product.category });
    if (!liked) toast.success('Added to wishlist');
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-[#737373] mb-10">
          <Link to="/" className="hover:text-[#64020e] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-[#64020e] transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1a0508] font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mb-24">

          {/* Image gallery */}
          <div>
            <div
              className="relative aspect-[4/3] md:aspect-[3/4] max-h-[450px] overflow-hidden bg-[#f5f5f5] rounded-3xl mb-3 group cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              <img
                src={allImages[selectedImage] ?? product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-[#1a0508]" />
              </div>
            </div>
            {allImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                      selectedImage === i
                        ? 'border-[#64020e] shadow-md'
                        : 'border-[#e5e5e5] hover:border-[#64020e]'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom lightbox */}
          {zoomOpen && (
            <>
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors" aria-label="Close zoom">
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={allImages[selectedImage] ?? product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                {allImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setSelectedImage(i); }}
                        className={`w-2 h-2 rounded-full transition-all ${i === selectedImage ? 'bg-white w-5' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Info */}
          <div className="lg:pt-4">
            <div className="mb-7">
              <p className="text-sm text-[#64020e] uppercase tracking-[0.2em] font-semibold mb-3">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-[#1a0508]">{format(product.price)}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <p className="text-xl text-[#a3a3a3] line-through">{format(product.originalPrice)}</p>
                    <span className="bg-amber-100 text-amber-700 text-sm font-bold px-2.5 py-1 rounded-full">-{product.discount}%</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-[#737373] mb-8 leading-relaxed text-base">{product.description}</p>

            {/* Size */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-semibold text-[#1a0508]">
                  Select Size
                  {sizeError && <span className="ml-2 text-[#64020e] text-sm font-normal">— Please select a size</span>}
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-sm text-[#64020e] hover:underline font-medium transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {displaySizes.map((size) => {
                  const isAvailable = availableSizes.has(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => { if (isAvailable && !isOutOfStock) { setSelectedSize(size); setSizeError(false); } }}
                      disabled={!isAvailable || isOutOfStock}
                      className={`min-w-[3.25rem] h-12 px-3 border-2 text-base font-medium rounded-xl transition-all duration-200 relative ${
                        !isAvailable || isOutOfStock
                          ? 'border-[#e5e5e5] text-[#d4d4d4] bg-[#fafafa] cursor-not-allowed'
                          : isSelected
                          ? 'border-[#64020e] bg-[#64020e] text-white'
                          : 'border-[#e5e5e5] text-[#1a0508] hover:border-[#64020e]'
                      }`}
                    >
                      {size}
                      {/* Strikethrough line for unavailable */}
                      {(!isAvailable || isOutOfStock) && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="w-full h-px bg-[#d4d4d4] absolute rotate-45 scale-75" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="block text-base font-semibold text-[#1a0508] mb-3">Quantity</span>
              <div className="flex items-center border-2 border-[#e5e5e5] rounded-xl w-fit overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors" aria-label="Decrease">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-base font-semibold text-[#1a0508]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors" aria-label="Increase">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions — hidden for admin */}
            {!isAdmin && (
              <div className="mb-8">
                {isLowStock && (
                  <p className="text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
                    Only {product.stockCount} left in stock
                  </p>
                )}
                <div className="flex gap-3">
                  {isOutOfStock ? (
                    <button disabled className="flex-1 flex items-center justify-center gap-2 py-4 text-base font-semibold bg-[#f5f5f5] text-[#a3a3a3] rounded-xl cursor-not-allowed">
                      Out of Stock
                    </button>
                  ) : (
                    <button onClick={handleAddToCart} className="flex-1 btn-brand justify-center py-4 text-base">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  )}
                  <button onClick={handleWishlist}
                    className={`w-14 h-14 border-2 rounded-xl transition-all duration-200 flex items-center justify-center ${
                      liked ? 'border-[#64020e] bg-[#fdf2f2] text-[#64020e]' : 'border-[#e5e5e5] text-[#737373] hover:border-[#64020e] hover:text-[#64020e]'
                    }`}
                    aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}>
                    <Heart className={`w-5 h-5 ${liked ? 'fill-[#64020e]' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="space-y-3 border-t border-[#f5f5f5] pt-6">
              {[
                { icon: Truck, text: `Free shipping on orders over ${format(freeShippingThreshold)}` },
                { icon: RotateCcw, text: `${settings.return_window ?? 30}-day return policy` },
                { icon: Shield, text: 'Authenticity guaranteed' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-base text-[#737373]">
                  <div className="w-9 h-9 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#64020e]" />
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* Details */}
            <div className="mt-8 border-t border-[#f5f5f5] pt-6">
              <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-[#737373] mb-4">Product Details</h3>
              <ul className="space-y-2.5">
                {(product.details ?? []).map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-base text-[#737373]">
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
              <p className="text-sm text-[#64020e] uppercase tracking-[0.2em] font-semibold mb-2">Discover More</p>
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
