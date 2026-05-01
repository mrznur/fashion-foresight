import { X, Ruler } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

type Unit = 'inches' | 'cm';

// ─── Size chart data from actual product measurements ─────────────────────────

const CHARTS: Record<string, {
  title: string;
  note?: string;
  headers: string[];
  rows: Record<string, string | number>[];
}> = {

  'T-Shirts': {
    title: 'T-Shirt Size Guide',
    note: 'All measurements in inches',
    headers: ['Measurement', 'S', 'M', 'L', 'XL'],
    rows: [
      { Measurement: 'Chest',  S: 38, M: 40, L: 42, XL: 46 },
      { Measurement: 'Length', S: 26, M: 28, L: 28, XL: 29 },
      { Measurement: 'Sleeve', S: 9,  M: 9,  L: 9,  XL: 10 },
    ],
  },

  'Polo Shirts': {
    title: 'Polo Shirt Size Guide',
    note: 'All measurements in inches — multiple brands available',
    headers: ['Measurement', 'M (Kappa)', 'L (LeeCooper)', 'L (Tommy)', 'L (FC)', 'XL (FC)'],
    rows: [
      { Measurement: 'Chest',  'M (Kappa)': 40, 'L (LeeCooper)': 41, 'L (Tommy)': 42, 'L (FC)': 42, 'XL (FC)': 44 },
      { Measurement: 'Length', 'M (Kappa)': 28, 'L (LeeCooper)': 28, 'L (Tommy)': 29, 'L (FC)': 29.5, 'XL (FC)': 30 },
      { Measurement: 'Sleeve', 'M (Kappa)': 10, 'L (LeeCooper)': 8,  'L (Tommy)': 9,  'L (FC)': 9,   'XL (FC)': 9  },
    ],
  },

  'Boxers': {
    title: 'Boxer Size Guide',
    note: 'All measurements in inches — multiple brands available',
    headers: ['Measurement', 'S (P&B)', 'M (CK)', 'L (NAVY & NAVY)', 'XL', 'XXL (ZAFFIRI)'],
    rows: [
      { Measurement: 'Waist',            'S (P&B)': 26, 'M (CK)': 28, 'L (NAVY & NAVY)': 30, XL: '—', 'XXL (ZAFFIRI)': 32 },
      { Measurement: 'Front Rise',       'S (P&B)': '—', 'M (CK)': 'PC', 'L (NAVY & NAVY)': '—', XL: '—', 'XXL (ZAFFIRI)': '—' },
      { Measurement: 'Side Seam Length', 'S (P&B)': '—', 'M (CK)': 26, 'L (NAVY & NAVY)': '—', XL: '—', 'XXL (ZAFFIRI)': '—' },
    ],
  },

  'Denim Jeans': {
    title: 'Denim Jeans Size Guide',
    note: 'Waist sizes in inches',
    headers: ['Size', 'Waist', 'Inseam', 'Rise'],
    rows: [
      { Size: '28', Waist: 28, Inseam: 30, Rise: 10 },
      { Size: '30', Waist: 30, Inseam: 30, Rise: 10.5 },
      { Size: '32', Waist: 32, Inseam: 31, Rise: 11 },
      { Size: '34', Waist: 34, Inseam: 31, Rise: 11.5 },
      { Size: '36', Waist: 36, Inseam: 32, Rise: 12 },
      { Size: '38', Waist: 38, Inseam: 32, Rise: 12.5 },
      { Size: '40', Waist: 40, Inseam: 32, Rise: 13 },
    ],
  },

  'Cargo Pants': {
    title: 'Cargo Pants Size Guide',
    note: 'Waist sizes in inches',
    headers: ['Size', 'Waist', 'Hip', 'Inseam'],
    rows: [
      { Size: '28', Waist: 28, Hip: 36, Inseam: 30 },
      { Size: '30', Waist: 30, Hip: 38, Inseam: 30 },
      { Size: '32', Waist: 32, Hip: 40, Inseam: 31 },
      { Size: '34', Waist: 34, Hip: 42, Inseam: 31 },
      { Size: '36', Waist: 36, Hip: 44, Inseam: 32 },
      { Size: '38', Waist: 38, Hip: 46, Inseam: 32 },
      { Size: '40', Waist: 40, Hip: 48, Inseam: 32 },
    ],
  },

  'Joggers': {
    title: 'Joggers Size Guide',
    note: 'All measurements in inches',
    headers: ['Size', 'Waist', 'Hip', 'Length'],
    rows: [
      { Size: 'XS', Waist: 26, Hip: 34, Length: 38 },
      { Size: 'S',  Waist: 28, Hip: 36, Length: 39 },
      { Size: 'M',  Waist: 30, Hip: 38, Length: 40 },
      { Size: 'L',  Waist: 32, Hip: 40, Length: 41 },
      { Size: 'XL', Waist: 34, Hip: 42, Length: 42 },
      { Size: 'XXL',Waist: 36, Hip: 44, Length: 43 },
    ],
  },

  'Twirl Pants': {
    title: 'Twirl Pants Size Guide',
    note: 'Waist sizes in inches',
    headers: ['Size', 'Waist', 'Hip', 'Inseam'],
    rows: [
      { Size: '28', Waist: 28, Hip: 36, Inseam: 30 },
      { Size: '30', Waist: 30, Hip: 38, Inseam: 30 },
      { Size: '32', Waist: 32, Hip: 40, Inseam: 31 },
      { Size: '34', Waist: 34, Hip: 42, Inseam: 31 },
      { Size: '36', Waist: 36, Hip: 44, Inseam: 32 },
      { Size: '38', Waist: 38, Hip: 46, Inseam: 32 },
      { Size: '40', Waist: 40, Hip: 48, Inseam: 32 },
    ],
  },

  'Formal Shirts': {
    title: 'Formal Shirt Size Guide',
    note: 'All measurements in inches',
    headers: ['Size', 'Neck', 'Chest', 'Sleeve', 'Shoulder'],
    rows: [
      { Size: '36', Neck: 14.5, Chest: 36, Sleeve: 32, Shoulder: 17 },
      { Size: '38', Neck: 15,   Chest: 38, Sleeve: 33, Shoulder: 17.5 },
      { Size: '40', Neck: 15.5, Chest: 40, Sleeve: 33.5, Shoulder: 18 },
      { Size: '42', Neck: 16,   Chest: 42, Sleeve: 34, Shoulder: 18.5 },
      { Size: '44', Neck: 16.5, Chest: 44, Sleeve: 34.5, Shoulder: 19 },
      { Size: '46', Neck: 17,   Chest: 46, Sleeve: 35, Shoulder: 19.5 },
    ],
  },

  'Casual Shirts': {
    title: 'Casual Shirt Size Guide',
    note: 'All measurements in inches',
    headers: ['Size', 'Chest', 'Length', 'Sleeve'],
    rows: [
      { Size: 'XS', Chest: 36, Length: 27, Sleeve: 8.5 },
      { Size: 'S',  Chest: 38, Length: 28, Sleeve: 9 },
      { Size: 'M',  Chest: 40, Length: 28, Sleeve: 9 },
      { Size: 'L',  Chest: 42, Length: 29, Sleeve: 9.5 },
      { Size: 'XL', Chest: 44, Length: 30, Sleeve: 9.5 },
      { Size: 'XXL',Chest: 46, Length: 30, Sleeve: 10 },
    ],
  },
};

