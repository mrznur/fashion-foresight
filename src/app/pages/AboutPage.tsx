import { Link } from 'react-router';
import { ArrowRight, Award, Leaf, Clock } from 'lucide-react';
import { useSettings } from '../../lib/useSettings';

const values = [
  { icon: Award, num: '01', title: 'Quality First', desc: 'We source only the finest materials and work with skilled craftspeople to ensure every piece meets our rigorous quality standards.' },
  { icon: Leaf, num: '02', title: 'Authenticity', desc: 'Every product is genuine and carefully selected. We stand behind the quality and authenticity of everything we sell.' },
  { icon: Clock, num: '03', title: 'Timeless Style', desc: 'Our designs are created to be cherished for years, not seasons. We focus on classic styles with modern sensibilities.' },
];

export function AboutPage() {
  const s = useSettings();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1768809250854-2f4b1e8f19cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt={`About ${s.store_name}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 text-white px-4 max-w-3xl mx-auto text-center">
          <p className="text-[10px] md:text-2xl text-[#d4a0a0] uppercase tracking-[0.3em] font-semibold mb-4">Our Story</p>
          <h1 className="text-5xl md:text-6xl bg-white/30 rounded-lg px-2 py-1 font-light tracking-tight mb-5">{s.store_name}</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Premium menswear for the modern gentleman</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] md:text-2xl text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-4">Our Mission</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-8">Crafted for the Modern Gentleman</h2>
          <p className="text-[#737373] leading-relaxed mb-5">
            At {s.store_name}, we believe that great style starts with great quality. Our mission is to bring you premium menswear that combines comfort, durability, and timeless design — at prices that make sense.
          </p>
          <p className="text-[#737373] leading-relaxed">
            Every item in our collection is carefully selected to meet our standards of quality and style. We're committed to offering you the best, and we stand behind every product we sell.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, num, title, desc }) => (
              <div key={num} className="bg-white rounded-3xl p-8 border border-[#e5e5e5] hover:border-[#64020e]/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-[#fdf2f2] rounded-2xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#64020e]" />
                  </div>
                  <span className="text-xs font-bold text-[#64020e] tracking-widest">{num}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1a0508] mb-3">{title}</h3>
                <p className="text-sm text-[#737373] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-4">Find Us</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-7">{s.store_name}</h2>
              <div className="space-y-4 text-[#737373] leading-relaxed">
                {s.store_address && <p>📍 {s.store_address}</p>}
                {s.support_phone && <p>📞 {s.support_phone}</p>}
                {s.store_email && <p>✉️ {s.store_email}</p>}
                {s.business_hours && <p>🕐 {s.business_hours}</p>}
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-[#f5f5f5] rounded-3xl">
              <img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200" alt={s.store_name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#1a0508]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#d4a0a0] uppercase tracking-[0.3em] font-semibold mb-3">Shop Now</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">Explore Our Collection</h2>
          <p className="text-white/50 mb-8 leading-relaxed">Discover pieces that will become staples of your wardrobe.</p>
          <Link to="/shop" className="btn-brand inline-flex text-sm px-8 py-3.5">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
