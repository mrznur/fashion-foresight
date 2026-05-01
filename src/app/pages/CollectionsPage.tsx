import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '../../lib/useSettings';
import { useProducts } from '../../lib/productsApi';

export function CollectionsPage() {
  const s = useSettings();
  const { products } = useProducts();

  // Build collections from product categories that have items
  const categoryImages: Record<string, string> = {
    'T-Shirts':      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Polo Shirts':   'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Denim Jeans':   'https://images.unsplash.com/photo-1542272604-787c3835535d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Formal Shirts': 'https://images.unsplash.com/photo-1603252109303-2751441dd157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Casual Shirts': 'https://images.unsplash.com/photo-1598032895397-b9c644f8d06a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Cargo Pants':   'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Joggers':       'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Boxers':        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    'Twirl Pants':   'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
  };

  // Get unique categories that have in-stock products
  const activeCategories = [...new Set(
    products.filter(p => p.inStock && p.gender === 'men').map(p => p.category)
  )];

  const collections = activeCategories.map(cat => {
    const catProducts = products.filter(p => p.category === cat && p.inStock);
    const image = catProducts.find(p => p.featuredImage)?.featuredImage
      ?? catProducts[0]?.image
      ?? categoryImages[cat]
      ?? 'https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200';
    return { cat, image, count: catProducts.length };
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">Curated</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1a0508] mb-4">Our Collections</h1>
          <p className="text-[#737373] text-lg max-w-xl mx-auto leading-relaxed">
            Curated selections from {s.store_name} — crafted for the modern gentleman.
          </p>
        </div>
      </section>

      {/* Collections grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {collections.length === 0 ? (
            <div className="text-center py-20 text-[#737373]">
              <p className="text-lg">Collections coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map(({ cat, image, count }) => (
                <Link key={cat} to={`/shop?category=${encodeURIComponent(cat)}`} className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-[#f5f5f5]">
                  <img src={image} alt={cat} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-1">{count} items</p>
                    <h2 className="text-xl font-semibold text-white mb-3">{cat}</h2>
                    <span className="inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-white transition-colors">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#1a0508]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#d4a0a0] uppercase tracking-[0.3em] font-semibold mb-3">Need Help?</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">Not Sure What to Pick?</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Contact us and our team will help you find the perfect pieces for your style.
          </p>
          <Link to="/contact" className="btn-brand inline-flex text-sm px-8 py-3.5">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
