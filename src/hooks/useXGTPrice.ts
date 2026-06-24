import { useEffect } from 'react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { fetchXGTPrice } from '@/api/coinmarketcap';

const POLL_INTERVAL = 60_000;

export function useXGTPrice() {
  const setTokens = useGalaxyStore((s) => s.setTokens);

  useEffect(() => {
    let cancelled = false;

    async function update() {
      try {
        const data = await fetchXGTPrice();
        if (cancelled) return;

        const current = useGalaxyStore.getState().tokens;
        const updated = current.map((t) =>
          t.id === 'xgt-excalibur'
            ? { ...t, price: data.price, priceChange24h: data.priceChange24h, marketCap: data.marketCap, volume24h: data.volume24h }
            : t
        );
        if (updated.some((t) => t.id === 'xgt-excalibur')) {
          setTokens(updated);
        }
      } catch {
        /* keep existing price data on failure */
      }
    }

    update();
    const interval = setInterval(update, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [setTokens]);
}
