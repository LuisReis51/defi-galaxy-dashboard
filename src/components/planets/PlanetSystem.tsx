import React from 'react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { Planet } from './Planet';

export function PlanetSystem() {
  const networks = useGalaxyStore((s) => s.networks);

  return (
    <group>
      {networks.map((network) => (
        <Planet key={network.id} network={network} />
      ))}
    </group>
  );
}
