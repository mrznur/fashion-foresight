import { Package, Heart, MapPin, CreditCard, Trash2, ShoppingCart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { fetchUserOrders, type DbOrder } from '../../lib/db';
import { useCurrency } from '../../lib/useCurrency';

const STATUS_STYLES: Record<string, string> = {
  delivered:  'bg-green-100 text-green-700',
  shipped:    'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  pending:    'bg-gray-100 text-gray-600',
  cancelled:  'bg-red-100 text-red-600',
};

export function UserDashboard() {
  const { user } = useAuth();
  const { items: wishlistItems, toggle } = useWishlist();
  const { addItem } = useCart();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'payment'>('orders');
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetchUserOrders(user.id)
      .then(setOrders)
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (!user) return null;

  const navItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ] as const;

  return (
    <div className="min-h-screen bg-[#fafafa] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-2">Dashboard</p>
          <h1 className="text-3xl font-semibold text-[#1a0508] mb-1">My Account</h1>
          <p className="text-sm text-[#737373]">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f5f5f5]">
                <div className="w-14 h-14 bg-[#64020e] text-white rounded-2xl flex items-center justify-center text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a0508] truncate">{user.name}</p>
                  <p className="text-xs text-[#737373] truncate">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-sm font-medium ${
                      activeTab === id ? 'bg-[#64020e] text-white' : 'text-[#737373] hover:bg-[#f5f5f5] hover:text-[#1a0508]'
                    }`}>
                    <Icon className="w-4 h-4" />
                    {label}
                    {id === 'wishlist' && wishlistItems.length > 0 && (
                      <span className={`ml-auto text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                        activeTab === id ? 'bg-white text-[#64020e]' : 'bg-[#64020e] text-white'
                      }`}>
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl border border-[#e5e5e5]">
                <div className="p-6 border-b border-[#f5f5f5]">
                  <h2 className="text-lg font-semibold text-[#1a0508]">Recent Orders</h2>
                </div>
                <div className="p-6 space-y-4">
                  {ordersLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-7 h-7 border-2 border-[#f5f5f5] border-t-[#64020e] rounded-full animate-spin" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-7 h-7 text-[#d4d4d4]" />
                      </div>
                      <p className="font-medium text-[#1a0508] mb-1">No orders yet</p>
                      <p className="text-sm text-[#737373] mb-6">Your order history will appear here</p>
                      <Link to="/shop" className="btn-dark inline-flex text-sm px-6 py-2.5">Start Shopping</Link>
                    </div>
                  ) : (
                    <>
                      {orders.map((order) => {
                        const itemCount = order.items?.length ?? 0;
                        const statusKey = order.status?.toLowerCase() ?? 'pending';
                        const badgeClass = STATUS_STYLES[statusKey] ?? 'bg-gray-100 text-gray-600';
                        const dateStr = order.created_at
                          ? new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                          : '—';
                        return (
                          <div key={order.id} className="flex gap-4 p-4 border border-[#e5e5e5] rounded-2xl hover:border-[#64020e]/30 hover:shadow-md transition-all duration-200">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm font-semibold text-[#1a0508]">Order #{order.id.slice(0, 8)}</p>
                                  <p className="text-xs text-[#737373]">{dateStr}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full capitalize ${badgeClass}`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-xs text-[#737373] mb-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                              <p className="text-base font-bold text-[#1a0508]">{format(order.total)}</p>
                            </div>
                          </div>
                        );
                      })}
                      <Link to="/shop" className="flex items-center justify-center gap-2 py-3 text-sm text-[#64020e] hover:gap-3 transition-all font-medium">
                        Continue Shopping <ChevronRight className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-[#e5e5e5]">
                <div className="p-6 border-b border-[#f5f5f5] flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#1a0508]">My Wishlist</h2>
                  <span className="text-xs text-[#737373] font-medium">{wishlistItems.length} items</span>
                </div>
                <div className="p-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-7 h-7 text-[#d4d4d4]" />
                      </div>
                      <p className="font-medium text-[#1a0508] mb-1">Your wishlist is empty</p>
                      <p className="text-sm text-[#737373] mb-6">Save items you love for later</p>
                      <Link to="/shop" className="btn-dark inline-flex text-sm px-6 py-2.5">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="group border border-[#e5e5e5] rounded-2xl overflow-hidden hover:border-[#64020e]/30 hover:shadow-md transition-all duration-200">
                          <Link to={`/product/${item.id}`} className="block aspect-square overflow-hidden bg-[#f5f5f5]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </Link>
                          <div className="p-4">
                            <p className="text-[10px] text-[#64020e] uppercase tracking-widest font-semibold mb-1">{item.category}</p>
                            <Link to={`/product/${item.id}`} className="text-sm font-medium text-[#1a0508] hover:text-[#64020e] transition-colors block mb-1 line-clamp-1">{item.name}</Link>
                            <p className="text-sm font-semibold text-[#1a0508] mb-3">{format(item.price)}</p>
                            <div className="flex gap-2">
                              <button onClick={() => { addItem({ ...item, size: 'M' }); toast.success('Added to cart'); }}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a0508] text-white py-2 rounded-xl hover:bg-[#1a1a1a] transition-colors text-xs font-medium">
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add to Cart
                              </button>
                              <button onClick={() => toggle(item)}
                                className="w-9 h-9 flex items-center justify-center border border-[#e5e5e5] hover:border-[#64020e] hover:text-[#64020e] transition-colors rounded-xl" aria-label="Remove">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl border border-[#e5e5e5]">
                <div className="p-6 border-b border-[#f5f5f5]">
                  <h2 className="text-lg font-semibold text-[#1a0508]">Saved Addresses</h2>
                </div>
                <div className="p-6">
                  <div className="border-2 border-dashed border-[#e5e5e5] rounded-2xl p-12 text-center">
                    <div className="w-14 h-14 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-6 h-6 text-[#d4d4d4]" />
                    </div>
                    <p className="font-medium text-[#1a0508] mb-1">No saved addresses</p>
                    <p className="text-sm text-[#737373] mb-5">Add an address for faster checkout</p>
                    <button className="btn-dark text-sm px-6 py-2.5">Add Address</button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl border border-[#e5e5e5]">
                <div className="p-6 border-b border-[#f5f5f5]">
                  <h2 className="text-lg font-semibold text-[#1a0508]">Payment Methods</h2>
                </div>
                <div className="p-6">
                  <div className="border-2 border-dashed border-[#e5e5e5] rounded-2xl p-12 text-center">
                    <div className="w-14 h-14 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-6 h-6 text-[#d4d4d4]" />
                    </div>
                    <p className="font-medium text-[#1a0508] mb-1">No saved payment methods</p>
                    <p className="text-sm text-[#737373] mb-5">Add a payment method for faster checkout</p>
                    <button className="btn-dark text-sm px-6 py-2.5">Add Payment Method</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
