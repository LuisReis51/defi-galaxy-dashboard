import axios from 'axios';
import type { OHLCV } from '@/store/types';

const BASE = 'https://api.coingecko.com/api/v3';

export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  platforms?: Record<string, string>; // Platform contract addresses
}

async function getWithRetry(url: string, params: any, tries = 3): Promise<CoinGeckoMarket[]> {
  for (let i = 0; i < tries; i++) {
    try {
      const apiParams = { ...params };
      if (import.meta.env.VITE_COINGECKO_KEY) {
        apiParams.x_cg_demo_api_key = import.meta.env.VITE_COINGECKO_KEY;
      }
      
      const { data } = await axios.get<CoinGeckoMarket[]>(url, { params: apiParams });
      return data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 429 && i < tries - 1) {
        const backoffTime = 2000 * (i + 1); // 2s, 4s, 6s backoff
        console.warn(`CoinGecko rate limited (429), retrying in ${backoffTime}ms... (attempt ${i + 1}/${tries})`);
        await new Promise(r => setTimeout(r, backoffTime));
        continue;
      }
      throw e;
    }
  }
  return []; // Return empty on final failure
}

export async function fetchTopTokensByNetwork(
  networkId: string,
  page = 1
): Promise<CoinGeckoMarket[]> {
  // Platform-specific filters for better network-specific results
  const platformMap: Record<string, string> = {
    ethereum: 'ethereum',
    bsc: 'binance-smart-chain',
    solana: 'solana',
    arbitrum: 'arbitrum-one',
    polygon: 'polygon-pos',
    avalanche: 'avalanche',
    optimism: 'optimistic-ethereum',
    base: 'base',
  };

  const categoryMap: Record<string, string> = {
    ethereum: 'ethereum-ecosystem',
    bsc: 'bnb-chain-ecosystem',
    solana: 'solana-ecosystem',
    arbitrum: 'arbitrum-ecosystem',
    polygon: 'polygon-ecosystem',
    avalanche: 'avalanche-ecosystem',
    optimism: 'optimism-ecosystem',
    base: 'base-ecosystem',
  };

  const platform = platformMap[networkId];
  const category = categoryMap[networkId] || 'ethereum-ecosystem';

  try {
    // Try platform-specific filter first
    const params: any = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page,
      sparkline: false,
      price_change_percentage: '24h',
    };
    
    if (platform) {
      params.platform = platform;
    } else {
      params.category = category;
    }
    
    const data = await getWithRetry(`${BASE}/coins/markets`, params);
    console.log('CoinGecko API success:', data.length, 'tokens for', networkId, '(platform:', platform, ')');
    return data;
  } catch (err) {
    // Handle rate limiting (429) and other errors gracefully
    if (axios.isAxiosError(err) && err.response?.status === 429) {
      console.warn('CoinGecko rate limited (429), returning empty array for this network');
      return []; // Return empty instead of falling back to avoid cascading failures
    }
    
    console.warn('CoinGecko platform/category API failed, falling back to top 100:', err);
    // Fallback to top 100 coins (will include network tokens)
    try {
      const fallbackParams = {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page,
        sparkline: false,
        price_change_percentage: '24h',
      };
      
      const data = await getWithRetry(`${BASE}/coins/markets`, fallbackParams);
      console.log('CoinGecko fallback API success:', data.length, 'total tokens');
      return data;
    } catch (fallbackErr) {
      console.error('CoinGecko fallback also failed:', fallbackErr);
      return []; // Return empty on total failure
    }
  }
}

export async function fetchOHLCV(coinId: string, days = 30): Promise<OHLCV[]> {
  const { data } = await axios.get<{ prices: [number, number][] }>(
    `${BASE}/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: 'usd',
        days,
        interval: days <= 1 ? 'hourly' : 'daily',
      },
    }
  );

  return data.prices.map(([timestamp, close], i) => ({
    timestamp,
    open: i > 0 ? data.prices[i - 1][1] : close,
    high: close * (1 + Math.random() * 0.02),
    low: close * (1 - Math.random() * 0.02),
    close,
    volume: Math.random() * 1e8,
  }));
}

export async function fetchGlobalStats(): Promise<{
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
}> {
  const { data } = await axios.get(`${BASE}/global`);
  return data.data;
}
