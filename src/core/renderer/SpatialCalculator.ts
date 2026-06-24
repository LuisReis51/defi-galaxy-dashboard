/**
 * Spatial Calculator
 * Converts universal metrics to visual properties
 * All visual calculations are data-driven and universal
 */

import type { UniversalEntity, UniversalMetrics, SpatialProperties, BiomeType } from '../entities/UniversalEntity';

export class SpatialCalculator {
  /**
   * Calculate all spatial properties from entity metrics
   * This is the core of the spatial meaning engine
   */
  static calculateSpatialProperties(entity: UniversalEntity): SpatialProperties {
    const metrics = entity.metrics;
    
    return {
      // Size = Importance (market cap, TVL, asset value)
      size: this.calculateSize(metrics),
      
      // Orbit radius = Scale (larger entities orbit closer)
      orbitRadius: this.calculateOrbitRadius(metrics),
      
      // Orbit speed = Activity (volume, transactions, flow)
      orbitSpeed: this.calculateOrbitSpeed(metrics),
      
      // Orbit phase = Current position (deterministic)
      orbitPhase: this.calculateOrbitPhase(entity.id),
      
      // Glow intensity = Liquidity/Confidence/Participation
      glowIntensity: this.calculateGlowIntensity(metrics),
      
      // Rotation speed = Transaction velocity
      rotationSpeed: this.calculateRotationSpeed(metrics),
      
      // Z-axis elevation = Risk/Maturity (stable = high)
      zElevation: this.calculateZElevation(metrics),
      
      // Colors from entity configuration
      color: entity.spatial.color,
      glowColor: entity.spatial.glowColor,
      biomeType: entity.spatial.biomeType,
      
      // Position from entity configuration
      position: entity.spatial.position
    };
  }

  /**
   * Size represents importance in the ecosystem
   * Larger market cap/TVL = larger visual size
   */
  private static calculateSize(metrics: UniversalMetrics): number {
    // Use market cap as primary size indicator
    const marketCap = metrics.marketCap || 0;
    
    // Fallback to TVL for DeFi entities
    const tvl = metrics.tvl || 0;
    const primaryValue = Math.max(marketCap, tvl);
    
    if (primaryValue === 0) return 1.0; // Minimum size
    
    // Logarithmic scale for better visualization
    const minSize = 0.8;
    const maxSize = 6.0;
    const minValue = 1e6; // $1M minimum
    const maxValue = 1e12; // $1T maximum
    
    const normalized = Math.log10(Math.max(primaryValue, minValue)) / Math.log10(maxValue / minValue);
    const clamped = Math.max(0, Math.min(1, normalized));
    
    return minSize + clamped * (maxSize - minSize);
  }

  /**
   * Orbit radius represents scale and influence
   * More important entities orbit closer to center
   */
  private static calculateOrbitRadius(metrics: UniversalMetrics): number {
    const marketCap = metrics.marketCap || 0;
    const tvl = metrics.tvl || 0;
    const primaryValue = Math.max(marketCap, tvl);
    
    if (primaryValue === 0) return 15; // Default outer orbit
    
    // Inverse relationship: larger value = smaller radius (closer to center)
    const minRadius = 4;  // Largest entities
    const maxRadius = 20; // Smallest entities
    const minValue = 1e9;  // $1B
    const maxValue = 1e12; // $1T
    
    const normalized = Math.log10(Math.max(primaryValue, minValue)) / Math.log10(maxValue / minValue);
    const clamped = Math.max(0, Math.min(1, normalized));
    
    // Invert: larger value = smaller radius
    return maxRadius - clamped * (maxRadius - minRadius);
  }

  /**
   * Orbit speed represents activity level
   * Higher volume/transactions = faster movement
   */
  private static calculateOrbitSpeed(metrics: UniversalMetrics): number {
    const volume = metrics.volume24h || 0;
    const transactionVelocity = metrics.transactionVelocity || 0;
    const liquidity = metrics.liquidityScore || 0;
    
    // Combine multiple activity metrics
    const activityScore = (volume * 0.4) + (transactionVelocity * 0.4) + (liquidity * 0.2);
    
    if (activityScore === 0) return 0.1; // Minimum movement
    
    // Normalize to reasonable orbit speed range
    const minSpeed = 0.05; // Slow movement
    const maxSpeed = 1.5;  // Fast movement
    const referenceValue = 1e9; // $1B daily volume reference
    
    const normalized = Math.min(activityScore / referenceValue, 1);
    return minSpeed + normalized * (maxSpeed - minSpeed);
  }

