import type { CoinMarket } from '@/types/coin';

const BASE = 'https://pro-api.coinmarketcap.com/v1';

interface CmcQuote {
  price: number;
  volume_24h: number;
  percent_change_1h: number | null;
  percent_change_24h: number | null;
  percent_change_7d: number | null;
  market_cap: number;
  fully_diluted_market_cap: number | null;
}

interface CmcListing {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  quote: { USD: CmcQuote };
}

interface CmcListingsResponse {
  data: CmcListing[];
}

export interface CmcListingsParams {
  page?: number;
  perPage?: number;
}

function assertApiKey(): string {
  const key = process.env.COINMARKETCAP_API_KEY;
  if (!key) {
    throw new Error('Missing COINMARKETCAP_API_KEY');
  }
  return key;
}

export async function getCoinMarketCapListings({
  page = 1,
  perPage = 50,
}: CmcListingsParams = {}): Promise<CoinMarket[]> {
  const key = assertApiKey();
  const start = (page - 1) * perPage + 1;

  const url = new URL(`${BASE}/cryptocurrency/listings/latest`);
  url.searchParams.set('start', String(start));
  url.searchParams.set('limit', String(perPage));
  url.searchParams.set('convert', 'USD');

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'X-CMC_PRO_API_KEY': key,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`CoinMarketCap listings error ${res.status}: ${err}`);
  }

  const json = (await res.json()) as CmcListingsResponse;

  return json.data.map((coin) => {
    const quote = coin.quote.USD;
    return {
      id: `cmc-${coin.id}`,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      current_price: quote.price,
      market_cap: quote.market_cap,
      market_cap_rank: coin.cmc_rank,
      fully_diluted_valuation: quote.fully_diluted_market_cap,
      total_volume: quote.volume_24h,
      high_24h: quote.price,
      low_24h: quote.price,
      price_change_24h: 0,
      price_change_percentage_24h: quote.percent_change_24h ?? 0,
      price_change_percentage_1h_in_currency: quote.percent_change_1h,
      price_change_percentage_24h_in_currency: quote.percent_change_24h,
      price_change_percentage_7d_in_currency: quote.percent_change_7d,
      market_cap_change_24h: 0,
      market_cap_change_percentage_24h: 0,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: quote.price,
      ath_change_percentage: 0,
      ath_date: '',
      atl: quote.price,
      atl_change_percentage: 0,
      atl_date: '',
      roi: null,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: { price: [] },
      source: 'coinmarketcap',
      external_url: `https://coinmarketcap.com/currencies/${coin.slug}/`,
    };
  });
}
