'use client';

import { useState, useMemo } from 'react';
import { Ruler, Circle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const RING_SIZES = [
  { indian: 1, diameter: 12.04, circumference: 37.83, us: '1', uk: 'A' },
  { indian: 2, diameter: 12.45, circumference: 39.12, us: '1.5', uk: 'B' },
  { indian: 3, diameter: 12.85, circumference: 40.40, us: '2', uk: 'C' },
  { indian: 4, diameter: 13.26, circumference: 41.65, us: '2.5', uk: 'D' },
  { indian: 5, diameter: 13.67, circumference: 42.93, us: '3', uk: 'E' },
  { indian: 6, diameter: 14.07, circumference: 44.20, us: '3.5', uk: 'F' },
  { indian: 7, diameter: 14.48, circumference: 45.48, us: '4', uk: 'G' },
  { indian: 8, diameter: 14.88, circumference: 46.76, us: '4.5', uk: 'H' },
  { indian: 9, diameter: 15.29, circumference: 48.03, us: '5', uk: 'J' },
  { indian: 10, diameter: 15.70, circumference: 49.32, us: '5.5', uk: 'K' },
  { indian: 11, diameter: 16.10, circumference: 50.58, us: '6', uk: 'L' },
  { indian: 12, diameter: 16.51, circumference: 51.87, us: '6.5', uk: 'M' },
  { indian: 13, diameter: 16.92, circumference: 53.16, us: '7', uk: 'N' },
  { indian: 14, diameter: 17.32, circumference: 54.43, us: '7.5', uk: 'O' },
  { indian: 15, diameter: 17.73, circumference: 55.70, us: '8', uk: 'P' },
  { indian: 16, diameter: 18.14, circumference: 56.97, us: '8.5', uk: 'Q' },
  { indian: 17, diameter: 18.54, circumference: 58.25, us: '9', uk: 'R' },
  { indian: 18, diameter: 18.95, circumference: 59.53, us: '9.5', uk: 'S' },
  { indian: 19, diameter: 19.35, circumference: 60.79, us: '10', uk: 'T' },
  { indian: 20, diameter: 19.76, circumference: 62.07, us: '10.5', uk: 'U' },
  { indian: 21, diameter: 20.17, circumference: 63.36, us: '11', uk: 'V' },
  { indian: 22, diameter: 20.57, circumference: 64.62, us: '11.5', uk: 'W' },
  { indian: 23, diameter: 20.98, circumference: 65.91, us: '12', uk: 'X' },
  { indian: 24, diameter: 21.39, circumference: 67.18, us: '12.5', uk: 'Y' },
  { indian: 25, diameter: 21.79, circumference: 68.45, us: '13', uk: 'Z' },
];

const WOMEN_COMMON = [10, 11, 12, 13, 14, 15, 16];
const MEN_COMMON = [18, 19, 20, 21, 22, 23, 24];

function findSizeByCircumference(circ: number) {
  if (circ <= 0) return null;
  let closest = RING_SIZES[0];
  let minDiff = Math.abs(RING_SIZES[0].circumference - circ);
  for (const size of RING_SIZES) {
    const diff = Math.abs(size.circumference - circ);
    if (diff < minDiff) {
      minDiff = diff;
      closest = size;
    }
  }
  return closest;
}

function findSizeByDiameter(dia: number) {
  if (dia <= 0) return null;
  let closest = RING_SIZES[0];
  let minDiff = Math.abs(RING_SIZES[0].diameter - dia);
  for (const size of RING_SIZES) {
    const diff = Math.abs(size.diameter - dia);
    if (diff < minDiff) {
      minDiff = diff;
      closest = size;
    }
  }
  return closest;
}

export default function RingSizeTool() {
  const [method, setMethod] = useState<'string' | 'ring'>('string');
  const [circumference, setCircumference] = useState('');
  const [diameter, setDiameter] = useState(15);
  const [showFullChart, setShowFullChart] = useState(false);

  const stringResult = useMemo(() => {
    const val = parseFloat(circumference);
    if (isNaN(val) || val <= 0) return null;
    return findSizeByCircumference(val);
  }, [circumference]);

  const ringResult = useMemo(() => findSizeByDiameter(diameter), [diameter]);

  return (
    <div className="space-y-12">
      {/* Method Selector */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => setMethod('string')}
          className={cn(
            'px-6 py-3 rounded-[var(--radius-md)] font-medium text-sm uppercase tracking-wider transition-all duration-300',
            method === 'string'
              ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)]'
              : 'glass text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
          )}
        >
          <Ruler size={16} className="inline mr-2" />
          String Method
        </button>
        <button
          onClick={() => setMethod('ring')}
          className={cn(
            'px-6 py-3 rounded-[var(--radius-md)] font-medium text-sm uppercase tracking-wider transition-all duration-300',
            method === 'ring'
              ? 'bg-[var(--color-primary)] text-[var(--color-text-dark)]'
              : 'glass text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
          )}
        >
          <Circle size={16} className="inline mr-2" />
          Existing Ring
        </button>
      </div>

      {/* String Method */}
      {method === 'string' && (
        <div className="glass rounded-[var(--radius-lg)] p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Measure With String or Paper
          </h3>

          <div className="space-y-6 mb-8">
            {[
              { step: 1, text: 'Take a thin string, strip of paper, or thread' },
              { step: 2, text: 'Wrap it snugly around the base of your finger' },
              { step: 3, text: 'Mark where the end meets the string' },
              { step: 4, text: 'Lay it flat and measure the length in millimeters' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 flex items-center justify-center text-sm font-bold text-[var(--color-primary)]">
                  {step}
                </span>
                <p className="text-[var(--color-text-muted)] pt-1">{text}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="space-y-2">
            <label htmlFor="ring-circumference" className="input-label">Enter circumference (mm)</label>
            <div className="relative">
              <input
                id="ring-circumference"
                type="number"
                value={circumference}
                onChange={(e) => setCircumference(e.target.value)}
                placeholder="e.g., 52.5"
                className="input pr-12"
                min="30"
                max="80"
                step="0.5"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">mm</span>
            </div>
          </div>

          {/* Result */}
          {stringResult && circumference && (
            <div className="mt-6 p-6 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)] text-center">
              <p className="text-sm text-[var(--color-text-muted)] mb-2">Your Ring Size</p>
              <p className="text-4xl font-bold text-[var(--color-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Indian Size {stringResult.indian}
              </p>
              <div className="flex justify-center gap-6 text-sm text-[var(--color-text-muted)]">
                <span>US: {stringResult.us}</span>
                <span>UK: {stringResult.uk}</span>
                <span>Dia: {stringResult.diameter}mm</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ring Method */}
      {method === 'ring' && (
        <div className="glass rounded-[var(--radius-lg)] p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Match Your Existing Ring
          </h3>
          <p className="text-[var(--color-text-muted)] mb-8 text-sm">
            Place your ring on the screen and adjust the slider until the circle matches the inner diameter of your ring.
          </p>

          {/* Circle Display */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative flex items-center justify-center w-48 h-48">
              <div
                className="rounded-full border-2 border-[var(--color-primary)] transition-all duration-200"
                style={{
                  width: `${diameter * 5}px`,
                  height: `${diameter * 5}px`,
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
                }}
              />
            </div>

            {/* Slider */}
            <div className="w-full space-y-2">
              <label htmlFor="ring-diameter" className="input-label">Adjust diameter: {diameter.toFixed(1)}mm</label>
              <input
                id="ring-diameter"
                type="range"
                min="12"
                max="22"
                step="0.1"
                value={diameter}
                onChange={(e) => setDiameter(parseFloat(e.target.value))}
                className="w-full accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                <span>12mm</span>
                <span>22mm</span>
              </div>
            </div>
          </div>

          {/* Result */}
          {ringResult && (
            <div className="p-6 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)] text-center">
              <p className="text-sm text-[var(--color-text-muted)] mb-2">Your Ring Size</p>
              <p className="text-4xl font-bold text-[var(--color-primary)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                Indian Size {ringResult.indian}
              </p>
              <div className="flex justify-center gap-6 text-sm text-[var(--color-text-muted)]">
                <span>US: {ringResult.us}</span>
                <span>UK: {ringResult.uk}</span>
                <span>Circ: {ringResult.circumference}mm</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Size Chart */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setShowFullChart(!showFullChart)}
          className="flex items-center gap-2 mx-auto mb-6 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors font-medium text-sm uppercase tracking-wider"
        >
          <Search size={16} />
          {showFullChart ? 'Hide' : 'View'} Full Size Chart
          {showFullChart ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showFullChart && (
          <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-primary)]/20">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-primary)] font-semibold">Indian</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-primary)] font-semibold">Diameter (mm)</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-primary)] font-semibold">Circumference (mm)</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-primary)] font-semibold">US</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider text-[var(--color-primary)] font-semibold">UK</th>
                  </tr>
                </thead>
                <tbody>
                  {RING_SIZES.map((size) => {
                    const isWomen = WOMEN_COMMON.includes(size.indian);
                    const isMen = MEN_COMMON.includes(size.indian);
                    return (
                      <tr
                        key={size.indian}
                        className={cn(
                          'border-b border-[var(--color-text)]/5 transition-colors',
                          isWomen && 'bg-pink-500/5',
                          isMen && 'bg-blue-500/5',
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-[var(--color-text)]">
                          {size.indian}
                          {isWomen && <span className="ml-2 text-[10px] text-pink-400 uppercase">Women</span>}
                          {isMen && <span className="ml-2 text-[10px] text-blue-400 uppercase">Men</span>}
                        </td>
                        <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{size.diameter}</td>
                        <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{size.circumference}</td>
                        <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{size.us}</td>
                        <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{size.uk}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
