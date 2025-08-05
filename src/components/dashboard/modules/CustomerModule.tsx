import React from 'react';
import { CalendarDaysIcon, PlusIcon } from '@heroicons/react/24/outline';

const CustomerModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers Management</h1>
          <p className="text-gray-600">View and manage all reservations</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          New Booking
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <CalendarDaysIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Bookings Dashboard</h3>
        <p className="text-gray-600">This module will contain booking management features.</p>
      </div>
    </div>
  );
};

export default CustomerModule;