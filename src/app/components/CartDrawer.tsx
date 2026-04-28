import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const freeShippingThreshold = 200;
  const remaining = freeShippingThreshold - totalPrice;
  const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f5f5f5]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#1a0508]" />
            <h2 className="text-base font-semibold text-[#1a0508]">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-[#64020e] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-all"
            aria-label="Close cart"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {totalItems > 0 && (
          <div className="px-6 py-3 bg-[#fdf2f2] border-b border-[#f5e5e5]">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-[#737373]">
                {remaining > 0
                  ? <><span className="font-semibold text-[#64020e]">${remaining.toFixed(0)}</span> away from free shipping</>
                  : <span className="text-[#166534] font-semibold">✓ You qualify for free shipping!</span>
                }
              </p>
            </div>
            <div className="h-1.5 bg-[#f5e5e5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#64020e] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-5">
              <div className="w-20 h-20 bg-[#f5f5f5] rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-[#d4d4d4]" />
              </div>
              <div>
                <p className="font-medium text-[#1a0508] mb-1">Your cart is empty</p>
                <p className="text-sm text-[#737373]">Add some items to get started</p>
              </div>
              <button
                onClick={closeCart}
                className="btn-dark text-sm px-6 py-2.5"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b border-[#f5f5f5] last:border-0">
                  <Link to={`/product/${item.id}`} onClick={closeCart} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-22 object-cover bg-[#f5f5f5] rounded-xl"
                      style={{ width: '72px', height: '88px' }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold mb-0.5">
                          {item.category}
                        </p>
                        <Link
                          to={`/product/${item.id}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-[#1a0508] hover:text-[#64020e] transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#737373] mt-0.5">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-[#1a0508]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-[#1a0508]">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#f5f5f5] space-y-3 bg-white">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-[#737373]">Subtotal</span>
              <span className="text-lg font-semibold text-[#1a0508]">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full btn-brand justify-center py-3.5 text-sm font-semibold tracking-wide">
              Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={closeCart}
              className="w-full btn-outline justify-center py-3 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
