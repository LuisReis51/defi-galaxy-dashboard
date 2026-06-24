import { useEffect } from 'react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { MARKET_CAP_TO_ORBIT_RADIUS, VOLUME_TO_ORBIT_SPEED } from '@/constants/networks';
import type { Token } from '@/store/types';

// Helper functions for real data calculations
function calculateSocialScore(marketCapRank: number, volume: number): number {
  // Higher rank (lower number) and higher volume = higher social score
  const rankScore = Math.max(0, 100 - (marketCapRank - 1) * 2);
  const volumeScore = Math.min(50, Math.log10(volume + 1) * 5);
  return Math.min(100, rankScore * 0.7 + volumeScore * 0.3);
}

function calculateGlowIntensity(marketCapRank: number, volume: number): number {
  // Top 10 tokens glow more, volume also contributes
  const rankGlow = marketCapRank <= 10 ? 1.5 - (marketCapRank - 1) * 0.1 : 0.5;
  const volumeGlow = Math.min(0.5, Math.log10(volume + 1) * 0.1);
  return Math.min(2, rankGlow + volumeGlow);
}

function calculateTokenColor(marketCapRank: number, priceChange24h: number): string {
  // Color based on market cap rank and price performance
  const hue = (marketCapRank * 30) % 360; // Different hue per rank
  const saturation = 60 + Math.min(40, Math.abs(priceChange24h) * 2); // Brighter for bigger changes
  const lightness = priceChange24h >= 0 ? 60 : 40; // Lighter for gains, darker for losses
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// REMOVED: detectTokenNetwork function - we use the actual network being fetched for

function generateMockOHLCV(basePrice: number, days = 30) {
  const result = [];
  let price = basePrice;
  const now = Date.now();
  for (let i = days; i >= 0; i--) {
    const change = (Math.random() - 0.48) * 0.06;
    price = price * (1 + change);
    result.push({
      timestamp: now - i * 86400000,
      open: price * (1 - Math.random() * 0.01),
      high: price * (1 + Math.random() * 0.02),
      low: price * (1 - Math.random() * 0.02),
      close: price,
      volume: Math.random() * 1e8,
    });
  }
  return result;
}

export function useTokenData() {
  const setTokens = useGalaxyStore((s) => s.setTokens);
  const setTokensLoading = useGalaxyStore((s) => s.setTokensLoading);

  useEffect(() => {
    let cancelled = false;

    async function loadAllNetworks() {
      setTokensLoading(true);
      
      // API key is now server-side in serverless function - no client key needed
      
      // Clear cache for testing if needed
      if (window.location.search.includes('clearCache')) {
        localStorage.removeItem('defi-galaxy-tokens-cache');
        localStorage.removeItem('defi-galaxy-tokens-cache-timestamp');
      }
      
      try {
        // Check cache first
        const cacheKey = 'defi-galaxy-tokens-cache';
        const cacheTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);
        const cacheData = localStorage.getItem(cacheKey);
        const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
        
        if (cacheData && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp);
          if (age < CACHE_TTL) {
            const cachedTokens = JSON.parse(cacheData);
            setTokens(cachedTokens);
            setTokensLoading(false);
            return;
          }
        }
        
        // Load tokens from serverless function (single call, shared cache)
        const response = await fetch('/.netlify/functions/tokens');
        if (!response.ok) {
          throw new Error(`Serverless function failed: ${response.status}`);
        }
        
        const networkData = await response.json();
        
        const networks = ['ethereum', 'bsc', 'solana', 'arbitrum', 'polygon', 'avalanche', 'optimism', 'base'];
        const allTokens: Token[] = [];
        
        for (const networkId of networks) {
          if (cancelled) return;
          
          const markets = networkData[networkId] || [];

        const networkTokens: Token[] = markets.slice(0, 20).map((m: any, i: number) => ({
          id: `${networkId}-${m.id}`, // ✅ FIXED: Network-specific ID to avoid duplicates
          symbol: m.symbol.toUpperCase(),
          name: m.name,
          networkId: networkId, // ✅ FIXED: Use the actual network being fetched for
          price: m.current_price,
          priceChange24h: m.price_change_percentage_24h ?? 0,
          marketCap: m.market_cap,
          volume24h: m.total_volume,
          socialScore: calculateSocialScore(m.market_cap_rank ?? i + 1, m.total_volume),
          rank: m.market_cap_rank ?? i + 1,
          iconUrl: m.image,
          priceHistory: generateMockOHLCV(m.current_price), // TODO: Replace with real OHLCV
          orbitRadius: MARKET_CAP_TO_ORBIT_RADIUS(m.market_cap_rank ?? i + 1),
          orbitSpeed: VOLUME_TO_ORBIT_SPEED(m.total_volume),
          orbitPhase: (i / 20) * Math.PI * 2, // ✅ FIXED: Use 20 tokens for even distribution
          glowIntensity: calculateGlowIntensity(m.market_cap_rank ?? i + 1, m.total_volume),
          color: calculateTokenColor(m.market_cap_rank ?? i + 1, m.price_change_percentage_24h ?? 0),
        }));

        // Add XGT token for BSC network
        if (networkId === 'bsc') {
          networkTokens.push({
            id: 'xgt-excalibur',
            symbol: 'XGT',
            name: 'Excalibur Global Token',
            networkId: networkId,
            contractAddress: '0x654e38a4516f5476d723d770382a5eaf8bae0e0d',
            price: 0.00004372,
            priceChange24h: 0.48,
            marketCap: 42e6,
            volume24h: 3.2e6,
            socialScore: 95,
            rank: 1,
            iconUrl: 'https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png',
            priceHistory: generateMockOHLCV(0.00004372),
            orbitRadius: 6.0,
            orbitSpeed: 0.5,
            orbitPhase: Math.PI * 0.5,
            glowIntensity: 2.0,
            color: '#FFD700', // Gold color for XGT
            isHighlighted: true,
          });
        }

        allTokens.push(...networkTokens);
      }

      // Only update tokens if we have all networks (resilience against partial loads)
      const uniqueNetworks = new Set(allTokens.map(t => t.networkId)).size;
      if (uniqueNetworks === networks.length) {
        setTokens(allTokens);
      } else if (allTokens.length > 0) {
        console.warn('⚠️ Partial load detected, keeping previous tokens to prevent planets from disappearing');
      } else {
        setTokens(allTokens); // Only set empty if truly empty
      }
      
      // Only cache complete results (all networks loaded)
      if (allTokens.length > 0 && uniqueNetworks === networks.length) {
        localStorage.setItem(cacheKey, JSON.stringify(allTokens));
        localStorage.setItem(`${cacheKey}-timestamp`, Date.now().toString());
      }
      } catch (err) {
        console.error('Failed to load tokens:', err);
        // Keep existing tokens on error
      } finally {
        setTokensLoading(false);
      }
    }

    loadAllNetworks();

    return () => {
      cancelled = true;
    };
  }, [setTokens, setTokensLoading]); // ✅ FIXED: No dependency on selectedNetwork or view
}
