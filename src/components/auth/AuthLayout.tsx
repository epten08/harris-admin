import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = "Harris Lodges",
  subtitle = "Admin Dashboard"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-white bg-opacity-5 rounded-full animate-bounce delay-2000"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/2 left-10 w-8 h-8 bg-white bg-opacity-5 rounded-full animate-ping delay-3000"></div>
        <div className="absolute top-1/4 right-1/4 w-6 h-6 bg-white bg-opacity-10 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-white bg-opacity-5 rounded-full animate-bounce delay-2500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm border border-white border-opacity-30">
              <svg 
                className="w-14 h-14 text-white drop-shadow-lg" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
              {title}
            </h1>
            <p className="text-blue-100 text-lg font-medium">{subtitle}</p>
            
            {/* Animated underline */}
            <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-pulse"></div>
          </div>

          {/* Auth form container */}
          <div className="transition-all duration-500 ease-in-out transform hover:scale-105">
            {children}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-blue-100 text-sm">
              &copy; 2025 Harris Lodges. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-4 text-blue-200 text-xs">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>

      {/* Additional CSS for grid pattern - add to your global CSS */}
      <style >{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;