import { useState, useEffect, useRef } from 'react';
import {
  Package, Users, DollarSign, TrendingUp, ShoppingBag, ArrowUpRight,
  LayoutDashboard, Settings, Bell, Search, Plus, Edit2, Trash2,
  Eye, Tag, AlertTriangle, CheckCircle, Clock, XCircle,
  ChevronDown, X, Save, BarChart2, RefreshCw, Upload,
} from 'lucide-react';
import { CATEGORIES } from '../../lib/products';
import { fetchProducts, fetchAllOrders, createProduct, updateProduct, deleteProduct, updateOrderStatus, fetchSettings, saveSettings } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { useCurrency } from '../../lib/useCurrency';
import type { Product } from '../../lib/types';
import type { DbOrder } from '../../lib/db';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'orders' | 'products' | 'customers' | 'settings';

interface AdminProduct extends Product {
  discount?: number;
  featured?: boolean;
}

const STATUS_CONFIG = {
  delivered:  { label: 'Delivered',  bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  shipped:    { label: 'Shipped',    bg: 'bg-blue-50',    text: 'text-blue-700',    icon: TrendingUp },
  processing: { label: 'Processing', bg: 'bg-amber-50',   text: 'text-amber-700',   icon: Clock },
  pending:    { label: 'Pending',    bg: 'bg-[#f5f0ef]',  text: 'text-[#7a5c60]',  icon: Clock },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-50',     text: 'text-red-700',     icon: XCircle },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, change, positive }: {
  label: string; value: string; icon: React.ElementType; change: string; positive: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8dede] p-7 hover:shadow-md transition-all duration-200"> {}
      <div className="flex items-start justify-between mb-5"> {}
        <div className="w-12 h-12 bg-[#fdf2f2] rounded-xl flex items-center justify-center"> {}
          <Icon className="w-6 h-6 text-[#64020e]" /> {}
        </div>
        <span className={`text-base font-semibold flex items-center gap-1 ${positive ? 'text-emerald-600' : 'text-red-500'}`}> {}
          <TrendingUp className="w-4 h-4" />
          {change}
        </span>
      </div>
      <p className="text-4xl font-bold text-[#1a0508] mb-2 font-display">{value}</p> {}
      <p className="text-base text-[#7a5c60] font-medium">{label}</p> {}
    </div>
  );
}

