import React from 'react';
import { useLodges } from '../../../../hooks/useLodges';
import StatsCard from '../../StatsCard';
import {
  BuildingOfficeIcon,
  HomeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const LodgesStats: React.FC = () => {
  const { getOccupancyStats, roomStatuses } = useLodges();
  const stats = getOccupancyStats();

  const statsCards = [
    {
      title: 'Total Lodges',
      value: stats.totalLodges.toString(),
      subtitle: `${stats.activeLodges} active`,
      icon: BuildingOfficeIcon,
      color: 'blue' as const
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms.toString(),
      subtitle: 'All properties',
      icon: HomeIcon,
      color: 'purple' as const
    },
    {
      title: 'Available Rooms',
      value: stats.availableRooms.toString(),
      change: { 
        value: `${Math.round((stats.availableRooms / stats.totalRooms) * 100)}% of total`, 
        type: 'increase' as const 
      },
      icon: CheckCircleIcon,
      color: 'green' as const
    },
    {
      title: 'Occupied Rooms',
      value: stats.occupiedRooms.toString(),
      subtitle: 'Currently booked',
      icon: HomeIcon,
      color: 'yellow' as const
    },
    {
      title: 'Occupancy Rate',
      value: `${stats.occupancyRate}%`,
      change: {
        value: '+2.5% vs last week',
        type: 'increase' as const
      },
      icon: ChartBarIcon,
      color: 'blue' as const
    },
    {
      title: 'Maintenance',
      value: (stats.maintenanceRooms + stats.outOfOrderRooms).toString(),
      subtitle: `${stats.maintenanceRooms} maintenance, ${stats.outOfOrderRooms} out of order`,
      icon: ExclamationTriangleIcon,
      color: 'red' as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default LodgesStats;