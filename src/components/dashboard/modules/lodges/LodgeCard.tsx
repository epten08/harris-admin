import React from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { type Lodge } from '../../../../store/slices/lodgeSlice';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  PlusIcon,
  PencilIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import Button from '../../../ui/Button';

interface LodgeCardProps {
  lodge: Lodge;
  viewMode: 'grid' | 'list';
  onEdit: (lodge: Lodge) => void;
  onAddRoom: (lodge: Lodge) => void;
}

const LodgeCard: React.FC<LodgeCardProps> = ({
  lodge,
  viewMode,
  onEdit,
  onAddRoom
}) => {
  const { hasPermission } = useAuth();

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-50';
    if (rate >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="p-6">
      <div className={`flex ${viewMode === 'list' ? 'flex-row items-center' : 'flex-col'} gap-6`}>
        {/* Lodge Image */}
        <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'} bg-gray-200 rounded-lg overflow-hidden flex-shrink-0`}>
          {lodge.images && lodge.images.length > 0 ? (
            <img
              src={lodge.images[0]}
              alt={lodge.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Lodge Info */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-gray-900">{lodge.name}</h3>
                {!lodge.isActive && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-gray-600">{lodge.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {hasPermission('manage_rooms') && (
                <Button
                  onClick={() => onAddRoom(lodge)}
                  variant="outline"
                  size="sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Room
                </Button>
              )}
              {hasPermission('manage_lodges') && (
                <Button
                  onClick={() => onEdit(lodge)}
                  variant="outline"
                  size="sm"
                >
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">
                  {lodge.address.city}, {lodge.address.state}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-2">
              <PhoneIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Contact</p>
                <p className="text-gray-600">{lodge.contact.phone}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-start gap-2">
              <StarIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Rating</p>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">{lodge.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-3 h-3 ${
                          star <= lodge.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Occupancy */}
            <div className="flex items-start gap-2">
              <BuildingOfficeIcon className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">Occupancy</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOccupancyColor(lodge.occupancyRate)}`}>
                  {Math.round(lodge.occupancyRate)}%
                </span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {lodge.amenities.slice(0, 6).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {lodge.amenities.length > 6 && (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{lodge.amenities.length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-medium text-gray-900">{lodge.totalRooms}</span>
              <span className="text-gray-600 ml-1">Total Rooms</span>
            </div>
            <div>
              <span className="font-medium text-green-600">{lodge.availableRooms}</span>
              <span className="text-gray-600 ml-1">Available</span>
            </div>
            <div>
              <span className="font-medium text-red-600">{lodge.totalRooms - lodge.availableRooms}</span>
              <span className="text-gray-600 ml-1">Occupied</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LodgeCard;