import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 320,
          padding: 32,
          textAlign: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--color-error-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          ⚠
        </div>
        <p
          style={{
            color: "var(--color-text)",
            fontSize: "var(--text-lg)",
            fontWeight: 700,
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-sm)",
            maxWidth: 360,
          }}
        >
          {this.state.error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={this.reset}
          style={{
            padding: "8px 20px",
            background: "var(--color-brand)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: "var(--text-sm)",
            cursor: "pointer",
            letterSpacing: "0.5px",
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
