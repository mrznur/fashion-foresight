import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Truck, Shield, Headphones, Star, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { toast } from 'sonner';
import { useProducts } from '../../lib/productsApi';
import { subscribeNewsletter } from '../../lib/db';

// Get featured products - first 8 products from the catalog
const heroSlides = [
  { img: 'https://images.unsplash.com/photo-1775831726606-3d98ebefb57a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920', label: 'Spring / Summer 2026', title: 'Modern\nSophistication' },
  { img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920', label: 'New Arrivals', title: 'Refined\nElegance' },
  { img: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920', label: 'Formal Collection', title: 'Impeccable\nTailoring' },
  { img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920', label: 'Casual Essentials', title: 'Everyday\nLuxury' },
  { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920', label: 'Premium Menswear', title: 'Crafted for\nthe Bold' },
  { img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920', label: 'Exclusive Styles', title: 'Define Your\nStyle' },
];

const testimonials = [
  { name: 'James H.', role: 'CEO, London', text: 'The quality is exceptional. My suit arrived perfectly tailored and the fabric is outstanding.', rating: 5 },
  { name: 'Michael R.', role: 'Architect, Milan', text: 'Fashion Foresight has completely elevated my wardrobe. Every piece is worth every penny.', rating: 5 },
  { name: 'David L.', role: 'Lawyer, New York', text: "Impeccable craftsmanship and fast delivery. I've been a loyal customer for 3 years.", rating: 5 },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $200' },
  { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer service' },
];

export function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.filter(p => p.gender === 'men' && p.inStock).slice(0, 8);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length), []);
  const next = useCallback(() => setCurrent(c => (c + 1) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

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
      <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide.img}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 text-white px-4 max-w-6xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#d4a0a0]" />
              <span className="text-xs tracking-[0.2em] uppercase text-white/80">{heroSlides[current].label}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight mb-6 leading-[1.05] whitespace-pre-line">
              {heroSlides[current].title.split('\n')[0]}<br />
              <span className="font-semibold text-white">{heroSlides[current].title.split('\n')[1]}</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 mb-10 leading-relaxed max-w-lg">
              Impeccably tailored menswear crafted for the discerning gentleman who demands excellence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/shop" className="btn-brand text-sm px-7 py-3.5 bg-[#64020e] hover:bg-[#4a0109]">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/collections" className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-white/10 hover:border-white/70 transition-all duration-200">
                View Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next */}
        <button onClick={prev} aria-label="Previous slide" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-all duration-200">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={next} aria-label="Next slide" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/25 transition-all duration-200">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
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
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-2">Handpicked</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508]">Featured Collection</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-[#64020e] hover:gap-3 transition-all duration-200">
              View all products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection Showcase ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-2">Curated</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508]">Shop by Collection</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { img: 'https://images.unsplash.com/photo-1651493284103-b2a338ba0ba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', label: 'Everyday Luxury', title: 'Casual Essentials', link: '/shop?category=Casual' },
              { img: 'https://images.unsplash.com/photo-1772384480623-53b9cded0033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', label: 'Impeccable Tailoring', title: 'Formal Collection', link: '/shop?category=Suits' },
            ].map(({ img, label, title, link }) => (
              <div key={title} className="relative h-[480px] overflow-hidden rounded-3xl group">
                <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[10px] text-white/60 uppercase tracking-[0.3em] font-semibold mb-1.5">{label}</p>
                  <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
                  <Link to={link} className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white hover:text-[#1a0508] transition-all duration-200">
                    Explore
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-2">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508]">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-[#e5e5e5] rounded-3xl p-8 hover:border-[#64020e]/30 hover:shadow-lg transition-all duration-300">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#64020e] text-[#64020e]" />
                  ))}
                </div>
                <p className="text-[#737373] mb-6 leading-relaxed text-sm italic">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold text-[#1a0508]">{t.name}</p>
                  <p className="text-xs text-[#737373] mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-[#1a0508]">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-[#64020e]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-6 h-6 text-[#d4a0a0]" />
          </div>
          <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">Stay Updated</p>
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
