/**
 * Independent Galaxy Datasets
 * Each galaxy has its own rich, distinct data — no reflected DeFi data
 */

import type { UniversalEntity, EntityType, UniverseType, BiomeType } from '../entities/UniversalEntity';
import { LayerType, EntityType as ET, UniverseType as UT, BiomeType as BT } from '../entities/UniversalEntity';

interface GalaxyDataset {
  name: string;
  color: string;
  position: [number, number, number];
  entities: UniversalEntity[];
}

function createEntity(
  id: string,
  name: string,
  symbol: string,
  entityType: EntityType,
  universeType: UniverseType,
  color: string,
  glowColor: string,
  biomeType: BiomeType,
  position: [number, number, number],
  size: number,
  marketCap: number,
  tvl: number,
  childrenIds: string[] = []
): UniversalEntity {
  return {
    id,
    name,
    symbol,
    entityType,
    universeType,
    parentId: undefined,
    childrenIds,
    spatial: {
      size,
      orbitRadius: 10 + Math.random() * 20,
      orbitSpeed: 0.2 + Math.random() * 0.6,
      orbitPhase: Math.random() * Math.PI * 2,
      glowIntensity: 0.7 + Math.random() * 0.3,
      rotationSpeed: 0.05 + Math.random() * 0.15,
      zElevation: (Math.random() - 0.5) * 8,
      color,
      glowColor,
      biomeType,
      position
    },
    metrics: {
      marketCap,
      tvl,
      tokenCount: Math.floor(100 + Math.random() * 900),
      dominance: Math.random() * 100,
      liquidityScore: 0.5 + Math.random() * 0.5,
      confidence: 0.6 + Math.random() * 0.4,
      transactionVelocity: Math.floor(50 + Math.random() * 200)
    },
    identity: {
      entityId: id,
      biomeType,
      surfaceSeed: Math.floor(Math.random() * 100000),
      atmosphereSeed: Math.floor(Math.random() * 100000),
      colorPalette: [color, glowColor, '#ffffff', '#000000', color],
      features: []
    },
    connections: [],
    influenceRadius: size * 4,
    layers: [{
      layerType: LayerType.EXPLORER,
      visibleMetrics: ['marketCap', 'tvl'],
      hiddenMetrics: [],
      visualOverrides: {},
      interactions: []
    }],
    defaultLayer: LayerType.EXPLORER,
    metadata: {
      description: `${name} — ${universeType} entity`,
      founded: 2010 + Math.floor(Math.random() * 14),
      consensus: 'N/A'
    },
    tags: [universeType, entityType],
    isSelected: false,
    isHovered: false,
    isVisible: true
  };
}

// ─── NASDAQ GALAXY ───
function createNasdaqEntities(): UniversalEntity[] {
  const stocks = [
    { id: 'nvda', name: 'NVIDIA', symbol: 'NVDA', color: '#76b900', cap: 2200e9, tvl: 45e9, size: 5.0 },
    { id: 'aapl', name: 'Apple', symbol: 'AAPL', color: '#555555', cap: 3000e9, tvl: 60e9, size: 5.2 },
    { id: 'msft', name: 'Microsoft', symbol: 'MSFT', color: '#00a4ef', cap: 2800e9, tvl: 55e9, size: 5.0 },
    { id: 'googl', name: 'Alphabet', symbol: 'GOOGL', color: '#4285f4', cap: 1700e9, tvl: 35e9, size: 4.5 },
    { id: 'amzn', name: 'Amazon', symbol: 'AMZN', color: '#ff9900', cap: 1800e9, tvl: 40e9, size: 4.6 },
    { id: 'meta', name: 'Meta', symbol: 'META', color: '#0668e1', cap: 1200e9, tvl: 28e9, size: 4.0 },
    { id: 'tsla', name: 'Tesla', symbol: 'TSLA', color: '#cc0000', cap: 800e9, tvl: 22e9, size: 3.5 },
    { id: 'avgo', name: 'Broadcom', symbol: 'AVGO', color: '#e31837', cap: 600e9, tvl: 15e9, size: 3.2 },
    { id: 'cost', name: 'Costco', symbol: 'COST', color: '#e31837', cap: 350e9, tvl: 8e9, size: 2.8 },
    { id: 'nflx', name: 'Netflix', symbol: 'NFLX', color: '#e50914', cap: 280e9, tvl: 7e9, size: 2.5 },
    { id: 'amd', name: 'AMD', symbol: 'AMD', color: '#ed1c24', cap: 250e9, tvl: 6e9, size: 2.4 },
    { id: 'intc', name: 'Intel', symbol: 'INTC', color: '#0071c5', cap: 130e9, tvl: 4e9, size: 2.0 },
  ];

  return stocks.map((s, i) => {
    const angle = (i / stocks.length) * Math.PI * 2;
    const radius = 25 + (i % 3) * 15;
    return createEntity(
      s.id, s.name, s.symbol, ET.COMPANY, UT.NASDAQ,
      s.color, s.color, BT.LUXURY_EARTH,
      [Math.cos(angle) * radius, (Math.random() - 0.5) * 10, Math.sin(angle) * radius],
      s.size, s.cap, s.tvl
    );
  });
}

