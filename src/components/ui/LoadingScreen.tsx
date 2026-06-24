import React, { useEffect, useState } from 'react';

const MESSAGES = [
  'Initializing galaxy core...',
  'Mapping blockchain networks...',
  'Fetching TVL data...',
  'Plotting orbital mechanics...',
  'Calibrating holographic display...',
  'Synchronizing token streams...',
];

interface LoadingScreenProps {
  fadingOut?: boolean;
}

export function LoadingScreen({ fadingOut = false }: LoadingScreenProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 600);

    const progTimer = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 12, 95));
    }, 300);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-50 bg-space-black flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ opacity: visible && !fadingOut ? 1 : 0 }}
    >
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-full border-2 border-neon-cyan/30 animate-spin"
          style={{ animationDuration: '3s' }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-neon-green/30 animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-neon-cyan animate-pulse" />
        </div>
      </div>

      <h1 className="font-display text-2xl font-bold neon-text-cyan mb-2 tracking-widest uppercase">
        DeFi Galaxy
      </h1>
      <p className="font-mono text-xs text-white/40 mb-8 tracking-wider">
        Next-Generation DeFi Explorer
      </p>

      <div className="w-64 mb-3">
        <div className="h-px bg-white/10 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-neon-cyan transition-all duration-300"
            style={{ width: `${progress}%`, boxShadow: '0 0 8px #00f5ff' }}
          />
        </div>
      </div>

      <p className="font-mono text-xs text-white/40 tracking-wider transition-all duration-300">
        {MESSAGES[msgIndex]}
      </p>
    </div>
  );
}
