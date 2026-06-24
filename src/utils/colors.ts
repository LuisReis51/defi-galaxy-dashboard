import * as THREE from 'three';

export const NEON_CYAN = '#00f5ff';
export const NEON_GREEN = '#00ff88';
export const NEON_GOLD = '#ffd700';
export const NEON_PURPLE = '#bf00ff';
export const NEON_RED = '#ff3355';

export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 245, b: 255 };
}

export function hexToRgbNormalized(hex: string): [number, number, number] {
  const { r, g, b } = hexToRgb(hex);
  return [r / 255, g / 255, b / 255];
}

export function priceChangeToColor(change: number): string {
  if (change > 5) return NEON_GREEN;
  if (change > 0) return '#4ade80';
  if (change > -5) return '#f87171';
  return NEON_RED;
}

export function socialScoreToGlow(score: number): number {
  return 0.3 + Math.min(score, 100) / 100 * 1.4;
}

export function lerpColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bl = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

export function volumePillarColor(volume: number, maxVolume: number): THREE.Color {
  const t = Math.min(volume / maxVolume, 1);
  const low = new THREE.Color(NEON_CYAN);
  const high = new THREE.Color(NEON_GOLD);
  return low.lerp(high, t);
}
