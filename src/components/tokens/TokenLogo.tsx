import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Token } from '@/store/types';

interface TokenLogoProps {
  token: Token;
  distance: number; // Distance from camera for LOD
}

// Logo cache for performance
const logoCache = new Map<string, HTMLImageElement>();

export function TokenLogo({ token, distance }: TokenLogoProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // LOD system - determine visibility based on distance
  const lodLevel = useMemo(() => {
    if (distance > 25) return 0; // Too far - no logo
    if (distance > 10) return 1; // Medium - logo only
    return 2; // Close - logo + details
  }, [distance]);

  // Get logo URL with fallback
  const logoUrl = useMemo(() => {
    if (token.isHighlighted) {
      return 'https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png';
    }
    return token.iconUrl || `https://assets.coingecko.com/coins/images/64/${token.id}.png`;
  }, [token]);

  useFrame((state) => {
    if (!groupRef.current || lodLevel === 0) return;
    
    // Always face the camera
    groupRef.current.lookAt(state.camera.position);
  });

  // Don't render if too far away
  if (lodLevel === 0) return null;

  return (
    <group ref={groupRef}>
      <Html
        center
        position={[0, 0, 0]}
        style={{
          pointerEvents: 'none',
          transform: `scale(${lodLevel === 1 ? 0.8 : 1.2})`,
          opacity: lodLevel === 1 ? 0.7 : 0.9,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: lodLevel === 1 ? '24px' : '32px',
            height: lodLevel === 1 ? '24px' : '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${token.isHighlighted ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
            overflow: 'hidden',
          }}
        >
          <img
            src={logoUrl}
            alt={token.symbol}
            width={lodLevel === 1 ? 20 : 28}
            height={lodLevel === 1 ? 20 : 28}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              // Fallback to symbol text if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent && !parent.querySelector('.fallback-text')) {
                const fallback = document.createElement('div');
                fallback.className = 'fallback-text';
                fallback.textContent = token.symbol.slice(0, 2);
                fallback.style.cssText = `
                  font-size: ${lodLevel === 1 ? '10px' : '12px'};
                  font-weight: bold;
                  color: white;
                  text-transform: uppercase;
                `;
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        
        {/* Close distance - show token symbol */}
        {lodLevel === 2 && (
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: token.isHighlighted ? '#ffd700' : '#ffffff',
              textShadow: '0 0 4px rgba(0, 0, 0, 0.8)',
              whiteSpace: 'nowrap',
              background: 'rgba(0, 0, 0, 0.6)',
              padding: '2px 6px',
              borderRadius: '4px',
              backdropFilter: 'blur(2px)',
            }}
          >
            {token.symbol}
          </div>
        )}
      </Html>
    </group>
  );
}
