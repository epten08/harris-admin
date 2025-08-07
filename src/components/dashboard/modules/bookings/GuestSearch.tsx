import React, { useState, useEffect } from 'react';
import { useBookings } from '../../../../hooks/useBookings';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import Input from '../../../ui/Input';

interface GuestSearchProps {
  onSelectGuest: (guest: any) => void;
  selectedGuest?: any;
}

const GuestSearch: React.FC<GuestSearchProps> = ({ onSelectGuest, selectedGuest }) => {
  const { bookings } = useBookings();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Extract unique guests from bookings
  const uniqueGuests = React.useMemo(() => {
    const guestMap = new Map();
    
    bookings.forEach(booking => {
      if (!guestMap.has(booking.guestEmail)) {
        guestMap.set(booking.guestEmail, {
          name: booking.guestName,
          email: booking.guestEmail,
          phone: booking.guestPhone,
          nationality: booking.guestNationality,
          address: booking.guestAddress,
          totalBookings: 1,
          lastBooking: booking.createdAt,
          isReturning: booking.isReturningGuest
        });
      } else {
        const guest = guestMap.get(booking.guestEmail);
        guest.totalBookings++;
        if (new Date(booking.createdAt) > new Date(guest.lastBooking)) {
          guest.lastBooking = booking.createdAt;
        }
      }
    });
    
    return Array.from(guestMap.values()).sort((a, b) => 
      new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime()
    );
  }, [bookings]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = uniqueGuests.filter(guest =>
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 10));
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery, uniqueGuests]);

  const handleSelectGuest = (guest: any) => {
    onSelectGuest(guest);
    setSearchQuery(guest.name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search existing guests by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!e.target.value) {
              onSelectGuest(null);
            }
          }}
          className="pl-10"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((guest, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectGuest(guest)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {guest.name}
                    </p>
                    {guest.totalBookings > 1 && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                        Returning Guest
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{guest.email}</p>
                  <p className="text-xs text-gray-500">
                    {guest.totalBookings} booking{guest.totalBookings !== 1 ? 's' : ''} • 
                    Last: {new Date(guest.lastBooking).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedGuest && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Selected: {selectedGuest.name}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelectGuest(null);
                setSearchQuery('');
              }}
              className="text-green-600 hover:text-green-800 ml-auto"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-green-700 mt-1">
            {selectedGuest.email} • {selectedGuest.totalBookings} previous booking{selectedGuest.totalBookings !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {showResults && searchResults.length === 0 && searchQuery.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <p className="text-sm text-gray-500 text-center">No existing guests found</p>
        </div>
      )}
    </div>
  );
};

export default GuestSearch;