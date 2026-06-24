/**
 * Universal Engine Test App
 * Demonstrates the universal renderer with Ethereum, Nvidia, Gold, and XGT
 * This proves the core concept: same renderer works with any entity type
 */

import React from 'react';
import { UniversalRendererTest } from './core/test/UniversalRendererTest';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000814' }}>
      <UniversalRendererTest />
    </div>
  );
}
