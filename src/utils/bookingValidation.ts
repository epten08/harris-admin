import { type Booking } from '../store/slices/bookingSlice';

export interface BookingValidationErrors {
  [key: string]: string;
}

export const validateBookingForm = (booking: Partial<Booking>): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  // Guest Information
  if (!booking.guestName?.trim()) {
    errors.guestName = 'Guest name is required';
  } else if (booking.guestName.trim().length < 2) {
    errors.guestName = 'Guest name must be at least 2 characters';
  }

  if (!booking.guestEmail?.trim()) {
    errors.guestEmail = 'Guest email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.guestEmail)) {
    errors.guestEmail = 'Please enter a valid email address';
  }

  if (!booking.guestPhone?.trim()) {
    errors.guestPhone = 'Guest phone number is required';
  } else if (!/^[+]?[1-9][\d]{3,14}$/.test(booking.guestPhone.replace(/\s/g, ''))) {
    errors.guestPhone = 'Please enter a valid phone number';
  }

  // Booking Details
  if (!booking.lodgeId) {
    errors.lodgeId = 'Please select a lodge';
  }

  if (!booking.roomId) {
    errors.roomId = 'Please select a room';
  }

  if (!booking.checkIn) {
    errors.checkIn = 'Check-in date is required';
  }

  if (!booking.checkOut) {
    errors.checkOut = 'Check-out date is required';
  }

  // Date validation
  if (booking.checkIn && booking.checkOut) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      errors.checkIn = 'Check-in date cannot be in the past';
    }

    if (checkOutDate <= checkInDate) {
      errors.checkOut = 'Check-out date must be after check-in date';
    }

    // Maximum stay validation (e.g., 30 days)
    const maxStayDays = 30;
    const daysDiff = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > maxStayDays) {
      errors.checkOut = `Maximum stay is ${maxStayDays} days`;
    }
  }

  // Guest count validation
  if (!booking.guests || booking.guests < 1) {
    errors.guests = 'Number of guests must be at least 1';
  } else if (booking.guests > 20) {
    errors.guests = 'Maximum 20 guests per booking';
  }

  if (!booking.adults || booking.adults < 1) {
    errors.adults = 'Number of adults must be at least 1';
  }

  if (booking.children && booking.children < 0) {
    errors.children = 'Number of children cannot be negative';
  }

  if (booking.adults && booking.children && (booking.adults + booking.children) !== booking.guests) {
    errors.guests = 'Total guests must equal adults + children';
  }

  // Financial validation
  if (booking.amount !== undefined && booking.amount < 0) {
    errors.amount = 'Amount cannot be negative';
  }

  if (booking.deposit !== undefined && booking.deposit < 0) {
    errors.deposit = 'Deposit cannot be negative';
  }

  if (booking.amount !== undefined && booking.deposit !== undefined && booking.deposit > booking.amount) {
    errors.deposit = 'Deposit cannot exceed total amount';
  }

  // Special requests length validation
  if (booking.specialRequests && booking.specialRequests.length > 500) {
    errors.specialRequests = 'Special requests cannot exceed 500 characters';
  }

  // Notes length validation
  if (booking.notes && booking.notes.length > 1000) {
    errors.notes = 'Notes cannot exceed 1000 characters';
  }

  return errors;
};

export const validateBookingConflicts = (
  booking: Partial<Booking>, 
  existingBookings: Booking[],
  currentBookingId?: string
): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  if (!booking.roomId || !booking.checkIn || !booking.checkOut) {
    return errors;
  }

  const checkInDate = new Date(booking.checkIn);
  const checkOutDate = new Date(booking.checkOut);

  // Check for room availability conflicts
  const conflicts = existingBookings.filter(existingBooking => {
    // Skip current booking when editing
    if (currentBookingId && existingBooking.id === currentBookingId) {
      return false;
    }

    // Skip cancelled bookings
    if (existingBooking.status === 'cancelled') {
      return false;
    }

    // Same room check
    if (existingBooking.roomId !== booking.roomId) {
      return false;
    }

    const existingCheckIn = new Date(existingBooking.checkIn);
    const existingCheckOut = new Date(existingBooking.checkOut);

    // Check for date overlap
    return (checkInDate < existingCheckOut && checkOutDate > existingCheckIn);
  });

  if (conflicts.length > 0) {
    const conflictDetails = conflicts.map(c => 
      `${c.guestName} (${new Date(c.checkIn).toLocaleDateString()} - ${new Date(c.checkOut).toLocaleDateString()})`
    ).join(', ');
    
    errors.roomConflict = `Room is already booked during this period: ${conflictDetails}`;
  }

  return errors;
};

export const validatePayment = (booking: Booking, paymentData: {
  amount: number;
  method: string;
}): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  if (paymentData.amount <= 0) {
    errors.amount = 'Payment amount must be greater than 0';
  }

  if (paymentData.amount > booking.balance) {
    errors.amount = 'Payment amount cannot exceed outstanding balance';
  }

  if (!paymentData.method) {
    errors.method = 'Payment method is required';
  }

  return errors;
};

export const validateCancellation = (booking: Booking, reason?: string): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  if (booking.status === 'cancelled') {
    errors.status = 'Booking is already cancelled';
  }

  if (booking.status === 'checked_out') {
    errors.status = 'Cannot cancel a completed booking';
  }

  const checkInDate = new Date(booking.checkIn);
  const now = new Date();
  
  // Check cancellation deadline (24 hours before check-in)
  const cancellationDeadline = new Date(checkInDate.getTime() - 24 * 60 * 60 * 1000);
  
  if (now > cancellationDeadline && booking.status === 'confirmed') {
    errors.deadline = 'Cancellation deadline has passed. Late cancellation fees may apply.';
  }

  if (reason && reason.length > 500) {
    errors.reason = 'Cancellation reason cannot exceed 500 characters';
  }

  return errors;
};

export const calculateBookingAmount = (
  roomRate: number,
  checkIn: string,
  checkOut: string,
  guests: number,
  discounts: number = 0,
  extraCharges: number = 0,
  taxRate: number = 0.15
) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const subtotal = roomRate * nights;
  const discountAmount = (subtotal * discounts) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxes = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + taxes + extraCharges;
  
  return {
    nights,
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    extraCharges,
    total: Math.round(total * 100) / 100
  };
};