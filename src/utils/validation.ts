import type { LodgeFormData, RoomFormData } from '../types/forms';

export const validateLodgeForm = (data: Partial<LodgeFormData>): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!data.name?.trim()) {
    errors.name = 'Lodge name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Lodge name must be at least 3 characters long';
  }

  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!data.address?.street?.trim()) {
    errors['address.street'] = 'Street address is required';
  }

  if (!data.address?.city?.trim()) {
    errors['address.city'] = 'City is required';
  }

  if (!data.address?.state?.trim()) {
    errors['address.state'] = 'State/Province is required';
  }

  if (!data.address?.country?.trim()) {
    errors['address.country'] = 'Country is required';
  }

  if (!data.contact?.phone?.trim()) {
    errors['contact.phone'] = 'Phone number is required';
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(data.contact.phone)) {
    errors['contact.phone'] = 'Please enter a valid phone number';
  }

  if (!data.contact?.email?.trim()) {
    errors['contact.email'] = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.contact.email)) {
    errors['contact.email'] = 'Please enter a valid email address';
  }

  if (data.contact?.website && !/^https?:\/\/.+/.test(data.contact.website)) {
    errors['contact.website'] = 'Please enter a valid website URL';
  }

  if (!data.policies?.checkIn?.trim()) {
    errors['policies.checkIn'] = 'Check-in time is required';
  }

  if (!data.policies?.checkOut?.trim()) {
    errors['policies.checkOut'] = 'Check-out time is required';
  }

  if (!data.policies?.cancellation?.trim()) {
    errors['policies.cancellation'] = 'Cancellation policy is required';
  }

  if (!data.policies?.smokingPolicy?.trim()) {
    errors['policies.smokingPolicy'] = 'Smoking policy is required';
  }

  if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
    errors.rating = 'Rating must be between 0 and 5';
  }

  return errors;
};

export const validateRoomForm = (data: Partial<RoomFormData>): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!data.number?.trim()) {
    errors.number = 'Room number is required';
  }

  if (!data.name?.trim()) {
    errors.name = 'Room name is required';
  } else if (data.name.length < 3) {
    errors.name = 'Room name must be at least 3 characters long';
  }

  if (!data.type) {
    errors.type = 'Room type is required';
  }

  if (!data.capacity || data.capacity < 1) {
    errors.capacity = 'Room capacity must be at least 1';
  }

  if (!data.description?.trim()) {
    errors.description = 'Room description is required';
  }

  if (!data.size || data.size < 1) {
    errors.size = 'Room size must be greater than 0';
  }

  if (!data.view?.trim()) {
    errors.view = 'Room view is required';
  }

  if (data.floor === undefined || data.floor < 0) {
    errors.floor = 'Floor number is required and must be 0 or greater';
  }

  // Validate pricing
  if (!data.pricing?.normal || data.pricing.normal < 0) {
    errors['pricing.normal'] = 'Normal price is required and must be positive';
  }

  if (!data.pricing?.busy || data.pricing.busy < 0) {
    errors['pricing.busy'] = 'Busy season price is required and must be positive';
  }

  if (!data.pricing?.slow || data.pricing.slow < 0) {
    errors['pricing.slow'] = 'Slow season price is required and must be positive';
  }

  // Validate beds
  const totalBeds = (data.beds?.single || 0) + 
                   (data.beds?.double || 0) + 
                   (data.beds?.queen || 0) + 
                   (data.beds?.king || 0);

  if (totalBeds === 0) {
    errors.beds = 'At least one bed is required';
  }

  return errors;
};

export const formatValidationErrors = (errors: { [key: string]: string }): string[] => {
  return Object.values(errors).filter(Boolean);
};

export const hasValidationErrors = (errors: { [key: string]: string }): boolean => {
  return Object.keys(errors).length > 0;
};