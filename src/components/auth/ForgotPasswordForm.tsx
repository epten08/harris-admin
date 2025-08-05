import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/redux';
import { addNotification } from '../../store/slices/uiSlice';
import { clearError } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ 
  onBackToLogin, 
  isLoading, 
  error 
}) => {
  const { resetPassword } = useAuth();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      setSuccess(true);
      dispatch(addNotification({
        type: 'success',
        message: 'Password reset instructions sent to your email'
      }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (touched && emailError) {
      setEmailError(validateEmail(e.target.value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setEmailError(validateEmail(email));
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              We've sent password reset instructions to:
            </p>
            <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-lg break-all">
              {email}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Didn't receive the email?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Contact support if you still need help</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={onBackToLogin} 
              variant="primary" 
              className="w-full"
            >
              Back to Login
            </Button>
            
            <Button 
              onClick={() => {
                setSuccess(false);
                setEmail('');
                setTouched(false);
                setEmailError('');
              }} 
              variant="outline" 
              className="w-full"
            >
              Try Different Email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8">
        <button
          onClick={onBackToLogin}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <LockClosedIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              className="pl-10"
              error={touched ? emailError : ''}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !!emailError}
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send Reset Instructions'
            )}
          </Button>
        </form>

        {/* Help section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Need help?</h3>
          <p className="text-xs text-gray-600 mb-2">
            If you're having trouble accessing your account, please contact your system administrator or IT support.
          </p>
          <div className="text-xs text-gray-500">
            <p>📧 support@harrislodges.com</p>
            <p>📞 +263 4 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;