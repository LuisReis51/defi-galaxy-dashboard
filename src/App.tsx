import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useGalaxyStore } from '@/store/galaxyStore';
import { GalaxyScene } from '@/components/galaxy/GalaxyScene';
import { PlanetSystem } from '@/components/planets/PlanetSystem';
import { TokenOrbitalSystem } from '@/components/tokens/TokenOrbitalSystem';
import { HolographicDashboard } from '@/components/dashboard/HolographicDashboard';
import { HUDOverlay } from '@/components/ui/HUDOverlay';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useNetworkData } from '@/hooks/useNetworkData';
import { useTokenData } from '@/hooks/useTokenData';
import { useXGTPrice } from '@/hooks/useXGTPrice';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function SceneContent() {
  const view = useGalaxyStore((s) => s.view);
  const selectedNetwork = useGalaxyStore((s) => s.selectedNetwork);

  return (
    <>
      <GalaxyScene />
      {view === 'galaxy' && <PlanetSystem />}
      {view === 'planet' && selectedNetwork && (
        <TokenOrbitalSystem network={selectedNetwork} />
      )}
      {view === 'token' && <HolographicDashboard />}
    </>
  );
}

export default function App() {
  const isLoading = useGalaxyStore((s) => s.isLoading);
  const [showLoader, setShowLoader] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isLoading && showLoader) {
      setFadingOut(true);
      const t = setTimeout(() => setShowLoader(false), 750);
      return () => clearTimeout(t);
    }
  }, [isLoading, showLoader]);

  useNetworkData();
  useTokenData();
  useXGTPrice();

  useEffect(() => {
    document.title = 'DeFi Galaxy — Explore the DeFi Universe';
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') useGalaxyStore.getState().back();
      if (e.key === 'g' || e.key === 'G') {
        const s = useGalaxyStore.getState();
        const currentView = s.view;
        if (currentView === 'token') {
          s.back();
          s.back();
        } else if (currentView === 'planet') {
          s.back();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative w-full h-full bg-space-black overflow-hidden">
      <div className="scan-overlay" />

      <ErrorBoundary>
        <Canvas
          gl={{
            antialias: !isMobile,            // AA off on mobile to save GPU memory
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          dpr={isMobile ? 1.5 : [1, 2]}      // Clamp DPR to prevent iPhone context loss
          camera={{ fov: 60, near: 0.1, far: 2000, position: [0, 20, 60] }}
          className="absolute inset-0"
          style={{ cursor: 'crosshair' }}
          onPointerMissed={() => {
            document.body.style.cursor = 'crosshair';
          }}
          onCreated={({ gl }) => {
            // Prevent WebGL context loss on iOS
            gl.domElement.addEventListener('webglcontextlost', e => {
              e.preventDefault();
              console.warn('WebGL context lost - attempting recovery');
            });
          }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <HUDOverlay />

      {showLoader && <LoadingScreen fadingOut={fadingOut} />}
    </div>
  );
}
