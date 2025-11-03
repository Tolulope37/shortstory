import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You could also log the error to an analytics or error reporting service
  }

  handleRetry = () => {
    // Reset the error state and try again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Execute an optional retry callback if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  }

  render() {
    const { fallback } = this.props;
    
    if (this.state.hasError) {
      // Display the custom fallback UI if provided
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.handleRetry)
          : fallback;
      }
      
      // Otherwise, show default error UI
      return (
        <div 
          style={{ 
            margin: '20px',
            padding: '20px', 
            borderRadius: '8px',
            backgroundColor: '#fff0f0', 
            border: '1px solid #ffcccb',
            color: '#d8000c'
          }}
        >
          <h2>Something went wrong</h2>
          <p>We apologize for the inconvenience. The error has been logged.</p>
          <button 
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              marginTop: '12px',
              backgroundColor: '#d8000c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
          
          {this.props.showDetails && (
            <details style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
              <summary>Error Details</summary>
              <p>{this.state.error && this.state.error.toString()}</p>
              <p>Component Stack:</p>
              <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    // Render children if there's no error
    return this.props.children;
  }
}

export default ErrorBoundary; 