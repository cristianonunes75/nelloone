import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-card border border-border rounded-xl p-6">
            <h1 className="text-lg font-semibold mb-2">
              {this.props.fallbackTitle || "Algo deu errado"}
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Houve um erro ao renderizar esta página. Já registámos o erro no console.
            </p>
            <pre className="text-xs bg-muted/40 border border-border rounded-lg p-3 overflow-auto">
              {this.state.error?.message || "Erro desconhecido"}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
