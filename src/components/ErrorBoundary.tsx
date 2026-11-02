import { Component, type ReactNode, type ErrorInfo } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Bunyad ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-obsidian p-6 text-center">
          <div className="max-w-md">
            <h1 className="font-display text-2xl font-bold text-cyan">Something went wrong</h1>
            <p className="mt-3 text-sm text-platinum/70">
              The application encountered a runtime error. Try refreshing the page.
            </p>
            <pre className="mt-4 overflow-auto rounded-lg border border-cyan/20 bg-obsidian-2 p-4 text-left text-xs text-red-400">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-cyan px-4 py-2 text-sm font-semibold text-obsidian hover:opacity-90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
