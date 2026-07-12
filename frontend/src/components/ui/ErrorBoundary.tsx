import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Uncaught error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ background: 'var(--bg)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(248,113,113,0.12)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--overdue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="text-[20px] font-bold text-r-1 mb-2">Something went wrong</h1>
        <p className="text-[13px] text-r-3 mb-8 max-w-[360px] leading-relaxed">
          An unexpected error occurred. Reloading the page usually fixes it.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-[13px] font-semibold px-6 py-[10px] rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: 'var(--accent)', color: '#0C0E14' }}
        >
          Reload page
        </button>
      </div>
    );
  }
}
