# Universal Engine Architecture

## Current Architecture Analysis

### Problems with Current Implementation

1. **Tightly Coupled Types:** `Network` and `Token` interfaces are DeFi-specific
2. **Hardcoded Visual Logic:** Planet components know about blockchain biomes
3. **Single Universe Store:** `GalaxyStore` only handles DeFi data
4. **No Universe Abstraction:** No concept of switching between galaxies
5. **Fixed Data Sources:** APIs are hardcoded for crypto data

### Current Structure (DeFi-Only)

```
src/
├── store/
│   ├── types.ts           # DeFi-specific types (Network, Token)
│   └── galaxyStore.ts     # DeFi-only state management
├── constants/
│   └── networks.ts        # Hardcoded blockchain configurations
├── components/
│   ├── planets/Planet.tsx  # Knows about Network biomes
│   └── tokens/TokenSatellite.tsx  # Knows about Token data
├── hooks/
│   ├── useNetworkData.ts  # DeFiLlama API calls
│   └── useTokenData.ts    # CoinGecko API calls
└── api/
    ├── defillama.ts       # Crypto TVL API
    └── coingecko.ts       # Crypto price API
```

---

## Required Universal Architecture

### 1. Universal Entity System

**Core Principle:** Everything is a `UniversalEntity`

```typescript
// Universal entity that can represent anything
interface UniversalEntity {
  id: string;
  name: string;
  symbol: string;
  entityType: EntityType;
  universeType: UniverseType;
  
  // Universal visual properties
  size: number;                    // Importance (market cap, TVL, etc.)
  position: [number, number, number];
  color: string;
  glowColor: string;
  glowIntensity: number;
  
  // Orbital properties
  orbitRadius?: number;            // Distance from parent
  orbitSpeed?: number;            // Activity level
  orbitPhase?: number;            // Current position
  parentId?: string;              // Parent entity ID
  
  // Visual classification
  biomeType: BiomeType;
  zElevation: number;             // Risk/maturity
  
  // Relationship data
  connections: EntityConnection[];
  influenceRadius: number;
  
  // Universal metrics
  metrics: EntityMetrics;
  
  // Display layers
  layers: EntityLayer[];
  
  // Metadata
  metadata: Record<string, any>;
}

// Entity types (can be extended)
enum EntityType {
  BLOCKCHAIN = 'blockchain',
  TOKEN = 'token',
  COMPANY = 'company',
  SECTOR = 'sector',
  COMMODITY = 'commodity',
  PRODUCER = 'producer',
  CONSUMER = 'consumer',
  PROJECT = 'project',
  REGISTRY = 'registry',
  CREDIT = 'credit'
}

// Universe types
enum UniverseType {
  DEFI = 'defi',
  NASDAQ = 'nasdaq',
  SP_500 = 'sp500',
  COMMODITY = 'commodity',
  CARBON = 'carbon',
  EXCALIBUR_NEXUS = 'excalibur-nexus'
}

// Biome types (visual themes)
enum BiomeType {
  GAS_GIANT = 'gas-giant',
  GOLDEN_ROCKY = 'golden-rocky',
  CRYSTAL = 'crystal',
  ICE = 'ice',
  OCEAN = 'ocean',
  VOLCANIC = 'volcanic',
  STORMY = 'stormy',
  METALLIC = 'metallic',
  NEXUS = 'nexus',
  ARTIFICIAL_MEGACITY = 'artificial-megacity',
  LUXURY_EARTH = 'luxury-earth',
  INDUSTRIAL_ENERGY = 'industrial-energy',
  METALLIC_CORE = 'metallic-core'
}

// Universal metrics structure
interface EntityMetrics {
  // Financial metrics
  marketCap?: number;
  price?: number;
  volume24h?: number;
  priceChange24h?: number;
  
  // DeFi specific
  tvl?: number;
  dominance?: number;
  
  // Stock specific
  revenue?: number;
  eps?: number;
  pe?: number;
  
  // Commodity specific
  supply?: number;
  demand?: number;
  
  // Carbon specific
  creditVolume?: number;
  verifiedCredits?: number;
  
  // Universal activity metrics
  transactionVelocity?: number;
  liquidityScore?: number;
  confidence?: number;
}

// Entity connections (wormholes, gravity)
interface EntityConnection {
  targetId: string;
  connectionType: ConnectionType;
  strength: number;
  animated: boolean;
}

enum ConnectionType {
  WORMHOLE = 'wormhole',
  GRAVITY = 'gravity',
  SUPPLY_CHAIN = 'supply-chain',
  OWNERSHIP = 'ownership',
  DEPENDENCY = 'dependency'
}
```

