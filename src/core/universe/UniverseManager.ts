/**
 * Universe Manager
 * Handles switching between different financial universes
 * DeFi Galaxy ↔ NASDAQ Galaxy ↔ Commodity Galaxy ↔ Carbon Galaxy ↔ Excalibur Nexus
 */

import type { UniverseConfig, UniversalEntity } from '../entities/UniversalEntity';
import { UniverseType, EntityType } from '../entities/UniversalEntity';
import { createTestEntities } from '../test/TestEntities';

/**
 * Universe configurations for different financial ecosystems
 */
const UNIVERSE_CONFIGS: Record<UniverseType, UniverseConfig> = {
  [UniverseType.DEFI]: {
    id: 'defi-galaxy',
    name: 'DeFi Galaxy',
    type: UniverseType.DEFI,
    description: 'Decentralized finance ecosystem with blockchains and tokens',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.BLOCKCHAIN, name: 'Blockchain' },
      { level: 1, entityType: EntityType.TOKEN, parentType: EntityType.BLOCKCHAIN, name: 'Token' }
    ],
    
    visualTheme: {
      backgroundColor: '#000814',
      nebulaColors: ['#001d3d', '#003566', '#ffd60a'],
      starFieldDensity: 1000,
      ambientLightIntensity: 0.4,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [
      { id: 'defillama', type: 'api', url: 'https://api.llama.fi', priority: 1 },
      { id: 'coingecko', type: 'api', url: 'https://api.coingecko.com', priority: 2 }
    ],
    
    mappingRules: [],
    
    cameraPositions: {
      overview: [50, 30, 50],
      ethereum: [10, 5, 10],
      bitcoin: [15, 8, 12]
    }
  },
  
  [UniverseType.NASDAQ]: {
    id: 'nasdaq-galaxy',
    name: 'NASDAQ Galaxy',
    type: UniverseType.NASDAQ,
    description: 'US stock market with sectors and companies',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.SECTOR, name: 'Sector' },
      { level: 1, entityType: EntityType.COMPANY, parentType: EntityType.SECTOR, name: 'Company' }
    ],
    
    visualTheme: {
      backgroundColor: '#0a0e27',
      nebulaColors: ['#1e3a8a', '#3b82f6', '#60a5fa'],
      starFieldDensity: 1500,
      ambientLightIntensity: 0.5,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [
      { id: 'yahoo-finance', type: 'api', url: 'https://query1.finance.yahoo.com', priority: 1 },
      { id: 'alpha-vantage', type: 'api', url: 'https://www.alphavantage.co', priority: 2 }
    ],
    
    mappingRules: [],
    
    cameraPositions: {
      overview: [60, 25, 40],
      technology: [20, 10, 15],
      healthcare: [18, 12, 20]
    }
  },
  
  [UniverseType.COMMODITY]: {
    id: 'commodity-galaxy',
    name: 'Commodity Galaxy',
    type: UniverseType.COMMODITY,
    description: 'Global commodities market with producers and consumers',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.COMMODITY, name: 'Commodity' },
      { level: 1, entityType: EntityType.PRODUCER, parentType: EntityType.COMMODITY, name: 'Producer' },
      { level: 2, entityType: EntityType.CONSUMER, parentType: EntityType.COMMODITY, name: 'Consumer' }
    ],
    
    visualTheme: {
      backgroundColor: '#1a1f2e',
      nebulaColors: ['#92400e', '#b45309', '#fbbf24'],
      starFieldDensity: 800,
      ambientLightIntensity: 0.3,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [
      { id: 'trading-data', type: 'api', url: 'https://api.tradingeconomics.com', priority: 1 }
    ],
    
    mappingRules: [],
    
    cameraPositions: {
      overview: [40, 20, 45],
      gold: [12, 8, 10],
      oil: [15, 6, 12]
    }
  },
  
  [UniverseType.CARBON]: {
    id: 'carbon-galaxy',
    name: 'Carbon Galaxy',
    type: UniverseType.CARBON,
    description: 'Carbon credit ecosystem with registries and projects',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.REGISTRY, name: 'Registry' },
      { level: 1, entityType: EntityType.PROJECT, parentType: EntityType.REGISTRY, name: 'Project' },
      { level: 2, entityType: EntityType.CREDIT, parentType: EntityType.PROJECT, name: 'Credit' }
    ],
    
    visualTheme: {
      backgroundColor: '#0d2818',
      nebulaColors: ['#065f46', '#10b981', '#34d399'],
      starFieldDensity: 1200,
      ambientLightIntensity: 0.4,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [
      { id: 'verra', type: 'api', url: 'https://registry.verra.org', priority: 1 },
      { id: 'gold-standard', type: 'api', url: 'https://registry.goldstandard.org', priority: 2 }
    ],
    
    mappingRules: [],
    
    cameraPositions: {
      overview: [35, 25, 35],
      projects: [10, 8, 8],
      credits: [8, 6, 10]
    }
  },
  
  [UniverseType.EXCALIBUR_NEXUS]: {
    id: 'excalibur-nexus',
    name: 'Excalibur Nexus',
    type: UniverseType.EXCALIBUR_NEXUS,
    description: 'Sustainability and impact investment ecosystem',
    isSpecialUniverse: true,
    centralStarId: 'xgt',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.TOKEN, name: 'XGT' },
      { level: 1, entityType: EntityType.PROJECT, parentType: EntityType.TOKEN, name: 'Impact Project' },
      { level: 2, entityType: EntityType.CREDIT, parentType: EntityType.PROJECT, name: 'Carbon Credit' }
    ],
    
    visualTheme: {
      backgroundColor: '#0f172a',
      nebulaColors: ['#059669', '#10b981', '#ffd700'],
      starFieldDensity: 2000,
      ambientLightIntensity: 0.6,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [
      { id: 'nexus-api', type: 'api', url: 'https://api.excalibur-nexus.com', priority: 1 }
    ],
    
    mappingRules: [],
    
    cameraPositions: {
      overview: [30, 20, 30],
      xgt: [8, 5, 8],
      projects: [12, 8, 10]
    }
  },
  
  // Placeholder universes for future implementation
  [UniverseType.SP_500]: {
    id: 'sp500-galaxy',
    name: 'S&P 500 Galaxy',
    type: UniverseType.SP_500,
    description: 'Broad US market representation',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.SECTOR, name: 'Sector' },
      { level: 1, entityType: EntityType.COMPANY, parentType: EntityType.SECTOR, name: 'Company' }
    ],
    
    visualTheme: {
      backgroundColor: '#1e293b',
      nebulaColors: ['#1e40af', '#3b82f6', '#60a5fa'],
      starFieldDensity: 1300,
      ambientLightIntensity: 0.4,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [],
    mappingRules: [],
    cameraPositions: {}
  },
  
  [UniverseType.GLOBAL_ECONOMY]: {
    id: 'global-economy-galaxy',
    name: 'Global Economy Galaxy',
    type: UniverseType.GLOBAL_ECONOMY,
    description: 'World economic indicators and relationships',
    
    entityHierarchy: [
      { level: 0, entityType: EntityType.COUNTRY, name: 'Country' },
      { level: 1, entityType: EntityType.SECTOR, parentType: EntityType.COUNTRY, name: 'Economic Sector' }
    ],
    
    visualTheme: {
      backgroundColor: '#18181b',
      nebulaColors: ['#7c3aed', '#a78bfa', '#c4b5fd'],
      starFieldDensity: 1600,
      ambientLightIntensity: 0.5,
      connectionColors: {
        wormhole: '#00ffff',
        gravity: '#ff00ff',
        'supply-chain': '#ffff00',
        ownership: '#00ff00',
        dependency: '#ff6600',
        'capital-flow': '#ff0066'
      }
    },
    
    dataSources: [],
    mappingRules: [],
    cameraPositions: {}
  }
};

