import React from 'react';
import { BuildingOfficeIcon, PlusIcon } from '@heroicons/react/24/outline';

const LodgesModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lodges & Rooms</h1>
          <p className="text-gray-600">Manage your lodges, rooms, and facilities</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Lodge
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Lodges Management</h3>
        <p className="text-gray-600">This module will contain lodge and room management features.</p>
      </div>
    </div>
  );
};

export default LodgesModule;