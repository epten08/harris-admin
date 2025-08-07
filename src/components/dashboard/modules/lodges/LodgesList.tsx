import React from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { useLodges } from '../../../../hooks/useLodges';
import LodgeCard from './LodgeCard';
import RoomsList from './RoomsList';

interface LodgesListProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  onEditLodge: (lodge: any) => void;
  onAddRoom: (lodge: any) => void;
  onEditRoom: (room: any) => void;
}

const LodgesList: React.FC<LodgesListProps> = ({
  viewMode,
  searchQuery,
  onEditLodge,
  onAddRoom,
  onEditRoom
}) => {
  const { hasGlobalAccess, assignedLodges } = useAuth();
  const { lodges, searchLodges } = useLodges();

  // Filter lodges based on access and search
  const filteredLodges = React.useMemo(() => {
    let accessibleLodges = hasGlobalAccess 
      ? lodges 
      : lodges.filter(lodge => assignedLodges.includes(lodge.id));

    if (searchQuery.trim()) {
      accessibleLodges = searchLodges(searchQuery);
      // Apply access filter to search results
      if (!hasGlobalAccess) {
        accessibleLodges = accessibleLodges.filter(lodge => assignedLodges.includes(lodge.id));
      }
    }

    return accessibleLodges;
  }, [lodges, hasGlobalAccess, assignedLodges, searchQuery, searchLodges]);

  if (filteredLodges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery ? 'No lodges found' : 'No lodges available'}
        </h3>
        <p className="text-gray-600">
          {searchQuery 
            ? `No lodges match "${searchQuery}". Try adjusting your search.`
            : hasGlobalAccess 
              ? 'Get started by creating your first lodge.'
              : 'You have not been assigned to any lodges yet.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredLodges.map((lodge) => (
        <div key={lodge.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
          <LodgeCard
            lodge={lodge}
            viewMode={viewMode}
            onEdit={onEditLodge}
            onAddRoom={onAddRoom}
          />
          
          {/* Rooms Section */}
          <div className="border-t border-gray-200">
            <RoomsList
              lodge={lodge}
              onEditRoom={onEditRoom}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LodgesList;