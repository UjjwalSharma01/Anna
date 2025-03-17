import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';

// Make sure Bootstrap CSS is loaded before your custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// Disable websocket connections in GitHub Codespace environment
// This prevents WebSocket errors in GitHub.dev environment
const disableWebSocket = () => {
  try {
    // Completely override WebSocket to prevent connections
    window.WebSocket = function MockWebSocket() {
      console.log('[DISABLED] WebSocket connection attempt blocked');
      this.addEventListener = () => {};
      this.removeEventListener = () => {};
      this.send = () => {};
      this.close = () => {};
      
      // Return dummy event handlers
      setTimeout(() => {
        if (typeof this.onclose === 'function') {
          this.onclose({ code: 1006, reason: 'WebSocket connections disabled' });
        }
      }, 0);
      return this;
    };
    
    // Ensure the mock has required WebSocket properties
    window.WebSocket.CONNECTING = 0;
    window.WebSocket.OPEN = 1;
    window.WebSocket.CLOSING = 2;
    window.WebSocket.CLOSED = 3;
    
    console.log('WebSocket connections have been disabled');
  } catch (err) {
    console.error('Failed to disable WebSocket:', err);
  }
};

// Execute WebSocket disabling
disableWebSocket();

// Error boundary for the entire application
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4>Something went wrong</h4>
            <p>The application encountered an error. Please refresh the page.</p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