### 2. Universe Configuration System

```typescript
// Universe configuration (data-driven)
interface UniverseConfig {
  id: string;
  name: string;
  type: UniverseType;
  description: string;
  
  // Entity hierarchy
  entityHierarchy: HierarchyLevel[];
  
  // Visual theme
  visualTheme: VisualTheme;
  
  // Data sources
  dataSources: DataSource[];
  
  // Mapping rules (how raw data maps to universal entities)
  mappingRules: MappingRule[];
  
  // Default camera positions
  cameraPositions: Record<string, [number, number, number]>;
}

interface HierarchyLevel {
  level: number;
  entityType: EntityType;
  parentType?: EntityType;
  name: string;
}

interface VisualTheme {
  backgroundColor: string;
  nebulaColors: string[];
  starFieldDensity: number;
  ambientLightIntensity: number;
}

interface DataSource {
  id: string;
  type: 'api' | 'static' | 'realtime';
  url?: string;
  apiKey?: string;
  refreshInterval?: number;
}

// Example: DeFi Universe Config
const DEFI_UNIVERSE_CONFIG: UniverseConfig = {
  id: 'defi-galaxy',
  name: 'DeFi Galaxy',
  type: UniverseType.DEFI,
  entityHierarchy: [
    { level: 0, entityType: EntityType.BLOCKCHAIN, name: 'Blockchain' },
    { level: 1, entityType: EntityType.TOKEN, parentType: EntityType.BLOCKCHAIN, name: 'Token' }
  ],
  visualTheme: {
    backgroundColor: '#000814',
    nebulaColors: ['#001d3d', '#003566', '#ffd60a'],
    starFieldDensity: 1000
  },
  dataSources: [
    { id: 'defillama', type: 'api', url: 'https://api.llama.fi' },
    { id: 'coingecko', type: 'api', url: 'https://api.coingecko.com' }
  ],
  mappingRules: [
    // Map DeFiLlama data to UniversalEntity
  ]
};

// Example: NASDAQ Universe Config
const NASDAQ_UNIVERSE_CONFIG: UniverseConfig = {
  id: 'nasdaq-galaxy',
  name: 'NASDAQ Galaxy',
  type: UniverseType.NASDAQ,
  entityHierarchy: [
    { level: 0, entityType: EntityType.SECTOR, name: 'Sector' },
    { level: 1, entityType: EntityType.COMPANY, parentType: EntityType.SECTOR, name: 'Company' }
  ],
  visualTheme: {
    backgroundColor: '#0a0e27',
    nebulaColors: ['#1e3a8a', '#3b82f6', '#60a5fa'],
    starFieldDensity: 1500
  },
  dataSources: [
    { id: 'yahoo-finance', type: 'api', url: 'https://query1.finance.yahoo.com' },
    { id: 'alpha-vantage', type: 'api', url: 'https://www.alphavantage.co' }
  ],
  mappingRules: [
    // Map stock data to UniversalEntity
  ]
};
```

### 3. Universal Renderer

