import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { useGalaxyStore } from '@/store/galaxyStore';
import { PriceRibbon } from './PriceRibbon';
import { VolumePillars } from './VolumePillars';
import { ParticleStream } from './ParticleStream';
import { formatPrice, formatVolume } from '@/utils/math';
import { priceChangeToColor } from '@/utils/colors';

export function HolographicDashboard() {
  const token = useGalaxyStore((s) => s.selectedToken);
  const network = useGalaxyStore((s) => s.selectedNetwork);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    setPanelVisible(false);
    const t = setTimeout(() => setPanelVisible(true), 300);
    return () => clearTimeout(t);
  }, [token?.id]);

  if (!token) return null;

  const pos = network?.position ?? ([0, 0, 0] as [number, number, number]);
  const isXGT = token.isHighlighted === true;

  const changeColor = priceChangeToColor(token.priceChange24h);
  const changeSign = token.priceChange24h >= 0 ? '+' : '';

  const accentColor = isXGT ? '#ffd700' : undefined;
  const panelBorder = isXGT ? '1px solid rgba(255,215,0,0.4)' : undefined;
  const panelShadow = isXGT ? '0 0 24px rgba(255,215,0,0.12)' : undefined;

  return (
    <group position={pos}>
      <PriceRibbon token={token} />
      <VolumePillars token={token} />
      <ParticleStream />

      <Html
        center
        position={[0, 7, 0]}
        style={{ pointerEvents: 'none', width: '340px' }}
      >
        <div
          className="holo-panel relative p-4 rounded-lg"
          style={{
            opacity: panelVisible ? 1 : 0,
            transform: panelVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            border: panelBorder,
            boxShadow: panelShadow,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isXGT && (
                <img
                  src="https://excaliburglobal.farm/assets/token/xgt-token-logo-64.png"
                  alt="XGT"
                  width={28}
                  height={28}
                  style={{ borderRadius: '50%', boxShadow: '0 0 8px rgba(255,215,0,0.5)' }}
                />
              )}
              <div>
                <div
                  className={isXGT ? 'font-display text-lg font-bold' : 'font-display text-lg font-bold neon-text-cyan'}
                  style={isXGT ? { color: '#ffd700' } : {}}
                >{token.name}</div>
                <div className="font-mono text-sm text-white/50">
                  {token.symbol}
                  {token.rank < 900 && ` • Rank #${token.rank}`}
                  {isXGT && <span style={{ color: '#ffd700', marginLeft: '6px' }}>★ Featured</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xl font-bold text-white">{formatPrice(token.price)}</div>
              <div className="font-mono text-sm font-semibold" style={{ color: changeColor }}>
                {changeSign}{token.priceChange24h.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-panel-border">
            <div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-wider">Market Cap</div>
              <div className="font-mono text-sm" style={{ color: accentColor ?? '#ffd700' }}>{formatVolume(token.marketCap)}</div>
            </div>
            <div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-wider">24H Volume</div>
              <div className={isXGT ? 'font-mono text-sm' : 'font-mono text-sm text-neon-cyan'} style={isXGT ? { color: '#ffd700' } : {}}>{formatVolume(token.volume24h)}</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
