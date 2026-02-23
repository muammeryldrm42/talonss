import type { CoinMarket, CoinDetail, ChartPoint } from '@/types/coin';
import type { GlobalData } from '@/types/global';

const BASE = 'https://api.coingecko.com/api/v3';

function buildHeaders(): HeadersInit {
  const h: HeadersInit = { 'Content-Type': 'application/json' };
  if (process.env.COINGECKO_API_KEY) {
    h['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY;
  }
  return h;
}

// ─── Coins Markets ────────────────────────────────────────────────────────────

export interface CoinsMarketsParams {
  page?: number;
  perPage?: number;
  currency?: string;
}

export async function getCoinsMarkets({
  page = 1,
  perPage = 50,
  currency = 'usd',
}: CoinsMarketsParams = {}): Promise<CoinMarket[]> {
  const url = new URL(`${BASE}/coins/markets`);
  url.searchParams.set('vs_currency', currency);
  url.searchParams.set('order', 'market_cap_desc');
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('page', String(page));
  url.searchParams.set('sparkline', 'true');
  url.searchParams.set('price_change_percentage', '1h,24h,7d');

  const res = await fetch(url.toString(), {
    headers: buildHeaders(),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`CoinGecko markets error ${res.status}: ${err}`);
  }
  return res.json();
}

// ─── Global Data ──────────────────────────────────────────────────────────────

export async function getGlobalData(): Promise<GlobalData> {
  const res = await fetch(`${BASE}/global`, {
    headers: buildHeaders(),
    next: { revalidate: 120 },
  });
  if (!res.ok) throw new Error(`CoinGecko global error ${res.status}`);
  const json = await res.json();
  return json.data;
}

// ─── Coin Detail ──────────────────────────────────────────────────────────────

export async function getCoinDetail(id: string): Promise<CoinDetail> {
  const url = new URL(`${BASE}/coins/${id}`);
  url.searchParams.set('localization', 'false');
  url.searchParams.set('tickers', 'false');
  url.searchParams.set('market_data', 'true');
  url.searchParams.set('community_data', 'false');
  url.searchParams.set('developer_data', 'false');

  const res = await fetch(url.toString(), {
    headers: buildHeaders(),
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`CoinGecko detail error ${res.status}`);
  return res.json();
}

// ─── Market Chart ─────────────────────────────────────────────────────────────

export async function getMarketChart(
  id: string,
  days: number | string,
  currency = 'usd',
): Promise<ChartPoint[]> {
  const res = await fetch(
    `${BASE}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
    { headers: buildHeaders(), next: { revalidate: 30 } },
  );
  if (!res.ok) throw new Error(`CoinGecko chart error ${res.status}`);
  const data = await res.json();

  return data.prices.map(([ts, price]: [number, number]) => ({
    ts,
    price,
    date: new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(Number(days) <= 1 ? { hour: '2-digit', minute: '2-digit' } : {}),
    }),
  }));
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchCoins(query: string) {
  const res = await fetch(
    `${BASE}/search?query=${encodeURIComponent(query)}`,
    { headers: buildHeaders(), next: { revalidate: 300 } },
  );
  if (!res.ok) throw new Error(`CoinGecko search error ${res.status}`);
  return res.json();
}
