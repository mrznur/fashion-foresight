import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { subscribeNewsletter } from '../../lib/db';
import { useSettings } from '../../lib/useSettings';

export function Footer() {
  const [email, setEmail] = useState('');
  const s = useSettings();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await subscribeNewsletter(email);
    toast.success('Subscribed!', { description: "You're now on the list." });
    setEmail('');
  };

  return (
    <footer className="bg-[#1a0508] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="inline-block mb-5">
              <img
                src="/images/logo-desktop.png"
                alt="Fashion Foresight"
                className="h-10 md:h-14 w-auto object-contain bg-white px-4 py-2 rounded-lg"
              />
            </div>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              Modern sophistication meets Italian craftsmanship. Luxury menswear for the discerning gentleman.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:bg-[#64020e] hover:text-white transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-semibold text-white/50 mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { to: '/shop?gender=men&category=Suits', label: 'Suits & Blazers' },
                { to: '/shop?gender=men&category=Casual', label: 'Casual Wear' },
                { to: '/shop?gender=men&category=Accessories', label: 'Accessories' },
                { to: '/shop?gender=men&category=Footwear', label: 'Footwear' },
                { to: '/shop', label: 'New Arrivals' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-lg text-white/60 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-semibold text-white/50 mb-5">Help</h4>
            <ul className="space-y-3">
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '#', label: 'Shipping & Returns' },
                { to: '#', label: 'Size Guide' },
                { to: '#', label: 'FAQ' },
                { to: '/track-order', label: 'Track Order' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-lg text-white/60 hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] font-semibold text-white/50 mb-5">Newsletter</h4>
            <p className="text-lg text-white/60 mb-4 leading-relaxed">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2 mb-6">
              <input
                id="footer-newsletter-email"
                name="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#64020e] transition-colors"
              />
              <button type="submit" className="px-5 py-3 bg-[#64020e] rounded-xl flex items-center justify-center hover:bg-[#4a0109] transition-colors flex-shrink-0" aria-label="Subscribe">
                <Mail className="w-4 h-4" />
              </button>
            </form>

            {/* Contact mini */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {s.store_address}
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {s.support_phone}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">© {s.copyright_year} {s.store_name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-white/40 hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