// ─── COMMODITY GALAXY ───
function createCommodityEntities(): UniversalEntity[] {
  const commodities = [
    { id: 'gold', name: 'Gold', symbol: 'XAU', color: '#ffd700', cap: 14000e9, tvl: 120e9, size: 5.5, biome: 'golden-rocky' },
    { id: 'silver', name: 'Silver', symbol: 'XAG', color: '#c0c0c0', cap: 1400e9, tvl: 30e9, size: 4.0, biome: 'metallic' },
    { id: 'oil', name: 'Crude Oil', symbol: 'WTI', color: '#1a1a1a', cap: 2500e9, tvl: 80e9, size: 4.5, biome: 'volcanic' },
    { id: 'copper', name: 'Copper', symbol: 'HG', color: '#b87333', cap: 300e9, tvl: 15e9, size: 3.2, biome: 'metallic-core' },
    { id: 'platinum', name: 'Platinum', symbol: 'XPT', color: '#e5e4e2', cap: 80e9, tvl: 5e9, size: 2.5, biome: 'metallic' },
    { id: 'palladium', name: 'Palladium', symbol: 'XPD', color: '#b0b0b0', cap: 60e9, tvl: 4e9, size: 2.3, biome: 'metallic' },
    { id: 'wheat', name: 'Wheat', symbol: 'ZW', color: '#f5deb3', cap: 50e9, tvl: 3e9, size: 2.2, biome: 'forest-world' },
    { id: 'corn', name: 'Corn', symbol: 'ZC', color: '#ffdb58', cap: 40e9, tvl: 2.5e9, size: 2.1, biome: 'forest-world' },
    { id: 'coffee', name: 'Coffee', symbol: 'KC', color: '#6f4e37', cap: 120e9, tvl: 8e9, size: 2.8, biome: 'forest-world' },
    { id: 'natgas', name: 'Natural Gas', symbol: 'NG', color: '#87ceeb', cap: 400e9, tvl: 20e9, size: 3.5, biome: 'gas-giant' },
    { id: 'lithium', name: 'Lithium', symbol: 'LI', color: '#b8d4e3', cap: 150e9, tvl: 10e9, size: 2.8, biome: 'crystal' },
    { id: 'uranium', name: 'Uranium', symbol: 'U', color: '#7fff00', cap: 30e9, tvl: 2e9, size: 2.0, biome: 'volcanic' },
  ];

  return commodities.map((c, i) => {
    const angle = (i / commodities.length) * Math.PI * 2;
    const radius = 25 + (i % 3) * 15;
    return createEntity(
      c.id, c.name, c.symbol, ET.COMMODITY, UT.COMMODITY,
      c.color, c.color, c.biome as BiomeType,
      [Math.cos(angle) * radius, (Math.random() - 0.5) * 10, Math.sin(angle) * radius],
      c.size, c.cap, c.tvl
    );
  });
}

