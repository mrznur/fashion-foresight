import { Link } from 'react-router';
import { ArrowRight, Award, Leaf, Clock } from 'lucide-react';

const values = [
  { icon: Award, num: '01', title: 'Quality First', desc: 'We source only the finest materials and work with master craftspeople to ensure every piece meets our rigorous quality standards.' },
  { icon: Leaf, num: '02', title: 'Sustainability', desc: 'We are committed to ethical production practices and sustainable sourcing, minimizing our environmental impact while maximizing quality.' },
  { icon: Clock, num: '03', title: 'Timeless Design', desc: 'Our designs are created to be cherished for years, not seasons. We focus on classic silhouettes with modern sensibilities.' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative h-[65vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1768809250854-2f4b1e8f19cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
          alt="About Fashion Foresight"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 text-white px-4 max-w-3xl mx-auto text-center">
          <p className="text-[10px] text-[#d4a0a0] uppercase tracking-[0.3em] font-semibold mb-4">Est. 2010</p>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-5">Our Story</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Redefining modern menswear since 2010</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-4">Our Mission</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-8">Crafted for the Discerning Gentleman</h2>
          <p className="text-[#737373] leading-relaxed mb-5">
            At Fashion Foresight, we believe that true luxury lies in the perfect balance of timeless design and contemporary innovation. Our mission is to create menswear that transcends fleeting trends, offering discerning gentlemen clothing that embodies sophistication, quality, and individuality.
          </p>
          <p className="text-[#737373] leading-relaxed">
            Every garment in our collection is carefully curated or designed in-house, ensuring that each piece meets our exacting standards of craftsmanship and Italian tailoring excellence.
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

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-4">The Beginning</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-7">From Milan, With Craft</h2>
              <div className="space-y-4 text-[#737373] leading-relaxed">
                <p>Founded in 2010 by master tailor Alessandro Rossi, Fashion Foresight began as a bespoke menswear atelier in Milan with a simple philosophy: create clothing that empowers men to look and feel their absolute best.</p>
                <p>What started as a collection of made-to-measure suits has grown into a globally recognized brand, but our commitment to Italian craftsmanship and attention to detail remains unchanged.</p>
                <p>Today, we continue to honor our heritage while embracing innovation, offering discerning gentlemen a carefully curated selection of luxury menswear that stands the test of time.</p>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-[#f5f5f5] rounded-3xl">
              <img src="https://images.unsplash.com/photo-1768489039841-ef4f2d763233?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200" alt="Our Atelier" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#1a0508]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#d4a0a0] uppercase tracking-[0.3em] font-semibold mb-3">Join Us</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">Join Our Journey</h2>
          <p className="text-white/50 mb-8 leading-relaxed">Discover pieces that will become cherished parts of your wardrobe for years to come.</p>
          <Link to="/shop" className="btn-brand inline-flex text-sm px-8 py-3.5">
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
