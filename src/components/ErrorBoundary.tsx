import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Fallback UI pokud nastala chyba
      return this.props.fallback || (
        <div className="p-4 m-4 border border-red-500 rounded bg-red-50 text-red-700">
          <h2 className="text-xl font-bold mb-2">Něco se pokazilo</h2>
          <details className="whitespace-pre-wrap">
            <summary className="cursor-pointer">Zobrazit detaily chyby</summary>
            <p className="mt-2 text-sm font-mono">{this.state.error?.toString()}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;