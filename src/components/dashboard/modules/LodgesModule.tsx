import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../hooks/redux';
import { useAuth } from '../../../hooks/useAuth';
import { useLodges } from '../../../hooks/useLodges';
import { addNotification } from '../../../store/slices/uiSlice';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import LoadingSpinner from '../../ui/LoadingSpinner';
import LodgesList from './lodges/LodgesList';
import LodgeForm from './lodges/LodgeForm';
import RoomForm from './lodges/RoomForm';
import LodgeFilters from './lodges/LodgeFilters';
import LodgesStats from './lodges/LodgesStats';

const LodgesModule: React.FC = () => {
  const dispatch = useAppDispatch();
  const { hasPermission, hasGlobalAccess } = useAuth();
  const { lodges, isLoading, loadLodges, selectLodge, selectedLodge } = useLodges();
  
  const [showLodgeForm, setShowLodgeForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [editingLodge, setEditingLodge] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadLodges();
  }, [loadLodges]);

  const handleAddLodge = () => {
    if (!hasPermission('manage_lodges')) {
      dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to add lodges'
      }));
      return;
    }
    setEditingLodge(null);
    setShowLodgeForm(true);
  };

  const handleEditLodge = (lodge: any) => {
    if (!hasPermission('manage_lodges')) {
      dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to edit lodges'
      }));
      return;
    }
    setEditingLodge(lodge);
    setShowLodgeForm(true);
  };

  const handleAddRoom = (lodge: any) => {
    if (!hasPermission('manage_rooms')) {
      dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to add rooms'
      }));
      return;
    }
    selectLodge(lodge);
    setEditingRoom(null);
    setShowRoomForm(true);
  };

  const handleEditRoom = (room: any) => {
    if (!hasPermission('manage_rooms')) {
      dispatch(addNotification({
        type: 'error',
        message: 'You do not have permission to edit rooms'
      }));
      return;
    }
    setEditingRoom(room);
    setShowRoomForm(true);
  };

  const handleFormClose = () => {
    setShowLodgeForm(false);
    setShowRoomForm(false);
    setEditingLodge(null);
    setEditingRoom(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadLodges();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lodges & Rooms</h1>
          <p className="text-gray-600">
            Manage your {hasGlobalAccess ? 'properties' : 'assigned'} lodges, rooms, and facilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {hasPermission('manage_lodges') && (
            <Button onClick={handleAddLodge}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Lodge
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <LodgesStats />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search lodges, rooms, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              List
            </button>
          </div>
        </div>
        
        {showFilters && <LodgeFilters />}
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" color="blue" />
        </div>
      ) : (
        <LodgesList
          viewMode={viewMode}
          searchQuery={searchQuery}
          onEditLodge={handleEditLodge}
          onAddRoom={handleAddRoom}
          onEditRoom={handleEditRoom}
        />
      )}

      {/* Forms */}
      {showLodgeForm && (
        <LodgeForm
          lodge={editingLodge}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {showRoomForm && (
        <RoomForm
          room={editingRoom}
          lodge={selectedLodge}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default LodgesModule;