import React, { useState, useEffect, useMemo } from 'react';
import { useBookings } from '../../../../hooks/useBookings';
import { useLodges } from '../../../../hooks/useLodges';
import { useAuth } from '../../../../hooks/useAuth';
import { type Booking } from '../../../../store/slices/bookingSlice';
import { validateBookingForm, validateBookingConflicts, calculateBookingAmount } from '../../../../utils/bookingValidation';
import { XMarkIcon, CurrencyDollarIcon, UserIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import LoadingSpinner from '../../../ui/LoadingSpinner';
import GuestSearch from './GuestSearch';

interface BookingFormProps {
  booking: Booking | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ booking, onClose, onSuccess }) => {
  const { addBooking, editBooking, isLoading, bookings } = useBookings();
  const { lodges } = useLodges();
  const { hasGlobalAccess, assignedLodges, user } = useAuth();
  const [selectedExistingGuest, setSelectedExistingGuest] = useState<any>(null);
    const [useExistingGuest, setUseExistingGuest] = useState(false);

  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestAddress: '',
    guestNationality: 'Zimbabwe',
    guestIdNumber: '',
    lodgeId: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    adults: 2,
    children: 0,
    status: 'pending' as Booking['status'],
    paymentStatus: 'pending' as Booking['paymentStatus'],
    paymentMethod: '',
    bookingSource: 'website' as Booking['bookingSource'],
    specialRequests: '',
    notes: '',
    roomRate: 0,
    discounts: 0,
    extraCharges: 0,
    currency: 'USD'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [step, setStep] = useState(1);
  const [pricingCalculation, setPricingCalculation] = useState<any>(null);

  // Filter lodges based on user access
  const accessibleLodges = useMemo(() => {
    return hasGlobalAccess 
      ? lodges 
      : lodges.filter(lodge => assignedLodges.includes(lodge.id));
  }, [lodges, hasGlobalAccess, assignedLodges]);

  // Get rooms for selected lodge
  const availableRooms = useMemo(() => {
    const selectedLodge = accessibleLodges.find(lodge => lodge.id === formData.lodgeId);
    return selectedLodge?.rooms || [];
  }, [accessibleLodges, formData.lodgeId]);

  // Get selected room details
  const selectedRoom = useMemo(() => {
    return availableRooms.find(room => room.id === formData.roomId);
  }, [availableRooms, formData.roomId]);

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        guestAddress: booking.guestAddress || '',
        guestNationality: booking.guestNationality || 'Zimbabwe',
        guestIdNumber: booking.guestIdNumber || '',
        lodgeId: booking.lodgeId,
        roomId: booking.roomId,
        checkIn: booking.checkIn.split('T')[0],
        checkOut: booking.checkOut.split('T')[0],
        guests: booking.guests,
        adults: booking.adults,
        children: booking.children,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod || '',
        bookingSource: booking.bookingSource,
        specialRequests: booking.specialRequests || '',
        notes: booking.notes || '',
        roomRate: booking.roomRate,
        discounts: booking.discounts,
        extraCharges: booking.extraCharges,
        currency: booking.currency
      });
    }
  }, [booking]);

  // Calculate pricing when relevant fields change
  useEffect(() => {
    if (selectedRoom && formData.checkIn && formData.checkOut) {
      const calculation = calculateBookingAmount(
        selectedRoom.pricing.normal,
        formData.checkIn,
        formData.checkOut,
        formData.guests,
        formData.discounts,
        formData.extraCharges
      );
      setPricingCalculation(calculation);
      setFormData(prev => ({ ...prev, roomRate: selectedRoom.pricing.normal }));
    }
  }, [selectedRoom, formData.checkIn, formData.checkOut, formData.guests, formData.discounts, formData.extraCharges]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGuestCountChange = (field: 'adults' | 'children', value: number) => {
    const newAdults = field === 'adults' ? value : formData.adults;
    const newChildren = field === 'children' ? value : formData.children;
    const totalGuests = newAdults + newChildren;
    
    setFormData(prev => ({
      ...prev,
      adults: newAdults,
      children: newChildren,
      guests: totalGuests
    }));
  };

  const validateStep = (stepNumber: number) => {
    let stepErrors: { [key: string]: string } = {};
    
    switch (stepNumber) {
      case 1: // Guest Information
        if (!formData.guestName.trim()) stepErrors.guestName = 'Guest name is required';
        if (!formData.guestEmail.trim()) stepErrors.guestEmail = 'Email is required';
        if (formData.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
          stepErrors.guestEmail = 'Please enter a valid email';
        }
        if (!formData.guestPhone.trim()) stepErrors.guestPhone = 'Phone number is required';
        break;
        
      case 2: // Booking Details
        if (!formData.lodgeId) stepErrors.lodgeId = 'Please select a lodge';
        if (!formData.roomId) stepErrors.roomId = 'Please select a room';
        if (!formData.checkIn) stepErrors.checkIn = 'Check-in date is required';
        if (!formData.checkOut) stepErrors.checkOut = 'Check-out date is required';
        if (formData.guests < 1) stepErrors.guests = 'At least 1 guest is required';
        if (formData.adults < 1) stepErrors.adults = 'At least 1 adult is required';
        
        // Date validation
        if (formData.checkIn && formData.checkOut) {
          const checkIn = new Date(formData.checkIn);
          const checkOut = new Date(formData.checkOut);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (checkIn < today) stepErrors.checkIn = 'Check-in cannot be in the past';
          if (checkOut <= checkIn) stepErrors.checkOut = 'Check-out must be after check-in';
        }
        
        // Room capacity check
        if (selectedRoom && formData.guests > selectedRoom.capacity) {
          stepErrors.guests = `Room capacity is ${selectedRoom.capacity} guests`;
        }
        
        // Check for conflicts
        const conflictErrors = validateBookingConflicts(formData, bookings, booking?.id);
        if (conflictErrors.roomConflict) {
          stepErrors.roomConflict = conflictErrors.roomConflict;
        }
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    const allValid = validateStep(1) && validateStep(2) && validateStep(3);
    if (!allValid) return;
    
    if (!pricingCalculation) {
      setErrors({ pricing: 'Unable to calculate pricing' });
      return;
    }

    const bookingData = {
      ...formData,
      checkIn: new Date(formData.checkIn).toISOString(),
      checkOut: new Date(formData.checkOut).toISOString(),
      lodgeName: accessibleLodges.find(l => l.id === formData.lodgeId)?.name || '',
      roomName: selectedRoom?.name || '',
      roomType: selectedRoom?.type || '',
      amount: pricingCalculation.total,
      deposit: 0,
      balance: pricingCalculation.total,
      taxes: pricingCalculation.taxes,
      isReturningGuest: false,
      loyaltyDiscountApplied: false,
      cancellationDeadline: new Date(new Date(formData.checkIn).getTime() - 24 * 60 * 60 * 1000).toISOString()
    };

    try {
      if (booking) {
        await editBooking(booking.id, bookingData);
      } else {
        await addBooking(bookingData);
      }
      onSuccess();
    } catch (error) {
      setErrors({ submit: 'Failed to save booking' });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
            step >= stepNumber 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-16 h-0.5 ${
              step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

 const renderStep1 = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-6">
      <UserIcon className="w-6 h-6 text-blue-600" />
      <h3 className="text-lg font-semibold text-gray-900">Guest Information</h3>
    </div>

    {/* Toggle between new and existing guest */}
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
      <label className="flex items-center">
        <input
          type="radio"
          name="guestType"
          checked={!useExistingGuest}
          onChange={() => {
            setUseExistingGuest(false);
            setSelectedExistingGuest(null);
          }}
          className="mr-2"
        />
        <span className="text-sm font-medium">New Guest</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="guestType"
          checked={useExistingGuest}
          onChange={() => setUseExistingGuest(true)}
          className="mr-2"
        />
        <span className="text-sm font-medium">Existing Guest</span>
      </label>
    </div>

    {useExistingGuest ? (
      <div>
        <GuestSearch
          onSelectGuest={(guest) => {
            setSelectedExistingGuest(guest);
            if (guest) {
              setFormData(prev => ({
                ...prev,
                guestName: guest.name,
                guestEmail: guest.email,
                guestPhone: guest.phone,
                guestNationality: guest.nationality || 'Zimbabwe',
                guestAddress: guest.address || ''
              }));
            }
          }}
          selectedGuest={selectedExistingGuest}
        />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.guestName}
          onChange={(e) => handleChange('guestName', e.target.value)}
          error={errors.guestName}
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={formData.guestEmail}
          onChange={(e) => handleChange('guestEmail', e.target.value)}
          error={errors.guestEmail}
          required
        />
        <Input
          label="Phone Number"
          value={formData.guestPhone}
          onChange={(e) => handleChange('guestPhone', e.target.value)}
          error={errors.guestPhone}
          required
          placeholder="+263 77 123 4567"
        />
        <Input
          label="Nationality"
          value={formData.guestNationality}
          onChange={(e) => handleChange('guestNationality', e.target.value)}
        />
        <div className="md:col-span-2">
          <Input
            label="Address (Optional)"
            value={formData.guestAddress}
            onChange={(e) => handleChange('guestAddress', e.target.value)}
            placeholder="Street address, City, Country"
          />
        </div>
        <Input
          label="ID Number (Optional)"
          value={formData.guestIdNumber}
          onChange={(e) => handleChange('guestIdNumber', e.target.value)}
          placeholder="Passport or National ID"
        />
      </div>
    )}
  </div>
);


  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
      </div>

      {errors.roomConflict && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.roomConflict}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lodge <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.lodgeId}
            onChange={(e) => {
              handleChange('lodgeId', e.target.value);
              handleChange('roomId', ''); // Reset room selection
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a lodge</option>
            {accessibleLodges.map(lodge => (
              <option key={lodge.id} value={lodge.id}>{lodge.name}</option>
            ))}
          </select>
          {errors.lodgeId && <p className="mt-1 text-sm text-red-600">{errors.lodgeId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.roomId}
            onChange={(e) => handleChange('roomId', e.target.value)}
            disabled={!formData.lodgeId}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select a room</option>
            {availableRooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - {room.type} (${room.pricing.normal}/night)
              </option>
            ))}
          </select>
          {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId}</p>}
        </div>

        <Input
          label="Check-in Date"
          type="date"
          value={formData.checkIn}
          onChange={(e) => handleChange('checkIn', e.target.value)}
          error={errors.checkIn}
          min={new Date().toISOString().split('T')[0]}
          required
        />
        <Input
          label="Check-out Date"
          type="date"
          value={formData.checkOut}
          onChange={(e) => handleChange('checkOut', e.target.value)}
          error={errors.checkOut}
          min={formData.checkIn || new Date().toISOString().split('T')[0]}
          required
        />

        <Input
          label="Adults"
          type="number"
          min="1"
          max="20"
          value={formData.adults}
          onChange={(e) => handleGuestCountChange('adults', parseInt(e.target.value) || 1)}
          error={errors.adults}
          required
        />
        <Input
          label="Children"
          type="number"
          min="0"
          max="10"
          value={formData.children}
          onChange={(e) => handleGuestCountChange('children', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-gray-900 mb-2">Guest Summary</p>
        <p className="text-sm text-gray-600">
          Total Guests: {formData.guests} ({formData.adults} adults, {formData.children} children)
        </p>
        {selectedRoom && (
          <p className="text-sm text-gray-600">
            Room Capacity: {selectedRoom.capacity} guests
            {formData.guests > selectedRoom.capacity && (
              <span className="text-red-600 ml-2">⚠️ Exceeds capacity</span>
            )}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Source
          </label>
          <select
            value={formData.bookingSource}
            onChange={(e) => handleChange('bookingSource', e.target.value as Booking['bookingSource'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="website">Website</option>
            <option value="walk_in">Walk-in</option>
            <option value="phone">Phone</option>
            <option value="booking_com">Booking.com</option>
            <option value="airbnb">Airbnb</option>
            <option value="agent">Travel Agent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Booking Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as Booking['status'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            {booking && (
              <>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests (Optional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => handleChange('specialRequests', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any special requests or preferences..."
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Pricing & Payment</h3>
      </div>

      {pricingCalculation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">Room Rate ({pricingCalculation.nights} nights):</span>
              <span className="font-medium">${pricingCalculation.subtotal}</span>
            </div>
            {formData.discounts > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-800">Discount ({formData.discounts}%):</span>
                <span className="font-medium text-green-600">-${pricingCalculation.discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-blue-800">Taxes (15%):</span>
              <span className="font-medium">${pricingCalculation.taxes}</span>
            </div>
            {formData.extraCharges > 0 && (
              <div className="flex justify-between">
                <span className="text-blue-800">Extra Charges:</span>
                <span className="font-medium">${formData.extraCharges}</span>
              </div>
            )}
            <div className="border-t border-blue-300 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-blue-900">
                <span>Total Amount:</span>
                <span>${pricingCalculation.total}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Discount (%)"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={formData.discounts}
          onChange={(e) => handleChange('discounts', parseFloat(e.target.value) || 0)}
        />
        <Input
          label="Extra Charges ($)"
          type="number"
          min="0"
          step="0.01"
          value={formData.extraCharges}
          onChange={(e) => handleChange('extraCharges', parseFloat(e.target.value) || 0)}
          placeholder="Additional fees, services, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={formData.paymentStatus}
            onChange={(e) => handleChange('paymentStatus', e.target.value as Booking['paymentStatus'])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial Payment</option>
            <option value="paid">Fully Paid</option>
            {booking && <option value="refunded">Refunded</option>}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="card">Credit/Debit Card</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internal Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Internal notes for staff reference..."
        />
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${booking ? 'Edit' : 'Create'} Booking`}
      size="xl"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>

            <div className="flex gap-3">
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" loading={isLoading}>
                  {booking ? 'Update Booking' : 'Create Booking'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BookingForm;