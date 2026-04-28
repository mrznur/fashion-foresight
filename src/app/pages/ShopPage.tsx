import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, X, ChevronDown, Clock, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../lib/products';
import { useProducts } from '../../lib/productsApi';
import type { ProductGender } from '../../lib/types';

const GENDER_TABS: { id: ProductGender; label: string }[] = [
  { id: 'men',   label: "Men's" },
  { id: 'women', label: "Women's" },
  { id: 'kids',  label: 'Kids' },
];

export function ShopPage() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeGender, setActiveGender] = useState<ProductGender>('men');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRanges, setPriceRanges] = useState<string[]>([]);

  useEffect(() => {
    const cat = searchParams.get('category');
    const gender = searchParams.get('gender') as ProductGender | null;
    if (gender && ['men', 'women', 'kids'].includes(gender)) setActiveGender(gender);
    if (cat && CATEGORIES.includes(cat as typeof CATEGORIES[number])) setSelectedCategory(cat);
  }, []);

  const handleGenderChange = (g: ProductGender) => {
    setActiveGender(g);
    setSelectedCategory('All');
    setPriceRanges([]);
    setSearchParams(g !== 'men' ? { gender: g } : {});
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const params: Record<string, string> = {};
    if (activeGender !== 'men') params.gender = activeGender;
    if (cat !== 'All') params.category = cat;
    setSearchParams(params);
  };

  const togglePriceRange = (range: string) =>
    setPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );

  const matchesPriceRange = (price: number) => {
    if (priceRanges.length === 0) return true;
    return priceRanges.some((range) => {
      if (range === 'under-100') return price < 100;
      if (range === '100-500') return price >= 100 && price <= 500;
      if (range === '500-1000') return price > 500 && price <= 1000;
      if (range === 'over-1000') return price > 1000;
      return false;
    });
  };

  const genderProducts = products.filter((p) => p.gender === activeGender);

  const filteredProducts = genderProducts.filter((p) => {
    const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
    return catMatch && matchesPriceRange(p.price);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + priceRanges.length;
  const isComingSoon = activeGender === 'women' || activeGender === 'kids';

  return (
    <div className="min-h-screen bg-white">

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-[#faf9f8] border-b border-[#e8dede] py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-overline mb-2">Catalog</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1a0508] font-display mb-6">Shop</h1>

          {/* Gender Tabs */}
          <div className="flex gap-1 bg-white border border-[#e8dede] rounded-2xl p-1.5 w-full sm:w-fit overflow-x-auto">
            {GENDER_TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleGenderChange(id)}
                className={`relative px-5 sm:px-7 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeGender === id
                    ? 'bg-[#64020e] text-white shadow-sm'
                    : 'text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2]'
                }`}
              >
                {label}
                {(id === 'women' || id === 'kids') && (
                  <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    SOON
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* ── Coming Soon overlay for Women & Kids ─────────────────────── */}
        {isComingSoon ? (
          <ComingSoonSection gender={activeGender} products={genderProducts} />
        ) : (
          <>
            {/* Filter / Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#f5f0ef]">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    filterOpen || activeFilterCount > 0
                      ? 'border-[#64020e] bg-[#fdf2f2] text-[#64020e]'
                      : 'border-[#e8dede] text-[#1a0508] hover:border-[#1a0508]'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-[#64020e] text-white text-[10px] font-bold rounded-full flex items-center justify-center" style={{ width: 18, height: 18 }}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-[#7a5c60]">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                  {selectedCategory !== 'All' && <span className="text-[#64020e] hidden sm:inline"> in {selectedCategory}</span>}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-[#7a5c60] hidden sm:inline">Sort by</span>
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none pl-4 pr-9 py-2.5 border-2 border-[#e8dede] rounded-xl text-sm font-medium text-[#1a0508] bg-white hover:border-[#1a0508] focus:outline-none focus:border-[#64020e] transition-colors cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7a5c60] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== 'All' && (
                  <button onClick={() => handleCategoryChange('All')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#64020e] text-white text-xs font-semibold rounded-full hover:bg-[#4a0109] transition-colors">
                    {selectedCategory} <X className="w-3 h-3" />
                  </button>
                )}
                {priceRanges.map((range) => (
                  <button key={range} onClick={() => togglePriceRange(range)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#64020e] text-white text-xs font-semibold rounded-full hover:bg-[#4a0109] transition-colors">
                    {range === 'under-100' && 'Under $100'}
                    {range === '100-500' && '$100–$500'}
                    {range === '500-1000' && '$500–$1000'}
                    {range === 'over-1000' && 'Over $1000'}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button onClick={() => { handleCategoryChange('All'); setPriceRanges([]); }}
                  className="text-xs text-[#7a5c60] hover:text-[#64020e] underline underline-offset-2 transition-colors">
                  Clear all
                </button>
              </div>
            )}

            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className={`${filterOpen ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0 mb-8 md:mb-0`}>
                <div className="md:sticky md:top-24 space-y-8">
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#7a5c60] mb-4">Categories</h3>
                    <div className="space-y-1">
                      {CATEGORIES.map((cat) => (
                        <button key={cat} onClick={() => handleCategoryChange(cat)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            selectedCategory === cat
                              ? 'bg-[#64020e] text-white'
                              : 'text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#1a0508]'
                          }`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#7a5c60] mb-4">Price Range</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'under-100', label: 'Under $100' },
                        { id: '100-500', label: '$100 – $500' },
                        { id: '500-1000', label: '$500 – $1,000' },
                        { id: 'over-1000', label: 'Over $1,000' },
                      ].map(({ id, label }) => (
                        <label key={id} className="flex items-center gap-3 cursor-pointer group">
                          <div
                            onClick={() => togglePriceRange(id)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 cursor-pointer ${
                              priceRanges.includes(id)
                                ? 'bg-[#64020e] border-[#64020e]'
                                : 'border-[#e8dede] group-hover:border-[#64020e]'
                            }`}
                          >
                            {priceRanges.includes(id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-[#7a5c60] group-hover:text-[#1a0508] transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24">
                    <div className="w-16 h-16 bg-[#f5f0ef] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <SlidersHorizontal className="w-7 h-7 text-[#d4b8ba]" />
                    </div>
                    <p className="font-medium text-[#1a0508] mb-1">No products match your filters</p>
                    <p className="text-sm text-[#7a5c60] mb-5">Try adjusting or clearing your filters</p>
                    <button onClick={() => { handleCategoryChange('All'); setPriceRanges([]); }}
                      className="btn-brand text-sm px-6 py-2.5">
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Coming Soon Section ───────────────────────────────────────────────────────

function ComingSoonSection({ gender, products }: { gender: ProductGender; products: typeof PRODUCTS }) {
  const label = gender === 'women' ? "Women's" : "Kids'";
  const desc = gender === 'women'
    ? 'Our women\'s collection is being carefully curated with the same dedication to quality and elegance. Be the first to know when it launches.'
    : 'A thoughtfully designed collection for the little ones — crafted with the same quality and care as our adult lines.';

  return (
    <div>
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl mb-12 bg-[#1a0508]">
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-3 gap-0 h-full">
            {products.slice(0, 3).map((p) => (
              <img key={p.id} src={p.image} alt="" className="w-full h-full object-cover" />
            ))}
          </div>
        </div>
        <div className="relative z-10 py-20 md:py-28 px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2 mb-6">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 text-sm font-semibold tracking-wide">Coming Soon</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white font-display mb-4">
            {label} Collection
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            {desc}
          </p>
          <NotifyForm gender={gender} />
        </div>
      </div>

      {/* Preview cards — blurred/locked */}
      <div>
        <p className="text-sm font-semibold text-[#7a5c60] uppercase tracking-widest mb-6 text-center">
          Sneak Peek
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              {/* Blurred product card */}
              <div className="rounded-2xl overflow-hidden border border-[#e8dede]">
                <div className="aspect-[3/4] bg-[#f5f0ef] overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover blur-sm scale-105 opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 text-center shadow-lg">
                      <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                      <p className="text-sm font-bold text-[#1a0508]">Coming Soon</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold mb-1">{product.category}</p>
                  <p className="text-base font-medium text-[#1a0508] blur-sm select-none">{product.name}</p>
                  <p className="text-base font-semibold text-[#1a0508] mt-1 blur-sm select-none">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotifyForm({ gender }: { gender: ProductGender }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
  };

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white">
        <span className="text-green-400">✓</span>
        <span className="text-sm font-medium">You're on the list! We'll notify you at launch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        id="coming-soon-notify-email"
        name="notify-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-xl text-sm focus:outline-none focus:border-[#64020e] transition-colors"
      />
      <button type="submit" className="btn-brand px-5 py-3 text-sm whitespace-nowrap">
        Notify Me
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
