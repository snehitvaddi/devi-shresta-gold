'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'Video Call', href: '/video-call' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book Appointment', href: '/booking' },
];

interface HeaderProps {
  businessName: string;
  whatsappNumber?: string;
  domain?: string;
}

interface GoldPrice {
  price24K: number;
  change24K: number;
}

export default function Header({ businessName, whatsappNumber, domain }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch gold price for jewelry domain
  useEffect(() => {
    if (domain !== 'jewelry') return;
    async function fetchPrice() {
      try {
        const res = await fetch('/api/gold-price');
        if (res.ok) {
          const data = await res.json();
          setGoldPrice({ price24K: data.price24K, change24K: data.change24K });
        }
      } catch {
        setGoldPrice({ price24K: 87500, change24K: 250 });
      }
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [domain]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[var(--color-bg)]/95 backdrop-blur-md border-b border-[var(--color-text)]/5 shadow-lg'
          : 'bg-transparent',
      )}
    >
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link
          href="/"
          className="font-[var(--font-heading)] text-xl md:text-2xl tracking-wide text-[var(--color-text)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className="text-gradient">{businessName}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}

          {/* Gold Price Badge — compact, elegant */}
          {goldPrice && (
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20',
                'text-xs font-medium cursor-default',
              )}
              title={`Gold 24K: ${formatPrice(goldPrice.price24K)} per 10g`}
            >
              <span className="text-[var(--color-primary)] font-bold text-[10px] tracking-wider">GOLD</span>
              <span className="text-[var(--color-text)] font-semibold">
                {formatPrice(goldPrice.price24K)}
              </span>
              <span
                className={cn(
                  'flex items-center gap-0.5',
                  goldPrice.change24K >= 0 ? 'text-green-400' : 'text-red-400',
                )}
              >
                {goldPrice.change24K >= 0 ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 transition-colors"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          )}
        </nav>

        {/* Mobile: Gold Price + Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {goldPrice && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full',
                'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20',
                'text-[10px] font-medium',
              )}
            >
              <span className="text-[var(--color-primary)] font-bold">24K</span>
              <span className="text-[var(--color-text)] font-semibold">
                {formatPrice(goldPrice.price24K)}
              </span>
            </div>
          )}
          <button
            className="text-[var(--color-text)] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-0 top-16 z-40 lg:hidden transition-all duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            'absolute top-0 right-0 w-72 h-full bg-[var(--color-bg-surface)] border-l border-[var(--color-text)]/5 transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <nav className="flex flex-col p-8 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-lg tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-text)]/5">
              <span className="text-sm text-[var(--color-text-muted)]">Theme</span>
              <ThemeToggle />
            </div>

            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-green-500 hover:text-green-400 transition-colors mt-4"
              >
                <MessageCircle size={20} />
                <span className="text-sm uppercase tracking-wider">WhatsApp</span>
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
