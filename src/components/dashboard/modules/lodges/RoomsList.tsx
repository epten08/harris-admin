import React, { useState } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useLodges } from '../../../../hooks/useLodges';
import { type Lodge, type Room } from '../../../../store/slices/lodgeSlice';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import Button from '../../../ui/Button';
import RoomStatusBadge from './RoomStatusBadge';

interface RoomsListProps {
  lodge: Lodge;
  onEditRoom: (room: Room) => void;
}

const RoomsList: React.FC<RoomsListProps> = ({ lodge, onEditRoom }) => {
  const { hasPermission } = useAuth();
  const { changeRoomStatus, removeRoom } = useLodges();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const handleStatusChange = async (room: Room, newStatus: Room['status']) => {
    await changeRoomStatus(lodge.id, room.id, newStatus, room.name);
  };

  const handleDeleteRoom = async (room: Room) => {
    if (window.confirm(`Are you sure you want to delete ${room.name}?`)) {
      await removeRoom(lodge.id, room.id, room.name);
    }
  };

  const toggleRoomSelection = (roomId: string) => {
    setSelectedRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleBulkStatusChange = async (status: Room['status']) => {
    const promises = selectedRooms.map(roomId => {
      const room = lodge.rooms.find(r => r.id === roomId);
      if (room) {
        return changeRoomStatus(lodge.id, room.id, status, room.name);
      }
    });
    await Promise.all(promises);
    setSelectedRooms([]);
  };

  if (!lodge.rooms || lodge.rooms.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No rooms added yet</p>
      </div>
    );
  }

  return (
    <div>
      {/* Rooms Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
          Rooms ({lodge.rooms.length})
        </button>

        {selectedRooms.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-600">
              {selectedRooms.length} selected
            </span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange('available')}
              >
                Mark Available
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange('maintenance')}
              >
                Maintenance
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange('out_of_order')}
              >
                Out of Order
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Rooms Grid */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {lodge.rooms.map((room) => (
              <div
                key={room.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Room Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {hasPermission('manage_rooms') && (
                      <input
                        type="checkbox"
                        checked={selectedRooms.includes(room.id)}
                        onChange={() => toggleRoomSelection(room.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{room.name}</h4>
                      <p className="text-sm text-gray-600">Room {room.number}</p>
                    </div>
                  </div>
                  <RoomStatusBadge status={room.status} />
                </div>

                {/* Room Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{room.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{room.capacity} guests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{room.size} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-medium">{room.floor}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold text-green-600">
                      ${room.pricing.normal}/night
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {hasPermission('manage_rooms') && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditRoom(room)}
                      className="flex-1"
                    >
                      <PencilIcon className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <div className="flex gap-1">
                      {room.status !== 'maintenance' && (
                        <button
                          onClick={() => handleStatusChange(room, 'maintenance')}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded"
                          title="Mark for Maintenance"
                        >
                          <WrenchScrewdriverIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      {room.status !== 'out_of_order' && (
                        <button
                          onClick={() => handleStatusChange(room, 'out_of_order')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Mark Out of Order"
                        >
                          <EyeSlashIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteRoom(room)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Room"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Status Actions */}
                {hasPermission('update_room_status') && room.status !== 'available' && (
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(room, 'available')}
                     className="w-full text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Mark Available
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsList;