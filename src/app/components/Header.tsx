import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface HeaderProps {
  onAuthClick: () => void;
  onSearchOpen: () => void;
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header({ onAuthClick, onSearchOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { user, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-[#e8dede]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24" style={{ height: '80px' }}>

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link to="/" className="flex-shrink-0 min-w-0" aria-label="Fashion Foresight — Home">
            <img
              src="/images/logo-desktop.png"
              alt="Fashion Foresight"
              className="h-8 md:h-11 w-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] object-contain"
            />
          </Link>

          {/* ── Desktop Nav ───────────────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-0" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-6 py-3 font-body font-medium transition-all duration-200 group ${
                  isActive(to)
                    ? 'text-[#64020e]'
                    : 'text-[#7a5c60] hover:text-[#64020e]'
                }`}
                style={{ fontSize: '1.125rem' }} /* Increased from 1rem */
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
                {/* Full-width underline — spans the entire link text */}
                <span
                  className={`absolute bottom-1 left-6 right-6 h-0.5 bg-[#64020e] rounded-full transition-all duration-300 origin-left ${
                    isActive(to) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-80'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* ── Right Icons ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Search */}
            <button
              onClick={onSearchOpen}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all duration-200"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[#fdf2f2] transition-all duration-200"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-8 h-8 bg-[#64020e] text-white rounded-full flex items-center justify-center text-sm font-semibold select-none">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7a5c60] transition-transform duration-200 hidden sm:block ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-60 bg-white border border-[#e8dede] rounded-2xl shadow-xl py-2 z-20 overflow-hidden">
                      <div className="px-4 py-3.5 border-b border-[#f5f0ef]">
                        <p className="text-base font-semibold text-[#1a0508] truncate">{user.name}</p>
                        <p className="text-sm text-[#7a5c60] truncate mt-0.5">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#64020e] text-white text-xs font-semibold rounded-full tracking-wide">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-3 text-base text-[#1a0508] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#7a5c60]" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-base text-[#1a0508] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4 text-[#7a5c60]" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-lg font-medium text-[#64020e] border-2 border-[#64020e] rounded-xl hover:bg-[#64020e] hover:text-white transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all duration-200"
              aria-label={`Cart, ${totalItems} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#64020e] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#f5f0ef] py-3 pb-5">
            <div className="flex flex-col gap-0.5">
              {!user && (
                <button
                  onClick={onAuthClick}
                  className="flex items-center gap-3 px-4 py-3.5 text-base text-[#1a0508] hover:bg-[#fdf2f2] hover:text-[#64020e] rounded-xl transition-colors"
                >
                  <User className="w-4 h-4 text-[#7a5c60]" />
                  Sign In / Sign Up
                </button>
              )}
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-4 rounded-xl transition-colors text-lg font-medium ${
                    isActive(to)
                      ? 'bg-[#fdf2f2] text-[#64020e]'
                      : 'text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e]'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-3.5 text-base text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] rounded-xl transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-3.5 text-base text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] rounded-xl transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
