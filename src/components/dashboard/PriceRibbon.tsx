import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Token } from '@/store/types';

interface PriceRibbonProps {
  token: Token;
}

export function PriceRibbon({ token }: PriceRibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const { tubeGeometry, color } = useMemo(() => {
    const history = token.priceHistory.slice(-60);
    if (history.length < 2) {
      return {
        tubeGeometry: new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3([new THREE.Vector3(-5, 0, 0), new THREE.Vector3(5, 0, 0)]),
          20, 0.04, 8, false
        ),
        color: new THREE.Color('#00f5ff'),
      };
    }

    const minPrice = Math.min(...history.map((h) => h.close));
    const maxPrice = Math.max(...history.map((h) => h.close));
    const priceRange = maxPrice - minPrice || 1;
    const width = 10;
    const height = 3;

    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * width - width / 2;
      const y = ((h.close - minPrice) / priceRange) * height - height / 2;
      const z = Math.sin(i * 0.3) * 0.1;
      return new THREE.Vector3(x, y, z);
    });

    const curve = new THREE.CatmullRomCurve3(points);
    const tube = new THREE.TubeGeometry(curve, history.length * 2, 0.04, 8, false);

    const lastClose = history[history.length - 1].close;
    const firstClose = history[0].close;
    const isUp = lastClose >= firstClose;
    const col = new THREE.Color(isUp ? '#00ff88' : '#ff3355');

    return { tubeGeometry: tube, color: col };
  }, [token.priceHistory]);

  useEffect(() => {
    return () => {
      tubeGeometry.dispose();
    };
  }, [tubeGeometry]);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={[0, 1, 0]}>
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
