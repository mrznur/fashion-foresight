import { X, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { searchProducts, CATEGORIES } from '../../lib/products';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const results = query.trim().length > 1 ? searchProducts(query) : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Search Bar */}
      <div className="border-b border-[#f5f5f5] px-4 sm:px-8 py-4 flex items-center gap-4">
        <Search className="w-5 h-5 text-[#64020e] flex-shrink-0" />
        <input
          id="search-overlay-input"
          name="search-query"
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, categories..."
          className="flex-1 text-lg text-[#1a0508] outline-none placeholder:text-[#d4d4d4] bg-transparent"
        />
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-all"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full">
        {query.trim().length > 1 ? (
          results.length > 0 ? (
            <div>
              <p className="text-xs text-[#737373] uppercase tracking-widest font-semibold mb-5">
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </p>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#f5f5f5] transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-18 object-cover bg-[#f5f5f5] rounded-xl flex-shrink-0"
                      style={{ height: '72px' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold mb-0.5">{product.category}</p>
                      <p className="text-sm font-medium text-[#1a0508] group-hover:text-[#64020e] transition-colors truncate">{product.name}</p>
                      <p className="text-sm font-semibold text-[#1a0508] mt-0.5">${product.price.toFixed(2)}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d4d4d4] group-hover:text-[#64020e] transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-[#d4d4d4]" />
              </div>
              <p className="font-medium text-[#1a0508] mb-1">No results for "{query}"</p>
              <p className="text-sm text-[#737373]">Try a different search term</p>
            </div>
          )
        ) : (
          <div className="space-y-8">
            <div>
              <p className="text-xs text-[#737373] uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Popular Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <Link
                    key={cat}
                    to={`/shop?category=${cat}`}
                    onClick={onClose}
                    className="px-4 py-2 bg-[#f5f5f5] text-[#1a0508] text-sm font-medium rounded-xl hover:bg-[#64020e] hover:text-white transition-all duration-200"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