const DEFAULT_CHART = {
  title: 'General Size Guide',
  note: 'All measurements in inches',
  headers: ['Size', 'Chest', 'Waist', 'Length'],
  rows: [
    { Size: 'XS', Chest: 34, Waist: 28, Length: 27 },
    { Size: 'S',  Chest: 36, Waist: 30, Length: 28 },
    { Size: 'M',  Chest: 38, Waist: 32, Length: 29 },
    { Size: 'L',  Chest: 40, Waist: 34, Length: 30 },
    { Size: 'XL', Chest: 42, Waist: 36, Length: 31 },
    { Size: 'XXL',Chest: 44, Waist: 38, Length: 32 },
  ],
};

export function SizeGuideModal({ isOpen, onClose, category = '' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<Unit>('inches');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const chart = CHARTS[category] ?? DEFAULT_CHART;

  const fmt = (val: string | number): string => {
    if (typeof val !== 'number') return String(val);
    if (unit === 'cm') return (val * 2.54).toFixed(1);
    return String(val);
  };

  const isNumericHeader = (h: string) =>
    !['Size', 'Measurement', 'Brand Name', 'Qty'].includes(h);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#f5f0ef] sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fdf2f2] rounded-xl flex items-center justify-center">
                <Ruler className="w-5 h-5 text-[#64020e]" />
              </div>
              <div>
                <p className="text-xs text-[#64020e] uppercase tracking-widest font-semibold">Measurements</p>
                <h3 className="text-xl font-semibold text-[#1a0508] mt-0.5">{chart.title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-7 py-6 space-y-6">

            {/* Unit toggle + note */}
            <div className="flex items-center justify-between">
              {chart.note && <p className="text-sm text-[#7a5c60]">{chart.note}</p>}
              <div className="flex gap-1 bg-[#f5f0ef] rounded-xl p-1 ml-auto">
                {(['inches', 'cm'] as Unit[]).map(u => (
                  <button key={u} onClick={() => setUnit(u)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      unit === u ? 'bg-white text-[#64020e] shadow-sm' : 'text-[#7a5c60] hover:text-[#1a0508]'
                    }`}>
                    {u === 'inches' ? 'Inches' : 'CM'}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#e8dede]">
              <table className="w-full text-sm">
                <thead className="bg-[#faf9f8]">
                  <tr>
                    {chart.headers.map(h => (
                      <th key={h} className="px-4 py-3 text-left font-bold text-[#7a5c60] uppercase tracking-wider whitespace-nowrap">
                        {h}
                        {isNumericHeader(h) && <span className="ml-1 text-xs font-normal">({unit === 'inches' ? 'in' : 'cm'})</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f0ef] bg-white">
                  {chart.rows.map((row, i) => (
                    <tr key={i} className={`hover:bg-[#faf9f8] transition-colors ${
                      String(row[chart.headers[0]]) === 'Qty' ? 'bg-[#fdf2f2] font-semibold' : ''
                    }`}>
                      {chart.headers.map(h => (
                        <td key={h} className={`px-4 py-3 whitespace-nowrap ${
                          h === chart.headers[0] ? 'font-semibold text-[#1a0508]' : 'text-[#7a5c60]'
                        }`}>
                          {isNumericHeader(h) ? fmt(row[h] ?? '—') : String(row[h] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to measure */}
            <div className="bg-[#fdf2f2] rounded-2xl p-5">
              <p className="text-sm font-semibold text-[#1a0508] mb-3">How to Measure</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#7a5c60]">
                {(category === 'Denim Jeans' || category === 'Cargo Pants' || category === 'Twirl Pants' || category === 'Joggers') ? (
                  <>
                    <div><span className="font-semibold text-[#64020e]">Waist — </span>Measure around your natural waistline.</div>
                    <div><span className="font-semibold text-[#64020e]">Hip — </span>Measure around the fullest part of your hips.</div>
                    <div><span className="font-semibold text-[#64020e]">Inseam — </span>Measure from crotch to ankle along the inner leg.</div>
                  </>
                ) : category === 'Boxers' ? (
                  <>
                    <div><span className="font-semibold text-[#64020e]">Waist — </span>Measure around your natural waistline.</div>
                    <div><span className="font-semibold text-[#64020e]">Front Rise — </span>Measure from waistband to crotch seam at front.</div>
                    <div><span className="font-semibold text-[#64020e]">Side Seam — </span>Measure from waistband to hem along the side.</div>
                  </>
                ) : (
                  <>
                    <div><span className="font-semibold text-[#64020e]">Chest — </span>Measure around the fullest part of your chest.</div>
                    <div><span className="font-semibold text-[#64020e]">Length — </span>Measure from shoulder seam to hem.</div>
                    <div><span className="font-semibold text-[#64020e]">Sleeve — </span>Measure from shoulder seam to wrist.</div>
                    {(category === 'Formal Shirts') && (
                      <div><span className="font-semibold text-[#64020e]">Neck — </span>Measure around the base of your neck.</div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="border border-[#e8dede] rounded-2xl p-5">
              <p className="text-sm font-semibold text-[#1a0508] mb-2">💡 Tips</p>
              <ul className="space-y-1.5 text-sm text-[#7a5c60]">
                <li>• If between sizes, size up for a more comfortable fit.</li>
                <li>• Measurements are approximate and may vary slightly by brand.</li>
                <li>• Contact us for personalized sizing advice.</li>
              </ul>
            </div>
          </div>

          <div className="px-7 pb-7">
            <button onClick={onClose} className="btn-brand w-full justify-center py-3 text-sm">Got It</button>
          </div>
        </div>
      </div>
    </>
  );
}
