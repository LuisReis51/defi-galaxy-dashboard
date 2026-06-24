/**
 * Universe Switcher Component
 * Allows users to travel between different financial universes
 * DeFi Galaxy ↔ NASDAQ Galaxy ↔ Commodity Galaxy ↔ Carbon Galaxy ↔ Excalibur Nexus
 */

import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { UniverseManager } from './UniverseManager';
import type { UniverseType } from '../entities/UniversalEntity';

interface UniverseSwitcherProps {
  onUniverseChange?: (universeType: UniverseType) => void;
  position?: [number, number, number];
}

export function UniverseSwitcher({ 
  onUniverseChange, 
  position = [0, 15, 0] 
}: UniverseSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const universeManager = UniverseManager.getInstance();
  const currentUniverse = universeManager.getCurrentUniverseType();
  const availableUniverses = universeManager.getAvailableUniverses();
  const portalConnections = universeManager.getPortalConnections();

  const handleUniverseSwitch = async (universeType: UniverseType) => {
    await universeManager.switchUniverse(universeType);
    onUniverseChange?.(universeType);
    setIsExpanded(false);
  };

  const getUniverseIcon = (universeType: UniverseType): string => {
    const icons = {
      'defi': '🌐',
      'nasdaq': '📈',
      'sp500': '📊',
      'commodity': '⛏️',
      'carbon': '🌿',
      'global-economy': '🌍',
      'excalibur-nexus': '✨'
    };
    return icons[universeType] || '🌌';
  };

  const getUniverseColor = (universeType: UniverseType): string => {
    const colors = {
      'defi': '#627EEA',
      'nasdaq': '#00bcd4',
      'sp500': '#3b82f6',
      'commodity': '#f59e0b',
      'carbon': '#10b981',
      'global-economy': '#7c3aed',
      'excalibur-nexus': '#ffd700'
    };
    return colors[universeType] || '#ffffff';
  };

  const getConnectedUniverses = (): UniverseType[] => {
    const connections = portalConnections.filter(
      conn => conn.from === currentUniverse || conn.to === currentUniverse
    );
    
    const connected = new Set<UniverseType>();
    connections.forEach(conn => {
      if (conn.from === currentUniverse) connected.add(conn.to);
      if (conn.to === currentUniverse) connected.add(conn.from);
    });
    
    return Array.from(connected);
  };

  const connectedUniverses = getConnectedUniverses();

  return (
    <Html position={position}>
      <div style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        pointerEvents: 'auto'
      }}>
        {/* Main universe indicator */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            border: `2px solid ${getUniverseColor(currentUniverse)}`,
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 20px ${getUniverseColor(currentUniverse)}40`,
            userSelect: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)';
            e.currentTarget.style.boxShadow = `0 0 30px ${getUniverseColor(currentUniverse)}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            e.currentTarget.style.boxShadow = `0 0 20px ${getUniverseColor(currentUniverse)}40`;
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>
              {getUniverseIcon(currentUniverse)}
            </span>
            <span>
              {universeManager.getUniverseConfig(currentUniverse).name}
            </span>
            <span style={{ fontSize: '10px', opacity: 0.7 }}>
              {isExpanded ? '▼' : '▶'}
            </span>
          </div>
        </div>

        {/* Expanded universe list */}
        {isExpanded && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '200px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}>
            {/* Connected universes (portals available) */}
            {connectedUniverses.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  fontSize: '10px',
                  color: '#888',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  🌌 Available Portals
                </div>
                {connectedUniverses.map(universe => (
                  <div
                    key={universe}
                    onClick={() => handleUniverseSwitch(universe)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      margin: '2px 0',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${getUniverseColor(universe)}40`,
                      borderRadius: '4px',
                      color: 'white',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = getUniverseColor(universe);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = `${getUniverseColor(universe)}40`;
                    }}
                  >
                    <span>{getUniverseIcon(universe)}</span>
                    <span>{universeManager.getUniverseConfig(universe).name}</span>
                    <span style={{ fontSize: '10px', opacity: 0.6 }}>
                      →
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* All universes (for demonstration) */}
            <div>
              <div style={{
                fontSize: '10px',
                color: '#888',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                🌍 All Universes
              </div>
              {availableUniverses.map(universe => (
                <div
                  key={universe}
                  onClick={() => handleUniverseSwitch(universe)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 8px',
                    margin: '1px 0',
                    borderRadius: '4px',
                    color: universe === currentUniverse ? getUniverseColor(universe) : '#ccc',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: universe === currentUniverse ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (universe !== currentUniverse) {
                      e.currentTarget.style.color = getUniverseColor(universe);
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (universe !== currentUniverse) {
                      e.currentTarget.style.color = '#ccc';
                      e.currentTarget.style.opacity = '0.6';
                    }
                  }}
                >
                  <span>{getUniverseIcon(universe)}</span>
                  <span>{universeManager.getUniverseConfig(universe).name}</span>
                  {universe === currentUniverse && (
                    <span style={{ fontSize: '10px' }}>✓</span>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div style={{
              marginTop: '8px',
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px',
              fontSize: '10px',
              color: '#888',
              lineHeight: '1.3'
            }}>
              Click to travel between universes through portals
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}

/**
 * Portal visual component
 * Shows animated portal connections between universes
 */
export function PortalVisualizer() {
  const universeManager = UniverseManager.getInstance();
  const portalConnections = universeManager.getPortalConnections();
  const currentUniverse = universeManager.getCurrentUniverseType();

  // Get portals connected to current universe
  const connectedPortals = portalConnections.filter(
    conn => conn.from === currentUniverse || conn.to === currentUniverse
  );

  return (
    <>
      {connectedPortals.map((portal, index) => {
        const targetUniverse = portal.from === currentUniverse ? portal.to : portal.from;
        const angle = (index / connectedPortals.length) * Math.PI * 2;
        const distance = 25;
        const x = Math.cos(angle) * distance;
        const z = Math.sin(angle) * distance;
        const y = Math.sin(angle * 2) * 5;

        return (
          <group key={portal.from + '-' + portal.to} position={[x, y, z]}>
            {/* Portal ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[3, 5, 32]} />
              <meshBasicMaterial
                color={universeManager.getUniverseConfig(targetUniverse).visualTheme.nebulaColors[0]}
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* Portal center */}
            <mesh>
              <sphereGeometry args={[1, 16, 16]} />
              <meshBasicMaterial
                color={universeManager.getUniverseConfig(targetUniverse).visualTheme.nebulaColors[1]}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Portal label */}
            <Html position={[0, 4, 0]}>
              <div style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                border: `1px solid ${universeManager.getUniverseConfig(targetUniverse).visualTheme.nebulaColors[0]}`,
                borderRadius: '4px',
                padding: '4px 8px',
                color: 'white',
                fontSize: '10px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                pointerEvents: 'none'
              }}>
                <div>{universeManager.getUniverseConfig(targetUniverse).name}</div>
                <div style={{ fontSize: '8px', opacity: 0.7 }}>Portal</div>
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}
