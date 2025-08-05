import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error while loading the authentication system. 
              Please try refreshing the page.
            </p>
            
            {/* {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <p className="text-sm font-medium text-red-800 mb-2">Error Details:</p>
                <p className="text-xs text-red-600 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )} */}
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                variant="primary"
                className="w-full"
              >
                Refresh Page
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;