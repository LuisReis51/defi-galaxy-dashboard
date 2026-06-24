import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Network } from '@/store/types';
import { useGalaxyStore } from '@/store/galaxyStore';
import { TVL_TO_PLANET_RADIUS } from '@/constants/networks';
import { formatTVL, formatPrice, formatVolume } from '@/utils/math';
import { ProceduralPlanet } from './ProceduralPlanet';
import { priceChangeToColor } from '@/utils/colors';

interface PlanetProps {
  network: Network;
}

export function Planet({ network }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const selectNetwork = useGalaxyStore((s) => s.selectNetwork);

  const selectedNetwork = useGalaxyStore((s) => s.selectedNetwork);
  const tokens = useGalaxyStore((s) => s.tokens);
  const isSelected = selectedNetwork?.id === network.id;

  const { radius, color, glowColor, hasRing, planetSeed } = useMemo(() => ({
    radius: TVL_TO_PLANET_RADIUS(network.tvl),
    color: new THREE.Color(network.color),
    glowColor: new THREE.Color(network.glowColor),
    hasRing: network.chainId === 1 || network.dominance > 40 || network.id === 'excalibur-nexus',
    planetSeed: Math.abs(network.chainId % 100) + network.id.length * 0.37,
  }), [network.tvl, network.color, network.glowColor, network.chainId, network.dominance, network.id]);

  const networkTokens = useMemo(
    () => tokens.filter((t) => t.networkId === network.id).slice(0, 5),
    [tokens, network.id]
  );

  const groupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    return () => { document.body.style.cursor = 'crosshair'; };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.12;
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.04;
    if (groupRef.current) {
      const targetScale = hovered ? 1.12 : 1.0;
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * Math.min(delta * 8, 1);
      groupRef.current.scale.setScalar(newScale);
    }
  });

  return (
    <group position={network.position}>
      <group 
      ref={groupRef}
      onClick={() => selectNetwork(network)}
      onPointerOver={(e: any) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'crosshair'; }}
    >
      <ProceduralPlanet
        radius={radius}
        biome={network.biome ?? 'gas-giant'}
        seed={planetSeed}
        color={color}
        glowColor={glowColor}
        hovered={hovered}
        meshRef={meshRef}
        network={network}
      />

      <mesh>
        <sphereGeometry args={[radius * 1.18, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.13 : 0.05}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight
        color={network.glowColor}
        intensity={hovered ? 2 : 1}
        distance={radius * 6}
        decay={2}
      />

      {hasRing && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.4, 64]} />
          <meshBasicMaterial
            color={network.id === 'excalibur-nexus' ? '#ffd700' : glowColor}
            transparent
            opacity={network.id === 'excalibur-nexus' ? 0.30 : 0.18}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[radius * 1.55, radius * 2.35, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      <Html
        center
        position={[0, radius + 1.2, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          className="text-center px-2 py-1 rounded"
          style={{
            background: 'rgba(2,4,8,0.55)',
            backdropFilter: 'blur(4px)',
            border: hovered ? `1px solid ${network.glowColor}55` : '1px solid transparent',
            transition: 'border-color 0.2s',
          }}
        >
          <div
            className="font-display font-semibold text-sm tracking-wider"
            style={{ color: network.glowColor, textShadow: `0 0 8px ${network.glowColor}` }}
          >
            {network.name}
          </div>
          <div className="font-mono text-xs text-white/60 mt-0.5">
            TVL {formatTVL(network.tvl)}
          </div>
          {hovered && (
            <div className="font-mono text-xs text-white/35 mt-0.5">
              {network.dominance.toFixed(1)}% dominance
            </div>
          )}
        </div>
      </Html>

      {isSelected && networkTokens.length > 0 && (
        <Html
          position={[radius * 2.2, radius * 0.8, 0]}
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
          distanceFactor={18}
        >
          <div
            style={{
              width: 210,
              background: 'rgba(2,4,12,0.88)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${network.glowColor}55`,
              borderRadius: 8,
              padding: '10px 12px',
              boxShadow: `0 0 24px ${network.glowColor}22`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: network.color, boxShadow: `0 0 6px ${network.glowColor}` }} />
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: network.glowColor, letterSpacing: 2, textTransform: 'uppercase' }}>
                {network.name}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>TVL</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#ffd700' }}>{formatTVL(network.tvl)}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Dominance</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#00f5ff' }}>{network.dominance.toFixed(1)}%</div>
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 4 }}>Top Tokens</div>
            {networkTokens.map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t.symbol}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{formatPrice(t.price)}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: priceChangeToColor(t.priceChange24h) }}>
                    {t.priceChange24h >= 0 ? '+' : ''}{t.priceChange24h.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Html>
      )}
      </group>
    </group>
  );
}
