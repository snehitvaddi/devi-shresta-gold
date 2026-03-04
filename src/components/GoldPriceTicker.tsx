"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoldPrice {
  price24K: number;
  price22K: number;
  price18K: number;
  silverPrice: number;
  change24K: number; // +/- from yesterday
  currency: string;
  unit: string; // "per 10g"
  lastUpdated: string;
}

interface GoldPriceTickerProps {
  className?: string;
}

// Fallback prices (updated periodically, used if API fails)
const FALLBACK_PRICES: GoldPrice = {
  price24K: 87500,
  price22K: 80200,
  price18K: 65600,
  silverPrice: 99500, // per kg
  change24K: 250,
  currency: "INR",
  unit: "per 10g",
  lastUpdated: new Date().toISOString(),
};

export default function GoldPriceTicker({ className }: GoldPriceTickerProps) {
  const [prices, setPrices] = useState<GoldPrice>(FALLBACK_PRICES);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchGoldPrice();
    // Refresh every 30 minutes
    const interval = setInterval(fetchGoldPrice, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function fetchGoldPrice() {
    try {
      setLoading(true);
      // Try our API endpoint first
      const res = await fetch("/api/gold-price");
      if (res.ok) {
        const data = await res.json();
        setPrices(data);
      }
    } catch {
      // Use fallback prices
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const TrendIcon = prices.change24K > 0
    ? TrendingUp
    : prices.change24K < 0
    ? TrendingDown
    : Minus;

  const trendColor = prices.change24K > 0
    ? "text-green-400"
    : prices.change24K < 0
    ? "text-red-400"
    : "text-[var(--color-text-muted)]";

  return (
    <div
      className={cn(
        "bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-primary)]/10",
        className
      )}
    >
      <div className="container-site">
        {/* Compact ticker bar */}
        <div className="flex items-center justify-between py-1.5 text-xs">
          {/* Left: Gold prices */}
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {/* 24K Gold */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 whitespace-nowrap hover:text-[var(--color-primary)] transition-colors"
            >
              <span className="font-bold text-[var(--color-primary)]">GOLD 24K</span>
              <span className="text-[var(--color-text)] font-semibold">
                {formatPrice(prices.price24K)}
              </span>
              <span className={cn("flex items-center gap-0.5 font-medium", trendColor)}>
                <TrendIcon size={12} />
                {prices.change24K > 0 ? "+" : ""}
                {formatPrice(Math.abs(prices.change24K))}
              </span>
            </button>

            {/* Separator */}
            <span className="hidden sm:inline text-[var(--color-text-muted)]/50">|</span>

            {/* 22K Gold */}
            <div className="hidden sm:flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-[var(--color-primary)]/70">22K</span>
              <span className="text-[var(--color-text-muted)] font-medium">
                {formatPrice(prices.price22K)}
              </span>
            </div>

            {/* Separator */}
            <span className="hidden md:inline text-[var(--color-text-muted)]/50">|</span>

            {/* 18K Gold */}
            <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-[var(--color-primary)]/70">18K</span>
              <span className="text-[var(--color-text-muted)] font-medium">
                {formatPrice(prices.price18K)}
              </span>
            </div>

            {/* Separator */}
            <span className="hidden lg:inline text-[var(--color-text-muted)]/50">|</span>

            {/* Silver */}
            <div className="hidden lg:flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-[var(--color-text-muted)]">SILVER</span>
              <span className="text-[var(--color-text-muted)] font-medium">
                {formatPrice(prices.silverPrice)}/kg
              </span>
            </div>
          </div>

          {/* Right: Unit + refresh */}
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] shrink-0 ml-4">
            <span className="hidden sm:inline">{prices.unit}</span>
            <button
              onClick={fetchGoldPrice}
              className={cn(
                "p-1 rounded hover:text-[var(--color-primary)] transition-colors",
                loading && "animate-spin"
              )}
              aria-label="Refresh prices"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Expanded details panel */}
        {expanded && (
          <div className="border-t border-[var(--color-primary)]/10 py-3 animate-[slideDown_0.2s_ease-out]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PriceCard label="24K Gold" price={prices.price24K} unit="per 10g" highlight />
              <PriceCard label="22K Gold" price={prices.price22K} unit="per 10g" />
              <PriceCard label="18K Gold" price={prices.price18K} unit="per 10g" />
              <PriceCard label="Silver" price={prices.silverPrice} unit="per kg" />
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)]/50 mt-2 text-center">
              Prices are indicative and may vary. Last updated: {new Date(prices.lastUpdated).toLocaleString("en-IN")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PriceCard({
  label,
  price,
  unit,
  highlight = false,
}: {
  label: string;
  price: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 text-center",
        highlight
          ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20"
          : "bg-[var(--color-bg-surface)]"
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className={cn("text-lg font-bold", highlight ? "text-[var(--color-primary)]" : "text-[var(--color-text)]")}>
        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price)}
      </p>
      <p className="text-[10px] text-[var(--color-text-muted)]/50">{unit}</p>
    </div>
  );
}