  /**
   * Orbit phase is deterministic based on entity ID
   * Ensures consistent positioning across sessions
   */
  private static calculateOrbitPhase(entityId: string): number {
    // Create deterministic hash from entity ID
    let hash = 0;
    for (let i = 0; i < entityId.length; i++) {
      const char = entityId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to 0-2π range
    return (Math.abs(hash) % 1000) / 1000 * Math.PI * 2;
  }

  /**
   * Glow intensity represents liquidity, confidence, and participation
   * Brighter glow = stronger ecosystem participation
   */
  private static calculateGlowIntensity(metrics: UniversalMetrics): number {
    const liquidity = metrics.liquidityScore || 0;
    const confidence = metrics.confidence || 0;
    const volume = metrics.volume24h || 0;
    
    // Combine liquidity and confidence metrics
    let glowScore = (liquidity * 0.6) + (confidence * 0.4);
    
    // Add volume boost for high-activity entities
    if (volume > 1e8) { // $100M daily volume
      glowScore = Math.min(1, glowScore + 0.2);
    }
    
    // Price change affects glow (positive = brighter, negative = dimmer)
    const priceChange = metrics.priceChange24h || 0;
    if (priceChange > 0) {
      glowScore = Math.min(1, glowScore + (priceChange / 100) * 0.3);
    } else if (priceChange < 0) {
      glowScore = Math.max(0.1, glowScore + (priceChange / 100) * 0.2);
    }
    
    return Math.max(0.1, Math.min(1, glowScore));
  }

  /**
   * Rotation speed represents transaction velocity
   * Faster transactions = faster rotation
   */
  private static calculateRotationSpeed(metrics: UniversalMetrics): number {
    const transactionVelocity = metrics.transactionVelocity || 0;
    const volume = metrics.volume24h || 0;
    
    // Use transaction velocity as primary indicator
    let rotationSpeed = transactionVelocity * 0.001;
    
    // Add volume contribution
    rotationSpeed += (volume / 1e9) * 0.1; // Scale by $1B reference
    
    // Normalize to reasonable range
    return Math.max(0.02, Math.min(0.5, rotationSpeed));
  }

  /**
   * Z-axis elevation represents risk and maturity
   * Higher = more stable, established, lower risk
   * Lower = more experimental, emerging, higher risk
   */
  private static calculateZElevation(metrics: UniversalMetrics): number {
    let elevationScore = 0.5; // Default middle elevation
    
    // Market cap affects stability (larger = more stable)
    const marketCap = metrics.marketCap || 0;
    if (marketCap > 1e12) { // $1T+
      elevationScore += 0.3;
    } else if (marketCap > 1e9) { // $1B+
      elevationScore += 0.2;
    } else if (marketCap < 1e6) { // <$1M
      elevationScore -= 0.3;
    }
    
    // Volatility affects risk (higher volatility = lower elevation)
    const volatility = metrics.volatility || 0;
    if (volatility > 0.5) { // High volatility
      elevationScore -= 0.2;
    } else if (volatility < 0.2) { // Low volatility
      elevationScore += 0.1;
    }
    
    // Age/maturity indicators
    if (metrics.employees && metrics.employees > 10000) { // Large company
      elevationScore += 0.1;
    }
    
    // Specific entity type adjustments
    if (metrics.tvl && metrics.tvl > 1e10) { // Large DeFi protocol
      elevationScore += 0.2;
    }
    
    // Normalize to -5 to +5 range
    const normalizedElevation = (elevationScore - 0.5) * 10;
    return Math.max(-5, Math.min(5, normalizedElevation));
  }

  /**
   * Calculate connection visual properties
   */
  static calculateConnectionProperties(
    connectionType: string,
    strength: number,
    isAnimated: boolean
  ) {
    const baseColors = {
      wormhole: '#00ffff',
      gravity: '#ff00ff',
      'supply-chain': '#ffff00',
      ownership: '#00ff00',
      dependency: '#ff6600',
      'capital-flow': '#ff0066'
    };
    
    return {
      color: baseColors[connectionType as keyof typeof baseColors] || '#ffffff',
      thickness: Math.max(0.5, strength * 3),
      opacity: Math.max(0.3, strength),
      animated: isAnimated,
      pulseSpeed: 0.5 + strength * 2
    };
  }

  /**
   * Calculate visual properties for time-based effects
   */
  static calculateTimeEffects(
    baseProperties: SpatialProperties,
    timeScale: string,
    historicalData?: any
  ): Partial<SpatialProperties> {
    if (!historicalData) return {};
    
    // Time-based modifications would go here
    // For now, return base properties
    return {};
  }
}
