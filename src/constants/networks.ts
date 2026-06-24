import type { Network, Token } from '@/store/types';
import * as THREE from 'three';

export const STATIC_NETWORKS: Omit<Network, 'tvl' | 'tvlChange24h' | 'tokenCount' | 'dominance'>[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    glowColor: '#8ba4f7',
    position: [0, 0, 0],
    chainId: 1,
    rpcUrl: 'https://cloudflare-eth.com',
    defiLlamaSlug: 'ethereum',
    biome: 'gas-giant',
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    color: '#F3BA2F',
    glowColor: '#f7cf6b',
    position: [28, 4, -12],
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    defiLlamaSlug: 'bsc',
    biome: 'golden-rocky',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#9945FF',
    glowColor: '#bb80ff',
    position: [-24, -6, 8],
    chainId: 0,
    defiLlamaSlug: 'solana',
    biome: 'crystal',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    color: '#28A0F0',
    glowColor: '#60bfff',
    position: [16, -10, 20],
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    defiLlamaSlug: 'arbitrum',
    biome: 'metallic',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
    glowColor: '#a97cf0',
    position: [-18, 12, -20],
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    defiLlamaSlug: 'polygon',
    biome: 'stormy',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    color: '#E84142',
    glowColor: '#f07475',
    position: [-32, 2, 16],
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    defiLlamaSlug: 'avax',
    biome: 'volcanic',
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'OP',
    color: '#FF0420',
    glowColor: '#ff5572',
    position: [36, 8, 4],
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    defiLlamaSlug: 'optimism',
    biome: 'volcanic',
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'BASE',
    color: '#0052FF',
    glowColor: '#4d87ff',
    position: [10, 16, -28],
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    defiLlamaSlug: 'base',
    biome: 'ocean',
  },
  {
    id: 'excalibur-nexus',
    name: 'Excalibur Nexus',
    symbol: 'XGT',
    color: '#ffd700',
    glowColor: '#ffe566',
    position: [0, 32, -48],
    chainId: 9999,
    defiLlamaSlug: 'excalibur-nexus',
    biome: 'nexus',
  },
];

export const NETWORK_CHAIN_MAP: Record<number, string> = {
  1: 'ethereum',
  56: 'bsc',
  137: 'polygon',
  42161: 'arbitrum',
  43114: 'avalanche',
  10: 'optimism',
  8453: 'base',
};

export const TVL_TO_PLANET_RADIUS = (tvl: number): number => {
  const minRadius = 1.2;
  const maxRadius = 5.0;
  const minTVL = 1e8;
  const maxTVL = 1e11;
  const normalized = Math.log10(Math.max(tvl, minTVL) / minTVL) / Math.log10(maxTVL / minTVL);
  return minRadius + normalized * (maxRadius - minRadius);
};

export const MARKET_CAP_TO_ORBIT_RADIUS = (rank: number): number => {
  const base = 6;
  const step = 2.2;
  const tier = Math.floor((rank - 1) / 5);
  return base + tier * step + (((rank - 1) % 5) * 0.4);
};

export const VOLUME_TO_ORBIT_SPEED = (volume24h: number): number => {
  const min = 0.08;
  const max = 0.8;
  const ref = 1e8;
  const normalized = Math.min(volume24h / ref, 1);
  return min + normalized * (max - min);
};

// Chain metadata for deterministic generation
export interface ChainMetadata {
  launchDate: Date;
  sector: 'defi' | 'gaming' | 'infrastructure' | 'enterprise' | 'nexus';
  consensusType: 'pow' | 'pos' | 'dpos' | 'other';
  complexity: number; // 1-10 scale
  maturity: number; // 1-10 scale
}

export const CHAIN_METADATA: Record<string, ChainMetadata> = {
  ethereum: {
    launchDate: new Date('2015-07-30'),
    sector: 'infrastructure',
    consensusType: 'pos',
    complexity: 9,
    maturity: 10,
  },
  bsc: {
    launchDate: new Date('2020-09-01'),
    sector: 'defi',
    consensusType: 'pos',
    complexity: 6,
    maturity: 8,
  },
  solana: {
    launchDate: new Date('2020-03-16'),
    sector: 'infrastructure',
    consensusType: 'pos',
    complexity: 8,
    maturity: 7,
  },
  arbitrum: {
    launchDate: new Date('2021-08-31'),
    sector: 'infrastructure',
    consensusType: 'pos',
    complexity: 7,
    maturity: 6,
  },
  polygon: {
    launchDate: new Date('2019-10-01'),
    sector: 'infrastructure',
    consensusType: 'pos',
    complexity: 7,
    maturity: 8,
  },
  avalanche: {
    launchDate: new Date('2020-09-21'),
    sector: 'defi',
    consensusType: 'pos',
    complexity: 8,
    maturity: 7,
  },
  optimism: {
    launchDate: new Date('2021-12-01'),
    sector: 'infrastructure',
    consensusType: 'pos',
    complexity: 6,
    maturity: 6,
  },
  base: {
    launchDate: new Date('2023-02-23'),
    sector: 'infrastructure',
    consensusType: 'pos',
    complexity: 5,
    maturity: 4,
  },
  'excalibur-nexus': {
    launchDate: new Date('2024-01-01'),
    sector: 'nexus',
    consensusType: 'pos',
    complexity: 10,
    maturity: 3,
  },
};

