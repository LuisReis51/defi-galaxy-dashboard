import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleStream() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 200;

  const [positions, velocities, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const isIncoming = i < count / 2;
      const side = isIncoming ? 1 : -1;

      positions[i3] = (Math.random() - 0.5) * 20 * side;
      positions[i3 + 1] = (Math.random() - 0.5) * 6;
      positions[i3 + 2] = (Math.random() - 0.5) * 20 * side;

      velocities[i3] = -side * (0.02 + Math.random() * 0.04);
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = -side * (0.02 + Math.random() * 0.04);

      if (isIncoming) {
        colors[i3] = 0;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 0.53;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.33;
      }
    }

    return [positions, velocities, colors];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];

      if (Math.abs(pos[i3]) < 0.5 && Math.abs(pos[i3 + 2]) < 0.5) {
        const side = pos[i3] >= 0 ? 1 : -1;
        pos[i3] = (4 + Math.random() * 8) * side;
        pos[i3 + 1] = (Math.random() - 0.5) * 6;
        pos[i3 + 2] = (4 + Math.random() * 8) * side;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
