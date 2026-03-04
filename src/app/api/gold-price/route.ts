import { NextResponse } from "next/server";

// Cache gold prices for 30 minutes
let cachedPrices: GoldPriceResponse | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface GoldPriceResponse {
  price24K: number;
  price22K: number;
  price18K: number;
  silverPrice: number;
  change24K: number;
  currency: string;
  unit: string;
  lastUpdated: string;
}

async function fetchLiveGoldPrice(): Promise<GoldPriceResponse> {
  // Try fetching from a free gold price API
  try {
    const res = await fetch(
      "https://www.goldapi.io/api/XAU/INR",
      {
        headers: {
          "x-access-token": process.env.GOLD_API_KEY || "",
        },
        next: { revalidate: 1800 }, // 30 min
      }
    );

    if (res.ok) {
      const data = await res.json();
      // Gold API returns price per troy ounce, convert to per 10g
      // 1 troy ounce = 31.1035g, so per 10g = price * 10 / 31.1035
      const pricePerGram = data.price / 31.1035;
      const price24KPer10g = Math.round(pricePerGram * 10);
      const changePer10g = Math.round((data.ch / 31.1035) * 10);

      return {
        price24K: price24KPer10g,
        price22K: Math.round(price24KPer10g * 0.916), // 22/24
        price18K: Math.round(price24KPer10g * 0.75), // 18/24
        silverPrice: Math.round((data.price / 31.1035) * 1000 * 0.02), // approximate
        change24K: changePer10g,
        currency: "INR",
        unit: "per 10g",
        lastUpdated: new Date().toISOString(),
      };
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback: return reasonable current market prices
  // These should be updated periodically
  return {
    price24K: 87500,
    price22K: 80200,
    price18K: 65600,
    silverPrice: 99500,
    change24K: 250,
    currency: "INR",
    unit: "per 10g",
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET() {
  const now = Date.now();

  // Return cached if fresh
  if (cachedPrices && now - lastFetch < CACHE_DURATION) {
    return NextResponse.json(cachedPrices);
  }

  // Fetch fresh prices
  const prices = await fetchLiveGoldPrice();
  cachedPrices = prices;
  lastFetch = now;

  return NextResponse.json(prices, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
