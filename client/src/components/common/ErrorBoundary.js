// src/components/common/ErrorBoundary.js
import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
    window.location.reload(); // সরাসরি পেজ রিলোড করুন
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/'; // সরাসরি হোম পেজে রিডাইরেক্ট করুন
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Result
            status="500"
            title="Oops! Something went wrong"
            subTitle={
              this.state.error ? (
                <details style={{ whiteSpace: 'pre-wrap', margin: '20px 0' }}>
                  <summary>Error Details</summary>
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </details>
              ) : null
            }
            extra={[
              <Button 
                type="primary" 
                key="console" 
                onClick={this.handleReset}
              >
                Try Again
              </Button>,
              <Button 
                key="home" 
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
            ]}
          />
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;