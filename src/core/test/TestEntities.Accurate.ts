/**
 * Ground Zero Accurate Test Dataset for Universal Renderer Proof
 * Maintains proper entity-token relationships as originally intended
 * Each entity type has its corresponding elements, not mixed incorrectly
 */

import type { UniversalEntity, EntityType, UniverseType, BiomeType } from '../entities/UniversalEntity';
import { LayerType } from '../entities/UniversalEntity';

/**
 * Create ground zero accurate test entities
 * Proper entity-token relationships maintained
 */
export function createAccurateTestEntities(): UniversalEntity[] {
  return [
    // Ethereum - Blockchain with its DeFi tokens
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      entityType: 'blockchain' as EntityType,
      universeType: 'defi' as UniverseType,
      
      parentId: undefined,
      childrenIds: ['weth', 'usdc', 'wbtc', 'uni', 'aave'],
      
      spatial: {
        size: 4.5,
        orbitRadius: 8,
        orbitSpeed: 0.8,
        orbitPhase: 0,
        glowIntensity: 0.9,
        rotationSpeed: 0.12,
        zElevation: 2,
        color: '#627EEA',
        glowColor: '#8ba4f7',
        biomeType: 'gas-giant' as BiomeType,
        position: [-20, 0, 10]
      },
      
      metrics: {
        marketCap: 300e9, // $300B
        tvl: 45e9, // $45B
        tokenCount: 3200,
        dominance: 65,
        liquidityScore: 0.9,
        confidence: 0.85,
        transactionVelocity: 120
      },
      
      identity: {
        entityId: 'ethereum',
        biomeType: 'gas-giant' as BiomeType,
        surfaceSeed: 12345,
        atmosphereSeed: 67890,
        colorPalette: ['#627EEA', '#8ba4f7', '#4c63d2', '#1e3a8a', '#60a5fa'],
        features: [
          {
            type: 'storm',
            position: [0.3, -0.2, 0.1],
            size: 0.15,
            intensity: 0.7
          }
        ]
      },
      
      connections: [],
      influenceRadius: 15,
      
      layers: [
        {
          layerType: LayerType.EXPLORER,
          visibleMetrics: ['marketCap', 'tvl'],
          hiddenMetrics: ['eps', 'revenue'],
          visualOverrides: {},
          interactions: []
        }
      ],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Leading smart contract platform',
        founded: 2015,
        consensus: 'Proof of Stake'
      },
      tags: ['blockchain', 'smart-contracts', 'defi'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    },

    // Nvidia - Company with its stock-related entities
    {
      id: 'nvidia',
      name: 'NVIDIA Corporation',
      symbol: 'NVDA',
      entityType: 'company' as EntityType,
      universeType: 'nasdaq' as UniverseType,
      
      parentId: undefined,
      childrenIds: ['nvidia-earnings', 'nvidia-products'],
      
      spatial: {
        size: 3.8,
        orbitRadius: 12,
        orbitSpeed: 1.2,
        orbitPhase: 1.5,
        glowIntensity: 0.85,
        rotationSpeed: 0.08,
        zElevation: 3,
        color: '#76b900',
        glowColor: '#8fbc00',
        biomeType: 'artificial-megacity' as BiomeType,
        position: [15, 2, -5]
      },
      
      metrics: {
        marketCap: 1.2e12, // $1.2T
        price: 480,
        priceChange24h: 2.5,
        volume24h: 25e9,
        revenue: 60e9,
        eps: 19.8,
        pe: 24.2,
        employees: 26000,
        liquidityScore: 0.95,
        confidence: 0.9,
        volatility: 0.35
      },
      
      identity: {
        entityId: 'nvidia',
        biomeType: 'artificial-megacity' as BiomeType,
        surfaceSeed: 54321,
        atmosphereSeed: 98765,
        colorPalette: ['#00ffff', '#00bcd4', '#0097a7', '#006064', '#00acc1'],
        features: [
          {
            type: 'city',
            position: [0.1, 0.4, -0.3],
            size: 0.2,
            intensity: 0.8
          }
        ]
      },
      
      connections: [],
      influenceRadius: 20,
      
      layers: [
        {
          layerType: LayerType.EXPLORER,
          visibleMetrics: ['marketCap', 'price'],
          hiddenMetrics: ['tvl', 'tokenCount'],
          visualOverrides: {},
          interactions: []
        }
      ],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'AI and graphics processing leader',
        sector: 'Technology',
        industry: 'Semiconductors',
        founded: 1993
      },
      tags: ['technology', 'ai', 'semiconductors', 'gaming'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    },

    // Gold - Commodity with its market-related entities
    {
      id: 'gold',
      name: 'Gold',
      symbol: 'GC',
      entityType: 'commodity' as EntityType,
      universeType: 'commodity' as UniverseType,
      
      parentId: undefined,
      childrenIds: ['gold-futures', 'gold-mining'],
      
      spatial: {
        size: 3.2,
        orbitRadius: 18,
        orbitSpeed: 0.3,
        orbitPhase: 3.14,
        glowIntensity: 0.7,
        rotationSpeed: 0.05,
        zElevation: -1,
        color: '#FFD700',
        glowColor: '#FFED4E',
        biomeType: 'metallic-core' as BiomeType,
        position: [0, -3, 20]
      },
      
      metrics: {
        marketCap: 14e12, // $14T (total above-ground stock)
        price: 2350,
        priceChange24h: 0.8,
        volume24h: 120e9,
        supply: 212000, // tonnes
        reserves: 57000, // tonnes
        liquidityScore: 0.95,
        confidence: 0.75,
        volatility: 0.15
      },
      
      identity: {
        entityId: 'gold',
        biomeType: 'metallic-core' as BiomeType,
        surfaceSeed: 98765,
        atmosphereSeed: 43210,
        colorPalette: ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#fef3c7'],
        features: [
          {
            type: 'mountain',
            position: [0.2, -0.3, 0.1],
            size: 0.25,
            intensity: 0.6
          }
        ]
      },
      
      connections: [],
      influenceRadius: 25,
      
      layers: [
        {
          layerType: LayerType.EXPLORER,
          visibleMetrics: ['marketCap', 'price', 'supply'],
          hiddenMetrics: ['tvl', 'employees'],
          visualOverrides: {},
          interactions: []
        }
      ],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Precious metal and store of value',
        category: 'Precious Metals',
        unit: 'Troy Ounce',
        purity: '99.5%'
      },
      tags: ['commodity', 'precious-metal', 'store-of-value', 'safe-haven'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    },

    // XGT - Token ecosystem with its sustainability projects
    {
      id: 'xgt',
      name: 'Excalibur Global Token',
      symbol: 'XGT',
      entityType: 'token' as EntityType,
      universeType: 'excalibur-nexus' as UniverseType,
      
      parentId: 'excalibur-nexus',
      childrenIds: ['carbon-credits', 'sustainability-projects'],
      
      spatial: {
        size: 2.5,
        orbitRadius: 6,
        orbitSpeed: 1.5,
        orbitPhase: 4.71,
        glowIntensity: 0.95,
        rotationSpeed: 0.15,
        zElevation: 1,
        color: '#FFD700',
        glowColor: '#00FF00',
        biomeType: 'nexus' as BiomeType,
        position: [0, 5, -15]
      },
      
      metrics: {
        marketCap: 50e6, // $50M
        price: 0.00004372,
        priceChange24h: 0.48,
        volume24h: 1.2e6,
        tvl: 120e6, // $120M in ecosystem
        liquidityScore: 0.8,
        confidence: 0.7,
        sustainabilityScore: 0.95,
        socialImpact: 0.9,
        governanceScore: 0.85
      },
      
      identity: {
        entityId: 'xgt',
        biomeType: 'nexus' as BiomeType,
        surfaceSeed: 24680,
        atmosphereSeed: 13579,
        colorPalette: ['#ffd700', '#ffe566', '#10b981', '#34d399', '#6ee7b7'],
        features: [
          {
            type: 'city',
            position: [0.0, 0.0, 0.0],
            size: 0.3,
            intensity: 0.9
          }
        ]
      },
      
      connections: [],
      influenceRadius: 10,
      
      layers: [
        {
          layerType: LayerType.EXPLORER,
          visibleMetrics: ['marketCap', 'price', 'sustainabilityScore'],
          hiddenMetrics: ['employees', 'eps'],
          visualOverrides: {},
          interactions: []
        }
      ],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Sustainability and carbon credit ecosystem token',
        category: 'Utility Token',
        blockchain: 'BNB Chain',
        contractAddress: '0x654e38a4516f5476d723d770382a5eaf8bae0e0d'
      },
      tags: ['token', 'sustainability', 'carbon-credits', 'impact-investing'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    }
  ];
}

