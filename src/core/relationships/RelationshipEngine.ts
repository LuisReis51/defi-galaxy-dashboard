/**
 * Relationship Engine
 * Handles connections between entities: Wormholes, Gravity, Dependencies
 * Relationships are more important than entities in the Financial Universe
 */

import type { 
  UniversalEntity, 
  EntityConnection, 
  SpatialProperties 
} from '../entities/UniversalEntity';
import { ConnectionType } from '../entities/UniversalEntity';
import { SpatialCalculator } from '../renderer/SpatialCalculator';

/**
 * Relationship Engine class
 * Manages and visualizes connections between entities
 */
export class RelationshipEngine {
  private static instance: RelationshipEngine;
  private connections: Map<string, EntityConnection> = new Map();
  private influenceMap: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): RelationshipEngine {
    if (!RelationshipEngine.instance) {
      RelationshipEngine.instance = new RelationshipEngine();
    }
    return RelationshipEngine.instance;
  }

  /**
   * Add a connection between two entities
   */
  addConnection(connection: EntityConnection): void {
    this.connections.set(connection.id, connection);
    this.updateInfluence(connection);
  }

  /**
   * Remove a connection
   */
  removeConnection(connectionId: string): boolean {
    const connection = this.connections.get(connectionId);
    if (connection) {
      this.connections.delete(connectionId);
      this.recalculateInfluence();
      return true;
    }
    return false;
  }

  /**
   * Get all connections
   */
  getAllConnections(): EntityConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get connections for a specific entity
   */
  getConnectionsForEntity(entityId: string): EntityConnection[] {
    return Array.from(this.connections.values()).filter(
      conn => conn.sourceId === entityId || conn.targetId === entityId
    );
  }

  /**
   * Calculate influence of an entity based on its connections
   */
  getInfluence(entityId: string): number {
    return this.influenceMap.get(entityId) || 0;
  }

  /**
   * Update influence based on a new connection
   */
  private updateInfluence(connection: EntityConnection): void {
    const sourceInfluence = this.influenceMap.get(connection.sourceId) || 0;
    const targetInfluence = this.influenceMap.get(connection.targetId) || 0;

    // Influence is bidirectional but weighted by connection strength
    const influenceDelta = connection.strength * 0.1;

    this.influenceMap.set(connection.sourceId, sourceInfluence + influenceDelta);
    this.influenceMap.set(connection.targetId, targetInfluence + influenceDelta);
  }

  /**
   * Recalculate all influence values
   */
  private recalculateInfluence(): void {
    // Reset influence map
    this.influenceMap.clear();

    // Recalculate from all connections
    this.connections.forEach(connection => {
      this.updateInfluence(connection);
    });
  }

  /**
   * Create automatic connections based on entity properties
   */
  createAutomaticConnections(entities: UniversalEntity[]): EntityConnection[] {
    const connections: EntityConnection[] = [];

    // Create connections based on various relationship types
    connections.push(...this.createWormholeConnections(entities));
    connections.push(...this.createGravityConnections(entities));
    connections.push(...this.createDependencyConnections(entities));

    // Add all connections to the engine
    connections.forEach(conn => this.addConnection(conn));

    return connections;
  }

  /**
   * Create wormhole connections (cross-chain bridges, major relationships)
   */
  private createWormholeConnections(entities: UniversalEntity[]): EntityConnection[] {
    const connections: EntityConnection[] = [];
    const wormholePairs = [
      // DeFi cross-chain bridges
      ['ethereum', 'arbitrum'],
      ['ethereum', 'optimism'],
      ['ethereum', 'base'],
      ['ethereum', 'polygon'],
      ['bsc', 'polygon'],
      
      // Major ecosystem connections
      ['ethereum', 'xgt'], // XGT ecosystem connection
      ['nvidia', 'ethereum'], // Tech-DeFi correlation
      ['gold', 'ethereum'], // Safe haven correlation
      
      // Commodity relationships
      ['gold', 'oil'], // Commodity correlation
    ];

    wormholePairs.forEach(([sourceId, targetId]) => {
      const sourceEntity = entities.find(e => e.id === sourceId);
      const targetEntity = entities.find(e => e.id === targetId);

      if (sourceEntity && targetEntity) {
        connections.push({
          id: `wormhole-${sourceId}-${targetId}`,
          sourceId,
          targetId,
          connectionType: ConnectionType.WORMHOLE,
          strength: this.calculateConnectionStrength(sourceEntity, targetEntity, 'wormhole'),
          animated: true,
          color: this.getConnectionColor(ConnectionType.WORMHOLE, sourceEntity, targetEntity),
          metadata: {
            type: 'cross-chain-bridge',
            description: `${sourceEntity.name} ↔ ${targetEntity.name}`
          }
        });
      }
    });

    return connections;
  }

  /**
   * Create gravity connections (major entity influence)
   */
  private createGravityConnections(entities: UniversalEntity[]): EntityConnection[] {
    const connections: EntityConnection[] = [];

    // Major entities create gravitational pull on smaller entities
    const majorEntities = entities
      .filter(e => (e.metrics.marketCap || 0) > 1e11) // > $100B
      .sort((a, b) => (b.metrics.marketCap || 0) - (a.metrics.marketCap || 0));

    majorEntities.forEach(majorEntity => {
      entities.forEach(otherEntity => {
        if (majorEntity.id === otherEntity.id) return;

        const distance = this.calculateDistance(majorEntity.spatial, otherEntity.spatial);
        const maxGravityRange = 30; // Maximum distance for gravity effect

        if (distance < maxGravityRange) {
          const strength = this.calculateGravityStrength(majorEntity, otherEntity, distance);
          
          if (strength > 0.1) { // Only create visible gravity connections
            connections.push({
              id: `gravity-${majorEntity.id}-${otherEntity.id}`,
              sourceId: majorEntity.id,
              targetId: otherEntity.id,
              connectionType: ConnectionType.GRAVITY,
              strength,
              animated: false,
              color: this.getConnectionColor(ConnectionType.GRAVITY, majorEntity, otherEntity),
              metadata: {
                type: 'gravitational-influence',
                distance: distance.toFixed(2),
                description: `${majorEntity.name} influences ${otherEntity.name}`
              }
            });
          }
        }
      });
    });

    return connections;
  }

  /**
   * Create dependency connections (supply chain, ownership, etc.)
   */
  private createDependencyConnections(entities: UniversalEntity[]): EntityConnection[] {
    const connections: EntityConnection[] = [];

    // Known dependency relationships
    const dependencyPairs = [
      // Tech supply chain
      ['nvidia', 'tsla'], // Tesla uses NVIDIA chips
      ['nvidia', 'apple'], // Apple uses NVIDIA chips
      
      // Energy dependencies
      ['oil', 'tsla'], // Tesla depends on oil prices
      ['gold', 'nvidia'], // Tech sector affects gold demand
      
      // DeFi dependencies
      ['ethereum', 'xgt'], // XGT depends on Ethereum ecosystem
    ];

    dependencyPairs.forEach(([sourceId, targetId]) => {
      const sourceEntity = entities.find(e => e.id === sourceId);
      const targetEntity = entities.find(e => e.id === targetId);

      if (sourceEntity && targetEntity) {
        connections.push({
          id: `dependency-${sourceId}-${targetId}`,
          sourceId,
          targetId,
          connectionType: ConnectionType.DEPENDENCY,
          strength: this.calculateConnectionStrength(sourceEntity, targetEntity, 'dependency'),
          animated: false,
          color: this.getConnectionColor(ConnectionType.DEPENDENCY, sourceEntity, targetEntity),
          metadata: {
            type: 'dependency-relationship',
            description: `${targetEntity.name} depends on ${sourceEntity.name}`
          }
        });
      }
    });

    return connections;
  }

  /**
   * Calculate connection strength based on entity properties
   */
  private calculateConnectionStrength(
    source: UniversalEntity, 
    target: UniversalEntity, 
    connectionType: string
  ): number {
    const sourceValue = source.metrics.marketCap || source.metrics.tvl || 0;
    const targetValue = target.metrics.marketCap || target.metrics.tvl || 0;
    
    // Base strength on relative sizes
    let strength = Math.min(sourceValue, targetValue) / Math.max(sourceValue, targetValue);
    
    // Adjust based on connection type
    switch (connectionType) {
      case 'wormhole':
        strength *= 1.2; // Wormholes are strong connections
        break;
      case 'gravity':
        strength *= 0.8; // Gravity is moderate
        break;
      case 'dependency':
        strength *= 0.6; // Dependencies are weaker
        break;
    }
    
    // Consider liquidity and confidence
    const sourceLiquidity = source.metrics.liquidityScore || 0.5;
    const targetLiquidity = target.metrics.liquidityScore || 0.5;
    const avgLiquidity = (sourceLiquidity + targetLiquidity) / 2;
    strength *= avgLiquidity;
    
    // Normalize to 0-1 range
    return Math.max(0.1, Math.min(1, strength));
  }

  /**
   * Calculate gravitational strength based on distance and mass
   */
  private calculateGravityStrength(
    majorEntity: UniversalEntity, 
    otherEntity: UniversalEntity, 
    distance: number
  ): number {
    const majorMass = majorEntity.metrics.marketCap || majorEntity.metrics.tvl || 0;
    const otherMass = otherEntity.metrics.marketCap || otherEntity.metrics.tvl || 0;
    
    // Simplified gravity calculation: F = G * m1 * m2 / r^2
    const gravityConstant = 1e-10; // Adjusted for visualization
    const strength = gravityConstant * majorMass * otherMass / (distance * distance);
    
    // Normalize and apply distance falloff
    const normalizedStrength = Math.min(1, strength / 1e20);
    const distanceFalloff = Math.max(0, 1 - (distance / 30)); // Linear falloff over 30 units
    
    return normalizedStrength * distanceFalloff;
  }

  /**
   * Calculate distance between two entities
   */
  private calculateDistance(pos1: SpatialProperties, pos2: SpatialProperties): number {
    const dx = pos1.position[0] - pos2.position[0];
    const dy = pos1.position[1] - pos2.position[1];
    const dz = pos1.position[2] - pos2.position[2];
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Get connection color based on type and entities
   */
  private getConnectionColor(
    connectionType: ConnectionType, 
    source: UniversalEntity, 
    target: UniversalEntity
  ): string {
    // Base colors for connection types
    const baseColors = {
      [ConnectionType.WORMHOLE]: '#00ffff',
      [ConnectionType.GRAVITY]: '#ff00ff',
      [ConnectionType.SUPPLY_CHAIN]: '#ffff00',
      [ConnectionType.OWNERSHIP]: '#00ff00',
      [ConnectionType.DEPENDENCY]: '#ff6600',
      [ConnectionType.CAPITAL_FLOW]: '#ff0066'
    };

    // Modify color based on entities involved
    const baseColor = baseColors[connectionType];
    
    // Blend with entity colors for visual variety
    const sourceColor = source.spatial.glowColor;
    const targetColor = target.spatial.glowColor;
    
    // Simple color blending (in production, use proper color space conversion)
    return this.blendColors(baseColor, sourceColor, 0.7);
  }

  /**
   * Simple color blending (placeholder)
   */
  private blendColors(color1: string, color2: string, ratio: number): string {
    // This is a simplified version - real implementation would use HSL color space
    return color1; // Return base color for now
  }

  /**
   * Update connection properties (for animation, strength changes, etc.)
   */
  updateConnection(connectionId: string, updates: Partial<EntityConnection>): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection) return false;

    Object.assign(connection, updates);
    this.recalculateInfluence();
    return true;
  }

  /**
   * Get connection statistics
   */
  getConnectionStats() {
    const connections = this.getAllConnections();
    
    const stats = {
      total: connections.length,
      byType: {} as Record<ConnectionType, number>,
      animated: connections.filter(c => c.animated).length,
      averageStrength: connections.reduce((sum, c) => sum + c.strength, 0) / connections.length
    };

    // Count by type
    connections.forEach(conn => {
      stats.byType[conn.connectionType] = (stats.byType[conn.connectionType] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear all connections
   */
  clearConnections(): void {
    this.connections.clear();
    this.influenceMap.clear();
  }

  /**
   * Validate connection integrity
   */
  validateConnections(entities: UniversalEntity[]): boolean {
    let isValid = true;

    this.connections.forEach((connection, id) => {
      // Check if source and target entities exist
      const sourceExists = entities.some(e => e.id === connection.sourceId);
      const targetExists = entities.some(e => e.id === connection.targetId);

      if (!sourceExists) {
        console.error(`❌ Connection ${id}: Source entity ${connection.sourceId} not found`);
        isValid = false;
      }

      if (!targetExists) {
        console.error(`❌ Connection ${id}: Target entity ${connection.targetId} not found`);
        isValid = false;
      }

      // Check for self-connections
      if (connection.sourceId === connection.targetId) {
        console.error(`❌ Connection ${id}: Self-connection detected`);
        isValid = false;
      }

      // Check strength bounds
      if (connection.strength < 0 || connection.strength > 1) {
        console.error(`❌ Connection ${id}: Invalid strength ${connection.strength}`);
        isValid = false;
      }
    });

    return isValid;
  }
}