// Deterministic hash function for chain data
export function hashChainData(chainId: number, tvl: number, volume: number): number {
  const str = `${chainId}-${tvl}-${volume}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Deterministic planet identity generator
export function generatePlanetIdentity(network: Network & { tvl: number; volume24h: number }) {
  const metadata = CHAIN_METADATA[network.id];
  const hash = hashChainData(network.chainId, network.tvl, network.volume24h || 1e6);
  const age = (Date.now() - metadata.launchDate.getTime()) / (1000 * 60 * 60 * 24); // days
  
  return {
    // Terrain based on sector and complexity
    terrainType: getTerrainType(metadata.sector, metadata.complexity, hash),
    
    // Atmosphere density based on TVL and maturity
    atmosphereDensity: getAtmosphereDensity(network.tvl, metadata.maturity),
    
    // Ring presence based on dominance and age
    ringPresence: hasRings(network.dominance || 0, age),
    
    // Rotation speed based on volume and consensus
    rotationSpeed: getRotationSpeed(network.volume24h || 1e6, metadata.consensusType),
    
    // Surface structures based on token count and complexity
    surfaceStructures: getSurfaceStructures(network.tokenCount || 100, metadata.complexity, hash),
    
    // Color variations based on sector
    colorVariation: getColorVariation(metadata.sector, hash),
    
    // Weather patterns based on volume and age
    weatherIntensity: getWeatherIntensity(network.volume24h || 1e6, age),
  };
}

// Helper functions for deterministic generation
function getTerrainType(sector: string, complexity: number, hash: number): string {
  const terrainTypes = {
    defi: ['rocky', 'metallic', 'crystalline'],
    gaming: ['organic', 'neon', 'holographic'],
    infrastructure: ['geometric', 'circuit', 'grid'],
    enterprise: ['smooth', 'polished', 'corporate'],
    nexus: ['quantum', 'energy', 'transdimensional'],
  };
  
  const types = terrainTypes[sector as keyof typeof terrainTypes] || terrainTypes.infrastructure;
  return types[hash % types.length];
}

function getAtmosphereDensity(tvl: number, maturity: number): number {
  const tvlFactor = Math.min(tvl / 1e10, 1); // Normalize to 0-1
  const maturityFactor = maturity / 10;
  return (tvlFactor * 0.6 + maturityFactor * 0.4);
}

function hasRings(dominance: number, age: number): boolean {
  return dominance > 15 || age > 2000; // 15% dominance or 2000+ days old
}

function getRotationSpeed(volume: number, consensusType: string): number {
  const baseSpeed = Math.min(volume / 1e9, 2); // Max 2x speed
  const consensusMultiplier = {
    pow: 0.5,
    pos: 1.0,
    dpos: 1.5,
    other: 1.0,
  }[consensusType] || 1.0;
  
  return baseSpeed * consensusMultiplier;
}

function getSurfaceStructures(tokenCount: number, complexity: number, hash: number): number {
  const baseStructures = Math.min(tokenCount / 100, 10); // Max 10 structures
  const complexityFactor = complexity / 10;
  const hashFactor = (hash % 100) / 100; // 0-1 random factor
  
  return Math.floor(baseStructures * complexityFactor * (0.5 + hashFactor));
}

function getColorVariation(sector: string, hash: number): number {
  const sectorRanges = {
    defi: [0.8, 1.2],
    gaming: [0.6, 1.4],
    infrastructure: [0.9, 1.1],
    enterprise: [0.95, 1.05],
    nexus: [0.7, 1.3],
  };
  
  const [min, max] = sectorRanges[sector as keyof typeof sectorRanges] || sectorRanges.infrastructure;
  return min + (hash % 100) / 100 * (max - min);
}

function getWeatherIntensity(volume: number, age: number): number {
  const volumeFactor = Math.min(volume / 1e9, 1);
  const ageFactor = Math.min(age / 2000, 1); // 2000 days = full intensity
  return (volumeFactor * 0.7 + ageFactor * 0.3);
}

// Token inheritance from parent network
export function getInheritedTokenTraits(token: Token, network: Network) {
  const metadata = CHAIN_METADATA[network.id];
  const networkHash = hashChainData(network.chainId, network.tvl, network.tvl * 0.1);
  
  return {
    // Base color inherits from network with variation
    baseColor: new THREE.Color(network.color).multiplyScalar(
      getColorVariation(metadata.sector, networkHash + token.rank)
    ),
    
    // Glow intensity based on network maturity + token social score
    glowIntensity: (metadata.maturity / 10) * 0.5 + (token.socialScore / 100) * 0.5,
    
    // Orbit inclination based on network complexity
    orbitInclination: (metadata.complexity / 10) * 15, // 0-15 degrees
    
    // Visual style based on network sector
    visualStyle: getNetworkVisualStyle(metadata.sector),
    
    // Transparency based on network maturity (more mature = more solid)
    transparency: 1 - (metadata.maturity / 20), // 0.5-0.95 opacity
    
    // Surface pattern based on consensus type
    surfacePattern: metadata.consensusType,
    
    // Energy effect intensity based on TVL
    energyIntensity: Math.min(network.tvl / 1e10, 1),
  };
}

function getNetworkVisualStyle(sector: string): string {
  const styles = {
    defi: 'metallic-shiny',
    gaming: 'neon-glowing', 
    infrastructure: 'geometric-circuit',
    enterprise: 'smooth-polished',
    nexus: 'quantum-energy',
  };
  return styles[sector as keyof typeof styles] || styles.infrastructure;
}
