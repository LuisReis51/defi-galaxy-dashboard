import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import type { Token, Network } from '@/store/types';
import { useGalaxyStore } from '@/store/galaxyStore';
import { socialScoreToGlow, priceChangeToColor } from '@/utils/colors';
import { formatPrice } from '@/utils/math';
import { TokenTrail } from './TokenTrail';
import { IdentityRing } from './IdentityRing';
import { TokenLogo } from './TokenLogo';
import { getInheritedTokenTraits } from '@/constants/networks';

interface TokenSatelliteProps {
  token: Token;
}

const XGT_GOLD = new THREE.Color('#ffd700');
const XGT_GOLD_DIM = new THREE.Color('#b8860b');

export function TokenSatellite({ token }: TokenSatelliteProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const selectToken = useGalaxyStore((s) => s.selectToken);
  const isPaused = useGalaxyStore((s) => s.isPaused);
  const setPaused = useGalaxyStore((s) => s.setPaused);
  const [hovered, setHovered] = useState(false);
  const networks = useGalaxyStore((s) => s.networks);
  const [isMobile, setIsMobile] = useState(false);
  const [distance, setDistance] = useState(0);

  // Detect mobile for touch optimization
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isXGT = token.isHighlighted === true;

  // Get parent network for inheritance
  const parentNetwork = useMemo(() => 
    networks.find(n => n.id === token.networkId), 
    [networks, token.networkId]
  );

  // Apply network inheritance
  const inheritedTraits = useMemo(() => {
    if (parentNetwork && !isXGT) {
      return getInheritedTokenTraits(token, parentNetwork);
    }
    return null;
  }, [parentNetwork, token, isXGT]);

  useEffect(() => {
    return () => { document.body.style.cursor = 'crosshair'; };
  }, []);

  // Handle hover pause for tokens
  useEffect(() => {
    if (hovered) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  }, [hovered, setPaused]);

  const glowIntensity = useMemo(() => {
    if (inheritedTraits) {
      return inheritedTraits.glowIntensity;
    }
    return socialScoreToGlow(token.socialScore);
  }, [inheritedTraits, token.socialScore]);

  const color = useMemo(() => {
    if (isXGT) {
      return new THREE.Color(token.color || XGT_GOLD);
    }
    if (token.color) {
      return new THREE.Color(token.color);
    }
    if (inheritedTraits) {
      return inheritedTraits.baseColor;
    }
    return new THREE.Color().setHSL((token.orbitPhase * 137.5) % 360 / 360, 0.8, 0.6);
  }, [inheritedTraits, token.orbitPhase, token.color, isXGT]);

  const sphereRadius = isXGT ? 0.55 : 0.35;

  // DEBUG: Check satellite properties
  console.log(`🛰️ ${token.symbol} Satellite:`, {
    orbitRadius: token.orbitRadius,
    sphereRadius,
    marketCap: token.marketCap,
    rank: token.rank,
    position: groupRef.current?.position.toArray()
  });

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Calculate distance from camera for LOD
    const cameraDistance = groupRef.current.position.distanceTo(state.camera.position);
    setDistance(cameraDistance);
    
    // Skip animation when paused
    if (isPaused) return;
    
    const time = state.clock.elapsedTime;
    const SPEED = isMobile ? 0.35 : 1;            // 35% speed on phones
    const angle = token.orbitPhase + time * token.orbitSpeed * SPEED;
    groupRef.current.position.set(
      Math.cos(angle) * token.orbitRadius,
      Math.sin(angle * 0.3) * 1.5,
      Math.sin(angle) * token.orbitRadius
    );
    if (meshRef.current) {
      meshRef.current.rotation.y += isXGT ? 0.035 : 0.02;
      if (isXGT) {
        const pulse = 1 + Math.sin(time * 2.2) * 0.06;
        meshRef.current.scale.setScalar(pulse);
      }
    }
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.018;
      haloRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
    }
  });

  return (
    <>
    <TokenTrail
      orbitRadius={token.orbitRadius}
      orbitSpeed={token.orbitSpeed}
      orbitPhase={token.orbitPhase}
      color={color}
    />
    <group ref={groupRef}>
      {/* XGT outer halo ring */}
      {isXGT && (
        <mesh ref={haloRef} rotation={[Math.PI / 2.3, 0, 0]}>
          <ringGeometry args={[sphereRadius * 1.6, sphereRadius * 2.2, 64]} />
          <meshBasicMaterial
            color={XGT_GOLD}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* XGT outer glow atmosphere */}
      {isXGT && (
        <mesh>
          <sphereGeometry args={[sphereRadius * 1.4, 16, 16]} />
          <meshBasicMaterial color={XGT_GOLD} transparent opacity={0.06} depthWrite={false} side={THREE.BackSide} />
        </mesh>
      )}

      {/* Visible satellite */}
      <Sphere
        ref={meshRef}
        args={[sphereRadius, isXGT ? 32 : 16, isXGT ? 32 : 16]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={isXGT ? XGT_GOLD : color}
          emissive={isXGT ? XGT_GOLD_DIM : color}
          emissiveIntensity={isXGT ? 1.2 + (hovered ? 0.8 : 0) : glowIntensity * (hovered ? 1.5 : 1)}
          roughness={isXGT ? 0.05 : (inheritedTraits?.surfacePattern === 'pos' ? 0.15 : 0.2)}
          metalness={isXGT ? 0.95 : (inheritedTraits?.surfacePattern === 'pos' ? 0.8 : 0.6)}
          transparent
          opacity={isXGT ? 0.7 : (inheritedTraits?.transparency ?? 0.7)}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Identity Ring - Camera-facing holographic ring */}
      <IdentityRing token={token} distance={distance} />
      
      {/* Token Logo - Camera-facing with LOD */}
      <TokenLogo token={token} distance={distance} />

      {/* Invisible, enlarged tap target for mobile */}
      <mesh
        onPointerDown={(e) => { e.stopPropagation(); selectToken(token); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'crosshair'; }}
      >
        <sphereGeometry args={[sphereRadius * (isMobile ? 3 : 1.5), 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* XGT always-on point light */}
      {isXGT && (
        <pointLight color={XGT_GOLD} intensity={3.5} distance={8} decay={2} />
      )}

      {/* Inherited energy effects for non-XGT tokens */}
      {!isXGT && inheritedTraits && (
        <>
          {/* Energy glow based on network TVL */}
          {inheritedTraits.energyIntensity > 0.5 && (
            <mesh>
              <sphereGeometry args={[sphereRadius * 1.2, 12, 12]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={inheritedTraits.energyIntensity * 0.1} 
                depthWrite={false} 
                side={THREE.BackSide} 
              />
            </mesh>
          )}
          
          {/* Visual style effects */}
          {inheritedTraits.visualStyle === 'neon-glowing' && (
            <pointLight color={color} intensity={inheritedTraits.energyIntensity * 1.5} distance={4} decay={2} />
          )}
          {inheritedTraits.visualStyle === 'quantum-energy' && (
            <pointLight color={color} intensity={inheritedTraits.energyIntensity * 2} distance={6} decay={1.5} />
          )}
        </>
      )}

      {/* Ordinary hover light */}
      {!isXGT && hovered && (
        <pointLight color={color} intensity={glowIntensity * 2} distance={5} decay={2} />
      )}

      {/* XGT label - only show when paused */}
      {isXGT && isPaused && (
        <Html center position={[0, sphereRadius + 0.9, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className="text-center whitespace-nowrap px-2 py-1 rounded-md"
            style={{
              background: 'rgba(2,4,8,0.82)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,215,0,0.5)',
              boxShadow: '0 0 12px rgba(255,215,0,0.25)',
            }}
          >
            <div className="flex items-center gap-1.5 justify-center mb-0.5">
              <img
                src="https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png"
                alt="XGT"
                width={14}
                height={14}
                style={{ borderRadius: '50%' }}
              />
              <span className="font-mono text-xs font-bold" style={{ color: '#ffd700' }}>XGT</span>
            </div>
            <div className="font-mono text-xs text-white/80">{formatPrice(token.price)}</div>
            <div className="font-mono text-xs" style={{ color: priceChangeToColor(token.priceChange24h) }}>
              +{token.priceChange24h.toFixed(2)}%
            </div>
          </div>
        </Html>
      )}

      {/* Ordinary token labels - only show when paused */}
      {!isXGT && isPaused && (
        <Html center position={[0, sphereRadius + 0.8, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className="text-center whitespace-nowrap px-2 py-1 rounded"
            style={{
              background: hovered ? 'rgba(2,4,8,0.85)' : 'rgba(2,4,8,0.65)',
              backdropFilter: 'blur(4px)',
              border: hovered ? '1px solid rgba(0,245,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: hovered ? '0 0 8px rgba(0,245,255,0.2)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="font-mono text-xs font-semibold" style={{ color: hovered ? '#00f5ff' : '#ffffff' }}>{token.symbol}</div>
            <div className="font-mono text-xs text-white/70">{formatPrice(token.price)}</div>
            <div
              className="font-mono text-xs"
              style={{ color: priceChangeToColor(token.priceChange24h) }}
            >
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
            </div>
            <div className="font-mono text-xs text-white/30">#{token.rank}</div>
          </div>
        </Html>
      )}
    </group>
    </>
  );
}
