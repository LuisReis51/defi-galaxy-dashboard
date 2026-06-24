import React, { useState, useEffect } from 'react';
import { useGalaxyStore } from '@/store/galaxyStore';
import { GalaxyScene } from './GalaxyScene';
import { PlanetSystem } from '@/components/planets/PlanetSystem';
import { TokenOrbitalSystem } from '@/components/tokens/TokenOrbitalSystem';
import { HolographicDashboard } from '@/components/dashboard/HolographicDashboard';
import { UniversalPlanet } from '@/core/renderer/UniversalPlanet';
import { createAccurateTestEntities } from '@/core/test/TestEntities.Accurate';
import { UniverseManager } from '@/core/universe/UniverseManager';
import type { UniversalEntity } from '@/core/entities/UniversalEntity';
import type { UniverseType } from '@/core/entities/UniversalEntity';
import { Html } from '@react-three/drei';

function UniversalEntitySystem() {
  const [selectedEntity, setSelectedEntity] = useState<UniversalEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<UniversalEntity | null>(null);
  const [entities] = useState(() => createAccurateTestEntities());

  return (
    <group position={[200, 30, -120]}>
      {/* Zone label */}
      <Html
        position={[0, 25, 0]}
        style={{
          color: '#00ffff',
          fontSize: '16px',
          fontWeight: 'bold',
          textShadow: '0 0 8px rgba(0,255,255,0.5)',
          pointerEvents: 'none',
          userSelect: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}
      >
        <div>🌌 Universal Engine Zone</div>
      </Html>

      {/* Render universal entities far from original DeFi galaxy */}
      {entities.map((entity, index) => {
        // Spread entities in a line formation
        const spreadX = (index - 1.5) * 40;
        const spreadZ = 0;
        const spreadY = Math.sin(index * 1.5) * 10;

        return (
          <group key={entity.id} position={[spreadX, spreadY, spreadZ]}>
            <UniversalPlanet
              entity={entity}
              isSelected={selectedEntity?.id === entity.id}
              isHovered={hoveredEntity?.id === entity.id}
              onSelect={setSelectedEntity}
              onHover={setHoveredEntity}
            />
            {/* Large visible label */}
            <Html
              position={[0, entity.spatial.size + 3, 0]}
              style={{
                color: entity.spatial.glowColor,
                fontSize: '14px',
                fontWeight: 'bold',
                textShadow: '0 0 6px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
                userSelect: 'none',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                letterSpacing: '1px'
              }}
            >
              <div>{entity.symbol}</div>
              <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
                {entity.entityType}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export function IntegratedScene() {
  const view = useGalaxyStore((s) => s.view);
  const selectedNetwork = useGalaxyStore((s) => s.selectedNetwork);
  const [currentUniverse, setCurrentUniverse] = useState<UniverseType>('defi' as UniverseType);
  const universeManager = UniverseManager.getInstance();

  // Sync with universe manager
  useEffect(() => {
    universeManager.switchUniverse(currentUniverse);
  }, [currentUniverse]);

  const showOriginal = currentUniverse === 'defi' || currentUniverse === 'excalibur-nexus';
  const showUniversal = true; // Always show universal entities alongside

  return (
    <>
      <GalaxyScene />
      
      {/* Original DeFi content */}
      {showOriginal && view === 'galaxy' && <PlanetSystem />}
      {showOriginal && view === 'planet' && selectedNetwork && (
        <TokenOrbitalSystem network={selectedNetwork} />
      )}
      {showOriginal && view === 'token' && <HolographicDashboard />}

      {/* Universal entities - visible in galaxy view alongside original */}
      {showUniversal && view === 'galaxy' && <UniversalEntitySystem />}
    </>
  );
}

export function UniverseSwitcherOverlay() {
  const [currentUniverse, setCurrentUniverse] = useState<UniverseType>('defi' as UniverseType);
  const [isOpen, setIsOpen] = useState(false);
  const universeManager = UniverseManager.getInstance();

  const handleSwitch = async (universe: UniverseType) => {
    await universeManager.switchUniverse(universe);
    setCurrentUniverse(universe);
    setIsOpen(false);
  };

  const getUniverseIcon = (universe: UniverseType): string => {
    const icons: Record<string, string> = {
      'defi': '🌐',
      'nasdaq': '📈',
      'sp500': '📊',
      'commodity': '⛏️',
      'carbon': '🌿',
      'global-economy': '🌍',
      'excalibur-nexus': '✨'
    };
    return icons[universe] || '🌌';
  };

  const getUniverseColor = (universe: UniverseType): string => {
    const colors: Record<string, string> = {
      'defi': '#627EEA',
      'nasdaq': '#00bcd4',
      'sp500': '#3b82f6',
      'commodity': '#f59e0b',
      'carbon': '#10b981',
      'global-economy': '#7c3aed',
      'excalibur-nexus': '#ffd700'
    };
    return colors[universe] || '#ffffff';
  };

  const availableUniverses = universeManager.getAvailableUniverses();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          border: `1px solid ${getUniverseColor(currentUniverse)}`,
          borderRadius: '8px',
          padding: '8px 12px',
          color: 'white',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>{getUniverseIcon(currentUniverse)}</span>
        <span>{universeManager.getUniverseConfig(currentUniverse).name}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          padding: '8px',
          minWidth: '180px',
          backdropFilter: 'blur(10px)'
        }}>
          {availableUniverses.map((universe) => (
            <button
              key={universe}
              onClick={() => handleSwitch(universe)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '6px 8px',
                margin: '2px 0',
                background: universe === currentUniverse ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: universe === currentUniverse ? getUniverseColor(universe) : '#ccc',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span>{getUniverseIcon(universe)}</span>
              <span>{universeManager.getUniverseConfig(universe).name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
