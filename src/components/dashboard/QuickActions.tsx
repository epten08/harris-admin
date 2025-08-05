import React from 'react';
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'add-lodge',
      name: 'Add Lodge',
      icon: BuildingOfficeIcon,
      color: 'blue',
      description: 'Register new lodge'
    },
    {
      id: 'new-booking',
      name: 'New Booking',
      icon: CalendarDaysIcon,
      color: 'green',
      description: 'Create reservation'
    },
    {
      id: 'add-staff',
      name: 'Add Staff',
      icon: UsersIcon,
      color: 'purple',
      description: 'Register new employee'
    },
    {
      id: 'generate-report',
      name: 'Generate Report',
      icon: ChartBarIcon,
      color: 'yellow',
      description: 'Create analytics report'
    },
    {
      id: 'view-revenue',
      name: 'View Revenue',
      icon: CurrencyDollarIcon,
      color: 'green',
      description: 'Check financial data'
    },
    {
      id: 'create-invoice',
      name: 'Create Invoice',
      icon: DocumentTextIcon,
      color: 'red',
      description: 'Generate new invoice'
    },
    {
      id: 'view-all-bookings',
      name: 'All Bookings',
      icon: EyeIcon,
      color: 'gray',
      description: 'View all reservations'
    },
    {
      id: 'quick-checkin',
      name: 'Quick Check-in',
      icon: PlusIcon,
      color: 'blue',
      description: 'Walk-in registration'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200',
      gray: 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <span className="text-sm text-gray-500">Click to perform common tasks</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.name)}
              className={`
                p-4 rounded-lg text-center transition-all duration-200 transform hover:scale-105 border
                ${getColorClasses(action.color)}
              `}
            >
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-medium mb-1">{action.name}</div>
              <div className="text-xs opacity-70">{action.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;