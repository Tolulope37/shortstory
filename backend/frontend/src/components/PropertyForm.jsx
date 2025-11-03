import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Check, AlertCircle, Trash2, Plus } from 'lucide-react';

// Helper function to format numbers with commas
const formatNumberWithCommas = (num) => {
  if (!num && num !== 0) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to remove commas for processing
const removeCommas = (str) => {
  return str.toString().replace(/,/g, '');
};

export default function PropertyForm({ property, onSubmit, onCancel }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'Available',
    rate: '',
    description: '',
    bedrooms: property?.bedrooms ? formatNumberWithCommas(property.bedrooms) : '',
    bathrooms: property?.bathrooms ? formatNumberWithCommas(property.bathrooms) : '',
    maxGuests: property?.maxGuests ? formatNumberWithCommas(property.maxGuests) : '',
    amenities: [],
    image: 'https://placehold.co/300x200',
    images: [],
    listedOn: [],
    isActivelyListed: false,
    autoListWhenVacant: false
  });

  // Status options
  const statusOptions = ['Available', 'Occupied', 'Maintenance', 'Renovation'];
  
  // Platform options
  const platformOptions = [
    'Airbnb',
    'Booking.com',
    'VRBO',
    'Expedia',
    'TripAdvisor',
    'Agoda'
  ];

  // Common amenities
  const commonAmenities = [
    'Wi-Fi',
    'Air Conditioning',
    'TV',
    'Kitchen',
    'Washer',
    'Free Parking',
    'Pool',
    'Security',
    'Workspace',
    'Hot Water',
    'Gym',
    '24/7 Check-in',
  ];

  useEffect(() => {
    // If property data is provided (for editing)
    if (property) {
      // Initialize with either existing images array or convert single image to array
      const propertyImages = property.images || 
                            (property.image && property.image !== 'https://placehold.co/300x200' ? 
                              [property.image] : []);
      
      setFormData({
        name: property.name || '',
        location: property.location || '',
        status: property.status || 'Available',
        rate: property.rate ? property.rate.replace('₦', '') : '',
        description: property.description || '',
        bedrooms: property.bedrooms ? formatNumberWithCommas(property.bedrooms) : '',
        bathrooms: property.bathrooms ? formatNumberWithCommas(property.bathrooms) : '',
        maxGuests: property.maxGuests ? formatNumberWithCommas(property.maxGuests) : '',
        amenities: property.amenities || [],
        image: property.image || 'https://placehold.co/300x200',
        images: propertyImages,
        listedOn: property.listedOn || [],
        isActivelyListed: property.isActivelyListed || false,
        autoListWhenVacant: property.autoListWhenVacant || false
      });
      
      // Set main image preview
      setImagePreview(property.image || (propertyImages.length > 0 ? propertyImages[0] : 'https://placehold.co/300x200'));
    }
  }, [property]);
  
  // Effect to handle auto-listing when status changes to Available
  useEffect(() => {
    if (formData.status === 'Available' && formData.autoListWhenVacant) {
      setFormData(prev => ({
        ...prev,
        isActivelyListed: true,
        listedOn: platformOptions // Enable all platforms
      }));
    }
  }, [formData.status, formData.autoListWhenVacant]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for number fields to add comma formatting
    if (name === 'bedrooms' || name === 'bathrooms' || name === 'maxGuests') {
      const rawValue = removeCommas(value);
      if (rawValue === '' || /^\d*\.?\d*$/.test(rawValue)) {
        setFormData({
          ...formData,
          [name]: rawValue === '' ? '' : formatNumberWithCommas(rawValue)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle multiple files
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result;
          
          // Update the first image as main image if none exists
          if (!imagePreview || imagePreview === 'https://placehold.co/300x200') {
            setImagePreview(imageUrl);
            setFormData(prev => ({
              ...prev,
              image: imageUrl
            }));
          }
          
          // Add to images array
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter((_, index) => index !== indexToRemove);
      
      // If we're removing the main image, update the preview
      if (prev.images[indexToRemove] === prev.image) {
        const newMainImage = updatedImages.length > 0 ? 
                            updatedImages[0] : 
                            'https://placehold.co/300x200';
        setImagePreview(newMainImage);
        return {
          ...prev,
          images: updatedImages,
          image: newMainImage
        };
      }
      
      return {
        ...prev,
        images: updatedImages
      };
    });
  };
  
  const setMainImage = (index) => {
    const selectedImage = formData.images[index];
    setImagePreview(selectedImage);
    setFormData(prev => ({
      ...prev,
      image: selectedImage
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity]
        };
      }
    });
  };
  
  const handlePlatformToggle = (platform) => {
    setFormData(prev => {
      const platforms = [...prev.listedOn];
      if (platforms.includes(platform)) {
        return {
          ...prev,
          listedOn: platforms.filter(p => p !== platform)
        };
      } else {
        return {
          ...prev,
          listedOn: [...platforms, platform]
        };
      }
    });
  };
  
  const toggleListingStatus = () => {
    setFormData(prev => ({
      ...prev,
      isActivelyListed: !prev.isActivelyListed
    }));
  };
  
  const toggleAutoList = () => {
    setFormData(prev => ({
      ...prev,
      autoListWhenVacant: !prev.autoListWhenVacant
    }));
  };
  
  const handleSelectAllPlatforms = () => {
    setFormData(prev => ({
      ...prev,
      listedOn: [...platformOptions]
    }));
  };
  
  const handleDeselectAllPlatforms = () => {
    setFormData(prev => ({
      ...prev,
      listedOn: []
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process the form data to remove commas from number fields
    const processedData = {
      ...formData,
      bedrooms: formData.bedrooms ? Number(removeCommas(formData.bedrooms)) : undefined,
      bathrooms: formData.bathrooms ? Number(removeCommas(formData.bathrooms)) : undefined,
      maxGuests: formData.maxGuests ? Number(removeCommas(formData.maxGuests)) : undefined,
    };
    
    onSubmit(processedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{property ? 'Edit Property' : 'Add New Property'}</h2>
            <button 
              onClick={onCancel}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {formData.status === 'Available' && formData.autoListWhenVacant && (
                  <div className="mt-2 text-xs text-emerald-600 flex items-center">
                    <Check size={14} className="mr-1" />
                    Auto-listed across all platforms
                  </div>
                )}
              </div>

              {/* Rate */}
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rate (₦) *
                </label>
                <input
                  type="text"
                  id="rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25000"
                  required
                />
              </div>

              {/* Bedrooms */}
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="text"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  pattern="^[0-9,]*$"
                  inputMode="numeric"
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="text"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  pattern="^[0-9,.]*$"
                  inputMode="numeric"
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Max Guests */}
              <div>
                <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Guests
                </label>
                <input
                  type="text"
                  id="maxGuests"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  pattern="^[0-9,]*$"
                  inputMode="numeric"
                  className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Main Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Images
                </label>
                <div className="mt-1 flex flex-col">
                  {/* Main image preview */}
                  <div 
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center overflow-hidden relative"
                  >
                    {imagePreview && imagePreview !== 'https://placehold.co/300x200' ? (
                      <div className="w-full h-full relative group">
                        <img 
                          src={imagePreview} 
                          alt="Main property image" 
                          className="w-full h-full object-cover"
                        />
                        <div 
                          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={triggerFileInput}
                        >
                          <span className="text-white text-sm font-medium">Change Main Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center" onClick={triggerFileInput}>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">Upload property images</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Image gallery */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Property Gallery ({formData.images.length} images)
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div 
                              className={`w-full h-20 rounded-lg overflow-hidden border-2 ${
                                image === formData.image ? 'border-blue-500' : 'border-gray-200'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Property ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => setMainImage(index)}
                                  className="p-1 bg-blue-500 rounded-full text-white mr-1"
                                  title="Set as main image"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-1 bg-red-500 rounded-full text-white"
                                  title="Remove image"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            {image === formData.image && (
                              <span className="absolute bottom-0 left-0 right-0 text-center text-xs bg-blue-500 text-white py-0.5">
                                Main
                              </span>
                            )}
                          </div>
                        ))}
                        <div 
                          className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
                          onClick={triggerFileInput}
                        >
                          <Plus size={20} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* File input (hidden) */}
                  <input
                    ref={fileInputRef}
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    className="hidden"
                  />
                  
                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Add Photos
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your property..."
              ></textarea>
            </div>

            {/* Listing Status */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <p className="block text-sm font-medium text-gray-700">Listing Status</p>
                  <button
                    type="button"
                    onClick={toggleListingStatus}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      formData.isActivelyListed ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Toggle listing status</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        formData.isActivelyListed ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  {formData.isActivelyListed 
                    ? 'Property is actively listed and visible to guests' 
                    : 'Property is not listed and hidden from guests'}
                </p>
                
                {/* Auto-list when vacant toggle */}
                <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Auto-list when vacant</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically list this property across all platforms when status changes to Available
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAutoList}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                      formData.autoListWhenVacant ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <span className="sr-only">Toggle auto-list</span>
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        formData.autoListWhenVacant ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                
                {/* Listing Platforms */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">Listed on platforms</p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleSelectAllPlatforms}
                        disabled={!formData.isActivelyListed}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 disabled:opacity-50"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllPlatforms}
                        disabled={!formData.isActivelyListed}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 disabled:opacity-50"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {platformOptions.map(platform => (
                      <div key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`platform-${platform}`}
                          checked={formData.listedOn.includes(platform)}
                          onChange={() => handlePlatformToggle(platform)}
                          className="mr-2 h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
                          disabled={!formData.isActivelyListed}
                        />
                        <label 
                          htmlFor={`platform-${platform}`} 
                          className={`text-sm ${!formData.isActivelyListed ? 'text-gray-400' : 'text-gray-700'}`}
                        >
                          {platform}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {!formData.isActivelyListed && (
                    <p className="text-xs text-orange-500 mt-2 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      Enable active listing status to select platforms
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <p className="block text-sm font-medium text-gray-700 mb-2">Amenities</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {commonAmenities.map(amenity => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="mr-2 h-4 w-4 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                {property ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 