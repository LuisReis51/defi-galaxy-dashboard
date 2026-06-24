import axios from 'axios';

const BASE = import.meta.env.VITE_CMC_BASE_URL ?? 'https://pro-api.coinmarketcap.com';
const API_KEY = import.meta.env.VITE_CMC_API_KEY ?? '';

const XGT_CONTRACT = '0x654e38a4516f5476d723d770382a5eaf8bae0e0d';

export interface CMCQuote {
  price: number;
  percent_change_24h: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
}

export interface XGTPriceData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
}

export async function fetchXGTPrice(): Promise<XGTPriceData> {
  const { data } = await axios.get(`${BASE}/v1/cryptocurrency/quotes/latest`, {
    headers: { 'X-CMC_PRO_API_KEY': API_KEY },
    params: {
      address: XGT_CONTRACT,
      convert: 'USD',
      aux: 'volume_24h,market_cap,percent_change_24h',
    },
  });

  const entries = Object.values(data.data) as Array<{
    quote: { USD: CMCQuote };
  }>;

  if (!entries.length) throw new Error('XGT not found in CMC response');

  const usd = entries[0].quote.USD;
  return {
    price: usd.price,
    priceChange24h: usd.percent_change_24h,
    marketCap: usd.market_cap,
    volume24h: usd.volume_24h,
  };
}
