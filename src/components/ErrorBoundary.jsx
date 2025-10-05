import { Component } from "react";
//This component will catch JavaScript errors anywhere in its child component tree, log the error, and display a fallback UI (e.g., an error message)
class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    // Update state to indicate an error occurred
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console (you can also send it to an error tracking service)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
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
