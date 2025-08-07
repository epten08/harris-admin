import React from 'react';
import { useBookings } from '../../../../hooks/useBookings';
import StatsCard from '../../StatsCard';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const BookingsStats: React.FC = () => {
  const { bookings } = useBookings();

  const calculateStats = () => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const checkedIn = bookings.filter(b => b.status === 'checked_in').length;
    const checkedOut = bookings.filter(b => b.status === 'checked_out').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    const totalRevenue = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.amount, 0);
    
    const avgBookingValue = total > 0 ? totalRevenue / (total - cancelled) : 0;

    // Today's check-ins/outs
    const today = new Date().toDateString();
    const todayCheckIns = bookings.filter(b => 
      new Date(b.checkIn).toDateString() === today && b.status === 'confirmed'
    ).length;
    const todayCheckOuts = bookings.filter(b => 
      new Date(b.checkOut).toDateString() === today && b.status === 'checked_in'
    ).length;

    return {
      total,
      confirmed,
      pending,
      checkedIn,
      checkedOut,
      cancelled,
      totalRevenue,
      avgBookingValue,
      todayCheckIns,
      todayCheckOuts
    };
  };

  const stats = calculateStats();

  const statsCards = [
    {
      title: 'Total Bookings',
      value: stats.total.toString(),
      subtitle: 'All time',
      icon: CalendarDaysIcon,
      color: 'blue' as const
    },
    {
      title: 'Confirmed',
      value: stats.confirmed.toString(),
      change: { 
        value: `${Math.round((stats.confirmed / stats.total) * 100)}% of total`, 
        type: 'increase' as const 
      },
      icon: CheckCircleIcon,
      color: 'green' as const
    },
    {
      title: 'Pending',
      value: stats.pending.toString(),
      subtitle: 'Awaiting confirmation',
      icon: ClockIcon,
      color: 'yellow' as const
    },
    {
      title: 'Check-ins Today',
      value: stats.todayCheckIns.toString(),
      subtitle: 'Guests arriving',
      icon: UserGroupIcon,
      color: 'blue' as const
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: {
        value: `$${Math.round(stats.avgBookingValue)} avg`,
        type: 'increase' as const
      },
      icon: CurrencyDollarIcon,
      color: 'green' as const
    },
    {
      title: 'Cancelled',
      value: stats.cancelled.toString(),
      subtitle: `${Math.round((stats.cancelled / stats.total) * 100)}% cancellation rate`,
      icon: XCircleIcon,
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

export default BookingsStats;