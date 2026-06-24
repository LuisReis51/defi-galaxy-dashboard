import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { useGalaxyStore } from '@/store/galaxyStore';
import { TVL_TO_PLANET_RADIUS } from '@/constants/networks';
import type { Network } from '@/store/types';
import { TokenSatellite } from './TokenSatellite';

interface TokenOrbitalSystemProps {
  network: Network;
}

function OrbitalRing({ radius, color }: { radius: number; color: string }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={0.25}
    />
  );
}

export function TokenOrbitalSystem({ network }: TokenOrbitalSystemProps) {
  const allTokens = useGalaxyStore((s) => s.tokens);
  const visibleTokens = useMemo(
    () => {
      const filtered = allTokens.filter((t) => {
        const matches = t.networkId === network.id;
        if (!matches) {
          console.log(`❌ REJECTED: ${t.symbol} networkId="${t.networkId}" planet="${network.id}"`);
        }
        return matches;
      }).slice(0, 50);
      
      console.log(`✅ ${network.id}: Found ${filtered.length} matching tokens out of ${allTokens.length} total`);
      return filtered;
    },
    [allTokens, network.id]
  );

  // DEBUG: Count satellites and check data
  const networkTokenCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTokens.forEach(token => {
      counts[token.networkId] = (counts[token.networkId] || 0) + 1;
    });
    return counts;
  }, [allTokens]);

  // DEBUG: Show first 10 tokens in store to see their networkId
  console.log('🔍 First 10 tokens in store:', 
    allTokens.slice(0, 10).map(t => `${t.symbol}: ${t.networkId}`)
  );

  console.log(`🪐 ${network.id} Planet:`, {
    totalTokens: allTokens.length,
    visibleTokens: visibleTokens.length,
    networkId: network.id,
    sampleToken: visibleTokens[0] ? {
      symbol: visibleTokens[0].symbol,
      orbitRadius: visibleTokens[0].orbitRadius,
      marketCap: visibleTokens[0].marketCap,
      rank: visibleTokens[0].rank
    } : null
  });

  // DEBUG: Print satellites per network
  console.log('📊 Satellites per network:', networkTokenCounts);
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  const hasRing = network.chainId === 1 || network.dominance > 40;

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.04;
  });

  const uniqueRadii = useMemo(() => {
    const radii = new Set(
      visibleTokens.map((t) => Math.round(Math.round(t.orbitRadius / 2.2) * 2.2 * 10) / 10)
    );
    return Array.from(radii);
  }, [visibleTokens]);

  const planetRadius = TVL_TO_PLANET_RADIUS(network.tvl);

  return (
    <group position={network.position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[planetRadius, 64, 64]} />
        <meshStandardMaterial
          color={network.color}
          emissive={network.glowColor}
          emissiveIntensity={0.3}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[planetRadius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color={network.glowColor}
          transparent
          opacity={0.06}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[planetRadius * 1.5, planetRadius * 2.4, 64]} />
          <meshBasicMaterial
            color={network.glowColor}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[planetRadius * 1.55, planetRadius * 2.35, 64]} />
          <meshBasicMaterial
            color={network.color}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      <pointLight color={network.glowColor} intensity={1.5} distance={planetRadius * 8} decay={2} />

      {uniqueRadii.map((r) => (
        <OrbitalRing key={r} radius={r} color={network.glowColor} />
      ))}

      {visibleTokens.map((token) => (
        <TokenSatellite key={token.id} token={token} />
      ))}
      
      {/* DEBUG: Add a visible test satellite */}
      {visibleTokens.length === 0 && (
        <mesh position={[10, 0, 0]} frustumCulled={false}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </group>
  );
}