// ─── CARBON GALAXY ───
function createCarbonEntities(): UniversalEntity[] {
  const carbon = [
    { id: 'xgt-carbon', name: 'XGT Blue Carbon', symbol: 'XGT-C', color: '#10b981', cap: 500e6, tvl: 50e6, size: 4.0 },
    { id: 'mangrove', name: 'Mangrove Credits', symbol: 'MGC', color: '#059669', cap: 120e6, tvl: 15e6, size: 3.0 },
    { id: 'seagrass', name: 'Seagrass Credits', symbol: 'SGC', color: '#34d399', cap: 80e6, tvl: 10e6, size: 2.6 },
    { id: 'vcs', name: 'Verra VCS', symbol: 'VCS', color: '#6ee7b7', cap: 2000e6, tvl: 200e6, size: 4.5 },
    { id: 'gs', name: 'Gold Standard', symbol: 'GS', color: '#a7f3d0', cap: 800e6, tvl: 80e6, size: 3.5 },
    { id: 'car', name: 'CAR Token', symbol: 'CAR', color: '#047857', cap: 60e6, tvl: 8e6, size: 2.3 },
    { id: 'tree', name: 'TreeCoin', symbol: 'TREE', color: '#065f46', cap: 40e6, tvl: 5e6, size: 2.0 },
    { id: 'ocean', name: 'Ocean Carbon', symbol: 'OCC', color: '#0e7490', cap: 150e6, tvl: 18e6, size: 2.8 },
    { id: 'soil', name: 'Soil Carbon', symbol: 'SOC', color: '#78350f', cap: 90e6, tvl: 12e6, size: 2.5 },
    { id: 'biochar', name: 'Biochar Credits', symbol: 'BIO', color: '#451a03', cap: 30e6, tvl: 4e6, size: 1.8 },
  ];

  return carbon.map((c, i) => {
    const angle = (i / carbon.length) * Math.PI * 2;
    const radius = 20 + (i % 2) * 15;
    return createEntity(
      c.id, c.name, c.symbol, ET.COMMODITY, UT.CARBON,
      c.color, c.color, BT.FOREST_WORLD,
      [Math.cos(angle) * radius, (Math.random() - 0.5) * 8, Math.sin(angle) * radius],
      c.size, c.cap, c.tvl
    );
  });
}

// ─── EXCALIBUR NEXUS ───
function createExcaliburEntities(): UniversalEntity[] {
  const excalibur = [
    { id: 'xgt', name: 'XGT Token', symbol: 'XGT', color: '#ffd700', cap: 10e6, tvl: 2e6, size: 5.0 },
    { id: 'xgt-lp', name: 'XGT LP', symbol: 'XGT-LP', color: '#ffed4a', cap: 5e6, tvl: 1e6, size: 3.5 },
    { id: 'arraial', name: 'Arraial Project', symbol: 'ARR', color: '#f59e0b', cap: 50e6, tvl: 10e6, size: 4.0 },
    { id: 'liberia', name: 'Liberia Hub', symbol: 'LBR', color: '#10b981', cap: 150e6, tvl: 25e6, size: 4.5 },
    { id: 'manufacturing', name: 'Excalibur Mfg', symbol: 'EXM', color: '#3b82f6', cap: 85e6, tvl: 15e6, size: 3.8 },
    { id: 'cruise', name: 'Cruise Terminal', symbol: 'CRZ', color: '#06b6d4', cap: 45e6, tvl: 8e6, size: 3.2 },
    { id: 'blue-carbon', name: 'Blue Carbon Fund', symbol: 'BCF', color: '#14b8a6', cap: 25e6, tvl: 5e6, size: 2.8 },
    { id: 'xgt-stake', name: 'XGT Staking', symbol: 'XGT-S', color: '#eab308', cap: 3e6, tvl: 0.5e6, size: 2.2 },
  ];

  return excalibur.map((e, i) => {
    const angle = (i / excalibur.length) * Math.PI * 2;
    const radius = 22 + (i % 2) * 12;
    return createEntity(
      e.id, e.name, e.symbol, ET.COMPANY, UT.EXCALIBUR_NEXUS,
      e.color, e.color, BT.GAS_GIANT,
      [Math.cos(angle) * radius, (Math.random() - 0.5) * 8, Math.sin(angle) * radius],
      e.size, e.cap, e.tvl
    );
  });
}

