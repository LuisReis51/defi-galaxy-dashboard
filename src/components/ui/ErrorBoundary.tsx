import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="absolute inset-0 z-50 bg-space-black flex flex-col items-center justify-center gap-4">
          <div className="font-mono text-neon-cyan text-lg tracking-widest">SYSTEM ERROR</div>
          <div className="font-mono text-xs text-white/40 max-w-sm text-center">
            {this.state.error?.message ?? 'An unexpected error occurred in the galaxy renderer.'}
          </div>
          <button
            className="btn-holo rounded mt-4"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reinitialize
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
