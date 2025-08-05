import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchBookings, selectBookings } from '../../store/slices/bookingSlice';
import { addNotification } from '../../store/slices/uiSlice';
import StatsCard from './StatsCard';
import RecentBookings from './RecentBookings';
import QuickActions from './QuickActions';
import OccupancyChart from './charts/OccupancyChart';
import RevenueChart from './charts/RevenueChart';
import {
  BuildingOfficeIcon,
  CalendarDaysIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector(selectBookings);

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchBookings({ page: 1 }));
  }, [dispatch]);

  // Mock data - replace with real API calls
  const stats = [
    {
      title: 'Total Lodges',
      value: '12',
      change: { value: '+2 this month', type: 'increase' as const },
      icon: BuildingOfficeIcon,
      color: 'blue' as const,
      trend: '+16.7%'
    },
    {
      title: 'Active Bookings',
      value: '48',
      change: { value: '+12% vs last month', type: 'increase' as const },
      icon: CalendarDaysIcon,
      color: 'green' as const,
      trend: '+12.3%'
    },
    {
      title: 'Total Customers',
      value: '1,247',
      change: { value: '+5.2%', type: 'increase' as const },
      icon: UsersIcon,
      color: 'purple' as const,
      trend: '+5.2%'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,580',
      change: { value: '+18.3%', type: 'increase' as const },
      icon: CurrencyDollarIcon,
      color: 'green' as const,
      trend: '+18.3%'
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      change: { value: '+3.1%', type: 'increase' as const },
      icon: ChartBarIcon,
      color: 'yellow' as const,
      trend: '+3.1%'
    },
    {
      title: 'Average Daily Rate',
      value: '$125',
      change: { value: '+8.5%', type: 'increase' as const },
      icon: ArrowTrendingUpIcon,
      color: 'blue' as const,
      trend: '+8.5%'
    }
  ];

  const handleQuickAction = (action: string) => {
    dispatch(addNotification({
      type: 'info',
      message: `${action} feature will be available soon!`
    }));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Harris Lodges Admin</h1>
            <p className="text-blue-100">
              Monitor your lodge operations, track bookings, and manage your business efficiently.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">Today</div>
              <div className="text-sm opacity-90">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Rate</h3>
          <OccupancyChart />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <RevenueChart />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <RecentBookings bookings={bookings.slice(0, 5)} />
        </div>

        {/* Today's Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Check-ins</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Check-outs</p>
                <p className="text-2xl font-bold text-green-600">6</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-green-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-900">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <ClockIcon className="w-8 h-8 text-yellow-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Revenue</p>
                <p className="text-xl font-bold text-purple-600">$2,450</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
            <div className="text-sm text-gray-600">Customer Satisfaction</div>
            <div className="mt-2 bg-blue-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
            <div className="text-sm text-gray-600">On-time Check-ins</div>
            <div className="mt-2 bg-green-100 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="mt-2 flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Staff Members</div>
            <div className="mt-2 text-xs text-gray-500">All active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;