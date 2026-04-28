import { useState } from 'react';
import {
  Package, Users, DollarSign, TrendingUp, ShoppingBag, ArrowUpRight,
  LayoutDashboard, Settings, Bell, Search, Plus, Edit2, Trash2,
  Eye, Tag, AlertTriangle, CheckCircle, Clock, XCircle,
  ChevronDown, Upload, X, Save, BarChart2, RefreshCw,
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../../lib/products';
import type { Product } from '../../lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'orders' | 'products' | 'customers' | 'settings';

interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  product: string;
}

interface AdminProduct extends Product {
  discount?: number;
  featured?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ORDERS: AdminOrder[] = [
  { id: '1001', customer: 'James Harrington', email: 'james@example.com', items: 2, total: 1548, status: 'delivered', date: '2026-04-25', product: 'Classic Black Suit' },
  { id: '1002', customer: 'Michael Chen', email: 'mchen@example.com', items: 1, total: 159, status: 'shipped', date: '2026-04-26', product: 'Tailored White Shirt' },
  { id: '1003', customer: 'David Okafor', email: 'david.o@example.com', items: 3, total: 1227, status: 'processing', date: '2026-04-27', product: 'Biker Jacket Outfit' },
  { id: '1004', customer: 'William Torres', email: 'wtorres@example.com', items: 1, total: 349, status: 'pending', date: '2026-04-27', product: 'Minimalist Watch' },
  { id: '1005', customer: 'Robert Kim', email: 'rkim@example.com', items: 2, total: 878, status: 'delivered', date: '2026-04-24', product: 'Light Summer Suit' },
  { id: '1006', customer: 'Thomas Müller', email: 'tmuller@example.com', items: 1, total: 429, status: 'cancelled', date: '2026-04-23', product: 'Leather Boots' },
];

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
    <div className="bg-white rounded-2xl border border-[#e8dede] p-7 hover:shadow-md transition-all duration-200"> {/* Increased padding */}
      <div className="flex items-start justify-between mb-5"> {/* Increased margin */}
        <div className="w-12 h-12 bg-[#fdf2f2] rounded-xl flex items-center justify-center"> {/* Increased size */}
          <Icon className="w-6 h-6 text-[#64020e]" /> {/* Increased icon size */}
        </div>
        <span className={`text-base font-semibold flex items-center gap-1 ${positive ? 'text-emerald-600' : 'text-red-500'}`}> {/* Increased font size */}
          <TrendingUp className="w-4 h-4" />
          {change}
        </span>
      </div>
      <p className="text-4xl font-bold text-[#1a0508] mb-2 font-display">{value}</p> {/* Increased font size and margin */}
      <p className="text-base text-[#7a5c60] font-medium">{label}</p> {/* Increased font size */}
    </div>
  );
}

