import React, { useState, useEffect } from 'react';
import { useLodges } from '../../../../hooks/useLodges';
import { type Lodge } from '../../../../store/slices/lodgeSlice';
import { validateLodgeForm } from '../../../../utils/validation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';

interface LodgeFormProps {
  lodge: Lodge | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LodgeForm: React.FC<LodgeFormProps> = ({ lodge, onClose, onSuccess }) => {
  const { addLodge, editLodge, isLoading } = useLodges();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'Zimbabwe',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 }
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    amenities: [] as string[],
    images: [] as string[],
    facilities: {
      conferenceRooms: 0,
      restaurant: false,
      gym: false,
      spa: false,
      pool: false,
      parking: false,
      wifi: false,
      laundry: false
    },
    policies: {
      checkIn: '15:00',
      checkOut: '11:00',
      cancellation: '24 hours before arrival',
      petPolicy: '',
      smokingPolicy: 'No smoking in rooms'
    },
    rating: 0,
    isActive: true,
    managerId: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (lodge) {
      setFormData({
        name: lodge.name,
        description: lodge.description,
        address: lodge.address,
        contact: lodge.contact,
        amenities: lodge.amenities,
        images: lodge.images,
        facilities: lodge.facilities,
        policies: lodge.policies,
        rating: lodge.rating,
        isActive: lodge.isActive,
        managerId: lodge.managerId || ''
      });
    }
  }, [lodge]);

  const handleChange = (field: string, value: any) => {
    const keys = field.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0] as keyof typeof prev], [keys[1]]: value }
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(i => i !== image)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLodgeForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (lodge) {
        await editLodge(lodge.id, formData);
      } else {
        await addLodge(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={lodge ? 'Edit Lodge' : 'Add New Lodge'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lodge Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Rating (0-5)"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
            error={errors.rating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your lodge..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                value={formData.address.street}
                onChange={(e) => handleChange('address.street', e.target.value)}
                error={errors['address.street']}
                required
              />
            </div>
            <Input
              label="City"
              value={formData.address.city}
              onChange={(e) => handleChange('address.city', e.target.value)}
              error={errors['address.city']}
              required
            />
            <Input
              label="State/Province"
              value={formData.address.state}
              onChange={(e) => handleChange('address.state', e.target.value)}
              error={errors['address.state']}
              required
            />
            <Input
              label="Country"
              value={formData.address.country}
              onChange={(e) => handleChange('address.country', e.target.value)}
              error={errors['address.country']}
              required
            />
            <Input
              label="Zip Code"
              value={formData.address.zipCode}
              onChange={(e) => handleChange('address.zipCode', e.target.value)}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={formData.contact.phone}
              onChange={(e) => handleChange('contact.phone', e.target.value)}
              error={errors['contact.phone']}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleChange('contact.email', e.target.value)}
              error={errors['contact.email']}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Website (optional)"
                value={formData.contact.website}
                onChange={(e) => handleChange('contact.website', e.target.value)}
                error={errors['contact.website']}
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add amenity (e.g., WiFi, Pool, Gym)"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
            />
            <Button type="button" onClick={handleAddAmenity} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {amenity}
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(amenity)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.restaurant}
                onChange={(e) => handleChange('facilities.restaurant', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Restaurant</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.gym}
                onChange={(e) => handleChange('facilities.gym', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Gym</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.spa}
                onChange={(e) => handleChange('facilities.spa', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Spa</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.pool}
                onChange={(e) => handleChange('facilities.pool', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Pool</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.parking}
                onChange={(e) => handleChange('facilities.parking', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Parking</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.wifi}
                onChange={(e) => handleChange('facilities.wifi', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">WiFi</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.facilities.laundry}
                onChange={(e) => handleChange('facilities.laundry', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Laundry</span>
            </label>
            <div>
              <Input
                label="Conference Rooms"
                type="number"
                min="0"
                value={formData.facilities.conferenceRooms || 0}
                onChange={(e) => handleChange('facilities.conferenceRooms', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Check-in Time"
              type="time"
              value={formData.policies.checkIn}
              onChange={(e) => handleChange('policies.checkIn', e.target.value)}
              error={errors['policies.checkIn']}
              required
            />
            <Input
              label="Check-out Time"
              type="time"
              value={formData.policies.checkOut}
              onChange={(e) => handleChange('policies.checkOut', e.target.value)}
              error={errors['policies.checkOut']}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Cancellation Policy"
                value={formData.policies.cancellation}
                onChange={(e) => handleChange('policies.cancellation', e.target.value)}
                error={errors['policies.cancellation']}
                required
              />
            </div>
            <Input
              label="Pet Policy (optional)"
              value={formData.policies.petPolicy || ''}
              onChange={(e) => handleChange('policies.petPolicy', e.target.value)}
              placeholder="e.g., Pets allowed with additional fee"
            />
            <Input
              label="Smoking Policy"
              value={formData.policies.smokingPolicy}
              onChange={(e) => handleChange('policies.smokingPolicy', e.target.value)}
              error={errors['policies.smokingPolicy']}
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Lodge is active and accepting bookings</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {lodge ? 'Update Lodge' : 'Create Lodge'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LodgeForm;