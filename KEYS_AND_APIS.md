# DeFi Galaxy Dashboard — Keys, APIs & Integration Reference

> **Last updated:** June 24, 2026 - PRODUCTION READY ✅  
> All secrets must go in `.env.local` (git-ignored). Never commit real keys.

---

## 1. Environment Variables (`.env.local` template)

```env
# ─── CoinMarketCap Pro API ────────────────────────────────────────────────────
VITE_CMC_API_KEY=                # Get from https://coinmarketcap.com/api/dashboard/
VITE_CMC_BASE_URL=https://pro-api.coinmarketcap.com

# ─── CoinGecko ────────────────────────────────────────────────────────────────
VITE_COINGECKO_API_KEY=          # Pro key (optional — free tier works without it)
VITE_COINGECKO_BASE_URL=https://api.coingecko.com/api/v3

# ─── Production (Netlify) ───────────────────────────────────────────────────────
COINGECKO_KEY=                    # Serverless function - set via Netlify CLI
# Command: npx netlify-cli env:set COINGECKO_KEY YOUR_KEY

# ─── DefiLlama ────────────────────────────────────────────────────────────────
# No API key required. Base URL only.
VITE_DEFILLAMA_BASE_URL=https://api.llama.fi

# ─── DexScreener ──────────────────────────────────────────────────────────────
# No API key required. Base URL only.
VITE_DEXSCREENER_BASE_URL=https://api.dexscreener.com/latest

# ─── XGT / Excalibur Global Token ─────────────────────────────────────────────
VITE_XGT_CONTRACT_ETHEREUM=              # TBC — ERC-20 not yet deployed
VITE_XGT_CONTRACT_BSC=0x654e38a4516f5476d723d770382a5eaf8bae0e0d
VITE_XGT_COINGECKO_ID=excalibur-global-token  # CoinGecko token ID (confirm on launch)

# ─── RPC Providers (optional — override defaults) ──────────────────────────────
VITE_RPC_ETHEREUM=https://cloudflare-eth.com
VITE_RPC_BSC=https://bsc-dataseed.binance.org
VITE_RPC_ARBITRUM=https://arb1.arbitrum.io/rpc
VITE_RPC_POLYGON=https://polygon-rpc.com
VITE_RPC_AVALANCHE=https://api.avax.network/ext/bc/C/rpc
VITE_RPC_OPTIMISM=https://mainnet.optimism.io
VITE_RPC_BASE=https://mainnet.base.org
```

Copy this block to `.env.local` and fill in secrets before running.

---

## 2. API Endpoints

### 2.1 CoinGecko (`src/api/coingecko.ts`)

| Purpose | Method | Endpoint |
|---------|--------|----------|
| Top tokens by network ecosystem | `GET` | `/coins/markets?vs_currency=usd&category={category}&order=market_cap_desc&per_page=50` |
| OHLCV history for a token | `GET` | `/coins/{id}/ohlc?vs_currency=usd&days={days}` |
| Token detail (price/mcap/vol) | `GET` | `/coins/{id}?localization=false&tickers=false` |
| Search token by symbol | `GET` | `/search?query={symbol}` |

**Category map** (used to filter tokens by chain ecosystem):

| Network | CoinGecko Category | Status |
|---------|--------------------|--------|
| Ethereum | `ethereum-ecosystem` | ✅ Working |
| BNB Chain | `binance-smart-chain` | ✅ Working |
| Solana | `solana-ecosystem` | ✅ Working |
| Arbitrum | `arbitrum-ecosystem` | ✅ Working |
| Polygon | `polygon-ecosystem` | ✅ Working |
| Avalanche | `avalanche-ecosystem` | ✅ Working |
| Optimism | `optimism-ecosystem` | ✅ Working |
| Base | `base-ecosystem` | ✅ Working |

**🔧 Serverless Function Implementation**
- **File:** `netlify/functions/tokens.mjs`
- **Endpoint:** `/.netlify/functions/tokens`
- **Method:** Sequential fetching with retry logic
- **Cache:** 2-minute TTL, no-store for partial results
- **Authentication:** `COINGECKO_KEY` environment variable
- **Rate Limiting:** 250ms delay between requests, 3 retries with backoff

**Rate limits:**
- Free tier: **30 calls/min**, **10,000 calls/month**
- Pro tier: **500 calls/min** (requires `x-cg-pro-api-key` header)
- Header: `x-cg-demo-api-key: YOUR_KEY` (Demo) or `x-cg-pro-api-key: YOUR_KEY` (Pro)

**Free-tier usage in this app:** ~8 calls per network selection (1 markets + up to 5 OHLCV).

---

### 2.2 DefiLlama (`src/api/defillama.ts`)

| Purpose | Method | Endpoint |
|---------|--------|----------|
| All chain TVLs | `GET` | `https://api.llama.fi/v2/chains` |
| All protocols TVL | `GET` | `https://api.llama.fi/protocols` |
| Protocol TVL history | `GET` | `https://api.llama.fi/protocol/{slug}` |
| Chain TVL history | `GET` | `https://api.llama.fi/v2/historicalChainTvl/{chain}` |

