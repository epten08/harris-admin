import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { useAuth } from '../../hooks/useAuth';
import { useLodges } from '../../hooks/useLodges';
import { useStaff } from '../../hooks/useStaff';
import { selectBookings } from '../../store/slices/bookingSlice';
import StatsCard from './StatsCard';
import {
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const SupervisorDashboard: React.FC = () => {
  const { assignedLodges, user } = useAuth();
  const { lodges } = useLodges();
  const { staff } = useStaff();
  const bookings = useAppSelector(selectBookings);
  const [selectedLodge, setSelectedLodge] = useState<string>('all');

  // Filter data by assigned lodges
  const accessibleLodges = lodges.filter(lodge => assignedLodges.includes(lodge.id));
  const accessibleStaff = staff.filter(staffMember => 
    staffMember.assignedLodges.some(lodgeId => assignedLodges.includes(lodgeId)) ||
    staffMember.supervisor === user?.id
  );

  // Calculate stats for assigned lodges
  const totalRooms = accessibleLodges.reduce((sum, lodge) => sum + lodge.totalRooms, 0);
  const availableRooms = accessibleLodges.reduce((sum, lodge) => sum + lodge.availableRooms, 0);
  const occupiedRooms = totalRooms - availableRooms;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

  const stats = [
    {
      title: 'Assigned Lodges',
      value: accessibleLodges.length.toString(),
      icon: BuildingOfficeIcon,
      color: 'blue' as const,
      subtitle: `Managing ${accessibleLodges.length} properties`
    },
    {
      title: 'Team Members',
      value: accessibleStaff.length.toString(),
      icon: UsersIcon,
      color: 'purple' as const,
      subtitle: 'Under your supervision'
    },
    {
      title: 'Total Rooms',
      value: totalRooms.toString(),
      icon: BuildingOfficeIcon,
      color: 'green' as const,
      subtitle: 'Across all assigned lodges'
    },
    {
      title: 'Occupancy Rate',
      value: `${Math.round(occupancyRate)}%`,
      change: { value: '+5% vs last week', type: 'increase' as const },
      icon: ChartBarIcon,
      color: 'yellow' as const
    },
    {
      title: 'Available Rooms',
      value: availableRooms.toString(),
      icon: CheckCircleIcon,
      color: 'green' as const,
      subtitle: 'Ready for guests'
    },
    {
      title: 'Daily Revenue',
      value: '$3,450',
      change: { value: '+12% vs yesterday', type: 'increase' as const },
      icon: CurrencyDollarIcon,
      color: 'green' as const
    }
  ];

  // Today's tasks and priorities
  const todayTasks = [
    {
      id: '1',
      type: 'maintenance',
      title: 'Room 205 AC Repair',
      lodge: 'Victoria Falls Lodge',
      priority: 'high',
      assignedTo: 'Lisa Maintenance',
      dueTime: '2:00 PM'
    },
    {
      id: '2',
      type: 'cleaning',
      title: 'Presidential Suite Deep Clean',
      lodge: 'Victoria Falls Lodge',
      priority: 'medium',
      assignedTo: 'Tom Cleaner',
      dueTime: '4:00 PM'
    },
    {
      id: '3',
      type: 'inspection',
      title: 'Weekly Safety Check',
      lodge: 'Hwange Safari Lodge',
      priority: 'medium',
      assignedTo: 'Mike Supervisor',
      dueTime: '5:00 PM'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Supervisor Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
            <p className="text-indigo-100">
              Oversee operations across {accessibleLodges.length} lodge{accessibleLodges.length !== 1 ? 's' : ''} and manage your team of {accessibleStaff.length} staff members.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">Today</div>
              <div className="text-sm opacity-90">{new Date().toLocaleDateString()}</div>
              <div className="text-xs mt-1">{todayTasks.length} tasks pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lodge Selector */}
      {accessibleLodges.length > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            View data for:
          </label>
          <select
            value={selectedLodge}
            onChange={(e) => setSelectedLodge(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Assigned Lodges</option>
            {accessibleLodges.map(lodge => (
              <option key={lodge.id} value={lodge.id}>{lodge.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Operations Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today's Priority Tasks</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
              View All Tasks
            </button>
          </div>
          
          <div className="space-y-4">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    task.type === 'maintenance' ? 'bg-red-100' :
                    task.type === 'cleaning' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {task.type === 'maintenance' ? (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    ) : task.type === 'cleaning' ? (
                      <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                    ) : (
                      <ClockIcon className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.lodge}</p>
                    <p className="text-xs text-gray-500">Assigned to: {task.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-500">{task.dueTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Status & Quick Actions */}
        <div className="space-y-6">
          {/* Team Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">On Duty</p>
                  <p className="text-xs text-green-700">Currently working</p>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {accessibleStaff.filter(s => s.isActive).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-900">On Break</p>
                  <p className="text-xs text-yellow-700">Scheduled breaks</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Off Duty</p>
                  <p className="text-xs text-blue-700">End of shift</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <CalendarDaysIcon className="w-5 h-5 text-indigo-600 mr-3" />
                <span className="text-sm font-medium text-indigo-900">Schedule Staff</span>
              </button>
              <button className="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-green-900">Assign Tasks</span>
              </button>
              <button className="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <UsersIcon className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-purple-900">Team Meeting</span>
              </button>
              <button className="w-full flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-sm font-medium text-red-900">Report Issue</span>
              </button>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Team Efficiency</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Task Completion</span>
                  <span className="font-medium">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Guest Satisfaction</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lodge Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Lodge Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleLodges.map(lodge => (
            <div key={lodge.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{lodge.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  lodge.occupancyRate > 80 ? 'bg-green-100 text-green-800' :
                  lodge.occupancyRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {Math.round(lodge.occupancyRate)}% occupied
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Rooms</p>
                  <p className="font-semibold">{lodge.totalRooms}</p>
                </div>
                <div>
                  <p className="text-gray-600">Available</p>
                  <p className="font-semibold text-green-600">{lodge.availableRooms}</p>
                </div>
                <div>
                  <p className="text-gray-600">Rating</p>
                  <p className="font-semibold">{lodge.rating}/5</p>
                </div>
                <div>
                  <p className="text-gray-600">Staff</p>
                  <p className="font-semibold">
                    {staff.filter(s => s.assignedLodges.includes(lodge.id)).length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;