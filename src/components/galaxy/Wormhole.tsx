import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Network } from '@/store/types';
import { useGalaxyStore } from '@/store/galaxyStore';

interface WormholeProps {
  from: Network;
  to: Network;
}

export function Wormhole({ from, to }: WormholeProps) {
  const selectNetwork = useGalaxyStore((s) => s.selectNetwork);
  const view = useGalaxyStore((s) => s.view);
  const [hovered, setHovered] = useState(false);
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  const midpoint = useMemo<[number, number, number]>(() => [
    (from.position[0] + to.position[0]) * 0.5,
    (from.position[1] + to.position[1]) * 0.5 + 1.5,
    (from.position[2] + to.position[2]) * 0.5,
  ], [from.position, to.position]);

  const lookDir = useMemo(() => {
    const d = new THREE.Vector3(
      to.position[0] - from.position[0],
      to.position[1] - from.position[1],
      to.position[2] - from.position[2]
    ).normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d);
    return q;
  }, [from.position, to.position]);

  const particlePositions = useMemo(() => {
    const count = 80;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.6;
      const spread = (Math.random() - 0.5) * 0.4;
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r;
      arr[i * 3 + 2] = spread;
    }
    return arr;
  }, []);

  const isNexusLink = to.id === 'excalibur-nexus' || from.id === 'excalibur-nexus';
  const primaryColor = isNexusLink ? '#ffd700' : to.color;
  const accentColor  = isNexusLink ? '#aaff44' : from.color;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outerRef.current) {
      outerRef.current.rotation.z = t * (isNexusLink ? 1.2 : 0.8);
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * (isNexusLink ? 2.0 : 1.4);
      const pulse = 1 + Math.sin(t * 3) * 0.08;
      innerRef.current.scale.setScalar(pulse);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z = t * 0.6;
    }
  });

  if (view !== 'galaxy') return null;

  return (
    <group
      position={midpoint}
      quaternion={lookDir}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'crosshair'; }}
      onClick={() => selectNetwork(to)}
    >
      <mesh ref={outerRef}>
        <torusGeometry args={[1.1, 0.08, 12, 64]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={hovered ? 0.9 : 0.55} />
      </mesh>

      <mesh ref={innerRef}>
        <torusGeometry args={[0.75, 0.05, 8, 48]} />
        <meshBasicMaterial color={accentColor} transparent opacity={hovered ? 0.8 : 0.40} />
      </mesh>

      <mesh>
        <circleGeometry args={[1.0, 48]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={hovered ? 0.18 : 0.07}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={primaryColor}
          size={0.04}
          transparent
          opacity={hovered ? 0.9 : 0.55}
          sizeAttenuation
        />
      </points>

      <pointLight color={primaryColor} intensity={hovered ? 3 : 1.2} distance={8} decay={2} />

      {hovered && (
        <Html center position={[0, 1.6, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: 10,
            color: primaryColor,
            background: 'rgba(2,4,12,0.85)',
            border: `1px solid ${primaryColor}55`,
            borderRadius: 4,
            padding: '3px 8px',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            ⟳ Wormhole → {to.name}
          </div>
        </Html>
      )}
    </group>
  );
}
