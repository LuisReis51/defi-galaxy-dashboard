import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarFieldProps {
  count?: number;
}

const ARMS = 4;
const ARM_SPREAD = 0.28;
const SPIRAL_TIGHTNESS = 0.4;

function spiralPoint(arm: number, t: number): [number, number, number] {
  const angle = (arm / ARMS) * Math.PI * 2 + t * SPIRAL_TIGHTNESS;
  const radius = 60 + t * 220;
  const spread = (Math.random() - 0.5) * ARM_SPREAD * radius;
  const x = Math.cos(angle) * radius + spread;
  const z = Math.sin(angle) * radius + spread;
  const y = (Math.random() - 0.5) * 12 * (1 - t * 0.6);
  return [x, y, z];
}

export function StarField({ count = 15000 }: StarFieldProps) {
  const meshRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const spiralCount = Math.floor(count * 0.7);

    for (let i = 0; i < spiralCount; i++) {
      const i3 = i * 3;
      const arm = i % ARMS;
      const t = Math.pow(Math.random(), 0.6);
      const [x, y, z] = spiralPoint(arm, t);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const brightness = 0.5 + Math.random() * 0.5;
      const starType = Math.random();
      if (starType < 0.12) {
        colors[i3] = brightness * 0.65; colors[i3 + 1] = brightness * 0.8; colors[i3 + 2] = brightness;
      } else if (starType < 0.22) {
        colors[i3] = brightness; colors[i3 + 1] = brightness * 0.88; colors[i3 + 2] = brightness * 0.65;
      } else if (starType < 0.28) {
        colors[i3] = brightness; colors[i3 + 1] = brightness * 0.4; colors[i3 + 2] = brightness * 0.4;
      } else {
        colors[i3] = brightness; colors[i3 + 1] = brightness; colors[i3 + 2] = brightness;
      }
    }

    for (let i = spiralCount; i < count; i++) {
      const i3 = i * 3;
      const r = 300 + Math.random() * 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      const b = 0.3 + Math.random() * 0.4;
      colors[i3] = b; colors[i3 + 1] = b; colors[i3 + 2] = b;
    }

    return [positions, colors];
  }, [count]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
