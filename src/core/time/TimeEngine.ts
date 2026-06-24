/**
 * Time Engine
 * Handles temporal dimensions and historical data for the Financial Universe
 * Users can view data across different time scales and historical periods
 */

import type { 
  TimeState, 
  EventType, 
  UniversalEntity,
  HistoricalDataPoint 
} from '../entities/UniversalEntity';
import { TimeScale, TimeEvent } from '../entities/UniversalEntity';

/**
 * Time Engine class
 * Manages temporal navigation and historical data replay
 */
export class TimeEngine {
  private static instance: TimeEngine;
  private currentTime: number;
  private timeScale: TimeScale = TimeScale.CURRENT;
  private isPlaying: boolean = false;
  private playbackSpeed: number = 1.0;
  private historicalIndex: number = 0;
  private events: TimeEvent[] = [];
  private historicalData: Map<string, HistoricalDataPoint[]> = new Map();
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.currentTime = Date.now();
    this.initializeHistoricalData();
  }

  static getInstance(): TimeEngine {
    if (!TimeEngine.instance) {
      TimeEngine.instance = new TimeEngine();
    }
    return TimeEngine.instance;
  }

  /**
   * Get current time state
   */
  getTimeState(): TimeState {
    return {
      currentTime: this.currentTime,
      timeScale: this.timeScale,
      isPlaying: this.isPlaying,
      playbackSpeed: this.playbackSpeed,
      historicalIndex: this.historicalIndex
    };
  }

  /**
   * Set time scale
   */
  setTimeScale(timeScale: TimeScale): void {
    this.timeScale = timeScale;
    this.notifyListeners();
  }

  /**
   * Start/stop playback
   */
  setPlaying(playing: boolean): void {
    this.isPlaying = playing;
    this.notifyListeners();
  }

  /**
   * Set playback speed
   */
  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(10, speed));
    this.notifyListeners();
  }

  /**
   * Jump to specific time
   */
  setTime(timestamp: number): void {
    this.currentTime = timestamp;
    this.notifyListeners();
  }

  /**
   * Navigate to historical index
   */
  setHistoricalIndex(index: number): void {
    this.historicalIndex = Math.max(0, Math.min(this.getMaxHistoricalIndex() - 1, index));
    if (this.historicalIndex >= 0 && this.historicalIndex < this.getMaxHistoricalIndex()) {
      const dataPoint = this.getHistoricalDataPoint();
      if (dataPoint) {
        this.currentTime = dataPoint.timestamp;
      }
    }
    this.notifyListeners();
  }

  /**
   * Get historical data point for current index
   */
  getHistoricalDataPoint(): HistoricalDataPoint | null {
    const dataPoints = Array.from(this.historicalData.values())[0];
    if (!dataPoints || dataPoints.length === 0) return null;
    
    return dataPoints[this.historicalIndex] || null;
  }

  /**
   * Get maximum historical index
   */
  private getMaxHistoricalIndex(): number {
    const dataPoints = Array.from(this.historicalData.values())[0];
    return dataPoints ? dataPoints.length : 0;
  }

  /**
   * Get time offset for current scale
   */
  getTimeOffset(): number {
    const now = Date.now();
    
    switch (this.timeScale) {
      case TimeScale.CURRENT:
        return 0;
      case TimeScale.HOURS_24:
        return -24 * 60 * 60 * 1000; // 24 hours ago
      case TimeScale.DAYS_7:
        return -7 * 24 * 60 * 60 * 1000; // 7 days ago
      case TimeScale.DAYS_30:
        return -30 * 24 * 60 * 60 * 1000; // 30 days ago
      case TimeScale.YEARS_1:
        return -365 * 24 * 60 * 60 * 1000; // 1 year ago
      case TimeScale.HISTORICAL:
        return this.historicalIndex > 0 ? 
          this.getHistoricalDataPoint()?.timestamp || 0 : 
          now;
      case TimeScale.PREDICTIVE:
        return 30 * 24 * 60 * 60 * 1000; // 30 days in future
      default:
        return 0;
    }
  }

  /**
   * Get effective time considering scale and playback
   */
  getEffectiveTime(): number {
    const baseTime = this.currentTime;
    const offset = this.getTimeOffset();
    
    return baseTime + offset;
  }

  /**
   * Update time (called each frame during playback)
   */
  update(deltaTime: number): void {
    if (this.isPlaying) {
      this.currentTime += deltaTime * this.playbackSpeed * 1000;
      
      // Handle historical replay
      if (this.timeScale === TimeScale.HISTORICAL) {
        this.advanceHistoricalIndex();
      }
      
      this.notifyListeners();
    }
  }

  /**
   * Advance historical index during playback
   */
  private advanceHistoricalIndex(): void {
    const maxIndex = this.getMaxHistoricalIndex();
    if (this.historicalIndex < maxIndex - 1) {
      this.historicalIndex++;
    } else {
      // Loop back to beginning
      this.historicalIndex = 0;
    }
  }

  /**
   * Add time event
   */
  addEvent(event: TimeEvent): void {
    this.events.push(event);
    this.events.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get events in time range
   */
  getEventsInTimeRange(startTime: number, endTime: number): TimeEvent[] {
    return this.events.filter(
      event => event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Get active events (current time ± impact duration)
   */
  getActiveEvents(): TimeEvent[] {
    const now = this.getEffectiveTime();
    return this.events.filter(event => {
      const eventEnd = event.timestamp + event.visualSignature.duration;
      return event.timestamp <= now && now <= eventEnd;
    });
  }

  /**
   * Initialize historical data with mock data
   */
  private initializeHistoricalData(): void {
    // Generate mock historical data points
    const now = Date.now();
    const dataPoints: HistoricalDataPoint[] = [];

    // Generate 365 days of historical data (1 year)
    for (let i = 365; i >= 0; i--) {
      const timestamp = now - (i * 24 * 60 * 60 * 1000);
      
      // Mock metrics with realistic variations
      const baseMarketCap = 2e12; // $2T base
      const marketCapVariation = Math.sin(i * 0.1) * 0.2 + Math.random() * 0.1 - 0.05;
      
      const dataPoint: HistoricalDataPoint = {
        timestamp,
        metrics: {
          marketCap: baseMarketCap * (1 + marketCapVariation),
          price: 100 + Math.sin(i * 0.05) * 20 + Math.random() * 10 - 5,
          priceChange24h: (Math.random() - 0.5) * 10,
          volume24h: 1e9 * (1 + Math.random() * 0.5),
          tvl: 50e9 * (1 + Math.sin(i * 0.08) * 0.3 + Math.random() * 0.2 - 0.1),
          liquidityScore: 0.7 + Math.sin(i * 0.12) * 0.2,
          confidence: 0.8 + Math.sin(i * 0.15) * 0.15
        },
        spatial: {
          // Visual properties would change over time
          glowIntensity: 0.5 + Math.sin(i * 0.1) * 0.3
        },
        connections: [] // Would store historical connection data
      };
      
      dataPoints.push(dataPoint);
    }

    // Store historical data for entities (using first entity as example)
    this.historicalData.set('example-entity', dataPoints);
  }

  /**
   * Get historical data for an entity
   */
  getHistoricalData(entityId: string): HistoricalDataPoint[] {
    return this.historicalData.get(entityId) || [];
  }

  /**
   * Add historical data point
   */
  addHistoricalDataPoint(entityId: string, dataPoint: HistoricalDataPoint): void {
    if (!this.historicalData.has(entityId)) {
      this.historicalData.set(entityId, []);
    }
    
    const entityData = this.historicalData.get(entityId)!;
    entityData.push(dataPoint);
    
    // Sort by timestamp
    entityData.sort((a, b) => a.timestamp - b.timestamp);
    
    // Limit to last 365 days
    if (entityData.length > 365) {
      entityData.splice(0, entityData.length - 365);
    }
  }

  /**
   * Create time event
   */
  createTimeEvent(
    eventType: EventType,
    title: string,
    description: string,
    affectedEntities: string[],
    impactRadius: number,
    visualSignature: {
      color: string;
      intensity: number;
      duration: number;
    }
  ): TimeEvent {
    const event: TimeEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      eventType,
      title,
      description,
      affectedEntities,
      impactRadius,
      visualSignature
    };

    this.addEvent(event);
    return event;
  }

  /**
   * Add listener for time changes
   */
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of time changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Get time scale information
   */
  getTimeScaleInfo(): {
    scale: TimeScale;
    name: string;
    description: string;
    duration: number;
    offset: number;
  }[] {
    return [
      {
        scale: TimeScale.CURRENT,
        name: 'Current',
        description: 'Real-time data',
        duration: 0,
        offset: 0
      },
      {
        scale: TimeScale.HOURS_24,
        name: '24 Hours',
        description: 'Last 24 hours',
        duration: 24 * 60 * 60 * 1000,
        offset: -24 * 60 * 60 * 1000
      },
      {
        scale: TimeScale.DAYS_7,
        name: '7 Days',
        description: 'Last 7 days',
        duration: 7 * 24 * 60 * 60 * 1000,
        offset: -7 * 24 * 60 * 60 * 1000
      },
      {
        scale: TimeScale.DAYS_30,
        name: '30 Days',
        description: 'Last 30 days',
        duration: 30 * 24 * 60 * 60 * 1000,
        offset: -30 * 24 * 60 * 60 * 1000
      },
      {
        scale: TimeScale.YEARS_1,
        name: '1 Year',
        description: 'Last year',
        duration: 365 * 24 * 60 * 60 * 1000,
        offset: -365 * 24 * 60 * 60 * 1000
      },
      {
        scale: TimeScale.HISTORICAL,
        name: 'Historical',
        description: 'Historical replay',
        duration: 365 * 24 * 60 * 60 * 1000,
        offset: 0 // Varies based on index
      },
      {
        scale: TimeScale.PREDICTIVE,
        name: 'Predictive',
        description: 'Future predictions',
        duration: 30 * 24 * 60 * 60 * 1000,
        offset: 30 * 24 * 60 * 60 * 1000
      }
    ];
  }

  /**
   * Format time for display
   */
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  /**
   * Get time ago string
   */
  getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }

  /**
   * Reset to current time
   */
  reset(): void {
    this.currentTime = Date.now();
    this.timeScale = TimeScale.CURRENT;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.historicalIndex = 0;
    this.notifyListeners();
  }

  /**
   * Get time statistics
   */
  getTimeStats() {
    const now = Date.now();
    const effectiveTime = this.getEffectiveTime();
    
    return {
      currentTime: this.currentTime,
      effectiveTime,
      timeScale: this.timeScale,
      isPlaying: this.isPlaying,
      playbackSpeed: this.playbackSpeed,
      historicalIndex: this.historicalIndex,
      totalEvents: this.events.length,
      activeEvents: this.getActiveEvents().length,
      historicalDataPoints: this.getMaxHistoricalIndex(),
      timeOffset: this.getTimeOffset()
    };
  }
}
