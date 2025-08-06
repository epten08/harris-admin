import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLodges } from '../../hooks/useLodges';
import StatsCard from './StatsCard';
import {
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const MaintenanceDashboard: React.FC = () => {
  const { assignedLodges } = useAuth();
  const { lodges } = useLodges();

  const accessibleLodges = lodges.filter(lodge => assignedLodges.includes(lodge.id));

  const stats = [
    {
      title: 'Open Work Orders',
      value: '7',
      change: { value: '+2 since yesterday', type: 'increase' as const },
      icon: WrenchScrewdriverIcon,
      color: 'red' as const
    },
    {
      title: 'Completed Today',
      value: '12',
      icon: CheckCircleIcon,
      color: 'green' as const
    },
    {
      title: 'Emergency Requests',
      value: '2',
      icon: ExclamationTriangleIcon,
      color: 'red' as const
    },
    {
      title: 'Scheduled Tasks',
      value: '15',
      icon: ClockIcon,
      color: 'blue' as const
    }
  ];

  const maintenanceRequests = [
    {
      id: '1',
      room: 'Room 205',
      lodge: 'Victoria Falls Lodge',
      issue: 'Air conditioning not working',
      priority: 'high',
      reportedAt: '2 hours ago',
      estimatedTime: '3 hours'
    },
    {
      id: '2',
      room: 'Suite 301',
      lodge: 'Victoria Falls Lodge',
      issue: 'Bathroom faucet leaking',
      priority: 'medium',
      reportedAt: '4 hours ago',
      estimatedTime: '1 hour'
    },
    {
      id: '3',
      room: 'Conference Room A',
      lodge: 'Victoria Falls Lodge',
      issue: 'Projector bulb replacement',
      priority: 'low',
      reportedAt: '1 day ago',
      estimatedTime: '30 minutes'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Maintenance Welcome */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Maintenance Dashboard</h1>
        <p className="text-orange-100">
          Track and manage maintenance requests across your assigned properties.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Requests */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Maintenance Requests</h3>
          
          <div className="space-y-4">
            {maintenanceRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <WrenchScrewdriverIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{request.room}</h4>
                      <p className="text-sm text-gray-600">{request.lodge}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{request.issue}</p>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Reported: {request.reportedAt}</span>
                  <span>Est. time: {request.estimatedTime}</span>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Start Work
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools & Quick Actions */}
        <div className="space-y-6">
          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Inventory</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Power Drill</span>
                <span className="text-sm font-medium text-green-600">Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wrench Set</span>
                <span className="text-sm font-medium text-green-600">Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Electrical Tester</span>
                <span className="text-sm font-medium text-yellow-600">In Use</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Plumbing Kit</span>
                <span className="text-sm font-medium text-red-600">Needs Restock</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium text-orange-900">Report Emergency</span>
              </button>
              <button className="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <ListBulletIcon className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-900">Submit Report</span>
              </button>
              <button className="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-green-900">Mark Complete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;