**Rate limits:** None officially documented. Practical limit ~300 req/min. **No API key required.**

**DefiLlama chain slugs** used in `STATIC_NETWORKS`:

| Network | Slug |
|---------|------|
| Ethereum | `ethereum` |
| BNB Chain | `bsc` |
| Solana | `solana` |
| Arbitrum | `arbitrum` |
| Polygon | `polygon` |
| Avalanche | `avax` |
| Optimism | `optimism` |
| Base | `base` |

---

### 2.3 DexScreener (`src/api/dexscreener.ts`) _(scaffolded, not yet active)_

| Purpose | Method | Endpoint |
|---------|--------|----------|
| Pairs for a token address | `GET` | `/dex/tokens/{tokenAddress}` |
| Search pairs by query | `GET` | `/dex/search?q={query}` |
| Pairs on a specific chain | `GET` | `/dex/pairs/{chainId}/{pairAddress}` |

**Rate limits:** 300 req/min. **No API key required.**

**Activate** by wiring `fetchTopPairsByChain(chainId, contractAddress)` into `TokenPairsPanel` or a new hook.

---

### 2.4 CoinMarketCap Pro API (`src/api/coinmarketcap.ts`)

| Purpose | Method | Endpoint |
|---------|--------|----------|
| XGT live price by contract | `GET` | `/v1/cryptocurrency/quotes/latest?address={contract}&convert=USD` |
| Token info by contract | `GET` | `/v1/cryptocurrency/info?address={contract}` |

**Auth header:** `X-CMC_PRO_API_KEY: {VITE_CMC_API_KEY}`  
**Dashboard:** https://coinmarketcap.com/api/dashboard/api-keys/  
**Rate limits:** Basic — 333 calls/day (10k/month). Standard — 30 calls/min.

The `useXGTPrice` hook polls this endpoint every **60 seconds** and patches the XGT token in the Zustand store in-place.

---

### 2.5 XGT — Excalibur Global Token

| Property | Value |
|----------|-------|
| Token name | Excalibur Global Token |
| Symbol | XGT |
| **Contract (BSC)** | `0x654e38a4516f5476d723d770382a5eaf8bae0e0d` |
| Contract (ETH) | TBC — ERC-20 not yet deployed |
| **Current price** | `$0.00004372` (+0.48% 24h) |
| **CMC DEX** | https://dex.coinmarketcap.com/token/bsc/0x654e38a4516f5476d723d770382a5eaf8bae0e0d/ |
| Logo 256px | `https://excaliburglobal.farm/assets/token/xgt-token-logo-256.png` |
| Logo 64px | `https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png` |
| Logo 32px | `https://excaliburglobal.farm/assets/token/xgt-token-logo-32.png` |
| Website | `https://excaliburglobal.farm` |
| Blockchain | BNB Chain primary (BEP-20) |
| Fixed orbit radius | `14.5` units (dedicated outer ring) |
| Orbit speed | `0.22` rad/s |
| Highlighted flag | `isHighlighted: true` |
| Live price source | CMC Pro API → `useXGTPrice` hook (60 s interval) |

---

## 3. npm Package Versions (key dependencies)

| Package | Version | Notes |
|---------|---------|-------|
| `react` | `^18.3.1` | — |
| `react-dom` | `^18.3.1` | — |
| `three` | `^0.167.1` | Three.js 3D engine |
| `@react-three/fiber` | `^8.17.6` | R3F v8 — DO NOT upgrade to v9 yet |
| `@react-three/drei` | `^9.109.2` | Helpers (Html, Line, Sphere, OrbitControls) |
| `@react-three/postprocessing` | `^2.19.1` | **Must stay at v2.x** — v3 has breaking API changes |
| `postprocessing` | `^6.39.1` | Peer dep for above |
| `zustand` | `^4.5.4` | State management |
| `axios` | `^1.7.3` | HTTP client |
| `lucide-react` | `^0.414.0` | Icons |
| `tailwindcss` | `^3.4.7` | CSS framework |
| `typescript` | `^5.5.4` | — |
| `vite` | `^5.3.5` | Build tool |

> **Critical:** `@react-three/postprocessing@2.x` requires `radialModulation={false}` and `modulationOffset={0}` on `<ChromaticAberration>`.

---

## 4. RPC Endpoints (all free, no key needed)

| Network | Chain ID | Free RPC | Rate Limit |
|---------|----------|----------|-----------|
| Ethereum | 1 | `https://cloudflare-eth.com` | ~100 req/s |
| BNB Chain | 56 | `https://bsc-dataseed.binance.org` | ~100 req/s |
| Arbitrum | 42161 | `https://arb1.arbitrum.io/rpc` | ~100 req/s |
| Polygon | 137 | `https://polygon-rpc.com` | ~100 req/s |
| Avalanche C-Chain | 43114 | `https://api.avax.network/ext/bc/C/rpc` | ~100 req/s |
| Optimism | 10 | `https://mainnet.optimism.io` | ~100 req/s |
| Base | 8453 | `https://mainnet.base.org` | ~100 req/s |
| Solana | — | `https://api.mainnet-beta.solana.com` | 100 req/10s |

