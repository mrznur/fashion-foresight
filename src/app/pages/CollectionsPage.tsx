import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';

const collections = [
  { id: 1, title: 'Spring/Summer 2026', subtitle: 'Light & Refined', description: 'Breathable linens and lightweight wools meet contemporary cuts in our latest collection celebrating modern elegance.', image: 'https://images.unsplash.com/photo-1772404246023-acef852decd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', link: '/shop?collection=ss2026' },
  { id: 2, title: 'Formal Collection', subtitle: 'Impeccable Tailoring', description: 'Masterfully crafted suits and tuxedos designed for the most important moments in your life.', image: 'https://images.unsplash.com/photo-1768696082783-4313d98341ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', link: '/shop?category=Suits' },
  { id: 3, title: 'Casual Essentials', subtitle: 'Elevated Everyday', description: 'Sophisticated casual wear that seamlessly transitions from weekend to workweek with effortless style.', image: 'https://images.unsplash.com/photo-1651493284103-b2a338ba0ba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', link: '/shop?category=Casual' },
  { id: 4, title: 'Signature Classics', subtitle: 'Timeless Menswear', description: 'Our most beloved pieces that transcend trends — the foundation of every distinguished wardrobe.', image: 'https://images.unsplash.com/photo-1770662368022-0665169d45f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', link: '/shop?collection=classics' },
];

export function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="py-16 md:py-20 bg-[#f5f5f5]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">Curated</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1a0508] mb-4">Our Collections</h1>
          <p className="text-[#737373] text-lg max-w-xl mx-auto leading-relaxed">
            Curated selections that tell a story of elegance, craftsmanship, and timeless style.
          </p>
        </div>
      </section>

      {/* Collections */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-20 md:space-y-28">
            {collections.map((col, index) => (
              <div key={col.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="aspect-[4/5] overflow-hidden bg-[#f5f5f5] rounded-3xl group">
                    <img src={col.image} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} space-y-5`}>
                  <div>
                    <p className="text-[10px] text-[#64020e] uppercase tracking-[0.3em] font-semibold mb-3">{col.subtitle}</p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#1a0508] mb-4">{col.title}</h2>
                    <p className="text-[#737373] leading-relaxed">{col.description}</p>
                  </div>
                  <Link to={col.link} className="btn-brand inline-flex text-sm px-7 py-3.5">
                    Explore Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#1a0508]">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] text-[#d4a0a0] uppercase tracking-[0.3em] font-semibold mb-3">Personal Styling</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-5">Can't Decide?</h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Book a complimentary styling consultation and let our experts help you discover pieces that speak to your unique style.
          </p>
          <Link to="/contact" className="btn-brand inline-flex text-sm px-8 py-3.5">
            Schedule Consultation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
