import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
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
    setUserMenuOpen(false);
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e8dede]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Fashion Foresight">
            <img
              src="/images/logo-desktop.png"
              alt="Fashion Foresight"
              className="h-7 md:h-10 w-auto max-w-[130px] md:max-w-[200px] object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center" aria-label="Main navigation">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative px-5 py-2 text-base font-medium transition-colors group ${
                  isActive(to) ? 'text-[#64020e]' : 'text-[#7a5c60] hover:text-[#64020e]'
                }`}
                aria-current={isActive(to) ? 'page' : undefined}
              >
                {label}
                <span className={`absolute bottom-0 left-5 right-5 h-0.5 bg-[#64020e] rounded-full transition-all duration-300 origin-left ${
                  isActive(to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-1">

            {/* Search */}
            <button
              onClick={onSearchOpen}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart — hidden for admin */}
            {!user || user.role !== 'admin' ? (
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all"
                aria-label={`Cart, ${totalItems} items`}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#64020e] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>
            ) : null}

            {/* User avatar (when logged in) — desktop only */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 bg-[#64020e] text-white rounded-full flex items-center justify-center text-sm font-semibold ml-1"
                  aria-label="User menu"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e8dede] rounded-2xl shadow-xl py-2 z-20">
                      <div className="px-4 py-3 border-b border-[#f5f0ef]">
                        <p className="text-sm font-semibold text-[#1a0508] truncate">{user.name}</p>
                        <p className="text-xs text-[#7a5c60] truncate mt-0.5">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#64020e] text-white text-[10px] font-bold rounded-full tracking-wide">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a0508] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#7a5c60]" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#1a0508] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4 text-[#7a5c60]" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#64020e] border-2 border-[#64020e] rounded-xl hover:bg-[#64020e] hover:text-white transition-all ml-1"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#7a5c60] hover:text-[#64020e] hover:bg-[#fdf2f2] transition-all ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#f5f0ef] py-2 pb-4">

            {/* User info + actions (logged in) */}
            {user ? (
              <div className="px-4 py-3 mb-1 bg-[#fdf2f2] rounded-xl mx-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-[#64020e] text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1a0508] truncate">{user.name}</p>
                    <p className="text-xs text-[#7a5c60] truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <span className="ml-auto px-2 py-0.5 bg-[#64020e] text-white text-[10px] font-bold rounded-full flex-shrink-0">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#64020e] border border-[#64020e] rounded-lg hover:bg-[#64020e] hover:text-white transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#7a5c60] border border-[#e8dede] rounded-lg hover:bg-white transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { onAuthClick(); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#1a0508] hover:bg-[#fdf2f2] hover:text-[#64020e] rounded-xl transition-colors"
              >
                <User className="w-4 h-4 text-[#7a5c60]" />
                Sign In / Sign Up
              </button>
            )}

            {/* Nav links */}
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-[#fdf2f2] text-[#64020e]'
                    : 'text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
