import { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCurrency } from '../../lib/useCurrency';
import type { CartItem } from '../context/CartContext';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface TrackedOrder {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items: CartItem[];
  guest_name: string | null;
  guest_phone: string | null;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending:    { label: 'Pending',    icon: Clock,        color: 'text-[#7a5c60]',   bg: 'bg-[#f5f0ef]' },
  processing: { label: 'Processing', icon: Package,      color: 'text-amber-700',   bg: 'bg-amber-50' },
  shipped:    { label: 'Shipped',    icon: Truck,        color: 'text-blue-700',    bg: 'bg-blue-50' },
  delivered:  { label: 'Delivered',  icon: CheckCircle,  color: 'text-emerald-700', bg: 'bg-emerald-50' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,      color: 'text-red-700',     bg: 'bg-red-50' },
};

const STEPS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

export function OrderTrackingPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { format } = useCurrency();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Search by first 8 chars of UUID (shown to customer)
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('id, status, total, created_at, items, guest_name, guest_phone')
        .ilike('id', `${trimmed}%`)
        .limit(1)
        .single();

      if (dbError || !data) {
        setError('Order not found. Please check your order ID and try again.');
        return;
      }

      setOrder(data as TrackedOrder);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STEPS.indexOf(order.status as OrderStatus) : -1;

  return (
    <div className="min-h-screen bg-white py-14 md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">Order Status</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-4">Track Your Order</h1>
          <p className="text-[#737373]">Enter your order ID to check the current status.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60]" />
            <input
              id="order-id"
              name="order-id"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter order ID (e.g. A1B2C3D4)"
              className="w-full pl-11 pr-4 py-3.5 border-2 border-[#e5e5e5] rounded-xl text-base text-[#1a0508] placeholder:text-[#d4d4d4] focus:outline-none focus:border-[#64020e] transition-colors"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-brand px-6 py-3.5 text-sm whitespace-nowrap">
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-[#fdf2f2] border border-[#f5e5e5] rounded-2xl p-5 text-center mb-8">
            <p className="text-[#64020e] font-medium">{error}</p>
          </div>
        )}

        {/* Order result */}
        {order && (
          <div className="space-y-6">

            {/* Order summary */}
            <div className="bg-white border border-[#e5e5e5] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-[#7a5c60] uppercase tracking-widest font-semibold mb-1">Order ID</p>
                  <p className="text-lg font-bold text-[#1a0508]">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-[#7a5c60] mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {(() => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const Icon = cfg.icon;
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.color}`}>
                      <Icon className="w-4 h-4" />
                      {cfg.label}
                    </span>
                  );
                })()}
              </div>

              {/* Progress bar */}
              {order.status !== 'cancelled' && (
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex flex-col items-center gap-1" style={{ width: '25%' }}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          i <= currentStepIndex
                            ? 'bg-[#64020e] text-white'
                            : 'bg-[#f5f0ef] text-[#7a5c60]'
                        }`}>
                          {i < currentStepIndex ? '✓' : i + 1}
                        </div>
                        <p className="text-[10px] text-[#7a5c60] capitalize text-center">{STATUS_CONFIG[s].label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="relative h-1.5 bg-[#f5f0ef] rounded-full mt-1">
                    <div
                      className="absolute left-0 top-0 h-full bg-[#64020e] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="space-y-3 border-t border-[#f5f5f5] pt-5">
                {(order.items ?? []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-xl bg-[#f5f5f5] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a0508] truncate">{item.name}</p>
                      <p className="text-xs text-[#7a5c60]">Size: {item.size} · Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#1a0508] flex-shrink-0">{format(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-[#f5f5f5] pt-4 mt-4">
                <span className="text-sm text-[#737373]">Total</span>
                <span className="text-lg font-bold text-[#1a0508]">{format(order.total)}</span>
              </div>
            </div>

            {/* Contact info */}
            {(order.guest_name || order.guest_phone) && (
              <div className="bg-[#faf9f8] border border-[#e5e5e5] rounded-2xl p-5">
                <p className="text-sm font-semibold text-[#1a0508] mb-3">Contact Details</p>
                {order.guest_name && <p className="text-sm text-[#737373]">Name: <span className="text-[#1a0508] font-medium">{order.guest_name}</span></p>}
                {order.guest_phone && <p className="text-sm text-[#737373] mt-1">Phone: <span className="text-[#1a0508] font-medium">{order.guest_phone}</span></p>}
              </div>
            )}

          </div>
        )}

        {/* Help */}
        {!order && !error && (
          <div className="text-center text-sm text-[#737373] mt-8">
            <p>Your order ID was shown on the confirmation screen and sent to your contact.</p>
            <p className="mt-1">Need help? <a href="/contact" className="text-[#64020e] hover:underline font-medium">Contact us</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
