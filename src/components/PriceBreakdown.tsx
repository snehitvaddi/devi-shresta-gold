'use client';

import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

interface PriceBreakdownProps {
  totalPrice: number;
  currency: string;
  metadata: Record<string, string>;
}

function formatCurrency(amount: number, currency: string): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseWeight(weightStr: string | undefined): number | null {
  if (!weightStr) return null;
  const match = weightStr.match(/([\d.]+)\s*g/i);
  return match ? parseFloat(match[1]) : null;
}

function parsePurity(metadata: Record<string, string>): number | null {
  const purStr = metadata.purity || metadata.metal || '';
  if (purStr.includes('24K')) return 0.999;
  if (purStr.includes('22K')) return 0.916;
  if (purStr.includes('18K')) return 0.750;
  if (purStr.includes('14K')) return 0.585;
  return null;
}

function getPurityLabel(metadata: Record<string, string>): string {
  const purStr = metadata.purity || metadata.metal || '';
  if (purStr.includes('24K')) return '24K (999)';
  if (purStr.includes('22K')) return '22K (916)';
  if (purStr.includes('18K')) return '18K (750)';
  if (purStr.includes('14K')) return '14K (585)';
  return 'N/A';
}

const GOLD_RATE_PER_GRAM = 7500; // default rate in INR
const GST_RATE = 0.03; // 3%

interface BreakdownLine {
  label: string;
  amount: number;
  color: string; // for proportion bar
}

function calculateBreakdown(
  totalPrice: number,
  metadata: Record<string, string>,
): { lines: BreakdownLine[]; usedFallback: boolean } {
  const weight = parseWeight(metadata.weight);
  const purity = parsePurity(metadata);

  if (weight && purity) {
    const goldValue = weight * purity * GOLD_RATE_PER_GRAM;
    // GST = 3% of (goldValue + makingCharges)
    // totalPrice = goldValue + makingCharges + GST
    // totalPrice = goldValue + makingCharges + 0.03*(goldValue + makingCharges)
    // totalPrice = (goldValue + makingCharges) * 1.03
    // goldValue + makingCharges = totalPrice / 1.03
    const preTax = totalPrice / (1 + GST_RATE);
    const makingCharges = preTax - goldValue;

    if (makingCharges >= 0) {
      const gst = totalPrice - preTax;
      return {
        lines: [
          { label: 'Gold Value', amount: Math.round(goldValue), color: 'var(--color-primary)' },
          { label: 'Making Charges', amount: Math.round(makingCharges), color: 'var(--color-text-muted)' },
          { label: 'GST (3%)', amount: Math.round(gst), color: 'var(--color-primary-light)' },
        ],
        usedFallback: false,
      };
    }
  }

  // Fallback: approximate proportions
  const goldApprox = Math.round(totalPrice * 0.75);
  const makingApprox = Math.round(totalPrice * 0.15);
  const gstApprox = Math.round(totalPrice * 0.03);
  const otherApprox = totalPrice - goldApprox - makingApprox - gstApprox;

  return {
    lines: [
      { label: 'Gold Value (approx.)', amount: goldApprox, color: 'var(--color-primary)' },
      { label: 'Making Charges (approx.)', amount: makingApprox, color: 'var(--color-text-muted)' },
      { label: 'GST (3%)', amount: gstApprox, color: 'var(--color-primary-light)' },
      { label: 'Other Charges', amount: otherApprox, color: 'var(--color-bg-surface-light)' },
    ],
    usedFallback: true,
  };
}

export default function PriceBreakdown({ totalPrice, currency, metadata }: PriceBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { lines, usedFallback } = calculateBreakdown(totalPrice, metadata);
  const purityLabel = getPurityLabel(metadata);
  const weight = parseWeight(metadata.weight);

  return (
    <div className="mt-4 border border-[var(--color-bg-surface-light)] rounded-[var(--radius-md)] overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-light)] transition-colors duration-200 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-[var(--color-text)] tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-body)' }}>
          View Price Breakdown
        </span>
        <ChevronDown
          size={18}
          className="text-[var(--color-primary)] transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Collapsible Content */}
      <div
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? '600px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-4 py-4 bg-[var(--color-bg-surface)] border-t border-[var(--color-bg-surface-light)]">
          {/* Metadata Summary */}
          {(weight || purityLabel !== 'N/A') && (
            <div className="flex flex-wrap gap-3 mb-4">
              {weight && (
                <span className="badge text-xs">
                  Weight: {metadata.weight}
                </span>
              )}
              {purityLabel !== 'N/A' && (
                <span className="badge text-xs">
                  Purity: {purityLabel}
                </span>
              )}
              {metadata.metal && (
                <span className="badge text-xs">
                  {metadata.metal}
                </span>
              )}
            </div>
          )}

          {/* Proportion Bar */}
          <div className="flex w-full h-2 rounded-full overflow-hidden mb-5">
            {lines.map((line) => {
              const pct = totalPrice > 0 ? (line.amount / totalPrice) * 100 : 0;
              return (
                <div
                  key={line.label}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: line.color,
                    minWidth: pct > 0 ? '4px' : '0',
                  }}
                  title={`${line.label}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2.5">
            {lines.map((line) => {
              const pct = totalPrice > 0 ? (line.amount / totalPrice) * 100 : 0;
              return (
                <div key={line.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    <span className="text-[var(--color-text-muted)]">
                      {line.label}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]/60">
                      ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <span className="font-medium text-[var(--color-text)] tabular-nums">
                    {formatCurrency(line.amount, currency)}
                  </span>
                </div>
              );
            })}

            {/* Divider */}
            <div className="border-t border-[var(--color-bg-surface-light)] my-2" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold text-[var(--color-text)] tracking-wide uppercase"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Total
              </span>
              <span
                className="text-lg font-bold text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {formatCurrency(totalPrice, currency)}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 mt-4 p-3 rounded-[var(--radius-sm)] bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
            <Info size={14} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Gold value based on today&apos;s rate ({formatCurrency(GOLD_RATE_PER_GRAM, currency)}/g).
              Final price may vary based on prevailing gold rate at the time of purchase.
              {usedFallback && ' Breakdown shown is approximate.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
