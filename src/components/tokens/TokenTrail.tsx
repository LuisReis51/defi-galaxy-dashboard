import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TokenTrailProps {
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  color: THREE.Color;
}

const TRAIL_LENGTH = 32;

export function TokenTrail({ orbitRadius, orbitSpeed, orbitPhase, color }: TokenTrailProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = useMemo(() => new Float32Array(TRAIL_LENGTH * 3), []);

  const colors = useMemo(() => {
    const buf = new Float32Array(TRAIL_LENGTH * 3);
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const t = i / (TRAIL_LENGTH - 1);
      buf[i * 3] = color.r * t;
      buf[i * 3 + 1] = color.g * t;
      buf[i * 3 + 2] = color.b * t;
    }
    return buf;
  }, [color]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const lag = (i / TRAIL_LENGTH) * 0.8;
      const angle = orbitPhase + (t - lag) * orbitSpeed;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin((angle) * 0.3) * 1.5;
      const z = Math.sin(angle) * orbitRadius;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
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
        size={0.09}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
