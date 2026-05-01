import { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, CheckCircle, Loader2, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router';
import { useCurrency } from '../../lib/useCurrency';
import { createOrder } from '../../lib/db';
import { toast } from 'sonner';

type Step = 'cart' | 'checkout' | 'confirmed';

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const { format, freeShippingThreshold } = useCurrency();

  const [step, setStep] = useState<Step>('cart');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [note, setNote] = useState('');

  const remaining = freeShippingThreshold - totalPrice;
  const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

  const handleCheckout = () => {
    setStep('checkout');
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const guestInfo = !user ? { name: guestName.trim(), phone: guestPhone.trim() } : undefined;
      const shippingAddress = { address: address.trim(), city: city.trim(), note: note.trim() };
      const { data, error } = await createOrder(
        user?.id ?? null,
        items,
        totalPrice,
        guestInfo,
        shippingAddress
      );
      if (error || !data) {
        toast.error('Failed to place order. Please try again.');
        return;
      }
      clearCart();
      setOrderId(data.id.slice(0, 8).toUpperCase());
      setStep('confirmed');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !guestName.trim()) { toast.error('Please enter your name'); return; }
    if (!user && !guestPhone.trim()) { toast.error('Please enter your phone number'); return; }
    if (!address.trim()) { toast.error('Please enter your delivery address'); return; }
    if (!city.trim()) { toast.error('Please enter your city'); return; }
    placeOrder();
  };

  const handleClose = () => {
    setStep('cart');
    setGuestName('');
    setGuestPhone('');
    setAddress('');
    setCity('');
    setNote('');
    setOrderId('');
    closeCart();
  };

  const inputCls = "w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-xl text-sm text-[#1a0508] placeholder:text-[#d4d4d4] focus:outline-none focus:border-[#64020e] transition-colors";

  return (
    <>
      {isCartOpen && <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={handleClose} />}

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f5f5f5]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#1a0508]" />
            <h2 className="text-base font-semibold text-[#1a0508]">
              {step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Checkout' : 'Order Confirmed'}
            </h2>
            {step === 'cart' && totalItems > 0 && (
              <span className="bg-[#64020e] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-all" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Confirmed ── */}
        {step === 'confirmed' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-5">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#1a0508] mb-1">Order Placed!</h3>
              <p className="text-sm text-[#7a5c60] mb-1">Order #{orderId}</p>
              <p className="text-sm text-[#737373] leading-relaxed">
                We'll contact you shortly to confirm delivery details.
              </p>
            </div>
            <button onClick={handleClose} className="btn-brand px-8 py-3 text-sm">Continue Shopping</button>
            {user && (
              <Link to="/dashboard" onClick={handleClose} className="text-sm text-[#64020e] hover:underline font-medium">
                View Order History
              </Link>
            )}
          </div>
        )}

        {/* ── Checkout ── */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 px-6 py-5 space-y-4">

              {/* Guest contact info — only if not signed in */}
              {!user && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#7a5c60] uppercase tracking-wider">Contact Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="co-name" className="block text-xs font-semibold text-[#1a0508] mb-1">Full Name *</label>
                      <input id="co-name" name="co-name" type="text" value={guestName} onChange={e => setGuestName(e.target.value)}
                        placeholder="Your full name" className={inputCls} required />
                    </div>
                    <div>
                      <label htmlFor="co-phone" className="block text-xs font-semibold text-[#1a0508] mb-1">Phone *</label>
                      <input id="co-phone" name="co-phone" type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                        placeholder="+880 1XXX-XXXXXX" className={inputCls} required />
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery address */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#7a5c60] uppercase tracking-wider">Delivery Address</p>
                <div>
                  <label htmlFor="co-address" className="block text-xs font-semibold text-[#1a0508] mb-1">Street Address *</label>
                  <input id="co-address" name="co-address" type="text" value={address} onChange={e => setAddress(e.target.value)}
                    placeholder="House no, road, area" className={inputCls} required />
                </div>
                <div>
                  <label htmlFor="co-city" className="block text-xs font-semibold text-[#1a0508] mb-1">City / District *</label>
                  <input id="co-city" name="co-city" type="text" value={city} onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Dhaka" className={inputCls} required />
                </div>
                <div>
                  <label htmlFor="co-note" className="block text-xs font-semibold text-[#1a0508] mb-1">Delivery Note <span className="font-normal text-[#7a5c60]">(optional)</span></label>
                  <input id="co-note" name="co-note" type="text" value={note} onChange={e => setNote(e.target.value)}
                    placeholder="e.g. Call before delivery" className={inputCls} />
                </div>
              </div>

              {/* Order summary */}
              <div className="border-t border-[#f5f5f5] pt-4 space-y-2">
                <p className="text-xs font-bold text-[#7a5c60] uppercase tracking-wider mb-3">Order Summary</p>
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#737373] truncate mr-2">{item.name} <span className="text-xs">×{item.quantity} ({item.size})</span></span>
                    <span className="font-medium text-[#1a0508] flex-shrink-0">{format(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold text-[#1a0508] border-t border-[#f5f5f5] pt-2 mt-2">
                  <span>Total</span>
                  <span>{format(totalPrice)}</span>
                </div>
              </div>

              {!user && (
                <div className="bg-[#fdf2f2] rounded-xl p-3 text-xs text-[#7a5c60]">
                  <span className="font-semibold text-[#1a0508]">Sign in</span> to save your order history and get faster checkout.
                </div>
              )}
            </div>

            <div className="px-6 pb-6 space-y-3 border-t border-[#f5f5f5] pt-4">
              <button type="submit" disabled={placing} className="w-full btn-brand justify-center py-3.5 text-sm font-semibold disabled:opacity-60">
                {placing ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : <>Confirm Order <ArrowRight className="w-4 h-4" /></>}
              </button>
              <button type="button" onClick={() => setStep('cart')} className="w-full btn-outline justify-center py-3 text-sm">
                Back to Cart
              </button>
            </div>
          </form>
        )}

        {/* ── Cart ── */}
        {step === 'cart' && (
          <>
            {totalItems > 0 && (
              <div className="px-6 py-3 bg-[#fdf2f2] border-b border-[#f5e5e5]">
                <p className="text-xs text-[#737373] mb-1.5">
                  {remaining > 0
                    ? <><span className="font-semibold text-[#64020e]">{format(remaining)}</span> away from free shipping</>
                    : <span className="text-[#166534] font-semibold">✓ You qualify for free shipping!</span>
                  }
                </p>
                <div className="h-1.5 bg-[#f5e5e5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#64020e] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

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
                  <button onClick={closeCart} className="btn-dark text-sm px-6 py-2.5">Continue Shopping</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b border-[#f5f5f5] last:border-0">
                      <Link to={`/product/${item.id}`} onClick={closeCart} className="flex-shrink-0">
                        <img src={item.image} alt={item.name} className="object-cover bg-[#f5f5f5] rounded-xl" style={{ width: '72px', height: '88px' }} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold mb-0.5">{item.category}</p>
                            <Link to={`/product/${item.id}`} onClick={closeCart} className="text-sm font-medium text-[#1a0508] hover:text-[#64020e] transition-colors line-clamp-2 leading-snug">
                              {item.name}
                            </Link>
                            <p className="text-xs text-[#737373] mt-0.5">Size: {item.size}</p>
                          </div>
                          <button onClick={() => removeItem(item.id, item.size)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all flex-shrink-0" aria-label="Remove">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center border border-[#e5e5e5] rounded-xl overflow-hidden">
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors" aria-label="Decrease">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-[#1a0508]">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} disabled={item.maxStock !== undefined && item.quantity >= item.maxStock} className="w-8 h-8 flex items-center justify-center text-[#737373] hover:text-[#1a0508] hover:bg-[#f5f5f5] transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Increase">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-[#1a0508]">{format(item.price * item.quantity)}</p>
                        </div>
                        {item.maxStock !== undefined && item.quantity >= item.maxStock && (
                          <p className="text-[10px] text-amber-600 mt-1">Max stock reached</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#f5f5f5] space-y-3 bg-white">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-[#737373]">Subtotal</span>
                  <span className="text-lg font-semibold text-[#1a0508]">{format(totalPrice)}</span>
                </div>
                <button onClick={handleCheckout} disabled={placing} className="w-full btn-brand justify-center py-3.5 text-sm font-semibold tracking-wide">
                  {placing ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order...</> : <>Checkout <ArrowRight className="w-4 h-4" /></>}
                </button>
                <button onClick={closeCart} className="w-full btn-outline justify-center py-3 text-sm">Continue Shopping</button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
