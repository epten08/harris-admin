import React, { useState, useEffect } from 'react';
import { useLodges } from '../../../../hooks/useLodges';
import { type Lodge, type Room } from '../../../../store/slices/lodgeSlice';
import { validateRoomForm } from '../../../../utils/validation';
import { XMarkIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';

interface RoomFormProps {
  room: Room | null;
  lodge: Lodge | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, lodge, onClose, onSuccess }) => {
  const { addRoom, editRoom, isLoading } = useLodges();
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    type: 'standard' as Room['type'],
    capacity: 2,
    beds: {
      single: 0,
      double: 1,
      queen: 0,
      king: 0
    },
    amenities: [] as string[],
    images: [] as string[],
    pricing: {
      normal: 100,
      busy: 150,
      slow: 80
    },
    status: 'available' as Room['status'],
    description: '',
    size: 25,
    view: '',
    floor: 1,
    isActive: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [amenityInput, setAmenityInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  // Room types with descriptions
  const roomTypes = [
    { value: 'standard', label: 'Standard', description: 'Basic room with essential amenities' },
    { value: 'deluxe', label: 'Deluxe', description: 'Enhanced room with premium features' },
    { value: 'suite', label: 'Suite', description: 'Spacious suite with separate living area' },
    { value: 'family', label: 'Family', description: 'Large room suitable for families' },
    { value: 'executive', label: 'Executive', description: 'Business-oriented room with work space' }
  ];

  // Room status options
  const statusOptions = [
    { value: 'available', label: 'Available', color: 'text-green-600' },
    { value: 'occupied', label: 'Occupied', color: 'text-red-600' },
    { value: 'maintenance', label: 'Maintenance', color: 'text-yellow-600' },
    { value: 'out_of_order', label: 'Out of Order', color: 'text-red-600' },
    { value: 'cleaning', label: 'Cleaning', color: 'text-blue-600' }
  ];

  // Common amenities suggestions
  const commonAmenities = [
    'Air Conditioning', 'WiFi', 'TV', 'Mini Bar', 'Safe', 'Balcony', 
    'Sea View', 'Mountain View', 'Room Service', 'Bathtub', 'Shower', 
    'Hair Dryer', 'Coffee Maker', 'Refrigerator', 'Work Desk', 'Telephone'
  ];

  // Common views
  const commonViews = [
    'Garden View', 'Pool View', 'Sea View', 'Mountain View', 
    'City View', 'Courtyard View', 'Falls View', 'Safari View'
  ];

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number,
        name: room.name,
        type: room.type,
        capacity: room.capacity,
        beds: room.beds,
        amenities: room.amenities,
        images: room.images,
        pricing: room.pricing,
        status: room.status,
        description: room.description,
        size: room.size,
        view: room.view,
        floor: room.floor,
        isActive: room.isActive
      });
    }
  }, [room]);

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

  const handleAddAmenity = (amenity?: string) => {
    const amenityToAdd = amenity || amenityInput.trim();
    if (amenityToAdd && !formData.amenities.includes(amenityToAdd)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityToAdd]
      }));
      if (!amenity) setAmenityInput('');
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

  const calculateTotalBeds = () => {
    return formData.beds.single + formData.beds.double + formData.beds.queen + formData.beds.king;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lodge) {
      setErrors({ general: 'No lodge selected' });
      return;
    }

    const validationErrors = validateRoomForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (room) {
        await editRoom(lodge.id, room.id, formData);
      } else {
        await addRoom(lodge.id, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: 'Failed to save room. Please try again.' });
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`${room ? 'Edit' : 'Add'} Room${lodge ? ` - ${lodge.name}` : ''}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Room Number"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            error={errors.number}
            placeholder="e.g., 101, A1, Suite-1"
            required
          />
          <Input
            label="Room Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="e.g., Victoria Suite, Garden Room"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {roomTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type}</p>
            )}
          </div>
        </div>

        {/* Room Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Capacity (guests)"
            type="number"
            min="1"
            max="20"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 1)}
            error={errors.capacity}
            required
          />
          <Input
            label="Size (m²)"
            type="number"
            min="1"
            value={formData.size}
            onChange={(e) => handleChange('size', parseInt(e.target.value) || 1)}
            error={errors.size}
            required
          />
          <Input
            label="Floor"
            type="number"
            min="0"
            max="50"
            value={formData.floor}
            onChange={(e) => handleChange('floor', parseInt(e.target.value) || 0)}
            error={errors.floor}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              View
            </label>
            <input
              list="views-list"
              value={formData.view}
              onChange={(e) => handleChange('view', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Select or type view"
            />
            <datalist id="views-list">
              {commonViews.map(view => (
                <option key={view} value={view} />
              ))}
            </datalist>
            {errors.view && (
              <p className="mt-1 text-sm text-red-600">{errors.view}</p>
            )}
          </div>
        </div>

        {/* Bed Configuration */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bed Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Single Beds"
              type="number"
              min="0"
              max="10"
              value={formData.beds.single}
              onChange={(e) => handleChange('beds.single', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Double Beds"
              type="number"
              min="0"
              max="10"
              value={formData.beds.double}
              onChange={(e) => handleChange('beds.double', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Queen Beds"
              type="number"
              min="0"
              max="10"
              value={formData.beds.queen}
              onChange={(e) => handleChange('beds.queen', parseInt(e.target.value) || 0)}
            />
            <Input
              label="King Beds"
              type="number"
              min="0"
              max="10"
              value={formData.beds.king}
              onChange={(e) => handleChange('beds.king', parseInt(e.target.value) || 0)}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Total beds: {calculateTotalBeds()}
            {errors.beds && <span className="text-red-600 ml-2">{errors.beds}</span>}
          </p>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing (USD per night)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Normal Rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricing.normal}
              onChange={(e) => handleChange('pricing.normal', parseFloat(e.target.value) || 0)}
              error={errors['pricing.normal']}
              required
            />
            <Input
              label="Busy Season Rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricing.busy}
              onChange={(e) => handleChange('pricing.busy', parseFloat(e.target.value) || 0)}
              error={errors['pricing.busy']}
              required
            />
            <Input
              label="Slow Season Rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.pricing.slow}
              onChange={(e) => handleChange('pricing.slow', parseFloat(e.target.value) || 0)}
              error={errors['pricing.slow']}
              required
            />
          </div>
        </div>

        {/* Room Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Status
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {statusOptions.map(status => (
              <label key={status.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={formData.status === status.value}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${status.color}`}>{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the room features, layout, and special characteristics..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Room Amenities</h3>
          
          {/* Quick Add Common Amenities */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick Add:</p>
            <div className="flex flex-wrap gap-2">
              {commonAmenities.filter(amenity => !formData.amenities.includes(amenity)).slice(0, 8).map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAddAmenity(amenity)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  + {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amenity Input */}
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add custom amenity"
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
            />
            <Button type="button" onClick={() => handleAddAmenity()} variant="outline">
              <PlusIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Amenities */}
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

        {/* Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Room Images</h3>
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
            />
            <Button type="button" onClick={handleAddImage} variant="outline">
              <PhotoIcon className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Room image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center bg-gray-100">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room Active Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Room is active and available for booking
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {room ? 'Update Room' : 'Create Room'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomForm;