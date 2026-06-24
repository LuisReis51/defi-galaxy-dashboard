/**
 * Procedural Identity System
 * Generates deterministic visual identities for entities
 * Same entity always looks the same across sessions
 */

import type { UniversalEntity, ProceduralIdentity, SurfaceFeature } from '../entities/UniversalEntity';
import { BiomeType } from '../entities/UniversalEntity';

export class ProceduralIdentityGenerator {
  /**
   * Generate procedural identity for an entity
   * Ensures deterministic appearance across sessions
   */
  static generateIdentity(entity: UniversalEntity): ProceduralIdentity {
    const seed = this.generateSeed(entity.id);
    const biomeType = this.determineBiomeType(entity);
    
    return {
      entityId: entity.id,
      biomeType,
      surfaceSeed: this.generateSurfaceSeed(seed),
      atmosphereSeed: this.generateAtmosphereSeed(seed),
      colorPalette: this.generateColorPalette(biomeType, seed),
      features: this.generateSurfaceFeatures(biomeType, seed)
    };
  }

  /**
   * Generate deterministic seed from entity ID
   */
  private static generateSeed(entityId: string): number {
    let hash = 0;
    for (let i = 0; i < entityId.length; i++) {
      const char = entityId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Determine biome type based on entity characteristics
   * This is where specific entities get their recognizable appearances
   */
  private static determineBiomeType(entity: UniversalEntity): BiomeType {
    const { entityType, universeType, symbol, name } = entity;
    
    // Specific entity mappings for recognizability
    if (universeType === 'defi') {
      if (entityType === 'blockchain') {
        switch (symbol.toLowerCase()) {
          case 'eth':
          case 'ethereum':
            return BiomeType.GAS_GIANT; // Blue/purple bands
          case 'bnb':
          case 'bsc':
            return BiomeType.GOLDEN_ROCKY; // Gold/tan cratered
          case 'sol':
          case 'solana':
            return BiomeType.CRYSTAL; // Purple/blue facets
          case 'arb':
          case 'arbitrum':
            return BiomeType.METALLIC; // Silver/circuits
          case 'matic':
          case 'polygon':
            return BiomeType.STORMY; // Purple/vortex
          case 'avax':
          case 'avalanche':
            return BiomeType.VOLCANIC; // Red/orange lava
          case 'op':
          case 'optimism':
            return BiomeType.VOLCANIC; // Red/orange lava
          case 'base':
            return BiomeType.OCEAN; // Blue/water
          case 'xgt':
            return BiomeType.NEXUS; // Green/gold particles
          default:
            return BiomeType.METALLIC;
        }
      }
    }
    
    if (universeType === 'nasdaq') {
      if (entityType === 'company') {
        switch (symbol.toLowerCase()) {
          case 'nvda':
          case 'nvidia':
            return BiomeType.ARTIFICIAL_MEGACITY; // Circuit patterns, neon
          case 'aapl':
          case 'apple':
            return BiomeType.LUXURY_EARTH; // Pristine blue/green
          case 'tsla':
          case 'tesla':
            return BiomeType.INDUSTRIAL_ENERGY; // Industrial, energy flows
          case 'msft':
          case 'microsoft':
            return BiomeType.ARTIFICIAL_MEGACITY; // Digital patterns
          case 'goog':
          case 'google':
          case 'aal':
          case 'alphabet':
            return BiomeType.ARTIFICIAL_MEGACITY; // Global network
          case 'amzn':
          case 'amazon':
            return BiomeType.FOREST_WORLD; // Global ecosystem
          case 'meta':
            return BiomeType.ARTIFICIAL_MEGACITY; // Social network
          default:
            if (name.toLowerCase().includes('technology') || 
                name.toLowerCase().includes('software')) {
              return BiomeType.ARTIFICIAL_MEGACITY;
            }
            if (name.toLowerCase().includes('energy') || 
                name.toLowerCase().includes('industrial')) {
              return BiomeType.INDUSTRIAL_ENERGY;
            }
            if (name.toLowerCase().includes('consumer') || 
                name.toLowerCase().includes('retail')) {
              return BiomeType.LUXURY_EARTH;
            }
            return BiomeType.METALLIC;
        }
      }
    }
    
    if (universeType === 'commodity') {
      if (entityType === 'commodity') {
        switch (symbol.toLowerCase()) {
          case 'gold':
          case 'gc':
            return BiomeType.METALLIC_CORE; // Golden metallic
          case 'silver':
          case 'si':
            return BiomeType.METALLIC; // Silver metallic
          case 'oil':
          case 'crude':
          case 'cl':
            return BiomeType.VOLCANIC; // Black/gold energy
          case 'copper':
            return BiomeType.METALLIC; // Reddish metallic
          default:
            return BiomeType.METALLIC_CORE;
        }
      }
    }
    
    if (universeType === 'carbon') {
      if (entityType === 'credit' || entityType === 'project') {
        return BiomeType.FOREST_WORLD; // Green, sustainable
      }
      if (entityType === 'registry') {
        return BiomeType.CRYSTAL; // Structured, organized
      }
    }
    
    if (universeType === 'excalibur-nexus') {
      return BiomeType.NEXUS; // Special nexus appearance
    }
    
    // Default biome based on entity type
    switch (entityType) {
      case 'blockchain':
        return BiomeType.GAS_GIANT;
      case 'company':
        return BiomeType.ARTIFICIAL_MEGACITY;
      case 'commodity':
        return BiomeType.METALLIC_CORE;
      case 'project':
        return BiomeType.FOREST_WORLD;
      default:
        return BiomeType.METALLIC;
    }
  }

  /**
   * Generate surface seed from base seed
   */
  private static generateSurfaceSeed(baseSeed: number): number {
    return (baseSeed * 31) % 1000000;
  }

  /**
   * Generate atmosphere seed from base seed
   */
  private static generateAtmosphereSeed(baseSeed: number): number {
    return (baseSeed * 47) % 1000000;
  }

  /**
   * Generate color palette based on biome type and seed
   */
  private static generateColorPalette(biomeType: BiomeType, seed: number): string[] {
    const basePalettes: Record<BiomeType, string[]> = {
      [BiomeType.GAS_GIANT]: ['#627EEA', '#8ba4f7', '#4c63d2', '#1e3a8a', '#60a5fa'],
      [BiomeType.GOLDEN_ROCKY]: ['#F3BA2F', '#f7cf6b', '#d4a017', '#b8860b', '#fbbf24'],
      [BiomeType.CRYSTAL]: ['#9945FF', '#bb80ff', '#7c3aed', '#6d28d9', '#a78bfa'],
      [BiomeType.ICE]: ['#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9'],
      [BiomeType.OCEAN]: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
      [BiomeType.VOLCANIC]: ['#E84142', '#f07475', '#dc2626', '#b91c1c', '#ef4444'],
      [BiomeType.STORMY]: ['#8247E5', '#a97cf0', '#7c3aed', '#6d28d9', '#8b5cf6'],
      [BiomeType.METALLIC]: ['#6b7280', '#9ca3af', '#4b5563', '#374151', '#d1d5db'],
      [BiomeType.NEXUS]: ['#ffd700', '#ffe566', '#10b981', '#34d399', '#6ee7b7'],
      [BiomeType.ARTIFICIAL_MEGACITY]: ['#00ffff', '#00bcd4', '#0097a7', '#006064', '#00acc1'],
      [BiomeType.LUXURY_EARTH]: ['#10b981', '#34d399', '#059669', '#047857', '#6ee7b7'],
      [BiomeType.INDUSTRIAL_ENERGY]: ['#f97316', '#fb923c', '#ea580c', '#c2410c', '#fed7aa'],
      [BiomeType.METALLIC_CORE]: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#fef3c7'],
      [BiomeType.FOREST_WORLD]: ['#22c55e', '#4ade80', '#16a34a', '#15803d', '#86efac'],
      [BiomeType.DESERT_OASIS]: ['#f59e0b', '#fbbf24', '#d97706', '#92400e', '#fef3c7']
    };
    
    const basePalette = basePalettes[biomeType] || basePalettes.metallic;
    
    // Modify palette based on seed for variety within biome
    const modifiedPalette = basePalette.map((color, index) => {
      const hueShift = (seed % 20) - 10; // -10 to +10 degree shift
      const brightnessShift = ((seed % 10) - 5) * 0.1; // -0.5 to +0.5 brightness
      
      // Simple color modification (in real implementation, use proper color space conversion)
      return this.modifyColor(color, hueShift, brightnessShift);
    });
    
    return modifiedPalette;
  }

  /**
   * Generate surface features based on biome and seed
   */
  private static generateSurfaceFeatures(biomeType: BiomeType, seed: number): SurfaceFeature[] {
    const features: SurfaceFeature[] = [];
    const featureCount = 3 + (seed % 5); // 3-7 features
    
    for (let i = 0; i < featureCount; i++) {
      const featureSeed = (seed + i * 100) % 1000;
      
      let featureType: SurfaceFeature['type'];
      let intensity: number;
      
      // Determine feature type based on biome
      switch (biomeType) {
        case BiomeType.GAS_GIANT:
          featureType = 'storm';
          intensity = 0.6 + (featureSeed % 40) / 100;
          break;
        case BiomeType.GOLDEN_ROCKY:
          featureType = 'crater';
          intensity = 0.3 + (featureSeed % 50) / 100;
          break;
        case BiomeType.CRYSTAL:
          featureType = 'mountain';
          intensity = 0.7 + (featureSeed % 30) / 100;
          break;
        case BiomeType.VOLCANIC:
          featureType = featureSeed % 2 === 0 ? 'volcano' : 'lava-flow';
          intensity = 0.8 + (featureSeed % 20) / 100;
          break;
        case BiomeType.ARTIFICIAL_MEGACITY:
          featureType = 'city';
          intensity = 0.5 + (featureSeed % 50) / 100;
          break;
        case BiomeType.FOREST_WORLD:
          featureType = 'forest';
          intensity = 0.6 + (featureSeed % 40) / 100;
          break;
        case BiomeType.OCEAN:
          featureType = 'whirlpool';
          intensity = 0.4 + (featureSeed % 40) / 100;
          break;
        default:
          featureType = 'mountain';
          intensity = 0.5 + (featureSeed % 50) / 100;
      }
      
      features.push({
        type: featureType,
        position: [
          ((featureSeed * 7) % 200) / 100 - 1, // -1 to 1
          ((featureSeed * 13) % 200) / 100 - 1,
          ((featureSeed * 17) % 200) / 100 - 1
        ],
        size: 0.1 + ((featureSeed % 30) / 100), // 0.1 to 0.4
        intensity
      });
    }
    
    return features;
  }

  /**
   * Simple color modification (placeholder implementation)
   * In production, use proper HSL color space manipulation
   */
  private static modifyColor(color: string, hueShift: number, brightnessShift: number): string {
    // This is a simplified version - real implementation would convert to HSL
    // For now, return the original color with minor variations
    return color;
  }

  /**
   * Validate that the same entity generates the same identity
   */
  static validateIdentityConsistency(entity: UniversalEntity): boolean {
    const identity1 = this.generateIdentity(entity);
    const identity2 = this.generateIdentity(entity);
    
    return (
      identity1.entityId === identity2.entityId &&
      identity1.biomeType === identity2.biomeType &&
      identity1.surfaceSeed === identity2.surfaceSeed &&
      identity1.atmosphereSeed === identity2.atmosphereSeed
    );
  }

  /**
   * Get biome characteristics for rendering
   */
  static getBiomeCharacteristics(biomeType: BiomeType) {
    const characteristics: Record<BiomeType, {
      hasAtmosphere: boolean;
      hasRings: boolean;
      surfaceType: string;
      atmosphereDensity: number;
      rotationSpeed: number;
    }> = {
      [BiomeType.GAS_GIANT]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'banded',
        atmosphereDensity: 0.8,
        rotationSpeed: 1.2
      },
      [BiomeType.GOLDEN_ROCKY]: {
        hasAtmosphere: false,
        hasRings: false,
        surfaceType: 'cratered',
        atmosphereDensity: 0.1,
        rotationSpeed: 0.8
      },
      [BiomeType.CRYSTAL]: {
        hasAtmosphere: false,
        hasRings: true,
        surfaceType: 'faceted',
        atmosphereDensity: 0.0,
        rotationSpeed: 0.6
      },
      [BiomeType.ICE]: {
        hasAtmosphere: true,
        hasRings: true,
        surfaceType: 'smooth',
        atmosphereDensity: 0.6,
        rotationSpeed: 0.9
      },
      [BiomeType.OCEAN]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'liquid',
        atmosphereDensity: 0.7,
        rotationSpeed: 1.0
      },
      [BiomeType.VOLCANIC]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'active',
        atmosphereDensity: 0.9,
        rotationSpeed: 1.1
      },
      [BiomeType.STORMY]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'vortex',
        atmosphereDensity: 0.8,
        rotationSpeed: 1.3
      },
      [BiomeType.METALLIC]: {
        hasAtmosphere: false,
        hasRings: false,
        surfaceType: 'metallic',
        atmosphereDensity: 0.0,
        rotationSpeed: 0.7
      },
      [BiomeType.NEXUS]: {
        hasAtmosphere: true,
        hasRings: true,
        surfaceType: 'energy',
        atmosphereDensity: 1.0,
        rotationSpeed: 1.5
      },
      [BiomeType.ARTIFICIAL_MEGACITY]: {
        hasAtmosphere: false,
        hasRings: false,
        surfaceType: 'grid',
        atmosphereDensity: 0.2,
        rotationSpeed: 0.5
      },
      [BiomeType.LUXURY_EARTH]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'vegetation',
        atmosphereDensity: 0.6,
        rotationSpeed: 1.0
      },
      [BiomeType.INDUSTRIAL_ENERGY]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'industrial',
        atmosphereDensity: 0.7,
        rotationSpeed: 0.9
      },
      [BiomeType.METALLIC_CORE]: {
        hasAtmosphere: false,
        hasRings: false,
        surfaceType: 'metallic-core',
        atmosphereDensity: 0.0,
        rotationSpeed: 0.4
      },
      [BiomeType.FOREST_WORLD]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'forest',
        atmosphereDensity: 0.5,
        rotationSpeed: 1.0
      },
      [BiomeType.DESERT_OASIS]: {
        hasAtmosphere: true,
        hasRings: false,
        surfaceType: 'desert',
        atmosphereDensity: 0.3,
        rotationSpeed: 1.1
      }
    };
    
    return characteristics[biomeType] || characteristics[BiomeType.METALLIC];
  }
}
