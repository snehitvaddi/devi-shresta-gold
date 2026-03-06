'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Calculator,
  IndianRupee,
  Calendar,
  Percent,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

/* ── Types ── */

interface EMICalculatorProps {
  defaultPrice?: number;
  compact?: boolean;
  whatsappNumber?: string;
}

/* ── Helpers ── */

/** Format number in Indian locale: 1,23,456 */
function formatINR(n: number): string {
  return n.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

/** Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1) */
function calcEMI(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return { emi: 0, total: 0, interest: 0 };
  if (annualRate === 0) {
    const emi = principal / months;
    return { emi: Math.round(emi), total: principal, interest: 0 };
  }
  const r = annualRate / 12 / 100;
  const pow = Math.pow(1 + r, months);
  const emi = (principal * r * pow) / (pow - 1);
  const total = Math.round(emi * months);
  return {
    emi: Math.round(emi),
    total,
    interest: total - principal,
  };
}

/* ── Tenure chips ── */

const TENURES = [3, 6, 9, 12, 18, 24] as const;

/* ── Component ── */

export default function EMICalculator({
  defaultPrice = 50000,
  compact = false,
  whatsappNumber = '917337372922',
}: EMICalculatorProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [price, setPrice] = useState(defaultPrice);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState<number>(12);
  const [rate, setRate] = useState(12);

  const principal = useMemo(
    () => Math.max(0, price - downPayment),
    [price, downPayment],
  );

  const { emi, total, interest } = useMemo(
    () => calcEMI(principal, rate, tenure),
    [principal, rate, tenure],
  );

  const principalPercent = useMemo(
    () => (total > 0 ? Math.round((principal / total) * 100) : 100),
    [principal, total],
  );

  const whatsappURL = useMemo(() => {
    const text = encodeURIComponent(
      `Hi, I'm interested in EMI options for a jewelry purchase of ₹${formatINR(price)} with ${tenure}-month tenure. Could you share more details?`,
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  }, [price, tenure, whatsappNumber]);

  const handlePriceInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value.replace(/\D/g, '') || '0', 10);
      setPrice(Math.min(v, 1000000));
    },
    [],
  );

  /* ── Compact collapsed view ── */
  if (compact && !expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm transition-colors"
        style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.18)',
          color: 'var(--color-primary)',
        }}
      >
        <span className="flex items-center gap-2 font-medium">
          <Calculator size={16} />
          Starting at{' '}
          <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
            ₹{formatINR(calcEMI(defaultPrice, 12, 12).emi)}/month
          </span>
        </span>
        <ChevronDown size={16} />
      </button>
    );
  }

  return (
    <div
      className="card"
      style={{
        border: '1px solid rgba(212,175,55,0.12)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          background: 'rgba(212,175,55,0.04)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 40,
              height: 40,
              background: 'rgba(212,175,55,0.12)',
            }}
          >
            <Calculator size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              EMI Calculator
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Plan your purchase with easy installments
            </p>
          </div>
        </div>

        {compact && (
          <button
            onClick={() => setExpanded(false)}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Collapse calculator"
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* ── Price Input ── */}
        <div>
          <label className="input-label flex items-center gap-1.5">
            <IndianRupee size={14} />
            Jewelry Price
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                ₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                className="input pl-7"
                value={formatINR(price)}
                onChange={handlePriceInput}
              />
            </div>
          </div>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={5000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full mt-3 accent-[var(--color-primary)]"
            style={{ accentColor: 'var(--color-primary)' }}
          />
          <div
            className="flex justify-between text-xs mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span>₹10,000</span>
            <span>₹10,00,000</span>
          </div>
        </div>

        {/* ── Down Payment ── */}
        <div>
          <label className="input-label flex items-center gap-1.5">
            <IndianRupee size={14} />
            Down Payment (optional)
          </label>
          <div className="relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              className="input pl-7"
              value={downPayment === 0 ? '' : formatINR(downPayment)}
              placeholder="0"
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/\D/g, '') || '0', 10);
                setDownPayment(Math.min(v, price));
              }}
            />
          </div>
        </div>

        {/* ── Tenure Chips ── */}
        <div>
          <label className="input-label flex items-center gap-1.5">
            <Calendar size={14} />
            Tenure (months)
          </label>
          <div className="flex flex-wrap gap-2 mt-1">
            {TENURES.map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  tenure === t
                    ? {
                        background: 'var(--color-primary)',
                        color: 'var(--color-text-dark)',
                      }
                    : {
                        background: 'var(--color-bg-surface)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-bg-surface-light)',
                      }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Interest Rate ── */}
        <div>
          <label className="input-label flex items-center gap-1.5">
            <Percent size={14} />
            Interest Rate —{' '}
            <span style={{ color: 'var(--color-primary)' }}>{rate}% p.a.</span>
          </label>
          <input
            type="range"
            min={0}
            max={24}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full mt-1"
            style={{ accentColor: 'var(--color-primary)' }}
          />
          <div
            className="flex justify-between text-xs mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span>0%</span>
            <span>24%</span>
          </div>
          {rate === 0 && (
            <p
              className="text-xs mt-1 font-medium"
              style={{ color: 'var(--color-success)' }}
            >
              0% EMI available on select items
            </p>
          )}
        </div>

        {/* ── Divider ── */}
        <hr className="divider" />

        {/* ── Results ── */}
        <div className="space-y-4">
          {/* Monthly EMI — hero number */}
          <div className="text-center">
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Monthly EMI
            </p>
            <p
              className="text-4xl md:text-5xl font-bold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-primary)',
              }}
            >
              ₹{formatINR(emi)}
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              for {tenure} months
            </p>
          </div>

          {/* Summary row */}
          <div
            className="grid grid-cols-2 gap-3 rounded-lg p-4"
            style={{ background: 'var(--color-bg-surface)' }}
          >
            <div>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Total Payable
              </p>
              <p className="text-lg font-semibold mt-0.5">
                ₹{formatINR(total + downPayment)}
              </p>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Total Interest
              </p>
              <p className="text-lg font-semibold mt-0.5">
                ₹{formatINR(interest)}
              </p>
            </div>
          </div>

          {/* Visual bar */}
          <div>
            <div
              className="flex justify-between text-xs mb-1.5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span>Principal ({principalPercent}%)</span>
              <span>Interest ({100 - principalPercent}%)</span>
            </div>
            <div
              className="flex h-3 rounded-full overflow-hidden"
              style={{ background: 'var(--color-bg-surface)' }}
            >
              <div
                className="h-full rounded-l-full transition-all duration-500"
                style={{
                  width: `${principalPercent}%`,
                  background: 'var(--color-primary)',
                }}
              />
              <div
                className="h-full rounded-r-full transition-all duration-500"
                style={{
                  width: `${100 - principalPercent}%`,
                  background: 'var(--color-primary-light)',
                  opacity: 0.5,
                }}
              />
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full justify-center gap-2"
          >
            <MessageCircle size={18} />
            Want EMI? Chat with us
          </a>
        </div>
      </div>
    </div>
  );
}
