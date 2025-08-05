import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../hooks/redux';
import { selectAuthError, selectAuthLoading } from '../store/slices/authSlice';
import AuthLayout from '../components/auth/AuthLayout';
import AuthErrorBoundary from '../components/auth/AuthErrorBoundary';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type AuthView = 'login' | 'forgot';

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [viewTransition, setViewTransition] = useState(false);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    // Simulate initial page load with realistic timing
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = (newView: AuthView) => {
    setViewTransition(true);
    setTimeout(() => {
      setCurrentView(newView);
      setViewTransition(false);
    }, 200);
  };

  if (isPageLoading) {
    return (
      <AuthLayout>
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <LoadingSpinner size="xl" color="blue" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading authentication system...</p>
        </div>
      </AuthLayout>
    );
  }

  const renderCurrentView = () => {
    const viewProps = {
      isLoading,
      error,
    };

    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            {...viewProps}
            onForgotPassword={() => handleViewChange('forgot')}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm 
            {...viewProps}
            onBackToLogin={() => handleViewChange('login')}
          />
        );
      default:
        return (
          <LoginForm 
            {...viewProps}
            onForgotPassword={() => handleViewChange('forgot')}
          />
        );
    }
  };

  return (
    <AuthErrorBoundary>
      <AuthLayout>
        <div className={`transition-all duration-200 ${viewTransition ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          {renderCurrentView()}
        </div>
      </AuthLayout>
    </AuthErrorBoundary>
  );
};

export default AuthPage;