```typescript
// Universal renderer that knows nothing about specific data types
interface UniversalRenderer {
  renderEntity(entity: UniversalEntity): JSX.Element;
  renderConnection(connection: EntityConnection, entities: UniversalEntity[]): JSX.Element;
  calculateVisualProperties(entity: UniversalEntity): VisualProperties;
}

// Visual properties calculated from universal metrics
interface VisualProperties {
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  glowIntensity: number;
  zElevation: number;
  biomeType: BiomeType;
  rotationSpeed: number;
}

// Universal Planet Component (data-agnostic)
interface UniversalPlanetProps {
  entity: UniversalEntity;
  isSelected: boolean;
  onSelect: (entity: UniversalEntity) => void;
  onHover: (entity: UniversalEntity | null) => void;
}

export function UniversalPlanet({ entity, isSelected, onSelect, onHover }: UniversalPlanetProps) {
  // Renderer doesn't know if this is Ethereum, Nvidia, or Gold
  // It only knows the visual properties calculated from universal metrics
  
  const visualProperties = useMemo(() => 
    calculateVisualProperties(entity), [entity]
  );
  
  return (
    <ProceduralEntity 
      biomeType={entity.biomeType}
      visualProperties={visualProperties}
      entity={entity}
      isSelected={isSelected}
      onSelect={onSelect}
      onHover={onHover}
    />
  );
}
```

### 4. Universe Store System

```typescript
// Universal state management
interface UniverseStore {
  // Current universe
  currentUniverse: UniverseType;
  universeConfig: UniverseConfig | null;
  
  // Universal entities
  entities: Record<string, UniversalEntity>;
  connections: EntityConnection[];
  
  // View state
  viewState: ViewState;
  selectedEntity: UniversalEntity | null;
  hoveredEntity: UniversalEntity | null;
  
  // Data layer
  currentLayer: EntityLayer;
  
  // Actions
  switchUniverse: (universeType: UniverseType) => Promise<void>;
  selectEntity: (entity: UniversalEntity) => void;
  setLayer: (layer: EntityLayer) => void;
  updateEntities: (entities: UniversalEntity[]) => void;
}

// Entity layers for different user modes
enum EntityLayer {
  EXPLORER = 'explorer',    // Simple, immersive
  TRADER = 'trader',        // Charts, volume, liquidity
  INVESTOR = 'investor',    // Revenue, growth, fundamentals
  RESEARCH = 'research'     // Dependencies, relationships, supply chains
}
```

### 5. Data Mapping System

