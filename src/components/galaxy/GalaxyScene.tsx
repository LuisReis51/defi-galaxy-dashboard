import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { StarField } from './StarField';
import { CameraController } from './CameraController';
import { WormholeSystem } from './WormholeSystem';

function GalaxyCore() {
  const coreRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3.5 + Math.sin(t * 1.8) * 1.2;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.04);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 1.1 + 1) * 0.07);
    }
    if (haloRef.current) {
      haloRef.current.rotation.z += 0.002;
      haloRef.current.rotation.x = Math.sin(t * 0.15) * 0.08;
    }
  });

  return (
    <>
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={4}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.04} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={haloRef} position={[0, 0, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[2.8, 5.5, 128]} />
        <meshBasicMaterial color="#00f5ff" transparent opacity={0.025} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.5 + 0.6, 0.3, 0]}>
        <ringGeometry args={[4, 7, 96]} />
        <meshBasicMaterial color="#bf00ff" transparent opacity={0.012} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </>
  );
}

export function GalaxyScene() {
  return (
    <>
      <color attach="background" args={['#020408']} />

      <ambientLight intensity={0.08} color="#0a1628" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00f5ff" distance={200} decay={2} />
      <pointLight position={[40, 20, -40]} intensity={1} color="#bf00ff" distance={150} decay={2} />
      <pointLight position={[-40, -20, 40]} intensity={0.8} color="#ffd700" distance={120} decay={2} />

      <GalaxyCore />

      <StarField count={15000} />
      <WormholeSystem />
      <CameraController />

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.6}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
