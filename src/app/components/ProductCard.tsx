import { Heart } from 'lucide-react';
import { Link } from 'react-router';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../../lib/useCurrency';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  isNew?: boolean;
  comingSoon?: boolean;
}

export function ProductCard({ id, name, price, originalPrice, discount, image, category, isNew, comingSoon }: ProductCardProps) {
  const { toggle, isLiked } = useWishlist();
  const { user } = useAuth();
  const { format } = useCurrency();
  const isAdmin = user?.role === 'admin';
  const liked = isLiked(id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!comingSoon && !isAdmin) {
      toggle({ id, name, price, image, category });
    }
  };

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden bg-[#f5f5f5] rounded-2xl aspect-[3/4] mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && !comingSoon && (
            <span className="bg-[#64020e] text-white px-2.5 py-1 text-[10px] font-semibold tracking-widest rounded-full uppercase">
              NEW
            </span>
          )}
          {discount && discount > 0 && !comingSoon && (
            <span className="bg-amber-500 text-white px-2.5 py-1 text-[10px] font-semibold rounded-full">
              -{discount}%
            </span>
          )}
          {comingSoon && (
            <span className="bg-amber-500 text-white px-2.5 py-1 text-[10px] font-semibold tracking-widest rounded-full uppercase">
              COMING SOON
            </span>
          )}
        </div>
        {!comingSoon && !isAdmin && (
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              liked
                ? 'bg-[#64020e] text-white shadow-md'
                : 'bg-white/90 backdrop-blur-sm text-[#737373] hover:text-[#64020e] hover:bg-white'
            }`}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
          </button>
        )}
      </div>
      <div className="space-y-1 px-1">
        <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold">{category}</p>
        <h3 className="text-base font-medium text-[#1a0508] group-hover:text-[#64020e] transition-colors duration-200 leading-snug">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-[#1a0508]">{format(price)}</p>
          {originalPrice && originalPrice > price && (
            <p className="text-sm text-[#a3a3a3] line-through">{format(originalPrice)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