/**
 * Universe Manager class
 * Handles universe switching and data management
 */
export class UniverseManager {
  private static instance: UniverseManager;
  private currentUniverse: UniverseType = UniverseType.DEFI;
  private entities: Record<UniverseType, UniversalEntity[]> = {} as Record<UniverseType, UniversalEntity[]>;
  
  private constructor() {
    this.initializeUniverses();
  }
  
  static getInstance(): UniverseManager {
    if (!UniverseManager.instance) {
      UniverseManager.instance = new UniverseManager();
    }
    return UniverseManager.instance;
  }
  
  /**
   * Initialize all universes with test data
   */
  private initializeUniverses() {
    // For now, use test entities for all universes
    // In production, each universe would have its own data sources
    const testEntities = createTestEntities();
    
    Object.values(UniverseType).forEach(universeType => {
      this.entities[universeType] = testEntities;
    });
  }
  
  /**
   * Switch to a different universe
   */
  async switchUniverse(universeType: UniverseType): Promise<void> {
    if (this.currentUniverse === universeType) {
      return;
    }
    
    console.log(`🌌 Switching from ${this.currentUniverse} to ${universeType}`);
    
    // In production, this would:
    // 1. Load universe-specific data
    // 2. Update visual theme
    // 3. Re-initialize renderer with new entities
    // 4. Handle portal transitions
    
    this.currentUniverse = universeType;
  }
  
