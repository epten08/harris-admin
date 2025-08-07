import React from 'react';
import { useLodges } from '../../../../hooks/useLodges';
import Button from '../../../ui/Button';

const LodgeFilters: React.FC = () => {
  const { filters, updateFilters, resetFilters, lodges } = useLodges();

  const availableAmenities = Array.from(
    new Set(lodges.flatMap(lodge => lodge.amenities))
  ).sort();

  const availableLocations = Array.from(
    new Set(lodges.map(lodge => lodge.address.city))
  ).sort();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value as any })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            {availableLocations.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Amenities
          </label>
          <select
            multiple
            value={filters.amenities}
            onChange={(e) => updateFilters({ 
              amenities: Array.from(e.target.selectedOptions, option => option.value)
            })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            size={3}
          >
            {availableAmenities.slice(0, 10).map(amenity => (
              <option key={amenity} value={amenity}>{amenity}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Price Range ($)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) => updateFilters({
                priceRange: { ...filters.priceRange, min: parseInt(e.target.value) || 0 }
              })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) => updateFilters({
                priceRange: { ...filters.priceRange, max: parseInt(e.target.value) || 1000 }
              })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LodgeFilters;