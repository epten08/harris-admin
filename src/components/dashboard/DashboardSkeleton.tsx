import React from 'react';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gray-200 rounded-xl h-32"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
        ))}
      </div>
      
      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-lg h-64"></div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
      
      {/* Quick Actions Skeleton */}
      <div className="bg-gray-200 rounded-lg h-48"></div>
      
      {/* Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96"></div>
        <div className="bg-gray-200 rounded-lg h-96"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;