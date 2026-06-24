import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, Globe, Zap, BarChart3, Search, X, TrendingUp, TrendingDown, Activity, Maximize2, Minimize2, Menu, Layers } from 'lucide-react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { formatTVL, formatPrice, formatVolume } from '@/utils/math';
import { priceChangeToColor } from '@/utils/colors';

function GalaxyLeaderboard({ isMobile }: { isMobile?: boolean }) {
  const networks = useGalaxyStore((s) => s.networks);
  const top = [...networks].sort((a, b) => b.tvl - a.tvl).slice(0, 6);
  const totalTVL = networks.reduce((s, n) => s + n.tvl, 0);

  if (networks.length === 0) return null;

  return (
    <div className={isMobile ? 'relative w-full' : 'absolute right-6 top-20 w-60'}>
      <div className="holo-panel rounded-lg p-4">
        <div className="font-mono text-xs text-white/40 uppercase tracking-wider mb-3">Network Leaderboard</div>
        <div className="space-y-2">
          {top.map((n, i) => {
            const barWidth = (n.tvl / top[0].tvl) * 100;
            const medalColor = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : null;
            return (
              <div
                key={n.id}
                className="cursor-pointer group rounded px-1 py-0.5 -mx-1 transition-colors hover:bg-white/[0.04]"
                onClick={() => useGalaxyStore.getState().selectNetwork(n)}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-mono text-xs w-4"
                      style={{ color: medalColor ?? 'rgba(255,255,255,0.3)' }}
                    >{i + 1}</span>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: n.color, boxShadow: `0 0 5px ${n.glowColor}` }}
                    />
                    <span className="font-mono text-xs text-white/70 group-hover:text-white/90 transition-colors">{n.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs text-neon-gold">{formatTVL(n.tvl)}</span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: priceChangeToColor(n.tvlChange24h) }}
                    >
                      {n.tvlChange24h >= 0 ? '+' : ''}{n.tvlChange24h.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: n.color,
                      boxShadow: `0 0 4px ${n.glowColor}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-panel-border">
          <div className="flex justify-between">
            <span className="font-mono text-xs text-white/30">Total DeFi TVL</span>
            <span className="font-mono text-xs font-semibold text-neon-cyan">{formatTVL(totalTVL)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function NetworkStatsPanel({ isMobile }: { isMobile?: boolean }) {
  const selectedNetwork = useGalaxyStore((s) => s.selectedNetwork);
  const tokens = useGalaxyStore((s) => s.tokens);
  const tokensLoading = useGalaxyStore((s) => s.tokensLoading);
  if (!selectedNetwork) return null;

  const networkTokens = tokens.filter((t) => t.networkId === selectedNetwork.id).slice(0, 5);
  const actualTokenCount = tokens.filter((t) => t.networkId === selectedNetwork.id).length;

  return (
    <div className={isMobile ? 'relative w-full' : 'absolute left-6 top-20 w-60 '}>
      <div className="holo-panel rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: selectedNetwork.color, boxShadow: `0 0 8px ${selectedNetwork.glowColor}` }}
          />
          <span className="font-display font-semibold text-sm" style={{ color: selectedNetwork.glowColor }}>
            {selectedNetwork.name}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-panel-border">
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">TVL</div>
            <div className="font-mono text-sm text-neon-gold">{formatTVL(selectedNetwork.tvl)}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Tokens</div>
            <div className="font-mono text-sm text-white/80">{actualTokenCount}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Dominance</div>
            <div className="font-mono text-sm text-neon-cyan">{selectedNetwork.dominance.toFixed(1)}%</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">24H</div>
            <div
              className="font-mono text-sm font-semibold"
              style={{ color: priceChangeToColor(selectedNetwork.tvlChange24h) }}
            >
              {selectedNetwork.tvlChange24h >= 0 ? '+' : ''}{selectedNetwork.tvlChange24h.toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="font-mono text-xs text-white/40 uppercase mb-2">Top Tokens</div>
          {tokensLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-1 py-0.5">
                <div className="h-2.5 rounded bg-white/10 animate-pulse" style={{ width: `${32 + i * 8}%` }} />
                <div className="h-2.5 w-12 rounded bg-white/10 animate-pulse" />
              </div>
            ))
          ) : (
            networkTokens.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between cursor-pointer hover:bg-white/5 px-1 py-0.5 rounded transition-colors"
                onClick={() => useGalaxyStore.getState().selectToken(t)}
              >
                <span className="font-mono text-xs text-white/70">{t.symbol}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-white/50">{formatPrice(t.price)}</span>
                  <span
                    className="font-mono text-xs flex items-center gap-0.5"
                    style={{ color: priceChangeToColor(t.priceChange24h) }}
                  >
                    {t.priceChange24h >= 0
                      ? <TrendingUp size={9} />
                      : <TrendingDown size={9} />
                    }
                    {Math.abs(t.priceChange24h).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function TokenInfoPanel({ isMobile }: { isMobile?: boolean }) {
  const token = useGalaxyStore((s) => s.selectedToken);
  const network = useGalaxyStore((s) => s.selectedNetwork);
  if (!token) return null;

  const isXGT = token.isHighlighted === true;
  const changeColor = priceChangeToColor(token.priceChange24h);
  const changeSign = token.priceChange24h >= 0 ? '+' : '';
  const accentColor = isXGT ? '#ffd700' : network?.glowColor ?? '#00bcd4';

  return (
    <div className={isMobile ? 'relative w-full' : 'absolute left-6 top-20 w-60 '}>
      <div className="holo-panel rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          {isXGT && (
            <img
              src="https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png"
              alt="XGT"
              width={24}
              height={24}
              style={{ borderRadius: '50%', boxShadow: '0 0 8px rgba(255,215,0,0.5)' }}
            />
          )}
          <div>
            <div className="font-display font-semibold text-sm" style={{ color: accentColor }}>
              {token.name}
            </div>
            <div className="font-mono text-xs text-white/50">{token.symbol}</div>
          </div>
        </div>

        <div className="mb-3 pb-3 border-b border-panel-border">
          <div className="font-mono text-2xl font-bold text-white">{formatPrice(token.price)}</div>
          <div className="font-mono text-sm font-semibold" style={{ color: changeColor }}>
            {changeSign}{token.priceChange24h.toFixed(2)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Market Cap</div>
            <div className="font-mono text-sm text-neon-gold">{formatVolume(token.marketCap)}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">24H Volume</div>
            <div className="font-mono text-sm text-neon-cyan">{formatVolume(token.volume24h)}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Rank</div>
            <div className="font-mono text-sm text-white/80">#{token.rank}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/40 uppercase">Network</div>
            <div className="font-mono text-sm text-white/80">{network?.symbol ?? '—'}</div>
          </div>
        </div>

        {isXGT && (
          <div className="mt-2 pt-2 border-t border-panel-border">
            <div className="font-mono text-xs text-white/40 uppercase mb-1">Contract</div>
            <div className="font-mono text-xs text-white/60 break-all">
              {token.contractAddress}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TokenSearchPanel({ isMobile }: { isMobile?: boolean }) {
  const [query, setQuery] = useState('');
  const tokens = useGalaxyStore((s) => s.tokens);
  const view = useGalaxyStore((s) => s.view);
  const selectedNetwork = useGalaxyStore((s) => s.selectedNetwork);
  const tokensLoading = useGalaxyStore((s) => s.tokensLoading);
  const selectToken = useGalaxyStore((s) => s.selectToken);

  if (view === 'galaxy') return null;

  const pool = view === 'planet' && selectedNetwork
    ? tokens.filter((t) => t.networkId === selectedNetwork.id)
    : tokens;

  const sorted = [...pool].sort((a, b) => b.marketCap - a.marketCap);

  const results = query.trim().length > 0
    ? sorted.filter(
        (t) =>
          t.symbol.toLowerCase().includes(query.toLowerCase()) ||
          t.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : sorted.slice(0, 5);

  return (
    <div className={isMobile ? 'relative w-full' : 'absolute right-6 top-20 w-56 '}>
      <div className="holo-panel rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Search size={12} className="text-white/40 flex-shrink-0" />
          <input
            className="bg-transparent font-mono text-xs text-white/80 placeholder-white/30 outline-none w-full"
            placeholder={view === 'planet' && selectedNetwork ? `Search ${selectedNetwork.name} tokens...` : 'Search tokens...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={10} className="text-white/40 hover:text-white/70" />
            </button>
          )}
        </div>
        {tokensLoading && !query && (
          <div className="space-y-1.5 border-t border-panel-border pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-1 py-0.5">
                <div className="h-2.5 rounded bg-white/10 animate-pulse" style={{ width: `${40 + i * 6}%` }} />
                <div className="h-2.5 w-10 rounded bg-white/10 animate-pulse" />
              </div>
            ))}
          </div>
        )}
        {!tokensLoading && query.trim() && results.length === 0 && (
          <div className="border-t border-panel-border pt-2">
            <div className="font-mono text-xs text-white/25 text-center py-2">No tokens found</div>
          </div>
        )}
        {!tokensLoading && results.length > 0 && (
          <div className="space-y-1 border-t border-panel-border pt-2">
            {!query ? (
              <div className="font-mono text-xs text-white/25 uppercase tracking-wider mb-1">
                Top by Market Cap
              </div>
            ) : (
              <div className="font-mono text-xs text-white/25 uppercase tracking-wider mb-1">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
            )}
            {results.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between cursor-pointer hover:bg-white/5 px-1 py-1 rounded transition-colors"
                style={t.isHighlighted ? { background: 'rgba(255,215,0,0.04)', borderLeft: '2px solid rgba(255,215,0,0.4)', paddingLeft: '6px' } : {}}
                onClick={() => { selectToken(t); setQuery(''); }}
              >
                <div>
                  <div
                    className={t.isHighlighted ? 'font-mono text-xs font-semibold' : 'font-mono text-xs font-semibold text-neon-cyan'}
                    style={t.isHighlighted ? { color: '#ffd700' } : {}}
                  >
                    {t.isHighlighted && '★ '}{t.symbol}
                  </div>
                  <div className="font-mono text-xs text-white/40">{t.name.slice(0, 18)}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-white/70">{formatPrice(t.price)}</div>
                  <div
                    className="font-mono text-xs"
                    style={{ color: priceChangeToColor(t.priceChange24h) }}
                  >
                    {t.priceChange24h >= 0 ? '+' : ''}{t.priceChange24h.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TokenPairsPanel({ isMobile }: { isMobile?: boolean }) {
  const token = useGalaxyStore((s) => s.selectedToken);
  if (!token) return null;

  const isXGT = token.isHighlighted === true;
  const mockPairs = isXGT
    ? [
        { dex: 'Excalibur DEX', quote: 'USDT',  price: token.price,           volume: token.volume24h * 0.52, change: token.priceChange24h },
        { dex: 'PancakeSwap',   quote: 'BNB',   price: token.price * 0.9997,  volume: token.volume24h * 0.31, change: token.priceChange24h - 0.08 },
        { dex: 'Uniswap V3',   quote: 'USDC',  price: token.price * 1.0002,  volume: token.volume24h * 0.17, change: token.priceChange24h + 0.04 },
      ]
    : [
        { dex: 'Uniswap V3', quote: 'USDC', price: token.price,          volume: token.volume24h * 0.45, change: token.priceChange24h },
        { dex: 'Uniswap V2', quote: 'WETH', price: token.price * 0.9998, volume: token.volume24h * 0.28, change: token.priceChange24h - 0.12 },
        { dex: 'Curve',      quote: 'USDT', price: token.price * 1.0001, volume: token.volume24h * 0.18, change: token.priceChange24h + 0.05 },
      ];

  return (
    <div className={isMobile ? 'relative w-full' : 'absolute left-6 top-20 w-64 '}>
      <div
        className="holo-panel rounded-lg p-4"
        style={isXGT ? { border: '1px solid rgba(255,215,0,0.35)', boxShadow: '0 0 18px rgba(255,215,0,0.08)' } : {}}
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity size={12} style={{ color: isXGT ? '#ffd700' : undefined }} className={isXGT ? '' : 'text-neon-cyan'} />
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Live Pairs</span>
          {isXGT && <span className="font-mono text-xs ml-auto" style={{ color: '#ffd700' }}>★ XGT</span>}
        </div>

        <div className="mb-3 pb-2 border-b border-panel-border">
          <div className="flex items-center gap-2 mb-0.5">
            {isXGT && (
              <img src="https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png" alt="XGT" width={18} height={18} style={{ borderRadius: '50%' }} />
            )}
            <div
              className={isXGT ? 'font-display text-sm font-semibold' : 'font-display text-sm font-semibold neon-text-cyan'}
              style={isXGT ? { color: '#ffd700' } : {}}
            >{token.symbol}{isXGT && <span className="font-mono text-xs text-white/40 ml-2">Excalibur Global Token</span>}</div>
          </div>
          <div className="font-mono text-xl font-bold text-white">{formatPrice(token.price)}</div>
          <div
            className="font-mono text-xs font-semibold"
            style={{ color: priceChangeToColor(token.priceChange24h) }}
          >
            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}% 24h
          </div>
        </div>

        <div className="space-y-2">
          {mockPairs.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
              <div>
                <div className="font-mono text-xs text-white/70">{p.dex}</div>
                <div className="font-mono text-xs text-white/30">{token.symbol}/{p.quote}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-white/80">{formatPrice(p.price)}</div>
                <div className="font-mono text-xs text-white/40">{formatVolume(p.volume)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-panel-border">
          <div>
            <div className="font-mono text-xs text-white/30">Market Cap</div>
            <div className={isXGT ? 'font-mono text-xs' : 'font-mono text-xs text-neon-gold'} style={isXGT ? { color: '#ffd700' } : {}}>{formatVolume(token.marketCap)}</div>
          </div>
          <div>
            <div className="font-mono text-xs text-white/30">24H Vol</div>
            <div className={isXGT ? 'font-mono text-xs' : 'font-mono text-xs text-neon-cyan'} style={isXGT ? { color: '#ffd700' } : {}}>{formatVolume(token.volume24h)}</div>
          </div>
        </div>

        {isXGT && (
          <div className="mt-3 pt-2 border-t border-panel-border space-y-1.5">
            <div className="font-mono text-xs text-white/30 uppercase tracking-wider">Contract (BSC)</div>
            <div
              className="font-mono text-xs break-all"
              style={{ color: 'rgba(255,215,0,0.6)', fontSize: '9px', lineHeight: '1.4' }}
            >
              {token.contractAddress}
            </div>
            <a
              href="https://dex.coinmarketcap.com/token/bsc/0x654e38a4516f5476d723d770382a5eaf8bae0e0d/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 mt-1 font-mono text-xs"
              style={{ color: '#ffd700', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '10px' }}>↗</span>
              View on CMC DEX
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function MarketTicker() {
  const networks = useGalaxyStore((s) => s.networks);
  const tokens = useGalaxyStore((s) => s.tokens);
  const [paused, setPaused] = useState(false);

  const items = [
    ...networks.map((n) => ({
      label: n.symbol,
      value: formatTVL(n.tvl),
      change: n.tvlChange24h,
      key: `net-${n.id}`,
    })),
    ...tokens.slice(0, 12).map((t) => ({
      label: t.symbol,
      value: formatPrice(t.price),
      change: t.priceChange24h,
      key: `tok-${t.id}`,
    })),
  ];

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <>
      {/* Key Reference Guide */}
      <div className="absolute bottom-8 left-4 pointer-events-none">
        <div className="text-xs font-mono text-white/30 space-y-1">
          <div>Hover/Touch: Pause & Show Info</div>
          <div>ESC: Back | G: Galaxy | F: Fullscreen</div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden  border-t border-panel-border bg-black/40 backdrop-blur-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
      <div
        className="flex items-center h-full gap-6 px-4"
        style={{
          animation: 'ticker 40s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}
      >
        {doubled.map((item, i) => (
          <span key={`${item.key}-${i}`} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-mono text-xs text-white/50">{item.label}</span>
            <span className="font-mono text-xs text-white/80">{item.value}</span>
            <span
              className="font-mono text-xs"
              style={{ color: priceChangeToColor(item.change) }}
            >
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
            <span className="text-white/10 font-mono text-xs ml-2">·</span>
          </span>
        ))}
      </div>
    </div>
    </>
  );
}

export function HUDOverlay() {
  const view = useGalaxyStore((s) => s.view);
  const selectedNetwork = useGalaxyStore((s) => s.selectedNetwork);
  const selectedToken = useGalaxyStore((s) => s.selectedToken);
  const networks = useGalaxyStore((s) => s.networks);
  const tokensLoading = useGalaxyStore((s) => s.tokensLoading);
  const back = useGalaxyStore((s) => s.back);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [panelOpen, setPanelOpen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFullscreen]);

  const totalTVL = networks.reduce((acc: number, n) => acc + n.tvl, 0);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 pointer-events-auto">
        <div className="flex items-center gap-4">
          {view !== 'galaxy' && (
            <button
              onClick={back}
              className="btn-holo flex items-center gap-2 rounded"
            >
              <ChevronLeft size={14} />
              Back
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="font-display font-semibold text-neon-cyan tracking-widest text-sm uppercase">
              DeFi Galaxy
            </span>
          </div>
          {selectedNetwork && (
            <div className="font-mono text-white/50 text-sm">
              / <span className="text-white/80">{selectedNetwork.name}</span>
            </div>
          )}
          {selectedToken && (
            <div className="font-mono text-white/50 text-sm">
              / <span className="text-white/80">{selectedToken.symbol}</span>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="holo-panel px-3 py-1.5 flex items-center gap-2 rounded">
            <Globe size={12} className="text-neon-cyan" />
            <span className="font-mono text-xs text-white/60">{networks.length} chains</span>
          </div>
          <div className="holo-panel px-3 py-1.5 flex items-center gap-2 rounded">
            <BarChart3 size={12} className="text-neon-gold" />
            <span className="font-mono text-xs text-neon-gold">{formatTVL(totalTVL)} TVL</span>
          </div>
          <div className="holo-panel px-3 py-1.5 flex items-center gap-2 rounded">
            <Zap size={12} className="text-neon-green" />
            <span className="font-mono text-xs text-neon-green">LIVE</span>
          </div>
          <button
            className="holo-panel px-2 py-1.5 flex items-center rounded transition-colors hover:bg-white/5"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen
              ? <Minimize2 size={12} className="text-white/50" />
              : <Maximize2 size={12} className="text-white/50" />
            }
          </button>
        </div>
        <button
          className="sm:hidden holo-panel p-2 flex items-center rounded"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 size={12} className="text-white/50" /> : <Maximize2 size={12} className="text-white/50" />}
        </button>
      </div>

      {/* Desktop panels */}
      {!isMobile && view === 'galaxy' && <GalaxyLeaderboard />}
      {!isMobile && view === 'planet' && <NetworkStatsPanel />}
      {!isMobile && view === 'token' && <TokenInfoPanel />}

      {/* Mobile panel sheet */}
      {isMobile && panelOpen && (
        <div className="fixed inset-x-0 top-14 z-50  overflow-y-auto" style={{ maxHeight: 'calc(100vh - 3.5rem)', background: 'rgba(2,4,10,0.92)', backdropFilter: 'blur(16px)' }}>
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Data Panels</span>
              <button onClick={() => setPanelOpen(false)} className="holo-panel px-2 py-1 flex items-center gap-1 rounded text-xs font-mono text-white/60">
                <X size={10} /> Close
              </button>
            </div>
            {view === 'galaxy' && <GalaxyLeaderboard isMobile />}
            {view === 'planet' && <NetworkStatsPanel isMobile />}
            {view === 'token' && <TokenInfoPanel isMobile />}
            {view === 'token' && <TokenPairsPanel isMobile />}
            {view !== 'galaxy' && <TokenSearchPanel isMobile />}
          </div>
        </div>
      )}

      {/* Mobile floating toggle */}
      {isMobile && (
        <button
          className="fixed bottom-12 left-4 z-50  w-11 h-11 flex items-center justify-center rounded-full border border-neon-cyan/30"
          style={{ background: 'rgba(2,4,10,0.85)', backdropFilter: 'blur(8px)', boxShadow: '0 0 12px rgba(0,255,255,0.15)' }}
          onClick={() => setPanelOpen((o) => !o)}
        >
          {panelOpen ? <X size={16} className="text-neon-cyan" /> : <Layers size={16} className="text-neon-cyan" />}
        </button>
      )}

      {view === 'planet' && tokensLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            <p className="font-mono text-xs text-neon-cyan/60 tracking-widest uppercase">Loading tokens...</p>
          </div>
        </div>
      )}
      {!isMobile && view !== 'galaxy' && <TokenSearchPanel />}

      {!isMobile && view === 'galaxy' && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="font-mono text-xs text-white/30 tracking-wider uppercase">
            Click a planet to explore its ecosystem
          </p>
        </div>
      )}

      {!isMobile && view === 'planet' && selectedNetwork && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="font-mono text-xs text-white/30 tracking-wider uppercase">
            Tokens orbit by market cap · Speed = trading activity · Glow = social score
          </p>
        </div>
      )}

      {!isMobile && view === 'token' && selectedToken && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <p className="font-mono text-xs text-white/30 tracking-wider uppercase">
            {selectedToken.symbol} · Rank #{selectedToken.rank} · Vol {formatVolume(selectedToken.volume24h)}
          </p>
        </div>
      )}

      <div className="absolute bottom-10 right-6 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/20">
            <kbd className="px-1 py-0.5 rounded border border-white/10 text-white/30 text-xs">Esc</kbd> back
          </span>
          <span className="font-mono text-xs text-white/20">
            <kbd className="px-1 py-0.5 rounded border border-white/10 text-white/30 text-xs">G</kbd> galaxy
          </span>
          <span className="font-mono text-xs text-white/20">
            <kbd className="px-1 py-0.5 rounded border border-white/10 text-white/30 text-xs">F</kbd> fullscreen
          </span>
        </div>
      </div>

      <MarketTicker />
    </div>
  );
}
