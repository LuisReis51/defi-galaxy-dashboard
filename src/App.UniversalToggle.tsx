import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { UniversalRendererTest } from './core/test/UniversalRendererTest';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000814' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[30, 20, 30]} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
        />
        
        <UniversalRendererTest />
      </Canvas>
    </div>
  );
}
