import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { selectBookings } from '../../store/slices/bookingSlice';
import StatsCard from './StatsCard';
import {
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ReceptionistDashboard: React.FC = () => {
  const bookings = useAppSelector(selectBookings);

  const stats = [
    {
      title: 'Today\'s Check-ins',
      value: '8',
      icon: CalendarDaysIcon,
      color: 'blue' as const
    },
    {
      title: 'Today\'s Check-outs',
      value: '6',
      icon: ClockIcon,
      color: 'green' as const
    },
    {
      title: 'Pending Bookings',
      value: '12',
      icon: UsersIcon,
      color: 'yellow' as const
    },
    {
      title: 'Available Rooms',
      value: '23',
      icon: CheckCircleIcon,
      color: 'green' as const
    }
  ];

  // Mock today's schedule data
  const todaySchedule = [
    {
      id: '1',
      type: 'check-in',
      guestName: 'John Smith',
      room: 'Suite 101',
      time: '2:00 PM',
      status: 'confirmed'
    },
    {
      id: '2',
      type: 'check-out',
      guestName: 'Sarah Johnson',
      room: 'Room 205',
      time: '11:00 AM',
      status: 'completed'
    },
    {
      id: '3',
      type: 'check-in',
      guestName: 'Mike Wilson',
      room: 'Room 301',
      time: '3:30 PM',
      status: 'pending'
    },
    {
      id: '4',
      type: 'check-out',
      guestName: 'Lisa Brown',
      room: 'Suite 202',
      time: '10:30 AM',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'check-in' ? 'text-blue-600' : 'text-green-600';
  };

  return (
    <div className="space-y-8">
      {/* Receptionist Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Front Desk Dashboard</h1>
        <p className="text-green-100">
          Manage guest check-ins, check-outs, and provide excellent customer service.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <div className="space-y-4">
            {todaySchedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${item.type === 'check-in' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {item.type === 'check-in' ? (
                      <CalendarDaysIcon className={`w-5 h-5 ${getTypeColor(item.type)}`} />
                    ) : (
                      <ClockIcon className={`w-5 h-5 ${getTypeColor(item.type)}`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.guestName}</p>
                    <p className="text-sm text-gray-600">{item.room} • {item.time}</p>
                    <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <DocumentTextIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Room Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <CalendarDaysIcon className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-blue-900">New Booking</span>
              </button>
              <button className="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-green-900">Walk-in Check-in</span>
              </button>
              <button className="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <UsersIcon className="w-5 h-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-purple-900">Guest Lookup</span>
              </button>
              <button className="w-full flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <PhoneIcon className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-yellow-900">Phone Inquiry</span>
              </button>
            </div>
          </div>

          {/* Room Status Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Available</p>
                  <p className="text-xs text-green-700">Ready for guests</p>
                </div>
                <span className="text-2xl font-bold text-green-600">23</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Occupied</p>
                  <p className="text-xs text-blue-700">Current guests</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">28</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Maintenance</p>
                  <p className="text-xs text-yellow-700">Being serviced</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-900">Out of Order</p>
                  <p className="text-xs text-red-700">Needs attention</p>
                </div>
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Guest Messages */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Guest Messages</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">Room 205 - Sarah Johnson</p>
                <span className="text-xs text-gray-500">10 min ago</span>
              </div>
              <p className="text-sm text-gray-600">Extra towels requested for tonight. Please deliver before 8 PM.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-gray-900">Suite 101 - John Smith</p>
                <span className="text-xs text-gray-500">25 min ago</span>
              </div>
              <p className="text-sm text-gray-600">Late checkout request until 2 PM. Willing to pay additional fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;