import { Component } from "react";
// catch JavaScript errors anywhere in child component tree, log the error, display a fallback
class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    // Update state to indicate an error occurred
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback on error
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>Try refreshing the page.</p>
          {this.state.error && (
            <details style={{ whiteSpace: "pre-wrap" }}>
              <summary>Error details (click to expand)</summary>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
