import axios from 'axios';

const BASE = 'https://api.llama.fi';

export interface DefiLlamaProtocol {
  id: string;
  name: string;
  slug: string;
  tvl: number;
  change_1d: number;
  chains: string[];
}

export interface ChainTVL {
  name: string;
  tvl: number;
}

export async function fetchChainTVLs(): Promise<ChainTVL[]> {
  const { data } = await axios.get<ChainTVL[]>(`${BASE}/v2/chains`);
  return data;
}

export async function fetchProtocols(): Promise<DefiLlamaProtocol[]> {
  const { data } = await axios.get<DefiLlamaProtocol[]>(`${BASE}/protocols`);
  return data;
}
