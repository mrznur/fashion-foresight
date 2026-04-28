import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production error boundary — catches unhandled React errors and
 * shows a graceful fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to error tracking (Sentry, etc.)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl mb-2">Something went wrong</h2>
            <p className="text-muted-foreground text-sm mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 border border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-5 py-2.5 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
