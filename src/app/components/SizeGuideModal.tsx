import { X, Ruler } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

type MeasurementUnit = 'inches' | 'cm';

export function SizeGuideModal({ isOpen, onClose, category = 'Suits' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<MeasurementUnit>('inches');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const convert = (inches: number) => unit === 'cm' ? (inches * 2.54).toFixed(1) : inches.toString();

  // Size charts based on category
  const getSizeChart = () => {
    if (category === 'Suits' || category === 'Blazers' || category === 'Outerwear') {
      return {
        title: 'Suits, Blazers & Outerwear',
        headers: ['Size', 'Chest', 'Waist', 'Sleeve', 'Shoulder'],
        rows: [
          { size: '36 / XS', chest: 36, waist: 30, sleeve: 32, shoulder: 17 },
          { size: '38 / S', chest: 38, waist: 32, sleeve: 33, shoulder: 17.5 },
          { size: '40 / M', chest: 40, waist: 34, sleeve: 33.5, shoulder: 18 },
          { size: '42 / L', chest: 42, waist: 36, sleeve: 34, shoulder: 18.5 },
          { size: '44 / XL', chest: 44, waist: 38, sleeve: 34.5, shoulder: 19 },
          { size: '46 / XXL', chest: 46, waist: 40, sleeve: 35, shoulder: 19.5 },
        ],
      };
    } else if (category === 'Shirts') {
      return {
        title: 'Dress Shirts',
        headers: ['Size', 'Neck', 'Chest', 'Sleeve', 'Shoulder'],
        rows: [
          { size: '36 / XS', neck: 14.5, chest: 36, sleeve: 32, shoulder: 17 },
          { size: '38 / S', neck: 15, chest: 38, sleeve: 33, shoulder: 17.5 },
          { size: '40 / M', neck: 15.5, chest: 40, sleeve: 33.5, shoulder: 18 },
          { size: '42 / L', neck: 16, chest: 42, sleeve: 34, shoulder: 18.5 },
          { size: '44 / XL', neck: 16.5, chest: 44, sleeve: 34.5, shoulder: 19 },
          { size: '46 / XXL', neck: 17, chest: 46, sleeve: 35, shoulder: 19.5 },
        ],
      };
    } else if (category === 'Casual') {
      return {
        title: 'Casual Wear',
        headers: ['Size', 'Chest', 'Waist', 'Length'],
        rows: [
          { size: 'XS', chest: 34, waist: 28, length: 27 },
          { size: 'S', chest: 36, waist: 30, length: 28 },
          { size: 'M', chest: 38, waist: 32, length: 29 },
          { size: 'L', chest: 40, waist: 34, length: 30 },
          { size: 'XL', chest: 42, waist: 36, length: 31 },
          { size: 'XXL', chest: 44, waist: 38, length: 32 },
        ],
      };
    } else if (category === 'Footwear') {
      return {
        title: 'Footwear',
        headers: ['US', 'UK', 'EU', 'Foot Length'],
        rows: [
          { size: '7', uk: 6, eu: 40, length: 9.6 },
          { size: '8', uk: 7, eu: 41, length: 9.9 },
          { size: '9', uk: 8, eu: 42, length: 10.1 },
          { size: '10', uk: 9, eu: 43, length: 10.4 },
          { size: '11', uk: 10, eu: 44, length: 10.7 },
          { size: '12', uk: 11, eu: 45, length: 11 },
          { size: '13', uk: 12, eu: 46, length: 11.3 },
        ],
      };
    } else {
      // Default general sizing
      return {
        title: 'General Sizing',
        headers: ['Size', 'Chest', 'Waist', 'Hip'],
        rows: [
          { size: 'XS', chest: 34, waist: 28, hip: 34 },
          { size: 'S', chest: 36, waist: 30, hip: 36 },
          { size: 'M', chest: 38, waist: 32, hip: 38 },
          { size: 'L', chest: 40, waist: 34, hip: 40 },
          { size: 'XL', chest: 42, waist: 36, hip: 42 },
          { size: 'XXL', chest: 44, waist: 38, hip: 44 },
        ],
      };
    }
  };

  const chart = getSizeChart();

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between px-7 py-5 border-b border-[#f5f0ef] sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#fdf2f2] rounded-xl flex items-center justify-center">
                <Ruler className="w-5 h-5 text-[#64020e]" />
              </div>
              <div>
                <p className="text-overline">Measurements</p>
                <h3 className="text-xl font-semibold text-[#1a0508] mt-0.5 font-display">Size Guide</h3>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-[#7a5c60] hover:bg-[#fdf2f2] hover:text-[#64020e] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-7 py-6">
            
            {/* Unit Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-[#1a0508]">{chart.title}</h4>
              <div className="flex gap-1 bg-[#f5f0ef] rounded-xl p-1">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    unit === 'inches'
                      ? 'bg-white text-[#64020e] shadow-sm'
                      : 'text-[#7a5c60] hover:text-[#1a0508]'
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    unit === 'cm'
                      ? 'bg-white text-[#64020e] shadow-sm'
                      : 'text-[#7a5c60] hover:text-[#1a0508]'
                  }`}
                >
                  Centimeters
                </button>
              </div>
            </div>

            {/* Size Chart Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#e8dede]">
              <table className="w-full">
                <thead className="bg-[#faf9f8]">
                  <tr>
                    {chart.headers.map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-bold text-[#7a5c60] uppercase tracking-wider">
                        {header}
                        {header !== 'Size' && header !== 'US' && header !== 'UK' && header !== 'EU' && (
                          <span className="ml-1 text-xs font-normal">({unit})</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f0ef] bg-white">
                  {chart.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#faf9f8] transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-[#1a0508]">{row.size}</td>
                      {Object.entries(row).slice(1).map(([key, value]) => (
                        <td key={key} className="px-4 py-3 text-sm text-[#7a5c60]">
                          {typeof value === 'number' && key !== 'uk' && key !== 'eu' ? convert(value) : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to Measure */}
            <div className="mt-8 bg-[#fdf2f2] rounded-2xl p-6">
              <h5 className="text-base font-semibold text-[#1a0508] mb-4">How to Measure</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category === 'Footwear' ? (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-[#64020e] mb-1">Foot Length</p>
                      <p className="text-sm text-[#7a5c60] leading-relaxed">
                        Stand on a piece of paper and mark the longest point of your foot. Measure from heel to toe.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#64020e] mb-1">Best Time to Measure</p>
                      <p className="text-sm text-[#7a5c60] leading-relaxed">
                        Measure your feet at the end of the day when they're at their largest.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-semibold text-[#64020e] mb-1">Chest</p>
                      <p className="text-sm text-[#7a5c60] leading-relaxed">
                        Measure around the fullest part of your chest, keeping the tape horizontal.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#64020e] mb-1">Waist</p>
                      <p className="text-sm text-[#7a5c60] leading-relaxed">
                        Measure around your natural waistline, keeping the tape comfortably loose.
                      </p>
                    </div>
                    {(category === 'Suits' || category === 'Blazers' || category === 'Shirts') && (
                      <>
                        <div>
                          <p className="text-sm font-semibold text-[#64020e] mb-1">Sleeve</p>
                          <p className="text-sm text-[#7a5c60] leading-relaxed">
                            Measure from the center back of your neck to your wrist with arm slightly bent.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#64020e] mb-1">Shoulder</p>
                          <p className="text-sm text-[#7a5c60] leading-relaxed">
                            Measure from one shoulder point to the other across your back.
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 p-5 bg-white border border-[#e8dede] rounded-2xl">
              <p className="text-sm font-semibold text-[#1a0508] mb-2">💡 Sizing Tips</p>
              <ul className="space-y-2 text-sm text-[#7a5c60]">
                <li className="flex items-start gap-2">
                  <span className="text-[#64020e] mt-1">•</span>
                  <span>If you're between sizes, we recommend sizing up for a more comfortable fit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#64020e] mt-1">•</span>
                  <span>All measurements are approximate and may vary slightly by style.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#64020e] mt-1">•</span>
                  <span>For tailored items, we recommend professional alterations for the perfect fit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#64020e] mt-1">•</span>
                  <span>Need help? Contact our styling team for personalized sizing advice.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-7 pb-7 flex gap-3">
            <button onClick={onClose} className="btn-brand flex-1 justify-center py-3 text-sm">
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
