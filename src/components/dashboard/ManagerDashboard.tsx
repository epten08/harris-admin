import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { selectBookings } from '../../store/slices/bookingSlice';
import StatsCard from './StatsCard';
import RecentBookings from './RecentBookings';
import {
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ManagerDashboard: React.FC = () => {
  const bookings = useAppSelector(selectBookings);

  const stats = [
    {
      title: 'Today\'s Revenue',
      value: '$2,450',
      change: { value: '+15% vs yesterday', type: 'increase' as const },
      icon: CurrencyDollarIcon,
      color: 'green' as const
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: { value: '+5% vs last week', type: 'increase' as const },
      icon: ChartBarIcon,
      color: 'blue' as const
    },
    {
      title: 'Active Bookings',
      value: '48',
      change: { value: '+8 new today', type: 'increase' as const },
      icon: CalendarDaysIcon,
      color: 'purple' as const
    },
    {
      title: 'Staff on Duty',
      value: '8',
      icon: UsersIcon,
      color: 'yellow' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Manager Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
        <p className="text-purple-100">
          Overview of daily operations and key performance indicators.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookings bookings={bookings.slice(0, 8)} />
        </div>

        <div className="space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Morning Shift</p>
                  <p className="text-sm text-blue-700">6:00 AM - 2:00 PM</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">4 Staff</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Evening Shift</p>
                  <p className="text-sm text-green-700">2:00 PM - 10:00 PM</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">3 Staff</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Night Shift</p>
                  <p className="text-sm text-gray-700">10:00 PM - 6:00 AM</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">1 Staff</span>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <ClockIcon className="w-5 h-5 text-yellow-500 mr-3" />
                <div>
                  <p className="font-medium text-yellow-900">Room 205 Maintenance</p>
                  <p className="text-sm text-yellow-700">Due in 2 hours</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <ClockIcon className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <p className="font-medium text-red-900">Inventory Check</p>
                  <p className="text-sm text-red-700">Overdue by 1 day</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <ClockIcon className="w-5 h-5 text-blue-500 mr-3" />
                <div>
                  <p className="font-medium text-blue-900">Staff Meeting</p>
                  <p className="text-sm text-blue-700">Tomorrow 9:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Managers */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <CalendarDaysIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-900">View Schedule</span>
          </button>
          <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
            <UsersIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-900">Staff Management</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <ChartBarIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-900">Reports</span>
          </button>
          <button className="p-4 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100 transition-colors">
            <CurrencyDollarIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-yellow-900">Revenue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;