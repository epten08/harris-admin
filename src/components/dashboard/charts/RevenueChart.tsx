import React from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const RevenueChart: React.FC = () => {
  // Mock data for the last 6 months
  const data = [
    { month: 'Feb', revenue: 18500 },
    { month: 'Mar', revenue: 22300 },
    { month: 'Apr', revenue: 19800 },
    { month: 'May', revenue: 25600 },
    { month: 'Jun', revenue: 28900 },
    { month: 'Jul', revenue: 24580 }
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];
  const growth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            ${currentMonth.revenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">This month</div>
        </div>
        <div className="flex items-center text-green-600">
          <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+{growth}%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.month} className="flex items-center space-x-3">
            <div className="w-8 text-sm text-gray-600">{item.month}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  index === data.length - 1 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                }`}
                style={{ 
                  width: `${(item.revenue / maxRevenue) * 100}%`,
                  transitionDelay: `${index * 100}ms`
                }}
              />
            </div>
            <div className="w-16 text-sm font-medium text-gray-900 text-right">
              ${(item.revenue / 1000).toFixed(0)}k
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;