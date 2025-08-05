import React from 'react';

const OccupancyChart: React.FC = () => {
  // Mock data for the last 7 days
  const data = [
    { day: 'Mon', occupancy: 75 },
    { day: 'Tue', occupancy: 82 },
    { day: 'Wed', occupancy: 68 },
    { day: 'Thu', occupancy: 91 },
    { day: 'Fri', occupancy: 88 },
    { day: 'Sat', occupancy: 95 },
    { day: 'Sun', occupancy: 73 }
  ];

  const maxOccupancy = Math.max(...data.map(d => d.occupancy));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">78%</div>
          <div className="text-sm text-gray-600">Average this week</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-green-600">+3.2%</div>
          <div className="text-xs text-gray-500">vs last week</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.day} className="flex items-center space-x-3">
            <div className="w-8 text-sm text-gray-600">{item.day}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(item.occupancy / maxOccupancy) * 100}%` }}
              />
            </div>
            <div className="w-10 text-sm font-medium text-gray-900 text-right">
              {item.occupancy}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccupancyChart;