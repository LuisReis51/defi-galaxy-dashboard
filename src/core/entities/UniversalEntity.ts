/**
 * Universal Entity System
 * Core entity interface that can represent any financial, economic, or ecological object
 */

export enum EntityType {
  BLOCKCHAIN = 'blockchain',
  TOKEN = 'token',
  COMPANY = 'company',
  SECTOR = 'sector',
  COMMODITY = 'commodity',
  PRODUCER = 'producer',
  CONSUMER = 'consumer',
  PROJECT = 'project',
  REGISTRY = 'registry',
  CREDIT = 'credit',
  CURRENCY = 'currency',
  COUNTRY = 'country'
}

export enum UniverseType {
  DEFI = 'defi',
  NASDAQ = 'nasdaq',
  SP_500 = 'sp500',
  COMMODITY = 'commodity',
  CARBON = 'carbon',
  GLOBAL_ECONOMY = 'global-economy',
  EXCALIBUR_NEXUS = 'excalibur-nexus'
}

export enum BiomeType {
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
  METALLIC_CORE = 'metallic-core',
  FOREST_WORLD = 'forest-world',
  DESERT_OASIS = 'desert-oasis'
}

export enum ConnectionType {
  WORMHOLE = 'wormhole',
  GRAVITY = 'gravity',
  SUPPLY_CHAIN = 'supply-chain',
  OWNERSHIP = 'ownership',
  DEPENDENCY = 'dependency',
  CAPITAL_FLOW = 'capital-flow'
}

export enum LayerType {
  EXPLORER = 'explorer',
  TRADER = 'trader',
  INVESTOR = 'investor',
  RESEARCH = 'research',
  AI = 'ai'
}

export interface UniversalMetrics {
  // Universal financial metrics
  marketCap?: number;
  price?: number;
  volume24h?: number;
  priceChange24h?: number;
  
  // DeFi specific
  tvl?: number;
  dominance?: number;
  tokenCount?: number;
  
  // Stock specific
  revenue?: number;
  eps?: number;
  pe?: number;
  employees?: number;
  
  // Commodity specific
  supply?: number;
  demand?: number;
  reserves?: number;
  
  // Carbon specific
  creditVolume?: number;
  verifiedCredits?: number;
  co2Sequestered?: number;
  
  // Universal activity metrics
  transactionVelocity?: number;
  liquidityScore?: number;
  confidence?: number;
  volatility?: number;
  
  // Impact metrics
  sustainabilityScore?: number;
  socialImpact?: number;
  governanceScore?: number;
}

export interface SpatialProperties {
  // Visual properties calculated from metrics
  size: number;                    // Importance (market cap, TVL, etc.)
  orbitRadius?: number;            // Distance from parent
  orbitSpeed?: number;            // Activity level
  orbitPhase?: number;            // Current position
  glowIntensity: number;          // Liquidity/confidence
  rotationSpeed: number;          // Transaction velocity
  zElevation: number;             // Risk/maturity
  
  // Visual appearance
  color: string;
  glowColor: string;
  biomeType: BiomeType;
  
  // Position in universe
  position: [number, number, number];
}

export interface EntityConnection {
  id: string;
  targetId: string;
  sourceId: string;
  connectionType: ConnectionType;
  strength: number;                // 0-1, affects visual thickness
  animated: boolean;               // Flow animation
  color: string;
  metadata?: Record<string, any>;
}

export interface ProceduralIdentity {
  entityId: string;                // Deterministic seed
  biomeType: BiomeType;
  surfaceSeed: number;             // For surface generation
  atmosphereSeed: number;          // For atmosphere effects
  colorPalette: string[];          // Procedural colors
  features: SurfaceFeature[];
}

export interface SurfaceFeature {
  type: 'crater' | 'mountain' | 'valley' | 'storm' | 'city' | 'forest' | 'volcano' | 'lava-flow' | 'whirlpool';
  position: [number, number, number];
  size: number;
  intensity: number;
}

export interface LayerData {
  layerType: LayerType;
  visibleMetrics: string[];
  hiddenMetrics: string[];
  visualOverrides: Record<string, any>;
  interactions: LayerInteraction[];
}

export interface LayerInteraction {
  type: 'click' | 'hover' | 'select' | 'drill-down';
  action: string;
  target: string;
  data?: any;
}

export interface UniversalEntity {
  // Core identity
  id: string;
  name: string;
  symbol: string;
  entityType: EntityType;
  universeType: UniverseType;
  
  // Hierarchy
  parentId?: string;               // Parent entity ID
  childrenIds: string[];           // Child entity IDs
  
  // Universal visual properties
  spatial: SpatialProperties;
  metrics: UniversalMetrics;
  identity: ProceduralIdentity;
  
  // Relationships
  connections: EntityConnection[];
  influenceRadius: number;
  
  // Knowledge layers
  layers: LayerData[];
  defaultLayer: LayerType;
  
  // Temporal data
  historicalData?: HistoricalDataPoint[];
  
  // Metadata
  metadata: Record<string, any>;
  tags: string[];
  
  // State
  isSelected: boolean;
  isHovered: boolean;
  isVisible: boolean;
}

export interface HistoricalDataPoint {
  timestamp: number;
  metrics: Partial<UniversalMetrics>;
  spatial?: Partial<SpatialProperties>;
  connections?: EntityConnection[];
}

export interface UniverseConfig {
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
  
  // Mapping rules
  mappingRules: MappingRule[];
  
  // Default positions
  cameraPositions: Record<string, [number, number, number]>;
  
  // Special properties
  isSpecialUniverse?: boolean;
  centralStarId?: string;
}

export interface HierarchyLevel {
  level: number;
  entityType: EntityType;
  parentType?: EntityType;
  name: string;
  maxChildren?: number;
}

export interface VisualTheme {
  backgroundColor: string;
  nebulaColors: string[];
  starFieldDensity: number;
  ambientLightIntensity: number;
  connectionColors: Record<ConnectionType, string>;
}

export interface DataSource {
  id: string;
  type: 'api' | 'static' | 'realtime' | 'mock';
  url?: string;
  apiKey?: string;
  refreshInterval?: number;
  priority: number;
}

export interface MappingRule {
  sourceField: string;
  targetField: string;
  transform: TransformFunction;
  required: boolean;
}

export type TransformFunction = (value: any, context?: any) => any;

// Data mapper interface for universe-specific implementations
export interface DataMapper<T = any> {
  universeType: UniverseType;
  entityType: EntityType;
  mapToEntity(rawData: T): UniversalEntity;
  updateEntity(entity: UniversalEntity, rawData: T): UniversalEntity;
  validateData(rawData: T): boolean;
}

// Time engine interfaces
export enum TimeScale {
  CURRENT = 'current',
  HOURS_24 = '24h',
  DAYS_7 = '7d',
  DAYS_30 = '30d',
  YEARS_1 = '1y',
  HISTORICAL = 'historical',
  PREDICTIVE = 'predictive'
}

export interface TimeState {
  currentTime: number;
  timeScale: TimeScale;
  isPlaying: boolean;
  playbackSpeed: number;
  historicalIndex?: number;
}

export interface TimeEvent {
  id: string;
  timestamp: number;
  eventType: string;
  title: string;
  description: string;
  affectedEntities: string[];
  impactRadius: number;
  visualSignature: {
    color: string;
    intensity: number;
    duration: number;
  };
}

// Event engine interfaces
export enum EventType {
  FED_RATE_CHANGE = 'fed-rate-change',
  TOKEN_BURN = 'token-burn',
  MAJOR_EARNINGS = 'major-earnings',
  WAR = 'war',
  SUPPLY_CHAIN_DISRUPTION = 'supply-chain-disruption',
  CARBON_CREDIT_ISSUANCE = 'carbon-credit-issuance',
  REGULATORY_CHANGE = 'regulatory-change',
  MARKET_CRASH = 'market-crash',
  MERGER_ACQUISITION = 'merger-acquisition'
}

export interface UniverseEvent {
  id: string;
  timestamp: number;
  eventType: EventType;
  title: string;
  description: string;
  affectedEntities: string[];
  impactRadius: number;
  rippleEffect: RippleEffect;
  visualSignature: VisualSignature;
}

export interface RippleEffect {
  propagationSpeed: number;
  maxRadius: number;
  intensity: number;
  color: string;
  duration: number;
}

export interface VisualSignature {
  color: string;
  intensity: number;
  pattern: 'pulse' | 'wave' | 'burst' | 'stream';
  duration: number;
}

// Portal system interfaces
export interface Portal {
  id: string;
  name: string;
  fromUniverse: string;
  toUniverse: string;
  position: [number, number, number];
  radius: number;
  isActive: boolean;
  visualType: PortalType;
  requirements?: PortalRequirement[];
}

export enum PortalType {
  WORMHOLE = 'wormhole',
  GATE = 'gate',
  BRIDGE = 'bridge',
  TELEPORTER = 'teleporter'
}

export interface PortalRequirement {
  type: 'level' | 'entity' | 'metric' | 'time';
  value: any;
  description: string;
}

// Store interfaces
export interface UniverseStore {
  // Current universe state
  currentUniverse: UniverseType;
  universeConfig: UniverseConfig | null;
  
  // Entities
  entities: Record<string, UniversalEntity>;
  connections: Record<string, EntityConnection>;
  
  // View state
  selectedEntity: UniversalEntity | null;
  hoveredEntity: UniversalEntity | null;
  cameraTarget: [number, number, number];
  
  // Knowledge layers
  currentLayer: LayerType;
  
  // Time state
  timeState: TimeState;
  
  // Portals
  portals: Record<string, Portal>;
  
  // Events
  events: UniverseEvent[];
  activeEvent: UniverseEvent | null;
  
  // Actions
  switchUniverse: (universeType: UniverseType) => Promise<void>;
  selectEntity: (entityId: string) => void;
  hoverEntity: (entityId: string | null) => void;
  setLayer: (layer: LayerType) => void;
  setTimeScale: (timeScale: TimeScale) => void;
  updateEntities: (entities: UniversalEntity[]) => void;
  addConnection: (connection: EntityConnection) => void;
  triggerEvent: (event: UniverseEvent) => void;
  travelThroughPortal: (portalId: string) => void;
}