  /**
   * Get current universe configuration
   */
  getCurrentUniverseConfig(): UniverseConfig {
    return UNIVERSE_CONFIGS[this.currentUniverse];
  }
  
  /**
   * Get current universe type
   */
  getCurrentUniverseType(): UniverseType {
    return this.currentUniverse;
  }
  
  /**
   * Get entities for current universe
   */
  getCurrentEntities(): UniversalEntity[] {
    return this.entities[this.currentUniverse] || [];
  }
  
  /**
   * Get all available universes
   */
  getAvailableUniverses(): UniverseType[] {
    return Object.values(UniverseType);
  }
  
  /**
   * Get universe configuration by type
   */
  getUniverseConfig(universeType: UniverseType): UniverseConfig {
    return UNIVERSE_CONFIGS[universeType];
  }
  
  /**
   * Check if a universe is special (like Excalibur Nexus)
   */
  isSpecialUniverse(universeType: UniverseType): boolean {
    return UNIVERSE_CONFIGS[universeType]?.isSpecialUniverse || false;
  }
  
  /**
   * Get portal connections between universes
   */
  getPortalConnections(): Array<{
    from: UniverseType;
    to: UniverseType;
    bidirectional: boolean;
    visualType: string;
  }> {
    return [
      {
        from: UniverseType.DEFI,
        to: UniverseType.NASDAQ,
        bidirectional: true,
        visualType: 'wormhole'
      },
      {
        from: UniverseType.DEFI,
        to: UniverseType.EXCALIBUR_NEXUS,
        bidirectional: true,
        visualType: 'golden-portal'
      },
      {
        from: UniverseType.NASDAQ,
        to: UniverseType.COMMODITY,
        bidirectional: true,
        visualType: 'wormhole'
      },
      {
        from: UniverseType.COMMODITY,
        to: UniverseType.CARBON,
        bidirectional: true,
        visualType: 'nature-portal'
      },
      {
        from: UniverseType.CARBON,
        to: UniverseType.EXCALIBUR_NEXUS,
        bidirectional: true,
        visualType: 'sustainability-portal'
      }
    ];
  }
  
  /**
   * Update entities for a universe (for data refresh)
   */
  updateEntities(universeType: UniverseType, entities: UniversalEntity[]): void {
    this.entities[universeType] = entities;
  }
  
  /**
   * Add entity to current universe
   */
  addEntity(entity: UniversalEntity): void {
    if (!this.entities[this.currentUniverse]) {
      this.entities[this.currentUniverse] = [];
    }
    this.entities[this.currentUniverse].push(entity);
  }
  
  /**
   * Remove entity from current universe
   */
  removeEntity(entityId: string): boolean {
    if (!this.entities[this.currentUniverse]) {
      return false;
    }
    
    const index = this.entities[this.currentUniverse].findIndex(e => e.id === entityId);
    if (index !== -1) {
      this.entities[this.currentUniverse].splice(index, 1);
      return true;
    }
    
    return false;
  }
  
  /**
   * Get entity by ID from current universe
   */
  getEntity(entityId: string): UniversalEntity | null {
    const entities = this.entities[this.currentUniverse] || [];
    return entities.find(e => e.id === entityId) || null;
  }
}
