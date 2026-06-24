/**
 * Universal Planet Component
 * Renders any entity (blockchain, company, commodity, etc.) without knowing its type
 * The renderer is universally stupid - only understands visual properties
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { UniversalEntity } from '../entities/UniversalEntity';
import { SpatialCalculator } from './SpatialCalculator';
import { ProceduralIdentityGenerator } from './ProceduralIdentity';

interface UniversalPlanetProps {
  entity: UniversalEntity;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (entity: UniversalEntity) => void;
  onHover: (entity: UniversalEntity | null) => void;
}

export function UniversalPlanet({ 
  entity, 
  isSelected, 
  isHovered, 
  onSelect, 
  onHover 
}: UniversalPlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // Calculate visual properties from universal metrics
  const visualProperties = useMemo(() => 
    SpatialCalculator.calculateSpatialProperties(entity), [entity]
  );

  // Generate procedural identity for consistent appearance
  const proceduralIdentity = useMemo(() => 
    ProceduralIdentityGenerator.generateIdentity(entity), [entity]
  );

  // Get biome characteristics for rendering
  const biomeCharacteristics = useMemo(() => 
    ProceduralIdentityGenerator.getBiomeCharacteristics(proceduralIdentity.biomeType), 
    [proceduralIdentity.biomeType]
  );

  // Material properties calculated from universal data
  const materialProperties = useMemo(() => ({
    color: new THREE.Color(visualProperties.color),
    emissive: new THREE.Color(visualProperties.color),
    emissiveIntensity: visualProperties.glowIntensity * 0.3,
    roughness: 0.7 - visualProperties.glowIntensity * 0.3,
    metalness: 0.3 + visualProperties.glowIntensity * 0.2
  }), [visualProperties]);

  // Glow material properties
  const glowMaterialProperties = useMemo(() => ({
    color: new THREE.Color(visualProperties.glowColor),
    transparent: true,
    opacity: visualProperties.glowIntensity * 0.6,
    emissive: new THREE.Color(visualProperties.glowColor),
    emissiveIntensity: visualProperties.glowIntensity * 0.8
  }), [visualProperties]);

  // Ring properties (if applicable)
  const ringProperties = useMemo(() => {
    const hasRings = biomeCharacteristics.hasRings || 
                     (entity.metrics.marketCap && entity.metrics.marketCap > 1e12) || // $1T+ market cap
                     (entity.metrics.tvl && entity.metrics.tvl > 1e10) || // $10B+ TVL
                     entity.id === 'excalibur-nexus';
    
    return {
      hasRings,
      innerRadius: visualProperties.size * 1.5,
      outerRadius: visualProperties.size * 2.2,
      color: new THREE.Color(visualProperties.glowColor),
      opacity: 0.4 + visualProperties.glowIntensity * 0.3
    };
  }, [visualProperties, biomeCharacteristics, entity.metrics]);

  // Animation frame update
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Rotation speed based on transaction velocity
      meshRef.current.rotation.y += delta * visualProperties.rotationSpeed;
      meshRef.current.rotation.x += delta * visualProperties.rotationSpeed * 0.1;
    }

    if (glowRef.current) {
      // Glow pulsing based on liquidity/confidence
      const pulseSpeed = 1 + visualProperties.glowIntensity;
      glowRef.current.rotation.y += delta * pulseSpeed * 0.5;
      
      // Scale pulsing for selected/hovered entities
      const targetScale = isSelected ? 1.2 : (isHovered ? 1.1 : 1.0);
      const currentScale = glowRef.current.scale.x;
      glowRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        delta * 3
      );
    }

    if (ringRef.current && ringProperties.hasRings) {
      // Ring rotation (slower than planet)
      ringRef.current.rotation.z += delta * visualProperties.rotationSpeed * 0.3;
    }

    // Group scale for hover/selection effects
    if (groupRef.current) {
      const targetScale = isHovered ? 1.15 : 1.0;
      const currentScale = groupRef.current.scale.x;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        delta * 5
      );
    }
  });

  // Event handlers
  const handleClick = () => onSelect(entity);
  const handlePointerOver = () => onHover(entity);
  const handlePointerOut = () => onHover(null);

  return (
    <group 
      ref={groupRef}
      position={visualProperties.position}
    >
      {/* Main planet mesh */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[visualProperties.size, 64, 32]} />
        <meshStandardMaterial {...materialProperties} />
      </mesh>

      {/* Glow layer */}
      <mesh ref={glowRef} scale={1.15}>
        <sphereGeometry args={[visualProperties.size, 32, 16]} />
        <meshBasicMaterial {...glowMaterialProperties} />
      </mesh>

      {/* Rings (if applicable) */}
      {ringProperties.hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ringProperties.innerRadius, ringProperties.outerRadius, 64]} />
          <meshBasicMaterial 
            color={ringProperties.color} 
            transparent 
            opacity={ringProperties.opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Atmosphere (if applicable) */}
      {biomeCharacteristics.hasAtmosphere && (
        <mesh scale={1.25}>
          <sphereGeometry args={[visualProperties.size, 32, 16]} />
          <meshBasicMaterial 
            color={visualProperties.glowColor} 
            transparent 
            opacity={biomeCharacteristics.atmosphereDensity * 0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Entity label (HTML overlay) - Simplified, no face-like appearance */}
      <Html
        position={[0, visualProperties.size + 1.5, 0]}
        style={{
          color: 'white',
          fontSize: '10px',
          fontWeight: 'normal',
          textShadow: '0 0 2px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
          userSelect: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: 0.8
        }}
      >
        <div>{entity.symbol}</div>
      </Html>

      {/* Selection indicator */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[visualProperties.size + 0.5, visualProperties.size + 1, 64]} />
          <meshBasicMaterial 
            color={visualProperties.glowColor} 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Procedural Planet Surface Component
 * Generates surface textures based on biome type and procedural identity
 * This would contain the actual procedural generation logic
 */
interface ProceduralPlanetProps {
  entity: UniversalEntity;
  size: number;
  biomeType: string;
  surfaceSeed: number;
}

function ProceduralPlanet({ 
  entity, 
  size, 
  biomeType, 
  surfaceSeed 
}: ProceduralPlanetProps) {
  // This would contain the actual procedural texture generation
  // For now, it's a placeholder that would use canvas-based noise generation
  
  const texture = useMemo(() => {
    // Placeholder for procedural texture generation
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Generate procedural texture based on biome and seed
    // This is where the actual FBM noise and biome-specific logic would go
    
    return new THREE.CanvasTexture(canvas);
  }, [biomeType, surfaceSeed]);

  return (
    <mesh>
      <sphereGeometry args={[size, 64, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
