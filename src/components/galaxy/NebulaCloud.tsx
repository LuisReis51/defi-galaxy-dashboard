import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NEBULA_CLUSTERS = [
  { cx: 55, cy: 8, cz: -30, r: 35, color: [0, 0.96, 1.0] },
  { cx: -70, cy: -5, cz: 20, r: 28, color: [0.47, 0, 1.0] },
  { cx: 20, cy: 15, cz: 80, r: 40, color: [0, 1.0, 0.53] },
  { cx: -40, cy: -10, cz: -65, r: 32, color: [1.0, 0.84, 0] },
  { cx: 90, cy: 5, cz: 40, r: 25, color: [1.0, 0.3, 0.8] },
];

export function NebulaCloud() {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 4000;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    let idx = 0;
    const perCluster = Math.floor(count / NEBULA_CLUSTERS.length);

    for (const cluster of NEBULA_CLUSTERS) {
      const clusterCount = idx + perCluster > count ? count - idx : perCluster;
      for (let j = 0; j < clusterCount; j++) {
        const i3 = idx * 3;
        const u = Math.random();
        const r = cluster.r * Math.cbrt(u);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = cluster.cx + r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = cluster.cy + r * Math.cos(phi) * 0.35;
        positions[i3 + 2] = cluster.cz + r * Math.sin(phi) * Math.sin(theta);

        const brightness = 0.08 + Math.pow(1 - u, 2) * 0.35;
        colors[i3] = cluster.color[0] * brightness;
        colors[i3 + 1] = cluster.color[1] * brightness;
        colors[i3 + 2] = cluster.color[2] * brightness;

        idx++;
      }
    }

    return [positions, colors];
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={4}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.25}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
