/**
 * Universal Renderer Test Component
 * Demonstrates that the same renderer can display Ethereum, Nvidia, Gold, and XGT
 * without any conditional logic - proof of the universal engine concept
 */

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { UniversalPlanet } from '../renderer/UniversalPlanet';
import { createTestEntities, createTestConnections, validateUniversalRenderer } from './TestEntities';
import { createAccurateTestEntities, validateGroundZeroAccuracy } from './TestEntities.Accurate';
import type { UniversalEntity } from '../entities/UniversalEntity';

/**
 * Test scene showing entities from different universes
 * This proves the universal renderer works with any entity type
 */
function TestScene() {
  const [selectedEntity, setSelectedEntity] = useState<UniversalEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<UniversalEntity | null>(null);

  // Create ground zero accurate test entities
  const entities = createAccurateTestEntities();
  const connections = createTestConnections();

  // Validate that all entities can be rendered universally
  React.useEffect(() => {
    const isValid = validateUniversalRenderer(entities);
    if (!isValid) {
      console.error('❌ Universal renderer validation failed');
    }
    
    // Validate ground zero accuracy
    const groundZeroValid = validateGroundZeroAccuracy(entities);
    if (!groundZeroValid) {
      console.error('❌ Ground zero accuracy validation failed');
    }
  }, [entities]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ffff" />
      
      {/* Star field background */}
      <Stars radius={300} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      {/* Render all entities with the same UniversalPlanet component */}
      {entities.map((entity) => (
        <UniversalPlanet
          key={entity.id}
          entity={entity}
          isSelected={selectedEntity?.id === entity.id}
          isHovered={hoveredEntity?.id === entity.id}
          onSelect={setSelectedEntity}
          onHover={setHoveredEntity}
        />
      ))}

      {/* Selection info panel */}
      {selectedEntity && (
        <Html position={[0, 0, 0]}>
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '300px',
            border: `2px solid ${selectedEntity.spatial.color}`,
            boxShadow: `0 0 10px ${selectedEntity.spatial.glowColor}`
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: selectedEntity.spatial.glowColor }}>
              {selectedEntity.name} ({selectedEntity.symbol})
            </h3>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
              Type: {selectedEntity.entityType} | Universe: {selectedEntity.universeType}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '5px' }}>
              Biome: {selectedEntity.spatial.biomeType}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '10px' }}>
              Market Cap: ${formatNumber(selectedEntity.metrics.marketCap || 0)}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.6 }}>
              {selectedEntity.metadata.description}
            </div>
          </div>
        </Html>
      )}

      {/* Hover info */}
      {hoveredEntity && !selectedEntity && (
        <Html position={[0, 0, 0]}>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            border: `1px solid ${hoveredEntity.spatial.glowColor}`
          }}>
            {hoveredEntity.name} - {hoveredEntity.entityType}
          </div>
        </Html>
      )}

      {/* Token Information Display - Top Left Quadrant */}
      <Html position={[0, 0, 0]}>
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          border: '1px solid #00ffff',
          borderRadius: '8px',
          padding: '12px',
          color: 'white',
          fontSize: '11px',
          maxWidth: '250px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#00ffff', fontSize: '12px' }}>
            🪙 Token Information
          </h4>
          
          {/* Quick Token Stats */}
          <div style={{ marginBottom: '10px' }}>
            {entities.map(entity => (
              <div key={entity.id} style={{ 
                marginBottom: '4px',
                padding: '4px',
                background: entity.id === selectedEntity?.id ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '3px',
                fontSize: '10px'
              }}>
                <div style={{ fontWeight: 'bold', color: entity.spatial.glowColor }}>
                  {entity.symbol}
                </div>
                <div style={{ opacity: 0.8 }}>
                  ${formatNumber(entity.metrics.marketCap || 0)} • {entity.entityType}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ fontSize: '9px', opacity: 0.6, textAlign: 'center' }}>
            Click entities for details
          </div>
        </div>
      </Html>
    </>
  );
}

/**
 * Main test component
 */
export function UniversalRendererTest() {
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
        
        <TestScene />
      </Canvas>
      
      {/* Title overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        textAlign: 'center',
        color: 'white',
        opacity: 0.1,
        fontSize: '48px',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
      }}>
        Universal Engine
      </div>
    </div>
  );
}

/**
 * Format large numbers for display
 */
function formatNumber(num: number): string {
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(2);
}

/**
 * Validation results display
 */
export function UniversalRendererValidation() {
  const entities = createTestEntities();
  const isValid = validateUniversalRenderer(entities);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: isValid ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
      border: `2px solid ${isValid ? '#00ff00' : '#ff0000'}`,
      color: 'white',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div>Universal Renderer: {isValid ? '✅ VALID' : '❌ INVALID'}</div>
      <div>Entities: {entities.length}</div>
      <div>Universes: {[...new Set(entities.map(e => e.universeType))].join(', ')}</div>
    </div>
  );
}