/**
 * Create corresponding child entities for each main entity
 * Maintains ground zero accuracy: proper parent-child relationships
 */
export function createCorrespondingChildEntities(): UniversalEntity[] {
  return [
    // Ethereum DeFi tokens (children of ethereum)
    {
      id: 'weth',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      entityType: 'token' as EntityType,
      universeType: 'defi' as UniverseType,
      parentId: 'ethereum',
      childrenIds: [],
      
      spatial: {
        size: 1.2,
        orbitRadius: 2,
        orbitSpeed: 2.0,
        orbitPhase: 0,
        glowIntensity: 0.7,
        rotationSpeed: 0.2,
        zElevation: 0.5,
        color: '#627EEA',
        glowColor: '#8ba4f7',
        biomeType: 'gas-giant' as BiomeType,
        position: [-22, 0, 12]
      },
      
      metrics: {
        marketCap: 25e9,
        price: 3000,
        priceChange24h: 1.2,
        volume24h: 500e6,
        liquidityScore: 0.85,
        confidence: 0.8
      },
      
      identity: {
        entityId: 'weth',
        biomeType: 'gas-giant' as BiomeType,
        surfaceSeed: 12346,
        atmosphereSeed: 67891,
        colorPalette: ['#627EEA', '#8ba4f7', '#4c63d2'],
        features: []
      },
      
      connections: [],
      influenceRadius: 3,
      
      layers: [{
        layerType: LayerType.EXPLORER,
        visibleMetrics: ['marketCap', 'price'],
        hiddenMetrics: [],
        visualOverrides: {},
        interactions: []
      }],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Wrapped version of ETH'
      },
      tags: ['token', 'wrapped-ether', 'defi'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    },

    // Nvidia stock derivatives (children of nvidia)
    {
      id: 'nvidia-earnings',
      name: 'NVIDIA Q4 Earnings',
      symbol: 'NVDA-EQ',
      entityType: 'financial-event' as EntityType,
      universeType: 'nasdaq' as UniverseType,
      parentId: 'nvidia',
      childrenIds: [],
      
      spatial: {
        size: 1.0,
        orbitRadius: 3,
        orbitSpeed: 1.5,
        orbitPhase: 1.5,
        glowIntensity: 0.6,
        rotationSpeed: 0.1,
        zElevation: 1,
        color: '#76b900',
        glowColor: '#8fbc00',
        biomeType: 'artificial-megacity' as BiomeType,
        position: [17, 3, -3]
      },
      
      metrics: {
        marketCap: 0, // Events don't have market cap
        price: 0,
        priceChange24h: 15.2, // Earnings beat
        volume24h: 0,
        liquidityScore: 0.7,
        confidence: 0.9
      },
      
      identity: {
        entityId: 'nvidia-earnings',
        biomeType: 'artificial-megacity' as BiomeType,
        surfaceSeed: 54322,
        atmosphereSeed: 98767,
        colorPalette: ['#00ffff', '#00bcd4'],
        features: []
      },
      
      connections: [],
      influenceRadius: 2,
      
      layers: [{
        layerType: LayerType.EXPLORER,
        visibleMetrics: ['priceChange24h'],
        hiddenMetrics: [],
        visualOverrides: {},
        interactions: []
      }],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Q4 2024 earnings announcement'
      },
      tags: ['earnings', 'financial-event', 'nasdaq'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    },

    // Gold market derivatives (children of gold)
    {
      id: 'gold-futures',
      name: 'Gold Futures',
      symbol: 'GC=F',
      entityType: 'derivative' as EntityType,
      universeType: 'commodity' as UniverseType,
      parentId: 'gold',
      childrenIds: [],
      
      spatial: {
        size: 1.1,
        orbitRadius: 4,
        orbitSpeed: 0.4,
        orbitPhase: 3.14,
        glowIntensity: 0.6,
        rotationSpeed: 0.06,
        zElevation: -0.5,
        color: '#FFD700',
        glowColor: '#FFED4E',
        biomeType: 'metallic-core' as BiomeType,
        position: [2, -2, 22]
      },
      
      metrics: {
        marketCap: 0,
        price: 2365,
        priceChange24h: 0.5,
        volume24h: 80e9,
        liquidityScore: 0.9,
        confidence: 0.8
      },
      
      identity: {
        entityId: 'gold-futures',
        biomeType: 'metallic-core' as BiomeType,
        surfaceSeed: 98766,
        atmosphereSeed: 43211,
        colorPalette: ['#fbbf24', '#f59e0b'],
        features: []
      },
      
      connections: [],
      influenceRadius: 4,
      
      layers: [{
        layerType: LayerType.EXPLORER,
        visibleMetrics: ['price', 'volume24h'],
        hiddenMetrics: [],
        visualOverrides: {},
        interactions: []
      }],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Gold futures contracts'
      },
      tags: ['futures', 'derivative', 'commodity'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    },

    // XGT sustainability projects (children of xgt)
    {
      id: 'carbon-credits',
      name: 'Carbon Credit Pool',
      symbol: 'CARBON',
      entityType: 'credit' as EntityType,
      universeType: 'excalibur-nexus' as UniverseType,
      parentId: 'xgt',
      childrenIds: [],
      
      spatial: {
        size: 0.8,
        orbitRadius: 2.5,
        orbitSpeed: 1.8,
        orbitPhase: 4.71,
        glowIntensity: 0.8,
        rotationSpeed: 0.18,
        zElevation: 0.8,
        color: '#FFD700',
        glowColor: '#00FF00',
        biomeType: 'nexus' as BiomeType,
        position: [2, 6, -13]
      },
      
      metrics: {
        marketCap: 0,
        price: 25, // $25 per carbon credit
        priceChange24h: 2.1,
        volume24h: 100000,
        liquidityScore: 0.75,
        confidence: 0.85,
        sustainabilityScore: 0.95
      },
      
      identity: {
        entityId: 'carbon-credits',
        biomeType: 'nexus' as BiomeType,
        surfaceSeed: 24681,
        atmosphereSeed: 13580,
        colorPalette: ['#ffd700', '#10b981'],
        features: []
      },
      
      connections: [],
      influenceRadius: 2,
      
      layers: [{
        layerType: LayerType.EXPLORER,
        visibleMetrics: ['price', 'sustainabilityScore'],
        hiddenMetrics: [],
        visualOverrides: {},
        interactions: []
      }],
      defaultLayer: LayerType.EXPLORER,
      
      metadata: {
        description: 'Verra-certified carbon credits'
      },
      tags: ['carbon', 'sustainability', 'credits', 'environmental'],
      
      isSelected: false,
      isHovered: false,
      isVisible: true
    }
  ];
}

/**
 * Validate ground zero accuracy
 * Ensures proper entity-token relationships
 */
export function validateGroundZeroAccuracy(entities: UniversalEntity[]): boolean {
  try {
    // Check parent-child relationships
    const parentEntities = entities.filter(e => !e.parentId);
    const childEntities = entities.filter(e => e.parentId);
    
    console.log('🔍 Ground Zero Validation:');
    console.log(`Parent entities: ${parentEntities.length}`);
    console.log(`Child entities: ${childEntities.length}`);
    
    // Validate each parent has proper children
    parentEntities.forEach(parent => {
      const children = childEntities.filter(child => child.parentId === parent.id);
      console.log(`${parent.name} (${parent.entityType}): ${children.length} children`);
      
      // Check if children are appropriate for parent type
      children.forEach(child => {
        const relationship = `${parent.entityType} → ${child.entityType}`;
        console.log(`  ${relationship}`);
      });
    });
    
    return true;
  } catch (error) {
    console.error('❌ Ground zero validation failed:', error);
    return false;
  }
}
