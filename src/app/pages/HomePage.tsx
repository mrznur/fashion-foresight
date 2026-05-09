import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Truck, Shield, Headphones, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { toast } from 'sonner';
import { useProducts } from '../../lib/productsApi';
import { subscribeNewsletter, fetchCarouselSlides, type CarouselSlide } from '../../lib/db';
import { useSettings } from '../../lib/useSettings';

const features = [
  { icon: Truck,       title: 'Free Shipping',   desc: 'On qualifying orders'       },
  { icon: Shield,      title: 'Secure Payment',  desc: '100% secure transactions'   },
  { icon: Headphones,  title: '24/7 Support',    desc: 'Dedicated customer service' },
];

export function HomePage() {
  const { products } = useProducts();
  const s = useSettings();
  const featuredProducts = products.filter(p => p.inStock).slice(0, 8);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);

  useEffect(() => {
    fetchCarouselSlides().then(setSlides);
  }, []);

  // Use DB carousel slides if available, else fallback to product images
  const heroItems = slides.length > 0
    ? slides.map(sl => ({ image: sl.image_url, label: sl.label ?? '', productId: sl.product_id }))
    : products.filter(p => p.image).slice(0, 6).map(p => ({
        image: p.featuredImage ?? p.image,
        label: p.category,
        productId: p.id,
      }));

  const slide = heroItems[current];

  const prev = useCallback(() =>
    setCurrent(c => (c - 1 + Math.max(heroItems.length, 1)) % Math.max(heroItems.length, 1)), [heroItems.length]);
  const next = useCallback(() =>
    setCurrent(c => (c + 1) % Math.max(heroItems.length, 1)), [heroItems.length]);

  useEffect(() => {
    if (heroItems.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, heroItems.length]);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    await subscribeNewsletter(newsletterEmail);
    toast.success('Subscribed!', { description: "You're now on the inner circle list." });
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Carousel ─────────────────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#1a0508]">
        {heroItems.length > 0 ? (
          <>
            {heroItems.map((item, i) => (
              <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
                <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

            <div className="relative z-20 text-white px-4 max-w-6xl mx-auto w-full">
              <div className="max-w-2xl">
                <p className="text-sm md:text-base uppercase tracking-[0.3em] text-white/60 font-medium mb-4">
                  {slide?.label}
                </p>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-5 leading-[1.05]">
                  {s.store_name}
                </h1>
                <p className="text-base md:text-lg text-white/65 mb-10 leading-relaxed max-w-lg font-light">
                  Premium menswear crafted for the discerning gentleman.
                </p>
                <div className="flex flex-wrap gap-3">
                  {slide?.productId ? (
                    <Link to={`/product/${slide.productId}`} className="btn-brand text-sm px-7 py-3.5 bg-[#64020e] hover:bg-[#4a0109]">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link to="/shop" className="btn-brand text-sm px-7 py-3.5 bg-[#64020e] hover:bg-[#4a0109]">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  <Link to="/shop" className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/70 transition-all duration-200">
                    View All
                  </Link>
                </div>
              </div>
            </div>

            {heroItems.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} aria-label="Next" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {heroItems.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)} aria-label={`Slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          /* Empty state — no products yet */
          <div className="relative z-10 text-center text-white px-4">
            <Sparkles className="w-12 h-12 text-[#d4a0a0] mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-4">{s.store_name}</h1>
            <p className="text-white/60 text-lg mb-8">New collection coming soon</p>
            <Link to="/shop" className="btn-brand px-8 py-3.5 text-sm">
              Explore Shop <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* ── Features Bar ─────────────────────────────────────────────────── */}
      <section className="bg-[#1a0508] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-white/10">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-4 md:px-10 first:md:pl-0 last:md:pr-0">
                <div className="w-10 h-10 bg-[#64020e]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#d4a0a0]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
              <div>
                <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-2">Handpicked</p>
                <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508]">Featured Collection</h2>
              </div>
              <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-[#64020e] hover:gap-3 transition-all duration-200">
                View all products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-[#1a0508]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">

          <p className="text-[10px] md:text-xl text-[#a50518] uppercase tracking-[0.3em] font-semibold mb-3">Stay Updated</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Join the Inner Circle</h2>
          <p className="text-white/50 mb-8 text-sm leading-relaxed">
            Be the first to know about new collections, exclusive offers, and styling tips.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
            <input
              id="homepage-newsletter-email"
              name="newsletter-email"
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-xl text-sm focus:outline-none focus:border-[#64020e] transition-colors"
            />
            <button type="submit" className="btn-brand px-5 py-3 text-sm whitespace-nowrap justify-center">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