```typescript
// Data mappers transform raw API data to UniversalEntity
interface DataMapper<T = any> {
  universeType: UniverseType;
  entityType: EntityType;
  mapToEntity: (rawData: T) => UniversalEntity;
  updateEntity: (entity: UniversalEntity, rawData: T) => UniversalEntity;
}

// Example: DeFi mapper
class DeFiNetworkMapper implements DataMapper {
  universeType = UniverseType.DEFI;
  entityType = EntityType.BLOCKCHAIN;
  
  mapToEntity(rawData: DefiLlamaNetwork): UniversalEntity {
    return {
      id: rawData.id,
      name: rawData.name,
      symbol: rawData.symbol,
      entityType: EntityType.BLOCKCHAIN,
      universeType: UniverseType.DEFI,
      
      // Map DeFi metrics to universal visual properties
      size: this.calculateSize(rawData.tvl),
      color: rawData.color,
      glowColor: rawData.glowColor,
      glowIntensity: this.calculateGlow(rawData.tvlChange24h),
      
      position: rawData.position,
      biomeType: this.mapBiome(rawData.id),
      zElevation: this.calculateRisk(rawData),
      
      metrics: {
        marketCap: rawData.tvl,
        tvl: rawData.tvl,
        dominance: rawData.dominance,
        confidence: rawData.tvlChange24h > 0 ? 0.8 : 0.3
      },
      
      // ... other universal properties
    };
  }
  
  private calculateSize(tvl: number): number {
    // Universal size calculation from TVL
    return Math.log10(tvl / 1e8) * 2;
  }
  
  private mapBiome(networkId: string): BiomeType {
    const biomeMap: Record<string, BiomeType> = {
      'ethereum': BiomeType.GAS_GIANT,
      'bsc': BiomeType.GOLDEN_ROCKY,
      'solana': BiomeType.CRYSTAL,
      // ... etc
    };
    return biomeMap[networkId] || BiomeType.METALLIC;
  }
}

// Example: NASDAQ mapper
class NasdaqCompanyMapper implements DataMapper {
  universeType = UniverseType.NASDAQ;
  entityType = EntityType.COMPANY;
  
  mapToEntity(rawData: YahooFinanceCompany): UniversalEntity {
    return {
      id: rawData.symbol,
      name: rawData.shortName,
      symbol: rawData.symbol,
      entityType: EntityType.COMPANY,
      universeType: UniverseType.NASDAQ,
      
      // Map stock metrics to universal visual properties
      size: this.calculateSize(rawData.marketCap),
      color: this.getSectorColor(rawData.sector),
      glowIntensity: this.calculateGlow(rawData.regularMarketChangePercent),
      
      position: this.calculatePosition(rawData),
      biomeType: this.mapBiome(rawData.sector, rawData.industry),
      zElevation: this.calculateRisk(rawData),
      
      metrics: {
        marketCap: rawData.marketCap,
        price: rawData.regularMarketPrice,
        priceChange24h: rawData.regularMarketChangePercent,
        revenue: rawData.totalRevenue,
        eps: rawData.epsTrailingTwelveMonths,
        confidence: this.calculateConfidence(rawData)
      },
      
      // ... other universal properties
    };
  }
  
  private mapBiome(sector: string, industry: string): BiomeType {
    if (sector === 'Technology' && industry.includes('Semiconductor')) {
      return BiomeType.ARTIFICIAL_MEGACITY; // Nvidia
    }
    if (sector === 'Technology' && industry.includes('Consumer Electronics')) {
      return BiomeType.LUXURY_EARTH; // Apple
    }
    if (sector === 'Consumer Cyclical' && industry.includes('Auto')) {
      return BiomeType.INDUSTRIAL_ENERGY; // Tesla
    }
    return BiomeType.METALLIC_CORE; // Gold equivalent
  }
}
```

### 6. New File Structure

```
src/
├── core/                           # Universal engine
│   ├── entities/
│   │   ├── UniversalEntity.ts      # Core entity interface
│   │   ├── EntityType.ts           # Entity type definitions
│   │   └── EntityMetrics.ts        # Universal metrics
│   ├── universe/
│   │   ├── UniverseConfig.ts       # Universe configuration
│   │   ├── UniverseType.ts         # Universe type definitions
│   │   └── UniverseStore.ts        # Universal state management
│   ├── renderer/
│   │   ├── UniversalRenderer.ts    # Data-agnostic renderer
│   │   ├── UniversalPlanet.tsx     # Universal planet component
│   │   └── VisualCalculator.ts     # Visual property calculations
│   ├── connections/
│   │   ├── EntityConnection.ts     # Connection interfaces
│   │   └── ConnectionRenderer.tsx  # Wormhole/gravity rendering
│   └── layers/
│       ├── EntityLayer.ts          # Layer definitions
│       └── LayerSystem.ts          # Layer management
├── universes/                      # Universe-specific implementations
│   ├── defi/
│   │   ├── DeFiUniverseConfig.ts   # DeFi universe configuration
│   │   ├── mappers/
│   │   │   ├── DeFiNetworkMapper.ts
│   │   │   └── DeFiTokenMapper.ts
│   │   ├── data/
│   │   │   ├── defiLlamaApi.ts
│   │   │   └── coinGeckoApi.ts
│   │   └── components/
│   │       └── DeFiSpecificComponents.tsx  # Only if needed
│   ├── nasdaq/
│   │   ├── NasdaqUniverseConfig.ts
│   │   ├── mappers/
│   │   │   ├── NasdaqSectorMapper.ts
│   │   │   └── NasdaqCompanyMapper.ts
│   │   ├── data/
│   │   │   ├── yahooFinanceApi.ts
│   │   │   └── alphaVantageApi.ts
│   │   └── components/
│   │       └── NasdaqSpecificComponents.tsx
│   ├── commodity/
│   │   └── ... (similar structure)
│   ├── carbon/
│   │   └── ... (similar structure)
│   └── excalibur-nexus/
│       └── ... (similar structure)
├── components/                      # Universal UI components
│   ├── navigation/
│   │   ├── UniverseSelector.tsx    # Switch between universes
│   │   ├── LayerSelector.tsx       # Switch data layers
│   │   └── NavigationControls.tsx  # Movement controls
│   ├── ui/
│   │   ├── UniversalHUD.tsx         # Data-agnostic HUD
│   │   └── EntityDetails.tsx       # Universal entity details
│   └── scene/
│       ├── UniversalScene.tsx       # Main 3D scene
│       └── CameraController.tsx     # Universal camera system
├── hooks/                          # Universal hooks
│   ├── useUniverse.ts              # Universe management
│   ├── useEntityData.ts            # Universal data fetching
│   └── useConnections.ts           # Relationship data
└── utils/
    ├── visualCalculations.ts       # Size, speed, glow calculations
    └── dataTransformations.ts      # Raw data to universal entities
```