function StatusBadge({ status }: { status: DbOrder['status'] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${cfg.bg} ${cfg.text}`}> {}
      <Icon className="w-3.5 h-3.5" /> {}
      {cfg.label}
    </span>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const { format } = useCurrency();

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchAllOrders().then(setOrders);
  }, []);

  const lowStock = products.filter((p) => (p.stockCount ?? 0) <= 8);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: 'Total Revenue', value: format(totalRevenue), icon: DollarSign, change: '', positive: true },
    { label: 'Total Orders', value: String(orders.length), icon: ShoppingBag, change: '', positive: true },
    { label: 'Products', value: String(products.length), icon: Package, change: '', positive: true },
    { label: 'Low Stock', value: String(lowStock.length), icon: AlertTriangle, change: '', positive: lowStock.length === 0 },
  ];

  return (
    <div className="space-y-8">
      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
          <div className="px-7 py-5 border-b border-[#f5f0ef] flex items-center justify-between"> {}
            <h3 className="text-xl font-semibold text-[#1a0508] font-display">Recent Orders</h3> {}
            <button className="text-base text-[#64020e] font-semibold flex items-center gap-1 hover:gap-2 transition-all"> {}
              View all <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-[#f5f0ef]">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="px-7 py-5 flex items-center gap-4 hover:bg-[#faf9f8] transition-colors">
                <div className="w-10 h-10 bg-[#fdf2f2] rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-5 h-5 text-[#64020e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-[#1a0508] truncate">{order.customer_name ?? 'Guest'}</p>
                  <p className="text-sm text-[#7a5c60] truncate">{order.items.length} items</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-[#1a0508]">{format(order.total)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="py-12 text-center text-[#7a5c60]">No orders yet</div>
            )}
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
          <div className="px-7 py-5 border-b border-[#f5f0ef] flex items-center gap-2"> {}
            <AlertTriangle className="w-5 h-5 text-amber-500" /> {}
            <h3 className="text-xl font-semibold text-[#1a0508] font-display">Low Stock</h3> {}
            <span className="ml-auto bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full"> {}
              {lowStock.length}
            </span>
          </div>
          <div className="divide-y divide-[#f5f0ef]">
            {lowStock.map((p) => (
              <div key={p.id} className="px-7 py-4 flex items-center gap-3 hover:bg-[#faf9f8] transition-colors"> {}
                <img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" /> {}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-[#1a0508] truncate">{p.name}</p> {}
                  <p className="text-sm text-[#7a5c60]">{p.category}</p> {}
                </div>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-lg flex-shrink-0 ${
                  (p.stockCount ?? 0) <= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}> {}
                  {p.stockCount} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const [pendingStatus, setPendingStatus] = useState<DbOrder['status'] | null>(null);
  const { format } = useCurrency();

  useEffect(() => {
    fetchAllOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      (o.customer_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openOrder = (order: DbOrder) => {
    setSelectedOrder(order);
    setPendingStatus(order.status);
  };

  const saveStatus = async () => {
    if (!selectedOrder || !pendingStatus) return;
    await updateOrderStatus(selectedOrder.id, pendingStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: pendingStatus } : o))
    );
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60]" />
          <input
            id="orders-search"
            name="orders-search"
            type="text"
            placeholder="Search orders, customers, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] placeholder:text-[#7a5c60]/50 focus:outline-none focus:border-[#64020e] transition-colors"
          />
        </div>
        <div className="relative">
          <select
            id="orders-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] bg-white focus:outline-none focus:border-[#64020e] transition-colors cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60] pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#faf9f8] border-b border-[#e8dede]">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs uppercase tracking-widest font-bold text-[#7a5c60]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f0ef]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf9f8] transition-colors">
                  <td className="px-5 py-4 text-sm font-bold text-[#64020e]">#{order.id.slice(0, 8)}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#1a0508]">{order.customer_name ?? 'Guest'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#1a0508] font-medium">{order.items.length}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#1a0508]">{format(order.total)}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4 text-sm text-[#7a5c60]">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => openOrder(order)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all"
                      aria-label="View order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-[#e8dede] mx-auto mb-3" />
            <p className="text-[#7a5c60]">{orders.length === 0 ? 'No orders yet' : 'No orders match your search'}</p>
          </div>
        )}
        {loading && (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-[#f5f5f5] border-t-[#64020e] rounded-full animate-spin mx-auto" />
          </div>
        )}
      </div>

      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="flex items-center justify-between px-7 py-5 border-b border-[#f5f0ef]">
                <div>
                  <p className="text-overline">Order Details</p>
                  <h3 className="text-xl font-semibold text-[#1a0508] mt-0.5">#{selectedOrder.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-7 py-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Customer', value: selectedOrder.customer_name ?? 'Guest' },
                    { label: 'Items', value: String(selectedOrder.items.length) },
                    { label: 'Total', value: format(selectedOrder.total) },
                    { label: 'Date', value: new Date(selectedOrder.created_at).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-[#7a5c60] font-semibold uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-medium text-[#1a0508] break-all">{value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-[#7a5c60] font-semibold uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(STATUS_CONFIG) as DbOrder['status'][]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPendingStatus(s)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                          pendingStatus === s
                            ? 'border-[#64020e] bg-[#64020e] text-white'
                            : 'border-[#e8dede] text-[#7a5c60] hover:border-[#64020e] hover:text-[#64020e]'
                        }`}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-7 pb-6 flex gap-3">
                <button onClick={saveStatus} className="btn-brand flex-1 justify-center py-3 text-sm">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                <button onClick={() => setSelectedOrder(null)} className="btn-outline flex-1 justify-center py-3 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { format } = useCurrency();

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data.map((p) => ({ ...p, discount: p.discount ?? 0, featured: p.isNew ?? false })));
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = async (updated: AdminProduct) => {
    const { data } = await updateProduct(updated.id, updated);
    if (data) setProducts((prev) => prev.map((p) => p.id === updated.id ? { ...data, discount: data.discount ?? 0 } : p));
    setEditingProduct(null);
  };

  return (
    <div className="space-y-5">
      {}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60]" />
          <input
            id="admin-products-search"
            name="products-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] placeholder:text-[#7a5c60]/50 focus:outline-none focus:border-[#64020e] transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] bg-white focus:outline-none focus:border-[#64020e] transition-colors cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60] pointer-events-none" />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-brand px-5 py-2.5 text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-[#e8dede] overflow-hidden hover:shadow-md transition-all duration-200 group">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0ef]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 flex gap-2">
                {product.isNew && (
                  <span className="bg-[#64020e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                )}
                {(product.discount ?? 0) > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{product.discount}%</span>
                )}
              </div>
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-[#64020e] shadow-md hover:bg-[#64020e] hover:text-white transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-overline mb-1">{product.category}</p>
              <p className="text-base font-semibold text-[#1a0508] mb-1 truncate">{product.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  {(product.discount ?? 0) > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#64020e]">
                        {format(Math.round(product.price * (1 - (product.discount ?? 0) / 100)))}
                      </span>
                      <span className="text-sm text-[#7a5c60] line-through">{format(product.price)}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-[#1a0508]">{format(product.price)}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  (product.stockCount ?? 0) <= 3
                    ? 'bg-red-100 text-red-700'
                    : (product.stockCount ?? 0) <= 8
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {product.stockCount} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
        />
      )}

      {}
      {showAddModal && (
        <ProductModal
          product={{
            id: Date.now(),
            name: '',
            price: 0,
            image: '',
            gender: 'men',
            category: 'Suits',
            description: '',
            sizes: [],
            inStock: true,
            stockCount: 0,
            discount: 0,
            featured: false,
          }}
          onSave={async (p) => {
            const { data } = await createProduct(p);
            if (data) setProducts((prev) => [...prev, { ...data, discount: 0 }]);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
          title="Add New Product"
        />
      )}
    </div>
  );
}

// ─── Product Modal ────────────────────────────────────────────────────────────

function ProductModal({ product, onSave, onClose, title }: {
  product: AdminProduct;
  onSave: (p: AdminProduct) => void;
  onClose: () => void;
  title: string;
}) {
  const [form, setForm] = useState<AdminProduct>({ ...product });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { format } = useCurrency();

  const set = (key: keyof AdminProduct, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const currentCount = (form.images ?? []).filter(Boolean).length;
    const remaining = 6 - currentCount;
    const toUpload = files.slice(0, remaining);

    if (files.length > remaining) {
      alert(`You can only add ${remaining} more image(s). Max 6 total.`);
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) { alert(`${file.name} is over 5MB, skipped.`); continue; }

        const ext = file.name.split('.').pop();
        const safeName = (form.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const filename = `${safeName}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data, error } = await supabase.storage
          .from('products')
          .upload(filename, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(data.path);

        uploaded.push(publicUrl);
      }

      const newImages = [...(form.images ?? []).filter(Boolean), ...uploaded];
      setForm((prev) => ({
        ...prev,
        images: newImages,
        image: newImages[0] ?? prev.image, // first image is the main one
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err);
      alert('Upload failed: ' + msg);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = (form.images ?? []).filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      images: newImages,
      image: newImages[0] ?? '',
    }));
  };

  const inputCls = "w-full px-4 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] placeholder:text-[#7a5c60]/40 focus:outline-none focus:border-[#64020e] transition-colors bg-white";

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#f5f0ef] sticky top-0 bg-white z-10">
            <div>
              <p className="text-overline">Products</p>
              <h3 className="text-xl font-semibold text-[#1a0508] mt-0.5">{title}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-all">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="px-7 py-6 space-y-5">
            {/* Image upload — 3 min, 6 max */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-[#1a0508]">
                  Product Images
                  <span className="ml-2 text-xs font-normal text-[#7a5c60]">
                    {(form.images ?? []).filter(Boolean).length}/6
                    {(form.images ?? []).filter(Boolean).length < 3 && (
                      <span className="text-amber-600"> · min 3 required</span>
                    )}
                  </span>
                </label>
                {(form.images ?? []).filter(Boolean).length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#64020e] border border-[#64020e] rounded-lg hover:bg-[#fdf2f2] transition-colors disabled:opacity-50"
                  >
                    {uploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    {uploading ? 'Uploading...' : 'Add Photos'}
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="grid grid-cols-3 gap-2">
                {/* Existing images */}
                {(form.images ?? []).filter(Boolean).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#f5f5f5] group">
                    <img src={img} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#64020e] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">MAIN</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 3 - (form.images ?? []).filter(Boolean).length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#e8dede] flex flex-col items-center justify-center cursor-pointer hover:border-[#64020e] transition-colors bg-[#faf9f8]"
                  >
                    <Upload className="w-4 h-4 text-[#7a5c60] mb-1" />
                    <span className="text-[10px] text-[#7a5c60]">Add photo</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#7a5c60] mt-2">First image is the main display image. Max 5MB per photo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-name" className="block text-sm font-semibold text-[#1a0508] mb-2">Product Name</label>
                <input id="product-name" name="product-name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="e.g. Classic Black Suit" />
              </div>
              <div>
                <label htmlFor="product-gender" className="block text-sm font-semibold text-[#1a0508] mb-2">Gender</label>
                <div className="relative">
                  <select id="product-gender" value={form.gender} onChange={(e) => set('gender', e.target.value)} className={`${inputCls} appearance-none pr-9 cursor-pointer`}>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60] pointer-events-none" />
                </div>
              </div>
              <div>
                <label htmlFor="product-category" className="block text-sm font-semibold text-[#1a0508] mb-2">Category</label>
                <div className="relative">
                  <select id="product-category" value={form.category} onChange={(e) => set('category', e.target.value)} className={`${inputCls} appearance-none pr-9 cursor-pointer`}>
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a5c60] pointer-events-none" />
                </div>
              </div>
              <div>
                <label htmlFor="product-price" className="block text-sm font-semibold text-[#1a0508] mb-2">Price (BDT)</label>
                <input id="product-price" name="product-price" type="number" min={0} value={form.price} onChange={(e) => set('price', Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label htmlFor="product-discount" className="block text-sm font-semibold text-[#1a0508] mb-2">Discount (%)</label>
                <input id="product-discount" name="product-discount" type="number" min={0} max={90} value={form.discount ?? 0} onChange={(e) => set('discount', Number(e.target.value))} className={inputCls} placeholder="0" />
              </div>
              <div>
                <label htmlFor="product-stock" className="block text-sm font-semibold text-[#1a0508] mb-2">Stock Count</label>
                <input id="product-stock" name="product-stock" type="number" min={0} value={form.stockCount ?? 0} onChange={(e) => set('stockCount', Number(e.target.value))} className={inputCls} />
              </div>
              <div className="flex flex-col gap-3 pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set('inStock', !form.inStock)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form.inStock ? 'bg-[#64020e]' : 'bg-[#e8dede]'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-[#1a0508]">In Stock</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set('isNew', !form.isNew)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${form.isNew ? 'bg-[#64020e]' : 'bg-[#e8dede]'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isNew ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm font-medium text-[#1a0508]">Mark as New</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="product-description" className="block text-sm font-semibold text-[#1a0508] mb-2">Description</label>
              <textarea
                id="product-description"
                rows={3}
                value={form.description ?? ''}
                onChange={(e) => set('description', e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Product description..."
              />
            </div>

            <div>
              <label htmlFor="product-sizes" className="block text-sm font-semibold text-[#1a0508] mb-2">Available Sizes (comma-separated)</label>
              <input
                id="product-sizes"
                name="product-sizes"
                type="text"
                value={(form.sizes ?? []).join(', ')}
                onChange={(e) => set('sizes', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                className={inputCls}
                placeholder="XS, S, M, L, XL, XXL"
              />
            </div>

            {}
            {(form.discount ?? 0) > 0 && form.price > 0 && (
              <div className="bg-[#fdf2f2] border border-[#e8dede] rounded-xl p-4 flex items-center gap-3">
                <Tag className="w-5 h-5 text-[#64020e] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#1a0508]">Discount Preview</p>
                  <p className="text-sm text-[#7a5c60]">
                    ${form.price} → <span className="font-bold text-[#64020e]">${(form.price * (1 - (form.discount ?? 0) / 100)).toFixed(2)}</span>
                    {' '}(saving ${(form.price * (form.discount ?? 0) / 100).toFixed(2)})
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="px-7 pb-7 flex gap-3">
            <button onClick={() => onSave(form)} className="btn-brand flex-1 justify-center py-3 text-sm">
              <Save className="w-4 h-4" /> Save Product
            </button>
            <button onClick={onClose} className="btn-outline flex-1 justify-center py-3 text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Customers Tab ────────────────────────────────────────────────────────────

function CustomersTab() {
  const [customers, setCustomers] = useState<Array<{
    id: string; name: string; role: string; created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, name, role, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        // Also get emails from auth — we only have what's in profiles
        setCustomers(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#f5f0ef] flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1a0508]">All Customers</h3>
        <span className="text-sm text-[#7a5c60]">{customers.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#faf9f8] border-b border-[#f5f0ef]">
            <tr>
              {['Customer', 'Role', 'Joined'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs uppercase tracking-widest font-bold text-[#7a5c60]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f0ef]">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-[#faf9f8] transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#fdf2f2] rounded-full flex items-center justify-center text-sm font-bold text-[#64020e] flex-shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-[#1a0508]">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${
                    c.role === 'admin' ? 'bg-[#fdf2f2] text-[#64020e]' : 'bg-emerald-50 text-emerald-700'
                  }`}>{c.role}</span>
                </td>
                <td className="px-5 py-4 text-sm text-[#7a5c60]">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && customers.length === 0 && (
        <div className="py-16 text-center">
          <Users className="w-10 h-10 text-[#e8dede] mx-auto mb-3" />
          <p className="text-[#7a5c60]">No customers yet</p>
        </div>
      )}
      {loading && (
        <div className="py-16 text-center">
          <div className="w-6 h-6 border-2 border-[#f5f5f5] border-t-[#64020e] rounded-full animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    store_name: '',
    store_email: '',
    support_phone: '',
    store_address: '',
    free_shipping_threshold: '',
    default_currency: '',
    return_window: '',
  });

  useEffect(() => {
    fetchSettings().then((data) => {
      if (Object.keys(data).length > 0) setValues((prev) => ({ ...prev, ...data }));
    });
  }, []);

  const set = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveSettings(values);
    setSaving(false);
    if (result.error) {
      console.error('[settings] save failed:', result.error);
      alert('Save failed: ' + result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full px-4 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] placeholder:text-[#7a5c60]/40 focus:outline-none focus:border-[#64020e] transition-colors bg-white";

  const sections = [
    {
      title: 'Store Information',
      fields: [
        { label: 'Store Name',     key: 'store_name',     placeholder: 'Fashion Foresight',              type: 'text'  },
        { label: 'Store Email',    key: 'store_email',    placeholder: 'hello@fashionforesight.com',     type: 'email' },
        { label: 'Support Phone',  key: 'support_phone',  placeholder: '+1 (555) 000-0000',              type: 'tel'   },
        { label: 'Store Address',  key: 'store_address',  placeholder: 'Via Montenapoleone 12, Milan',   type: 'text'  },
      ],
    },
    {
      title: 'Shipping & Orders',
      fields: [
        { label: 'Free Shipping Threshold ($)', key: 'free_shipping_threshold', placeholder: '200', type: 'number' },
        { label: 'Default Currency',            key: 'default_currency',        placeholder: 'USD', type: 'text'   },
        { label: 'Return Window (days)',         key: 'return_window',           placeholder: '30',  type: 'number' },
      ],
    },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      {sections.map(({ title, fields }) => (
        <div key={title} className="bg-white rounded-2xl border border-[#e8dede] p-6">
          <h3 className="text-lg font-semibold text-[#1a0508] mb-5">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, key, placeholder, type }) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-semibold text-[#1a0508] mb-1.5">{label}</label>
                <input
                  id={key}
                  name={key}
                  type={type}
                  placeholder={placeholder}
                  value={values[key] ?? ''}
                  onChange={(e) => set(key, e.target.value)}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`btn-brand px-8 py-3 text-sm ${saved ? 'bg-emerald-600' : ''}`}
      >
        {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
         : saved  ? <><CheckCircle className="w-4 h-4" /> Saved!</>
         : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>
    </div>
  );
}

// ─── Enhanced Admin Dashboard with Full CRUD Operations ──────────────────────

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<string | null>(
    () => localStorage.getItem('admin_last_checked_orders')
  );

  // Poll for new orders every 30 seconds
  useEffect(() => {
    const check = async () => {
      const orders = await fetchAllOrders();
      const unseen = orders.filter(o =>
        !lastChecked || new Date(o.created_at) > new Date(lastChecked)
      );
      setNewOrderCount(unseen.length);
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [lastChecked]);

  const handleBellClick = () => {
    const now = new Date().toISOString();
    localStorage.setItem('admin_last_checked_orders', now);
    setLastChecked(now);
    setNewOrderCount(0);
    setActiveTab('orders');
  };

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
    { id: 'orders',     label: 'Orders',     icon: ShoppingBag },
    { id: 'products',   label: 'Products',   icon: Package },
    { id: 'customers',  label: 'Customers',  icon: Users },
    { id: 'settings',   label: 'Settings',   icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f8]">
      <div className="bg-white border-b border-[#e8dede] px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <p className="text-overline font-accent">Fashion Foresight</p>
            <h1 className="text-3xl font-semibold text-[#1a0508] mt-1 font-display">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBellClick}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all relative"
              aria-label={`Notifications${newOrderCount > 0 ? ` (${newOrderCount} new)` : ''}`}
            >
              <Bell className="w-5 h-5" />
              {newOrderCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#64020e] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {newOrderCount > 9 ? '9+' : newOrderCount}
                </span>
              )}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 bg-white border border-[#e8dede] rounded-2xl p-2 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeTab === id
                  ? 'bg-[#64020e] text-white shadow-sm'
                  : 'text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2]'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {id === 'orders' && newOrderCount > 0 && (
                <span className="bg-[#64020e] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {newOrderCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'orders'    && <OrdersTab />}
        {activeTab === 'products'  && <ProductsTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'settings'  && <SettingsTab />}
      </div>
    </div>
  );
}