// ─── DEFI GALAXY (Rich dataset) ───
function createDeFiEntities(): UniversalEntity[] {
  const defi = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA', cap: 300e9, tvl: 45e9, size: 5.5 },
    { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', color: '#f0b90b', cap: 80e9, tvl: 8e9, size: 4.0 },
    { id: 'sol', name: 'Solana', symbol: 'SOL', color: '#14f195', cap: 60e9, tvl: 10e9, size: 3.8 },
    { id: 'arb', name: 'Arbitrum', symbol: 'ARB', color: '#28a0f0', cap: 30e9, tvl: 6e9, size: 3.2 },
    { id: 'pol', name: 'Polygon', symbol: 'POL', color: '#8247e5', cap: 20e9, tvl: 4e9, size: 2.8 },
    { id: 'avax', name: 'Avalanche', symbol: 'AVAX', color: '#e84142', cap: 15e9, tvl: 3e9, size: 2.6 },
    { id: 'op', name: 'Optimism', symbol: 'OP', color: '#ff0420', cap: 12e9, tvl: 2.5e9, size: 2.4 },
    { id: 'base', name: 'Base', symbol: 'BASE', color: '#0052ff', cap: 10e9, tvl: 2e9, size: 2.2 },
    { id: 'weth', name: 'Wrapped ETH', symbol: 'WETH', color: '#627EEA', cap: 20e9, tvl: 5e9, size: 2.5 },
    { id: 'usdc', name: 'USDC', symbol: 'USDC', color: '#2775ca', cap: 25e9, tvl: 6e9, size: 2.6 },
    { id: 'wbtc', name: 'Wrapped BTC', symbol: 'WBTC', color: '#f7931a', cap: 15e9, tvl: 4e9, size: 2.4 },
    { id: 'uni', name: 'Uniswap', symbol: 'UNI', color: '#ff007a', cap: 8e9, tvl: 2e9, size: 2.2 },
    { id: 'aave', name: 'Aave', symbol: 'AAVE', color: '#b6509e', cap: 5e9, tvl: 1.5e9, size: 2.0 },
    { id: 'link', name: 'Chainlink', symbol: 'LINK', color: '#2a5ada', cap: 12e9, tvl: 3e9, size: 2.8 },
    { id: 'pendle', name: 'Pendle', symbol: 'PENDLE', color: '#d4a373', cap: 3e9, tvl: 0.8e9, size: 1.8 },
  ];

  return defi.map((d, i) => {
    const angle = (i / defi.length) * Math.PI * 2;
    const radius = 20 + (i % 3) * 15;
    return createEntity(
      d.id, d.name, d.symbol, ET.BLOCKCHAIN, UT.DEFI,
      d.color, d.color, i === 0 ? BT.GAS_GIANT : BT.LUXURY_EARTH,
      [Math.cos(angle) * radius, (Math.random() - 0.5) * 10, Math.sin(angle) * radius],
      d.size, d.cap, d.tvl
    );
  });
}

export function getGalaxyDatasets(): Record<string, GalaxyDataset> {
  return {
    defi: {
      name: 'DeFi Galaxy',
      color: '#627EEA',
      position: [0, 0, 0],
      entities: createDeFiEntities()
    },
    nasdaq: {
      name: 'NASDAQ Galaxy',
      color: '#00bcd4',
      position: [300, 50, -200],
      entities: createNasdaqEntities()
    },
    commodity: {
      name: 'Commodity Galaxy',
      color: '#f59e0b',
      position: [-250, -30, 180],
      entities: createCommodityEntities()
    },
    carbon: {
      name: 'Carbon Galaxy',
      color: '#10b981',
      position: [180, 80, 250],
      entities: createCarbonEntities()
    },
    excalibur: {
      name: 'Excalibur Nexus',
      color: '#ffd700',
      position: [-180, 60, -250],
      entities: createExcaliburEntities()
    }
  };
}
