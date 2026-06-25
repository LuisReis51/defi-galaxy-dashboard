import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ring } from '@react-three/drei';
import * as THREE from 'three';
import type { Token } from '@/store/types';

interface IdentityRingProps {
  token: Token;
  distance: number; // Distance from camera for LOD
}

// Token category to color mapping
const CATEGORY_COLORS: Record<string, string> = {
  'defi': '#00f5ff',      // Cyan
  'layer1': '#ffd700',    // Gold
  'layer2': '#ff6b6b',    // Red
  'gaming': '#9b59b6',    // Purple
  'meme': '#ff9f43',      // Orange
  'stablecoin': '#2ecc71', // Green
  'exchange': '#3498db',  // Blue
  'lending': '#e74c3c',   // Red
  'derivatives': '#f39c12', // Yellow
  'oracle': '#1abc9c',    // Turquoise
  'infrastructure': '#34495e', // Dark gray
  'nft': '#e91e63',       // Pink
  'privacy': '#95a5a6',   // Gray
  'storage': '#16a085',   // Teal
  'default': '#ecf0f1'    // Light gray
};

export function IdentityRing({ token, distance }: IdentityRingProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Calculate visual properties based on token data
  const ringColor = useMemo(() => {
    const category = token.category?.toLowerCase() || 'default';
    return new THREE.Color(CATEGORY_COLORS[category] || CATEGORY_COLORS.default);
  }, [token.category]);

  const ringThickness = useMemo(() => {
    // Map market cap to ring thickness (0.02 to 0.15)
    const marketCap = token.marketCap || 0;
    const logCap = Math.log10(Math.max(marketCap, 1));
    const normalizedThickness = (logCap - 6) / 6; // Normalize between 1M and 1T
    return Math.max(0.02, Math.min(0.15, 0.02 + normalizedThickness * 0.13));
  }, [token.marketCap]);

  const glowIntensity = useMemo(() => {
    // Map trading volume to glow intensity (0.1 to 1.0)
    const volume = token.volume24h || 0;
    const logVolume = Math.log10(Math.max(volume, 1));
    const normalizedGlow = (logVolume - 3) / 8; // Normalize between 1K and 1B
    return Math.max(0.1, Math.min(1.0, 0.1 + normalizedGlow * 0.9));
  }, [token.volume24h]);

  const pulseSpeed = useMemo(() => {
    // Map activity level to pulse speed
    const activity = token.priceChange24h || 0;
    const activityLevel = Math.abs(activity);
    return Math.max(0.5, Math.min(3.0, 0.5 + activityLevel * 0.5));
  }, [token.priceChange24h]);

  // LOD system - determine visibility based on distance
  const lodLevel = useMemo(() => {
    if (distance > 50) return 0; // Too far - no ring
    if (distance > 25) return 1; // Far - ring only
    if (distance > 10) return 2; // Medium - ring + logo
    return 3; // Close - ring + logo + details
  }, [distance]);

  // Ring radius based on satellite size
  const ringRadius = token.isHighlighted ? 1.2 : 0.8;

  useFrame((state) => {
    if (!ringRef.current || lodLevel === 0) return;
    
    const time = state.clock.elapsedTime;
    
    // Always face the camera
    ringRef.current.lookAt(state.camera.position);
    
    // Pulse animation based on activity
    const pulse = 1 + Math.sin(time * pulseSpeed) * 0.1 * glowIntensity;
    ringRef.current.scale.setScalar(pulse);
    
    // Slow rotation for visual interest
    ringRef.current.rotation.z += 0.005;
  });

  // Don't render if too far away
  if (lodLevel === 0) return null;

  return (
    <Ring ref={ringRef} args={[ringRadius, ringRadius + ringThickness, 64]}>
      <meshBasicMaterial
        color={ringColor}
        transparent
        opacity={0.6 * glowIntensity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </Ring>
  );
}
