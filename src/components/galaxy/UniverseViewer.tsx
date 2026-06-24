/**
 * Universe Viewer
 * Displays all galaxies as independent systems with their own centers
 * Camera navigates between galaxies with exponential zoom
 */

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { GalaxyScene } from './GalaxyScene';
import { PlanetSystem } from '@/components/planets/PlanetSystem';
import { UniversalPlanet } from '@/core/renderer/UniversalPlanet';
import { getGalaxyDatasets } from '@/core/galaxy/GalaxyDatasets';
import type { UniversalEntity } from '@/core/entities/UniversalEntity';
import { useGalaxyStore } from '@/store/galaxyStore';

// Galaxy center positions in the universe
const GALAXY_CENTERS = {
  defi: { position: [0, 0, 0] as [number, number, number], color: '#627EEA', label: 'DeFi Galaxy' },
  nasdaq: { position: [300, 50, -200] as [number, number, number], color: '#00bcd4', label: 'NASDAQ Galaxy' },
  commodity: { position: [-250, -30, 180] as [number, number, number], color: '#f59e0b', label: 'Commodity Galaxy' },
  carbon: { position: [180, 80, 250] as [number, number, number], color: '#10b981', label: 'Carbon Galaxy' },
  excalibur: { position: [-180, 60, -250] as [number, number, number], color: '#ffd700', label: 'Excalibur Nexus' }
};

interface GalaxyProps {
  galaxyKey: string;
  centerPosition: [number, number, number];
  color: string;
  label: string;
  isActive: boolean;
  onSelect: (key: string) => void;
  entities: UniversalEntity[];
}