function StatusBadge({ status }: { status: AdminOrder['status'] }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${cfg.bg} ${cfg.text}`}> {/* Increased padding and font size */}
      <Icon className="w-3.5 h-3.5" /> {/* Increased icon size */}
      {cfg.label}
    </span>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const stats = [
    { label: 'Total Revenue', value: '$48,320', icon: DollarSign, change: '+12.5%', positive: true },
    { label: 'Total Orders', value: '312', icon: ShoppingBag, change: '+8.2%', positive: true },
    { label: 'Products', value: String(PRODUCTS.length), icon: Package, change: '+3', positive: true },
    { label: 'Customers', value: '1,204', icon: Users, change: '+24%', positive: true },
  ];

  const lowStock = PRODUCTS.filter((p) => (p.stockCount ?? 0) <= 8);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
          <div className="px-7 py-5 border-b border-[#f5f0ef] flex items-center justify-between"> {/* Increased padding */}
            <h3 className="text-xl font-semibold text-[#1a0508] font-display">Recent Orders</h3> {/* Increased font size and added font-display */}
            <button className="text-base text-[#64020e] font-semibold flex items-center gap-1 hover:gap-2 transition-all"> {/* Increased font size */}
              View all <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-[#f5f0ef]">
            {MOCK_ORDERS.slice(0, 5).map((order) => (
              <div key={order.id} className="px-7 py-5 flex items-center gap-4 hover:bg-[#faf9f8] transition-colors"> {/* Increased padding */}
                <div className="w-10 h-10 bg-[#fdf2f2] rounded-xl flex items-center justify-center flex-shrink-0"> {/* Increased size */}
                  <ShoppingBag className="w-5 h-5 text-[#64020e]" /> {/* Increased icon size */}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-[#1a0508] truncate">{order.customer}</p> {/* Increased font size */}
                  <p className="text-sm text-[#7a5c60] truncate">{order.product}</p> {/* Increased font size */}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-[#1a0508]">${order.total}</p> {/* Increased font size */}
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
          <div className="px-7 py-5 border-b border-[#f5f0ef] flex items-center gap-2"> {/* Increased padding */}
            <AlertTriangle className="w-5 h-5 text-amber-500" /> {/* Increased icon size */}
            <h3 className="text-xl font-semibold text-[#1a0508] font-display">Low Stock</h3> {/* Increased font size and added font-display */}
            <span className="ml-auto bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full"> {/* Increased font size and padding */}
              {lowStock.length}
            </span>
          </div>
          <div className="divide-y divide-[#f5f0ef]">
            {lowStock.map((p) => (
              <div key={p.id} className="px-7 py-4 flex items-center gap-3 hover:bg-[#faf9f8] transition-colors"> {/* Increased padding */}
                <img src={p.image} alt={p.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" /> {/* Increased size */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-[#1a0508] truncate">{p.name}</p> {/* Increased font size */}
                  <p className="text-sm text-[#7a5c60]">{p.category}</p> {/* Increased font size */}
                </div>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-lg flex-shrink-0 ${
                  (p.stockCount ?? 0) <= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}> {/* Increased font size and padding */}
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) || o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Enhanced Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4"> {/* Increased gap */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a5c60]" />
          <input
            id="admin-global-search"
            name="admin-search"
            type="text"
            placeholder="Search orders, customers, products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-[#e8dede] rounded-xl text-lg text-[#1a0508] placeholder:text-[#7a5c60]/50 focus:outline-none focus:border-[#64020e] transition-colors"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 border-2 border-[#e8dede] rounded-xl text-lg text-[#1a0508] bg-white focus:outline-none focus:border-[#64020e] transition-colors cursor-pointer" /* Increased padding and font size */
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a5c60] pointer-events-none" /> {/* Increased icon size */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8dede] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#faf9f8] border-b border-[#f5f0ef]">
              <tr>
                {['Order', 'Customer', 'Product', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-sm uppercase tracking-widest font-bold text-[#7a5c60]">{h}</th> /* Increased padding and font size */
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f0ef]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf9f8] transition-colors">
                  <td className="px-6 py-5 text-base font-bold text-[#64020e]">#{order.id}</td> /* Increased padding and font size */
                  <td className="px-6 py-5"> /* Increased padding */
                    <p className="text-base font-semibold text-[#1a0508]">{order.customer}</p> /* Increased font size */
                    <p className="text-sm text-[#7a5c60]">{order.email}</p> /* Increased font size */
                  </td>
                  <td className="px-6 py-5 text-base text-[#7a5c60] max-w-[160px] truncate">{order.product}</td> /* Increased padding and font size */
                  <td className="px-6 py-5 text-base text-[#1a0508] font-medium">{order.items}</td> /* Increased padding and font size */
                  <td className="px-6 py-5 text-base font-bold text-[#1a0508]">${order.total}</td> /* Increased padding and font size */
                  <td className="px-6 py-5"><StatusBadge status={order.status} /></td> /* Increased padding */
                  <td className="px-6 py-5 text-base text-[#7a5c60]">{order.date}</td> /* Increased padding and font size */
                  <td className="px-6 py-5"> /* Increased padding */
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all" /* Increased size */
                    >
                      <Eye className="w-5 h-5" /> /* Increased icon size */
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-[#e8dede] mx-auto mb-3" />
            <p className="text-[#7a5c60]">No orders match your search</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
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
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-all">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <div className="px-7 py-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Customer', value: selectedOrder.customer },
                    { label: 'Email', value: selectedOrder.email },
                    { label: 'Product', value: selectedOrder.product },
                    { label: 'Items', value: String(selectedOrder.items) },
                    { label: 'Total', value: `$${selectedOrder.total}` },
                    { label: 'Date', value: selectedOrder.date },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-[#7a5c60] font-semibold uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-base font-medium text-[#1a0508]">{value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-[#7a5c60] font-semibold uppercase tracking-wider mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(STATUS_CONFIG) as AdminOrder['status'][]).map((s) => (
                      <button key={s} className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        selectedOrder.status === s
                          ? 'border-[#64020e] bg-[#64020e] text-white'
                          : 'border-[#e8dede] text-[#7a5c60] hover:border-[#64020e] hover:text-[#64020e]'
                      }`}>
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-7 pb-6 flex gap-3">
                <button className="btn-brand flex-1 justify-center py-3 text-sm">
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
  const [products, setProducts] = useState<AdminProduct[]>(
    PRODUCTS.map((p) => ({ ...p, discount: 0, featured: p.isNew ?? false }))
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleDelete = (id: number) => {
    if (confirm('Delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = (updated: AdminProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setEditingProduct(null);
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
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

      {/* Products Grid */}
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
                        ${(product.price * (1 - (product.discount ?? 0) / 100)).toFixed(0)}
                      </span>
                      <span className="text-sm text-[#7a5c60] line-through">${product.price}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-[#1a0508]">${product.price}</span>
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
        />
      )}

      {/* Add Product Modal */}
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
          onSave={(p) => {
            setProducts((prev) => [...prev, p]);
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

  const set = (key: keyof AdminProduct, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
            {/* Image preview */}
            <div>
              <label htmlFor="product-image-url" className="block text-sm font-semibold text-[#1a0508] mb-2">Product Image URL</label>
              <div className="flex gap-3">
                <input
                  id="product-image-url"
                  name="product-image"
                  type="text"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://..."
                  className={`${inputCls} flex-1`}
                />
                {form.image && (
                  <img src={form.image} alt="" className="w-12 h-14 object-cover rounded-xl border border-[#e8dede] flex-shrink-0" />
                )}
              </div>
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
                <label htmlFor="product-price" className="block text-sm font-semibold text-[#1a0508] mb-2">Price ($)</label>
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

            {/* Discount preview */}
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
  const customers = [
    { id: 1, name: 'James Harrington', email: 'james@example.com', orders: 4, spent: 3240, joined: '2025-01-12', status: 'active' },
    { id: 2, name: 'Michael Chen', email: 'mchen@example.com', orders: 2, spent: 808, joined: '2025-03-05', status: 'active' },
    { id: 3, name: 'David Okafor', email: 'david.o@example.com', orders: 7, spent: 5890, joined: '2024-11-20', status: 'vip' },
    { id: 4, name: 'William Torres', email: 'wtorres@example.com', orders: 1, spent: 349, joined: '2026-02-14', status: 'new' },
    { id: 5, name: 'Robert Kim', email: 'rkim@example.com', orders: 3, spent: 1876, joined: '2025-06-08', status: 'active' },
    { id: 6, name: 'Thomas Müller', email: 'tmuller@example.com', orders: 0, spent: 0, joined: '2026-04-01', status: 'inactive' },
  ];

  const statusCfg: Record<string, { bg: string; text: string }> = {
    vip:      { bg: 'bg-amber-100', text: 'text-amber-700' },
    active:   { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    new:      { bg: 'bg-blue-100', text: 'text-blue-700' },
    inactive: { bg: 'bg-[#f5f0ef]', text: 'text-[#7a5c60]' },
  };

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
              {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs uppercase tracking-widest font-bold text-[#7a5c60]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f0ef]">
            {customers.map((c) => {
              const s = statusCfg[c.status];
              return (
                <tr key={c.id} className="hover:bg-[#faf9f8] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#fdf2f2] rounded-full flex items-center justify-center text-sm font-bold text-[#64020e] flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-[#1a0508]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#7a5c60]">{c.email}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#1a0508]">{c.orders}</td>
                  <td className="px-5 py-4 text-sm font-bold text-[#1a0508]">${c.spent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-[#7a5c60]">{c.joined}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${s.bg} ${s.text}`}>{c.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full px-4 py-2.5 border-2 border-[#e8dede] rounded-xl text-base text-[#1a0508] placeholder:text-[#7a5c60]/40 focus:outline-none focus:border-[#64020e] transition-colors bg-white";

  return (
    <div className="max-w-2xl space-y-6">
      {[
        {
          title: 'Store Information',
          fields: [
            { label: 'Store Name', placeholder: 'Fashion Foresight', type: 'text' },
            { label: 'Store Email', placeholder: 'hello@fashionforesight.com', type: 'email' },
            { label: 'Support Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
            { label: 'Store Address', placeholder: 'Via Montenapoleone 12, Milan', type: 'text' },
          ],
        },
        {
          title: 'Shipping & Orders',
          fields: [
            { label: 'Free Shipping Threshold ($)', placeholder: '200', type: 'number' },
            { label: 'Default Currency', placeholder: 'USD', type: 'text' },
            { label: 'Return Window (days)', placeholder: '30', type: 'number' },
          ],
        },
      ].map(({ title, fields }) => (
        <div key={title} className="bg-white rounded-2xl border border-[#e8dede] p-6">
          <h3 className="text-lg font-semibold text-[#1a0508] mb-5">{title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ label, placeholder, type }) => {
              const fieldId = label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <div key={label}>
                  <label htmlFor={fieldId} className="block text-sm font-semibold text-[#1a0508] mb-1.5">{label}</label>
                  <input id={fieldId} name={fieldId} type={type} placeholder={placeholder} className={inputCls} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={handleSave} className={`btn-brand px-8 py-3 text-sm ${saved ? 'bg-emerald-600' : ''}`}>
        {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>
    </div>
  );
}

// ─── Enhanced Admin Dashboard with Full CRUD Operations ──────────────────────

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview',   label: 'Overview',   icon: LayoutDashboard },
    { id: 'orders',     label: 'Orders',     icon: ShoppingBag },
    { id: 'products',   label: 'Products',   icon: Package },
    { id: 'customers',  label: 'Customers',  icon: Users },
    { id: 'settings',   label: 'Settings',   icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f8]">
      {/* Enhanced Top bar with better styling */}
      <div className="bg-white border-b border-[#e8dede] px-4 sm:px-6 lg:px-8 py-6"> {/* Increased padding */}
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <p className="text-overline font-accent">Fashion Foresight</p> {/* Added font-accent */}
            <h1 className="text-3xl font-semibold text-[#1a0508] mt-1 font-display">Admin Dashboard</h1> {/* Increased size and added font-display */}
          </div>
          <div className="flex items-center gap-4"> {/* Increased gap */}
            <button className="w-11 h-11 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all relative"> {/* Increased size */}
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#64020e] rounded-full" />
            </button>
            <button className="w-11 h-11 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all"> {/* Increased size */}
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Tab Navigation with larger fonts */}
        <div className="flex gap-2 bg-white border border-[#e8dede] rounded-2xl p-2 mb-8 overflow-x-auto"> {/* Increased padding */}
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
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview'  && <OverviewTab />}
        {activeTab === 'orders'    && <OrdersTab />}
        {activeTab === 'products'  && <ProductsTab />}
        {activeTab === 'customers' && <CustomersTab />}
        {activeTab === 'settings'  && <SettingsTab />}
      </div>
    </div>
  );
}
