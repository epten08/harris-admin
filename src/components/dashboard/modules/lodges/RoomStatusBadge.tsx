import React from 'react';
import { type Room } from '../../../../store/slices/lodgeSlice';

interface RoomStatusBadgeProps {
  status: Room['status'];
  size?: 'sm' | 'md' | 'lg';
}

const RoomStatusBadge: React.FC<RoomStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStatusConfig = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Available',
          icon: '●'
        };
      case 'occupied':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Occupied',
          icon: '●'
        };
      case 'maintenance':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Maintenance',
          icon: '🔧'
        };
      case 'out_of_order':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Out of Order',
          icon: '⚠️'
        };
      case 'cleaning':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Cleaning',
          icon: '🧹'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Unknown',
          icon: '●'
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}>
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default RoomStatusBadge;