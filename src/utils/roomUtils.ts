import { type Room } from '../store/slices/lodgeSlice';

export const calculateRoomRevenue = (room: Room, occupancyRate: number, seasonType: 'normal' | 'busy' | 'slow' = 'normal') => {
  const basePrice = room.pricing[seasonType];
  const daysInMonth = 30;
  const occupiedDays = Math.round((occupancyRate / 100) * daysInMonth);
  return basePrice * occupiedDays;
};

export const getRoomCapacityFromBeds = (beds: Room['beds']) => {
  // Estimate capacity based on bed configuration
  const { single, double, queen, king } = beds;
  return (single * 1) + (double * 2) + (queen * 2) + (king * 2);
};

export const validateRoomNumber = (number: string, existingRooms: Room[], currentRoomId?: string) => {
  if (!number.trim()) return 'Room number is required';
  
  const duplicate = existingRooms.find(room => 
    room.number.toLowerCase() === number.toLowerCase() && room.id !== currentRoomId
  );
  
  if (duplicate) return 'Room number already exists in this lodge';
  return '';
};

export const generateRoomSuggestions = (lodge: any) => {
  const existingNumbers = lodge?.rooms?.map((r: Room) => r.number) || [];
  const suggestions = [];
  
  // Generate numeric suggestions
  for (let floor = 1; floor <= 5; floor++) {
    for (let room = 1; room <= 20; room++) {
      const number = `${floor}${room.toString().padStart(2, '0')}`;
      if (!existingNumbers.includes(number)) {
        suggestions.push(number);
        if (suggestions.length >= 10) break;
      }
    }
    if (suggestions.length >= 10) break;
  }
  
  return suggestions;
};

export const getRoomTypeDescription = (type: Room['type']) => {
  const descriptions = {
    standard: 'Comfortable accommodations with essential amenities for a pleasant stay.',
    deluxe: 'Enhanced room with upgraded amenities and superior comfort features.',
    suite: 'Spacious accommodation with separate living area and premium amenities.',
    family: 'Large room designed for families with multiple beds and extra space.',
    executive: 'Business-oriented room with work area and premium business amenities.'
  };
  
  return descriptions[type] || 'Room with essential accommodations.';
};

export const getOptimalPricing = (roomType: Room['type'], marketRate = 100) => {
  const multipliers = {
    standard: { normal: 1.0, busy: 1.3, slow: 0.8 },
    deluxe: { normal: 1.4, busy: 1.8, slow: 1.1 },
    suite: { normal: 2.0, busy: 2.6, slow: 1.6 },
    family: { normal: 1.6, busy: 2.1, slow: 1.3 },
    executive: { normal: 1.8, busy: 2.3, slow: 1.4 }
  };
  
  const multiplier = multipliers[roomType];
  return {
    normal: Math.round(marketRate * multiplier.normal),
    busy: Math.round(marketRate * multiplier.busy),
    slow: Math.round(marketRate * multiplier.slow)
  };
};