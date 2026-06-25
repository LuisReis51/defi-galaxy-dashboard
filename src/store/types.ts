export type ViewState = 'galaxy' | 'planet' | 'token';

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type PlanetBiome =
  | 'gas-giant'
  | 'golden-rocky'
  | 'crystal'
  | 'ice'
  | 'ocean'
  | 'volcanic'
  | 'stormy'
  | 'metallic'
  | 'nexus';

export interface Network {
  id: string;
  name: string;
  symbol: string;
  tvl: number;
  tvlChange24h: number;
  color: string;
  glowColor: string;
  position: [number, number, number];
  chainId: number;
  rpcUrl?: string;
  iconUrl?: string;
  defiLlamaSlug: string;
  tokenCount: number;
  dominance: number;
  biome?: PlanetBiome;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  networkId: string;
  contractAddress?: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  socialScore: number;
  rank: number;
  iconUrl?: string;
  priceHistory: OHLCV[];
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  glowIntensity: number;
  color?: string;
  isHighlighted?: boolean;
  category?: string; // Token category for identity ring classification
}

export interface WalletActivity {
  direction: 'in' | 'out';
  amount: number;
  timestamp: number;
  address: string;
}

export interface GalaxyStore {
  view: ViewState;
  networks: Network[];
  tokens: Token[];
  selectedNetwork: Network | null;
  selectedToken: Token | null;
  walletActivity: WalletActivity[];
  isLoading: boolean;
  tokensLoading: boolean;
  isTransitioning: boolean;
  isPaused: boolean;
  cameraTarget: [number, number, number];
  setView: (v: ViewState) => void;
  selectNetwork: (n: Network) => void;
  selectToken: (t: Token) => void;
  back: () => void;
  setNetworks: (networks: Network[]) => void;
  setTokens: (tokens: Token[]) => void;
  setTokensLoading: (v: boolean) => void;
  setWalletActivity: (activity: WalletActivity[]) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  setTransitioning: (v: boolean) => void;
  setPaused: (v: boolean) => void;
}