### 7. Implementation Strategy

#### Phase 1: Core Universal Engine
1. Create `src/core/` with universal entity system
2. Implement `UniversalRenderer` that works with any entity type
3. Create `UniverseStore` for universal state management
4. Build universe configuration system

#### Phase 2: Universe Migration
1. Migrate existing DeFi code to `universes/defi/`
2. Create `DeFiNetworkMapper` and `DeFiTokenMapper`
3. Update components to use universal renderer
4. Test that DeFi galaxy works identically

#### Phase 3: NASDAQ Implementation
1. Create `universes/nasdaq/` structure
2. Implement `NasdaqCompanyMapper` and `NasdaqSectorMapper`
3. Add Yahoo Finance / Alpha Vantage data sources
4. Configure NASDAQ biome mappings (Tech = Artificial Megacity, etc.)
5. Test universe switching

#### Phase 4: Universe Switching
1. Implement `UniverseSelector` component
2. Add smooth transitions between universes
3. Create universe-specific visual themes
4. Implement cross-universe connections (if any)

### 8. Key Benefits

1. **True Universality:** Renderer knows nothing about data types
2. **Easy Expansion:** Add new universes without touching core engine
3. **Data-Driven:** Universe behavior defined by configuration, not code
4. **Maintainable:** Clear separation between universal logic and universe-specific logic
5. **Testable:** Each universe can be tested independently

### 9. Migration Risks & Mitigations

**Risk:** Breaking existing DeFi functionality
**Mitigation:** Phase 2 ensures identical behavior before adding new universes

**Risk:** Performance degradation from abstraction
**Mitigation:** Universal entities are lightweight; visual calculations are memoized

**Risk:** Complex data mapping
**Mitigation:** Each universe has dedicated mappers; can be developed independently

---

## Next Steps

1. **Approve Architecture:** Confirm this universal design meets the vision
2. **Phase 1 Implementation:** Build core universal engine
3. **Phase 2 Migration:** Move DeFi to universal system
4. **Phase 3 NASDAQ:** Implement first new universe
5. **Phase 4 Expansion:** Add remaining universes

The key insight: **The renderer should only know about visual properties, not about what it's rendering.** All business logic lives in universe-specific mappers that transform raw data into universal entities.

This architecture enables the vision of traveling from Ethereum to Nvidia to Gold to XGT within a single, unified financial universe.
