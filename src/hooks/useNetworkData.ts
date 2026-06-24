import { useEffect } from 'react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { STATIC_NETWORKS } from '@/constants/networks';
import { fetchChainTVLs } from '@/api/defillama';
import type { Network } from '@/store/types';

export function useNetworkData() {
  const setNetworks = useGalaxyStore((s) => s.setNetworks);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const chainTVLs = await fetchChainTVLs();
        if (cancelled) return;

        const tvlMap = new Map<string, number>();
        chainTVLs.forEach((c) => {
          tvlMap.set(c.name.toLowerCase(), c.tvl);
        });

        const totalTVL = chainTVLs.reduce((sum, c) => sum + c.tvl, 0);

        const networks: Network[] = STATIC_NETWORKS.map((n) => {
          const tvl = n.id === 'excalibur-nexus'
            ? 120e6
            : tvlMap.get(n.name.toLowerCase()) ??
              tvlMap.get(n.id.toLowerCase()) ??
              tvlMap.get(n.defiLlamaSlug.toLowerCase()) ??
              1e9;

          return {
            ...n,
            tvl,
            tvlChange24h: 0, // TODO: Get real TVL change from DefiLlama
            tokenCount: 0, // TODO: Get real token count from API
            dominance: (tvl / totalTVL) * 100,
          };
        });

        networks.sort((a, b) => b.tvl - a.tvl);
        setNetworks(networks);
      } catch (err) {
        if (cancelled) return;
        console.error('[useNetworkData] Failed to fetch real data:', err);
        // Set empty networks on error - no mock fallback
        setNetworks([]);
      }
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [setNetworks]);
}
