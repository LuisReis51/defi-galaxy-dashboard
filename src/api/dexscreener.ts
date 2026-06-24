import axios from 'axios';

const BASE = 'https://api.dexscreener.com/latest';

export interface DexPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  baseToken: { address: string; name: string; symbol: string };
  quoteToken: { address: string; name: string; symbol: string };
  priceNative: string;
  priceUsd: string;
  volume: { h24: number; h6: number; h1: number; m5: number };
  priceChange: { h24: number; h6: number; h1: number; m5: number };
  liquidity: { usd: number; base: number; quote: number };
  fdv: number;
}

export async function fetchTopPairsByChain(
  chainId: string,
  tokenAddress: string
): Promise<DexPair[]> {
  const { data } = await axios.get<{ pairs: DexPair[] }>(
    `${BASE}/dex/tokens/${tokenAddress}`,
    { params: { chainId } }
  );
  return data?.pairs?.slice(0, 5) ?? [];
}

export async function fetchPairSearch(query: string): Promise<DexPair[]> {
  const { data } = await axios.get<{ pairs: DexPair[] }>(
    `${BASE}/dex/search`,
    { params: { q: query } }
  );
  return data?.pairs ?? [];
}
