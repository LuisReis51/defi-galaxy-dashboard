import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Token } from '@/store/types';
import { NEON_CYAN } from '@/utils/colors';

interface VolumePillarsProps {
  token: Token;
}

export function VolumePillars({ token }: VolumePillarsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummyRef = useRef(new THREE.Object3D());
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = 0;
  }, [token.id]);

  const baseColor = useMemo(() => new THREE.Color(NEON_CYAN), []);

  const { count, maxVolume, history, pillarColors } = useMemo(() => {
    const history = token.priceHistory.slice(-40);
    const maxVol = Math.max(...history.map((h) => h.volume), 1);
    const low = new THREE.Color('#00f5ff');
    const high = new THREE.Color('#ffd700');
    const pillarColors = history.map((h) =>
      low.clone().lerp(high, Math.min(h.volume / maxVol, 1))
    );
    return { count: history.length, maxVolume: maxVol, history, pillarColors };
  }, [token.priceHistory]);

  const width = 10;

  useFrame((state, delta) => {
    if (!meshRef.current || history.length === 0) return;
    const time = state.clock.elapsedTime;
    const dummy = dummyRef.current;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;

    progressRef.current = Math.min(progressRef.current + delta * 1.8, 1);
    const ease = 1 - Math.pow(1 - progressRef.current, 3);

    for (let i = 0; i < history.length; i++) {
      const h = history[i];
      const x = (i / (history.length - 1)) * width - width / 2;
      const normalizedVol = h.volume / maxVolume;
      const pillarHeight = (normalizedVol * 3 + 0.1) * ease;
      const pulse = 1 + Math.sin(time * 3 + i * 0.5) * 0.05;

      dummy.position.set(x, -3 + pillarHeight / 2, 0);
      dummy.scale.set(0.12, Math.max(pillarHeight * pulse, 0.001), 0.12);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pillarColors[i]);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    mat.emissiveIntensity = 0.6 + Math.sin(time) * 0.2;
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={0.7}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.75}
      />
    </instancedMesh>
  );
}
