import React, { useMemo } from 'react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { Wormhole } from './Wormhole';

const WORMHOLE_PAIRS: Array<[string, string]> = [
  ['ethereum', 'arbitrum'],
  ['ethereum', 'base'],
  ['ethereum', 'optimism'],
  ['ethereum', 'polygon'],
  ['bsc', 'ethereum'],
  ['ethereum', 'excalibur-nexus'],
];

export function WormholeSystem() {
  const networks = useGalaxyStore((s) => s.networks);

  const networkMap = useMemo(
    () => Object.fromEntries(networks.map((n) => [n.id, n])),
    [networks]
  );

  if (networks.length === 0) return null;

  return (
    <>
      {WORMHOLE_PAIRS.map(([fromId, toId]) => {
        const from = networkMap[fromId];
        const to   = networkMap[toId];
        if (!from || !to) return null;
        return <Wormhole key={`${fromId}-${toId}`} from={from} to={to} />;
      })}
    </>
  );
}
