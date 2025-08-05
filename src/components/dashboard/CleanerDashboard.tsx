import React from 'react';
import StatsCard from './StatsCard';
import {
  HomeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ListBulletIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CleanerDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Rooms to Clean',
      value: '12',
      icon: HomeIcon,
      color: 'blue' as const
    },
    {
      title: 'Completed Today',
      value: '8',
      icon: CheckCircleIcon,
      color: 'green' as const
    },
    {
      title: 'In Progress',
      value: '3',
      icon: ClockIcon,
      color: 'yellow' as const
    },
    {
      title: 'Priority Tasks',
      value: '2',
      icon: ExclamationTriangleIcon,
      color: 'red' as const
    }
  ];

  const cleaningTasks = [
    {
      id: '1',
      room: 'Room 205',
      type: 'Check-out Cleaning',
      priority: 'high',
      estimatedTime: '45 min',
      status: 'pending',
      notes: 'Guest checked out at 11 AM. Deep clean required.'
    },
    {
      id: '2',
      room: 'Suite 101',
      type: 'Maintenance Clean',
      priority: 'medium',
      estimatedTime: '30 min',
      status: 'in-progress',
      notes: 'Bathroom fixtures need attention.'
    },
    {
      id: '3',
      room: 'Room 301',
      type: 'Pre-arrival Clean',
      priority: 'high',
      estimatedTime: '40 min',
      status: 'pending',
      notes: 'VIP guest arriving at 3 PM.'
    },
    {
      id: '4',
      room: 'Room 108',
      type: 'Regular Clean',
      priority: 'low',
      estimatedTime: '25 min',
      status: 'completed',
      notes: 'Routine cleaning completed.'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Cleaner Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Housekeeping Dashboard</h1>
        <p className="text-teal-100">
          Your daily cleaning schedule and room maintenance tasks.
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
        {/* Cleaning Tasks */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today's Cleaning Tasks</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {cleaningTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <SparklesIcon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{task.room}</h4>
                      <p className="text-sm text-gray-600">{task.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Est. time: {task.estimatedTime}</span>
                  {task.status === 'pending' && (
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Start Task
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button className="text-green-600 hover:text-green-800 font-medium">
                      Mark Complete
                    </button>
                  )}
                </div>
                
                {task.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                    {task.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cleaning Supplies & Tools */}
        <div className="space-y-6">
          {/* Supply Checklist */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" checked className="rounded border-gray-300 text-teal-600 mr-3" />
                  <span className="text-sm text-gray-700">All-purpose cleaner</span>
                </div>
                <span className="text-xs text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" checked className="rounded border-gray-300 text-teal-600 mr-3" />
                  <span className="text-sm text-gray-700">Fresh towels</span>
                </div>
                <span className="text-xs text-green-600">✓</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 mr-3" />
                  <span className="text-sm text-gray-700">Vacuum cleaner</span>
                </div>
                <span className="text-xs text-yellow-600">Low battery</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 mr-3" />
                  <span className="text-sm text-gray-700">Toilet paper</span>
                </div>
                <span className="text-xs text-red-600">Low stock</span>
              </div>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-xs text-green-700">Completed</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <div className="text-xs text-blue-700">Remaining</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                <ListBulletIcon className="w-5 h-5 text-teal-600 mr-3" />
                <span className="text-sm font-medium text-teal-900">Report Issue</span>
              </button>
              <button className="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <ExclamationTriangleIcon className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-900">Request Supplies</span>
              </button>
              <button className="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <ClockIcon className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-purple-900">Log Break</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanerDashboard;