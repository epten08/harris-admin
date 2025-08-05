export interface LodgeFormData {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  amenities: string[];
  images: string[];
  facilities: {
    conferenceRooms?: number;
    restaurant?: boolean;
    gym?: boolean;
    spa?: boolean;
    pool?: boolean;
    parking?: boolean;
    wifi?: boolean;
    laundry?: boolean;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    petPolicy?: string;
    smokingPolicy: string;
  };
  rating: number;
  isActive: boolean;
  managerId?: string;
}

export interface RoomFormData {
  number: string;
  name: string;
  type: 'standard' | 'deluxe' | 'suite' | 'family' | 'executive';
  capacity: number;
  beds: {
    single: number;
    double: number;
    queen: number;
    king: number;
  };
  amenities: string[];
  images: string[];
  pricing: {
    normal: number;
    busy: number;
    slow: number;
  };
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_order' | 'cleaning';
  description: string;
  size: number;
  view: string;
  floor: number;
  isActive: boolean;
}