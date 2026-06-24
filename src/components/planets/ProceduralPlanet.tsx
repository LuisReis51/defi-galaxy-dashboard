import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlanetBiome, Network } from '@/store/types';
import { generatePlanetIdentity } from '@/constants/networks';

function hash(n: number): number {
  let x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

function noise2d(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57);
  const b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57);
  const d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (d - a + a - b - c + b) * ux * uy;
}

function fbm(x: number, y: number, octaves: number): number {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    v += noise2d(x * freq, y * freq) * amp;
    max += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return v / max;
}

function lerpColor(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}

function generateDeterministicTexture(
  biome: PlanetBiome, 
  seed: number, 
  identity: ReturnType<typeof generatePlanetIdentity>
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = px / size;
      const v = py / size;
      
      // Use deterministic identity for texture generation
      const sx = u * 4 + seed * 3.7 + identity.colorVariation * 2;
      const sy = v * 4 + seed * 2.1 + identity.weatherIntensity * 1.5;
      const n = fbm(sx, sy, 6);
      const n2 = fbm(sx * 2 + 1.3, sy * 2 + 0.7, 4);
      const n3 = fbm(sx * 0.5 + 5, sy * 0.5 + 3, 3);

      let r = 0, g = 0, b = 0;

      // Apply terrain type and surface structures
      if (identity.terrainType === 'geometric' || identity.terrainType === 'circuit') {
        // Infrastructure chains get geometric patterns
        const circuit = Math.floor(n * 16) / 16;
        const energy = fbm(sx * 8, sy * 8, 2);
        const c1: [number,number,number] = [0.2, 0.4, 0.8];
        const c2: [number,number,number] = [0.1, 0.2, 0.4];
        const c3: [number,number,number] = [0.4, 0.6, 0.9];
        let col = lerpColor(c1, c2, circuit);
        col = lerpColor(col, c3, energy * identity.atmosphereDensity);
        [r, g, b] = col;
      } else if (identity.terrainType === 'metallic') {
        // Metallic surfaces for complex chains
        const metal = fbm(sx * 3, sy * 3, 5);
        const reflect = Math.max(0, n2 - 0.6) * 4;
        const c1: [number,number,number] = [0.7, 0.7, 0.8];
        const c2: [number,number,number] = [0.4, 0.4, 0.5];
        const c3: [number,number,number] = [0.9, 0.9, 1.0];
        let col = lerpColor(c1, c2, metal);
        col = lerpColor(col, c3, reflect * identity.surfaceStructures / 10);
        [r, g, b] = col;
      } else if (identity.terrainType === 'quantum' || identity.terrainType === 'energy') {
        // Nexus gets special quantum effects
        const quantum = fbm(sx * 6, sy * 6, 7);
        const energy = Math.sin(n * Math.PI * 4) * 0.5 + 0.5;
        const c1: [number,number,number] = [0.1, 0.8, 0.2];
        const c2: [number,number,number] = [0.8, 1.0, 0.2];
        const c3: [number,number,number] = [0.0, 0.2, 0.0];
        let col = lerpColor(c1, c2, quantum);
        col = lerpColor(col, c3, energy * 0.3);
        [r, g, b] = col;
      } else {
        // Fall back to original biome generation with modifications
        if (biome === 'gas-giant') {
          const band = Math.sin((v * 8 + n * 1.5) * Math.PI * 2) * 0.5 + 0.5;
          const swirl = fbm(sx + n * 2, sy + n2 * 2, 4);
          const c1: [number,number,number] = [0.38, 0.49, 0.92];
          const c2: [number,number,number] = [0.1, 0.05, 0.35];
          const c3: [number,number,number] = [0.55, 0.75, 1.0];
          const blended = lerpColor(lerpColor(c1, c2, band), c3, swirl * 0.4);
          [r, g, b] = blended;
        } else if (biome === 'golden-rocky') {
          const rock = fbm(sx * 1.5, sy * 1.5, 5);
          const crater = Math.max(0, 1 - Math.abs(n2 - 0.5) * 6);
          const c1: [number,number,number] = [0.72, 0.52, 0.12];
          const c2: [number,number,number] = [0.88, 0.72, 0.28];
          const c3: [number,number,number] = [0.22, 0.16, 0.06];
          let col = lerpColor(c1, c2, rock);
          col = lerpColor(col, c3, crater * 0.6);
          [r, g, b] = col;
        } else {
          // Default for other biomes with slight modifications
          const base = fbm(sx, sy, 4);
          const c1: [number,number,number] = [0.5, 0.5, 0.5];
          const c2: [number,number,number] = [0.3, 0.3, 0.3];
          const c3: [number,number,number] = [0.7, 0.7, 0.7];
          let col = lerpColor(c1, c2, base);
          col = lerpColor(col, c3, identity.atmosphereDensity * 0.2);
          [r, g, b] = col;
        }
      }

      // Apply weather effects
      if (identity.weatherIntensity > 0.5) {
        const weather = fbm(sx * 10, sy * 10, 2);
        const weatherEffect = weather * identity.weatherIntensity * 0.1;
        r = Math.min(1, r + weatherEffect);
        g = Math.min(1, g + weatherEffect);
        b = Math.min(1, b + weatherEffect);
      }

      const idx = (py * size + px) * 4;
      data[idx]     = Math.round(Math.min(r, 1) * 255);
      data[idx + 1] = Math.round(Math.min(g, 1) * 255);
      data[idx + 2] = Math.round(Math.min(b, 1) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function generateTexture(biome: PlanetBiome, seed: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = px / size;
      const v = py / size;
      const sx = u * 4 + seed * 3.7;
      const sy = v * 4 + seed * 2.1;
      const n = fbm(sx, sy, 6);
      const n2 = fbm(sx * 2 + 1.3, sy * 2 + 0.7, 4);
      const n3 = fbm(sx * 0.5 + 5, sy * 0.5 + 3, 3);

      let r = 0, g = 0, b = 0;

      if (biome === 'gas-giant') {
        const band = Math.sin((v * 8 + n * 1.5) * Math.PI * 2) * 0.5 + 0.5;
        const swirl = fbm(sx + n * 2, sy + n2 * 2, 4);
        const c1: [number,number,number] = [0.38, 0.49, 0.92];
        const c2: [number,number,number] = [0.1, 0.05, 0.35];
        const c3: [number,number,number] = [0.55, 0.75, 1.0];
        const blended = lerpColor(lerpColor(c1, c2, band), c3, swirl * 0.4);
        [r, g, b] = blended;
      } else if (biome === 'golden-rocky') {
        const rock = fbm(sx * 1.5, sy * 1.5, 5);
        const crater = Math.max(0, 1 - Math.abs(n2 - 0.5) * 6);
        const c1: [number,number,number] = [0.72, 0.52, 0.12];
        const c2: [number,number,number] = [0.88, 0.72, 0.28];
        const c3: [number,number,number] = [0.22, 0.16, 0.06];
        let col = lerpColor(c1, c2, rock);
        col = lerpColor(col, c3, crater * 0.6);
        [r, g, b] = col;
      } else if (biome === 'crystal') {
        const facet = Math.floor(n * 8) / 8;
        const shine = fbm(sx * 3, sy * 3, 3);
        const c1: [number,number,number] = [0.55, 0.1, 0.9];
        const c2: [number,number,number] = [0.85, 0.5, 1.0];
        const c3: [number,number,number] = [0.15, 0.0, 0.3];
        let col = lerprColor(c1, c2, facet);
        col = lerprColor(col, c3, shine * 0.3);
        [r, g, b] = col;
      } else if (biome === 'ice') {
        const crack = Math.max(0, 1 - Math.abs(n - 0.5) * 8);
        const pole = Math.pow(1 - Math.abs(v - 0.5) * 2, 2);
        const c1: [number,number,number] = [0.82, 0.92, 1.0];
        const c2: [number,number,number] = [0.45, 0.65, 0.88];
        const c3: [number,number,number] = [0.1, 0.2, 0.4];
        let col = lerprColor(c1, c2, n2 * 0.5);
        col = lerprColor(col, c3, crack * 0.7);
        col = lerprColor(col, [1, 1, 1] as [number,number,number], pole * 0.3);
        [r, g, b] = col;
      } else if (biome === 'ocean') {
        const depth = fbm(sx * 0.8, sy * 0.8, 4);
        const foam = Math.max(0, n2 - 0.7) * 5;
        const c1: [number,number,number] = [0.02, 0.15, 0.55];
        const c2: [number,number,number] = [0.05, 0.35, 0.72];
        const c3: [number,number,number] = [0.8, 0.9, 1.0];
        let col = lerprColor(c1, c2, depth);
        col = lerprColor(col, c3, Math.min(foam, 1));
        [r, g, b] = col;
      } else if (biome === 'volcanic') {
        const lava = Math.max(0, n - 0.55) * 4;
        const rock = fbm(sx * 2, sy * 2, 5);
        const c1: [number,number,number] = [0.12, 0.04, 0.04];
        const c2: [number,number,number] = [0.85, 0.15, 0.02];
        const c3: [number,number,number] = [1.0, 0.6, 0.05];
        let col = lerprColor(c1, c2, Math.min(lava, 1));
        col = lerprColor(col, c3, Math.min(lava * 0.5, 1) * (1 - rock * 0.3));
        [r, g, b] = col;
      } else if (biome === 'stormy') {
        const storm = fbm(sx * 1.2 + n2, sy * 1.2 + n3, 6);
        const swirl = Math.sin((n + n2) * Math.PI * 4) * 0.5 + 0.5;
        const c1: [number,number,number] = [0.18, 0.06, 0.28];
        const c2: [number,number,number] = [0.45, 0.25, 0.72];
        const c3: [number,number,number] = [0.7, 0.55, 0.95];
        let col = lerprColor(c1, c2, storm);
        col = lerprColor(col, c3, swirl * 0.35);
        [r, g, b] = col;
      } else if (biome === 'metallic') {
        const circuit = Math.max(0, 1 - Math.abs(Math.sin(sx * 8) * Math.sin(sy * 8)) * 2);
        const sheen = fbm(sx * 2, sy * 2, 4);
        const c1: [number,number,number] = [0.1, 0.2, 0.38];
        const c2: [number,number,number] = [0.28, 0.5, 0.78];
        const c3: [number,number,number] = [0.0, 0.8, 1.0];
        let col = lerprColor(c1, c2, sheen);
        col = lerprColor(col, c3, circuit * 0.25);
        [r, g, b] = col;
      } else {
        const bio = fbm(sx * 1.2, sy * 1.2, 5);
        const glow = Math.max(0, n2 - 0.5) * 3;
        const petal = Math.sin(sx * 6) * Math.sin(sy * 6) * 0.5 + 0.5;
        const c1: [number,number,number] = [0.1, 0.28, 0.06];
        const c2: [number,number,number] = [0.28, 0.55, 0.1];
        const c3: [number,number,number] = [0.9, 0.75, 0.0];
        let col = lerprColor(c1, c2, bio);
        col = lerprColor(col, c3, Math.min(glow * petal, 1) * 0.7);
        [r, g, b] = col;
      }

      const idx = (py * size + px) * 4;
      data[idx]     = Math.round(Math.min(r, 1) * 255);
      data[idx + 1] = Math.round(Math.min(g, 1) * 255);
      data[idx + 2] = Math.round(Math.min(b, 1) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function lerprColor(a: [number,number,number], b: [number,number,number], t: number): [number,number,number] {
  const tc = Math.max(0, Math.min(1, t));
  return [a[0]+(b[0]-a[0])*tc, a[1]+(b[1]-a[1])*tc, a[2]+(b[2]-a[2])*tc];
}

interface ProceduralPlanetProps {
  radius: number;
  biome: PlanetBiome;
  seed: number;
  color: THREE.Color;
  glowColor: THREE.Color;
  hovered: boolean;
  onClick?: () => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
  meshRef?: React.RefObject<THREE.Mesh>;
  network?: Network;
}

export function ProceduralPlanet({
  radius,
  biome,
  seed,
  color,
  glowColor,
  hovered,
  onClick,
  onPointerOver,
  onPointerOut,
  meshRef,
  network,
}: ProceduralPlanetProps) {
  const cloudRef = useRef<THREE.Mesh>(null!);

  // Generate deterministic planet identity if network data is available
  const planetIdentity = useMemo(() => {
    if (network) {
      // Create extended network object with volume24h for generation
      const extendedNetwork = {
        ...network,
        volume24h: network.tvl * 0.1, // Estimate volume as 10% of TVL if not available
      };
      return generatePlanetIdentity(extendedNetwork);
    }
    return null;
  }, [network]);

  const texture = useMemo(() => {
    if (planetIdentity) {
      return generateDeterministicTexture(biome, seed, planetIdentity);
    }
    return generateTexture(biome, seed);
  }, [biome, seed, planetIdentity]);

  const cloudOpacity = biome === 'gas-giant' ? 0.0
    : biome === 'nexus' ? 0.15
    : biome === 'ocean' ? 0.18
    : 0.08;

  useFrame((state) => {
    if (cloudRef.current && cloudOpacity > 0) {
      cloudRef.current.rotation.y += 0.0008;
      cloudRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.02;
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onPointerOver as any}
        onPointerOut={onPointerOut}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={biome === 'nexus' ? glowColor : color}
          emissiveIntensity={hovered ? 0.5 : (biome === 'nexus' ? 0.35 : 0.18)}
          roughness={biome === 'metallic' ? 0.2 : biome === 'ice' ? 0.15 : 0.55}
          metalness={biome === 'metallic' ? 0.7 : biome === 'nexus' ? 0.4 : 0.1}
        />
      </mesh>

      {cloudOpacity > 0 && (
        <mesh ref={cloudRef}>
          <sphereGeometry args={[radius * 1.04, 32, 32]} />
          <meshBasicMaterial
            color={biome === 'nexus' ? '#aaff88' : '#ffffff'}
            transparent
            opacity={hovered ? cloudOpacity * 1.5 : cloudOpacity}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
    </>
  );
}