function GalaxyNode({ galaxyKey, centerPosition, color, label, isActive, onSelect, entities }: GalaxyProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<UniversalEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<UniversalEntity | null>(null);

  // Pulse animation for the galaxy center
  useFrame((state) => {
    if (groupRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  // Strict filtering - each galaxy shows ONLY its own entity types
  const galaxyEntities = entities.filter(e => {
    if (galaxyKey === 'defi') return e.universeType === 'defi';
    if (galaxyKey === 'nasdaq') return e.universeType === 'nasdaq';
    if (galaxyKey === 'commodity') return e.universeType === 'commodity';
    if (galaxyKey === 'carbon') return e.universeType === 'carbon';
    if (galaxyKey === 'excalibur') return e.universeType === 'excalibur-nexus';
    return false;
  });

  const starSize = isActive ? 15 : 12;

  return (
    <group position={centerPosition}>
      {/* Galaxy Center Star - large and bright */}
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[starSize, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Glow layers */}
        <mesh scale={1.4}>
          <sphereGeometry args={[starSize, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
          />
        </mesh>

        <mesh scale={2}>
          <sphereGeometry args={[starSize, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </mesh>

        <mesh scale={3}>
          <sphereGeometry args={[starSize, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>

      {/* Large invisible click target - makes it easy to select from distance */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onSelect(galaxyKey); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <sphereGeometry args={[starSize * 6, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Galaxy Label */}
      <Html
        position={[0, (isActive ? 8 : 5) + 4, 0]}
        style={{
          color: color,
          fontSize: isActive ? '16px' : '12px',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
          userSelect: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        <div>
          <div>{label}</div>
          {hovered && (
            <div style={{ fontSize: '10px', opacity: 0.8 }}>
              Click to explore
            </div>
          )}
        </div>
      </Html>

      {/* Entities within galaxy - positioned relative to galaxy center */}
      {galaxyEntities.map((entity) => (
        <group key={entity.id} position={entity.spatial.position}>
          <UniversalPlanet
            entity={entity}
            isSelected={selectedEntity?.id === entity.id}
            isHovered={hoveredEntity?.id === entity.id}
            onSelect={setSelectedEntity}
            onHover={setHoveredEntity}
          />
          <Html
            position={[0, entity.spatial.size + 2, 0]}
            style={{
              color: entity.spatial.glowColor,
              fontSize: '11px',
              fontWeight: 'bold',
              textShadow: '0 0 4px rgba(0,0,0,0.9)',
              pointerEvents: 'none',
              userSelect: 'none',
              textAlign: 'center'
            }}
          >
            <div>{entity.symbol}</div>
          </Html>
        </group>
      ))}

      {/* Orbital paths for active galaxy */}
      {isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[20, 21, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// Camera controller with OrbitControls integration
function CameraController({ targetGalaxy }: { targetGalaxy: string | null }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const isAnimating = useRef(false);

  const getTargetPosition = useCallback((galaxy: string | null) => {
    if (galaxy && GALAXY_CENTERS[galaxy as keyof typeof GALAXY_CENTERS]) {
      const center = GALAXY_CENTERS[galaxy as keyof typeof GALAXY_CENTERS];
      return {
        pos: new THREE.Vector3(center.position[0] + 60, center.position[1] + 40, center.position[2] + 100),
        target: new THREE.Vector3(...center.position)
      };
    }
    // Universe view
    return {
      pos: new THREE.Vector3(0, 250, 700),
      target: new THREE.Vector3(0, 0, 0)
    };
  }, []);

  useEffect(() => {
    if (!controlsRef.current) return;
    
    isAnimating.current = true;
    const { pos, target } = getTargetPosition(targetGalaxy);
    
    // Animate camera and controls target
    const startPos = camera.position.clone();
    const startTarget = controlsRef.current.target.clone();
    const startTime = Date.now();
    const duration = 1500;
    
    function animate() {
      if (!isAnimating.current || !controlsRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      
      camera.position.lerpVectors(startPos, pos, eased);
      controlsRef.current.target.lerpVectors(startTarget, target, eased);
      controlsRef.current.update();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isAnimating.current = false;
      }
    }
    
    animate();
    
    return () => { isAnimating.current = false; };
  }, [targetGalaxy, camera, getTargetPosition]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={20}
      maxDistance={1000}
      zoomSpeed={1.2}
      rotateSpeed={0.5}
      panSpeed={0.8}
    />
  );
}

export function UniverseViewer() {
  const [activeGalaxy, setActiveGalaxy] = useState<string | null>(null);
  const datasets = useMemo(() => getGalaxyDatasets(), []);
  const galaxyStore = useGalaxyStore();

  const handleGalaxySelect = (galaxyKey: string) => {
    if (activeGalaxy === galaxyKey) {
      setActiveGalaxy(null); // Deselect to show universe view
    } else {
      setActiveGalaxy(galaxyKey);
    }
  };

  return (
    <>
      <CameraController targetGalaxy={activeGalaxy} />
      
      {/* Stars background */}
      <Stars radius={1000} depth={500} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Ambient light */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 200, 0]} intensity={1} color="#ffffff" />
      <pointLight position={[300, 100, -200]} intensity={0.5} color="#00bcd4" />
      <pointLight position={[-250, 50, 180]} intensity={0.5} color="#f59e0b" />

      {/* All galaxies */}
      {Object.entries(GALAXY_CENTERS).map(([key, config]) => (
        <GalaxyNode
          key={key}
          galaxyKey={key}
          centerPosition={config.position}
          color={config.color}
          label={config.label}
          isActive={activeGalaxy === key}
          onSelect={handleGalaxySelect}
          entities={datasets[key].entities}
        />
      ))}

      {/* Connection lines between galaxies */}
      <GalaxyConnections />

      {/* HUD */}
      <UniverseHUD activeGalaxy={activeGalaxy} onSelectGalaxy={handleGalaxySelect} />
    </>
  );
}

function GalaxyConnections() {
  const groupRef = useRef<THREE.Group>(null!);
  
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Create connection lines between nearby galaxies
    const centers = Object.values(GALAXY_CENTERS);
    
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const c1 = centers[i];
        const c2 = centers[j];
        const distance = Math.sqrt(
          Math.pow(c1.position[0] - c2.position[0], 2) +
          Math.pow(c1.position[1] - c2.position[1], 2) +
          Math.pow(c1.position[2] - c2.position[2], 2)
        );
        
        // Only connect galaxies within reasonable distance
        if (distance < 800) {
          const geometry = new THREE.BufferGeometry();
          const vertices = new Float32Array([
            ...c1.position,
            ...c2.position
          ]);
          geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
          
          const material = new THREE.LineBasicMaterial({ 
            color: '#00ffff', 
            transparent: true, 
            opacity: 0.15 
          });
          
          const line = new THREE.Line(geometry, material);
          groupRef.current.add(line);
        }
      }
    }
  }, []);

  return <group ref={groupRef} />;
}

function UniverseHUD({ activeGalaxy, onSelectGalaxy }: { 
  activeGalaxy: string | null; 
  onSelectGalaxy: (key: string) => void;
}) {
  return (
    <Html position={[0, 0, 0]} style={{ position: 'absolute', top: '20px', left: '20px' }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid #00ffff',
        borderRadius: '8px',
        padding: '12px',
        color: 'white',
        fontSize: '12px',
        maxWidth: '280px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#00ffff', fontSize: '14px' }}>
          🌌 Financial Universe
        </h3>
        
        <div style={{ marginBottom: '8px' }}>
          {activeGalaxy ? (
            <div>
              <div style={{ color: GALAXY_CENTERS[activeGalaxy as keyof typeof GALAXY_CENTERS]?.color, fontWeight: 'bold' }}>
                {GALAXY_CENTERS[activeGalaxy as keyof typeof GALAXY_CENTERS]?.label}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>
                Click galaxy center to return to universe view
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '11px', opacity: 0.8 }}>
              Click any galaxy to explore • Scroll to zoom
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '8px' }}>
          <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>GALAXIES</div>
          {Object.entries(GALAXY_CENTERS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => onSelectGalaxy(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: '100%',
                padding: '3px 6px',
                margin: '2px 0',
                background: activeGalaxy === key ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none',
                borderRadius: '3px',
                color: config.color,
                fontSize: '11px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>●</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Html>
  );
}
