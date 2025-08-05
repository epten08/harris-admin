import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'teal';
  trend?: string;
  subtitle?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  trend,
  subtitle,
  onClick 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-100',
      light: 'bg-blue-50',
      accent: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-100',
      light: 'bg-green-50',
      accent: 'text-green-600'
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-100',
      light: 'bg-yellow-50',
      accent: 'text-yellow-600'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-100',
      light: 'bg-red-50',
      accent: 'text-red-600'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-100',
      light: 'bg-purple-50',
      accent: 'text-purple-600'
    },
    teal: {
      bg: 'bg-teal-500',
      text: 'text-teal-100',
      light: 'bg-teal-50',
      accent: 'text-teal-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 
        ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}
        card-hover
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          
          <div className="flex items-center space-x-2">
            {change && (
              <div className={`flex items-center text-sm ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.type === 'increase' ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                )}
                {change.value}
              </div>
            )}
            
            {trend && !change && (
              <div className="text-sm text-gray-500">
                {trend}
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-3 rounded-full ${colors.bg} ${colors.text} shadow-lg`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
      
      {/* Optional progress bar */}
      {trend && trend.includes('%') && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{trend}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`${colors.bg} h-1.5 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: trend }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCard;