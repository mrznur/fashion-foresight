import { BrowserRouter, Routes, Route } from 'react-router';
import { lazy, Suspense, useState } from 'react';
import { Toaster } from 'sonner';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';

// ─── Lazy-loaded routes (code splitting) ─────────────────────────────────────
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const UserDashboard = lazy(() => import('./components/UserDashboard').then((m) => ({ default: m.UserDashboard })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-[#f5f5f5] border-t-[#64020e] rounded-full animate-spin" />
        <p className="text-xs text-[#737373] tracking-wide">Loading...</p>
      </div>
    </div>
  );
}

function AppShell() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onAuthClick={() => setAuthModalOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <CartDrawer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

/** Renders the correct dashboard based on user role */
function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  return <UserDashboard />;
}

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-white">
      <div className="text-center">
        <p className="text-8xl font-bold text-[#f5f5f5] mb-2 select-none">404</p>
        <h1 className="text-2xl font-semibold text-[#1a0508] mb-3">Page Not Found</h1>
        <p className="text-[#737373] mb-8 text-sm">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-brand inline-flex text-sm px-7 py-3">
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
