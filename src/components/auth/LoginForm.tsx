import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/redux';
import { addNotification } from '../../store/slices/uiSlice';
import { clearError } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormProps {
  onForgotPassword: () => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, isLoading, error }) => {
  const { login } = useAuth();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Demo credentials for quick access
  const demoCredentials = [
    { role: 'Admin', email: 'admin@harrislodges.com', password: 'admin123' },
    { role: 'Manager', email: 'manager@harrislodges.com', password: 'manager123' },
    { role: 'Receptionist', email: 'reception@harrislodges.com', password: 'reception123' },
    { role: 'Cleaner', email: 'cleaner@harrislodges.com', password: 'cleaner123' }
  ];

  useEffect(() => {
    // Clear Redux error when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Clear form errors when Redux error changes
    if (error) {
      setFormErrors({});
    }
  }, [error]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      dispatch(addNotification({
        type: 'success',
        message: `Welcome back! You've successfully logged in.`
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleDemoLogin = (credentials: { email: string; password: string }) => {
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password
    }));
  };

  const getFieldError = (field: string) => {
    return touched[field] ? formErrors[field] : '';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your admin account</p>
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
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              className="pl-10"
              error={getFieldError('email')}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              className="pl-10 pr-10"
              error={getFieldError('password')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        {/* Demo credentials section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-3">Quick Demo Access:</p>
          <div className="grid grid-cols-2 gap-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDemoLogin(cred)}
                className="p-2 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                <div className="font-medium text-gray-700">{cred.role}</div>
                <div className="text-gray-500 truncate">{cred.email}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click any role above to auto-fill login credentials
          </p>
        </div>

        {/* Security notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your connection is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;