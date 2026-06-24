/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CMC_API_KEY: string;
  readonly VITE_CMC_BASE_URL: string;
  readonly VITE_COINGECKO_API_KEY: string;
  readonly VITE_COINGECKO_BASE_URL: string;
  readonly VITE_DEFILLAMA_BASE_URL: string;
  readonly VITE_DEXSCREENER_BASE_URL: string;
  readonly VITE_XGT_CONTRACT_BSC: string;
  readonly VITE_XGT_CONTRACT_ETHEREUM: string;
  readonly VITE_XGT_COINGECKO_ID: string;
  readonly VITE_RPC_ETHEREUM: string;
  readonly VITE_RPC_BSC: string;
  readonly VITE_RPC_ARBITRUM: string;
  readonly VITE_RPC_POLYGON: string;
  readonly VITE_RPC_AVALANCHE: string;
  readonly VITE_RPC_OPTIMISM: string;
  readonly VITE_RPC_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