**For production** consider Alchemy, Infura, or QuickNode:
- Alchemy: `https://eth-mainnet.g.alchemy.com/v2/{API_KEY}`
- Infura: `https://mainnet.infura.io/v3/{PROJECT_ID}`
- QuickNode: `https://{slug}.quiknode.pro/{TOKEN}/`

---

## 5. Wallet / Web3 Libraries (not yet installed — future integration)

| Library | npm Package | Use Case |
|---------|-------------|----------|
| wagmi v2 | `wagmi` | React hooks for wallet connect |
| viem | `viem` | Low-level EVM calls (replaces ethers.js) |
| RainbowKit | `@rainbow-me/rainbowkit` | Wallet connection UI |
| ethers.js v6 | `ethers` | Alternative to viem |
| @solana/web3.js | `@solana/web3.js` | Solana RPC calls |

Install all at once:
```bash
npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
```
> `@tanstack/react-query` is already in `package.json` (peer dep for wagmi). The `QueryClientProvider` wrapper was removed from `main.tsx` but will need to be **re-added** when wagmi is wired up.

---

## 6. Analytics & Price Feed APIs (optional upgrades)

| Service | Endpoint | Key Required | Notes |
|---------|----------|-------------|-------|
| CoinMarketCap | `https://pro-api.coinmarketcap.com/v1` | ✅ Yes | Header: `X-CMC_PRO_API_KEY` |
| Messari | `https://data.messari.io/api/v1` | ✅ Yes (free tier) | Header: `x-messari-api-key` |
| Etherscan | `https://api.etherscan.io/api` | ✅ Yes (free) | Param: `apikey=` |
| BscScan | `https://api.bscscan.com/api` | ✅ Yes (free) | Same as Etherscan |
| Arbiscan | `https://api.arbiscan.io/api` | ✅ Yes (free) | Same as Etherscan |
| Birdeye (Solana) | `https://public-api.birdeye.so/defi` | ✅ Yes | Header: `X-API-KEY` |
| The Graph | `https://api.thegraph.com/subgraphs/name/` | Free (rate-limited) | GraphQL |
| Uniswap V3 Subgraph | via The Graph | Free | Pool/pair data |

---

## 7. File Structure Reference

```
defi-galaxy-dashboard/
├── src/
│   ├── api/
│   │   ├── coingecko.ts        ← CoinGecko REST (active)
│   │   ├── defillama.ts        ← DefiLlama REST (active)
│   │   └── dexscreener.ts      ← DexScreener REST (scaffolded)
│   ├── constants/
│   │   └── networks.ts         ← 8 static chains, TVL/orbit scaling functions
│   ├── hooks/
│   │   ├── useNetworkData.ts   ← DefiLlama fetch, 5-min interval, cancelled flag
│   │   └── useTokenData.ts     ← CoinGecko fetch, XGT injection, 50 mock tokens
│   ├── store/
│   │   ├── galaxyStore.ts      ← Zustand store (view, selectedNetwork/Token, etc.)
│   │   └── types.ts            ← Token (isHighlighted), Network, OHLCV interfaces
│   └── components/
│       ├── tokens/
│       │   ├── TokenSatellite.tsx  ← XGT: gold sphere, halo ring, persistent label
│       │   ├── TokenTrail.tsx      ← Comet tail, gradient brightness
│       │   └── TokenOrbitalSystem.tsx  ← 50 satellites, tier-grouped rings
│       └── ...
├── .env.local                  ← ⚠️ Git-ignored — real keys go here
├── KEYS_AND_APIS.md            ← This file
└── vite.config.ts
```

---

## 8. Security Checklist

- [ ] `.env.local` is in `.gitignore` ✅
- [ ] No API keys hardcoded in source files ✅
- [ ] All env vars prefixed `VITE_` (Vite exposes only `VITE_` vars to the browser)
- [ ] CoinGecko Pro key not committed to git
- [ ] RPC provider keys not committed to git
- [ ] XGT contract addresses verified on Etherscan before going live
- [ ] Rate limit handling: axios retries (`retry: 2`) configured in old QueryClient defaults — re-implement in axios interceptors for production

---

## 9. Quick Start

```bash
# Clone + install
npm install

# Copy env template and fill secrets
cp .env.example .env.local   # (create .env.example from template above)

# Dev server
npm run dev          # http://localhost:5173

# Type check
npx tsc --noEmit

# Production build
npm run build        # tsc + vite build → dist/
```

---

*This file is the single source of truth for all external integrations. Update it whenever a new API or key is added.*
