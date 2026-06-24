/**
 * Test Dataset for Universal Renderer Proof
 * Contains entities from different universes to test renderer universality
 * Maintains ground zero accuracy: each entity type has its proper corresponding tokens
 */

import type { UniversalEntity, EntityType, UniverseType, BiomeType } from '../entities/UniversalEntity';
import { LayerType } from '../entities/UniversalEntity';

/**
 * Create test entities from different universes
 * Each entity has the same structure but represents different types of assets
 * Ground zero accuracy: proper entity-token relationships maintained
 */
export function createTestEntities(): UniversalEntity[] {
  return [
    // Ethereum - Blockchain/DeFi with DeFi tokens
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      entityType: 'blockchain' as EntityType,
      universeType: 'defi' as UniverseType,
      
      parentId: undefined,
      childrenIds: [],
      
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
          },
          {
            type: 'storm',
            position: [-0.4, 0.3, -0.2],
            size: 0.12,
            intensity: 0.6
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

    // Nvidia - Company/Stock
    {
      id: 'nvidia',
      name: 'NVIDIA Corporation',
      symbol: 'NVDA',
      entityType: 'company' as EntityType,
      universeType: 'nasdaq' as UniverseType,
      
      parentId: undefined,
      childrenIds: [],
      
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
          },
          {
            type: 'city',
            position: [-0.3, -0.1, 0.2],
            size: 0.18,
            intensity: 0.7
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

    // Gold - Commodity
    {
      id: 'gold',
      name: 'Gold',
      symbol: 'GC',
      entityType: 'commodity' as EntityType,
      universeType: 'commodity' as UniverseType,
      
      parentId: undefined,
      childrenIds: [],
      
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
          },
          {
            type: 'mountain',
            position: [-0.1, 0.2, -0.2],
            size: 0.18,
            intensity: 0.5
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

    // XGT - Token/Sustainability
    {
      id: 'xgt',
      name: 'Excalibur Global Token',
      symbol: 'XGT',
      entityType: 'token' as EntityType,
      universeType: 'excalibur-nexus' as UniverseType,
      
      parentId: 'excalibur-nexus',
      childrenIds: [],
      
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
 * Create test connections between entities
 * Demonstrates relationship engine functionality
 */
export function createTestConnections() {
  return [
    {
      id: 'ethereum-xgt-bridge',
      targetId: 'xgt',
      sourceId: 'ethereum',
      connectionType: 'wormhole' as const,
      strength: 0.7,
      animated: true,
      color: '#00ffff',
      metadata: {
        type: 'cross-chain-bridge',
        protocol: 'multichain',
        volume: 1000000
      }
    },
    {
      id: 'nvidia-gold-correlation',
      targetId: 'gold',
      sourceId: 'nvidia',
      connectionType: 'dependency' as const,
      strength: 0.4,
      animated: false,
      color: '#ffd700',
      metadata: {
        type: 'economic-correlation',
        correlation: 0.35,
        description: 'Tech performance affects gold demand'
      }
    },
    {
      id: 'xgt-nexus-gravity',
      targetId: 'xgt',
      sourceId: 'excalibur-nexus',
      connectionType: 'gravity' as const,
      strength: 0.9,
      animated: true,
      color: '#00ff00',
      metadata: {
        type: 'ecosystem-relationship',
        description: 'XGT is central to Nexus ecosystem'
      }
    }
  ];
}

/**
 * Validate that all entities can be rendered by the same UniversalPlanet component
 * This is the proof of concept for the universal renderer
 */
export function validateUniversalRenderer(entities: UniversalEntity[]): boolean {
  try {
    // Check that all entities have required universal properties
    const requiredProperties = ['id', 'name', 'symbol', 'entityType', 'universeType', 'spatial', 'metrics', 'identity'];
    
    for (const entity of entities) {
      for (const prop of requiredProperties) {
        if (!(prop in entity)) {
          console.error(`Missing required property '${prop}' in entity ${entity.id}`);
          return false;
        }
      }
      
      // Check spatial properties
      const spatialProps = ['size', 'color', 'glowColor', 'biomeType', 'position'];
      for (const prop of spatialProps) {
        if (!(prop in entity.spatial)) {
          console.error(`Missing spatial property '${prop}' in entity ${entity.id}`);
          return false;
        }
      }
      
      // Check identity properties
      const identityProps = ['entityId', 'biomeType', 'surfaceSeed', 'colorPalette', 'features'];
      for (const prop of identityProps) {
        if (!(prop in entity.identity)) {
          console.error(`Missing identity property '${prop}' in entity ${entity.id}`);
          return false;
        }
      }
    }
    
    console.log('✅ All entities validated for universal renderer');
    return true;
  } catch (error) {
    console.error('❌ Universal renderer validation failed:', error);
    return false;
  }
}
