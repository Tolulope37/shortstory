import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash, Plus, Globe, Check, X, Zap, Share2, Filter } from 'lucide-react';
import { propertyService } from '../services/api';
import PropertyForm from '../components/PropertyForm';
import ImageCarousel from '../components/ImageCarousel';

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [shareTooltip, setShareTooltip] = useState({ visible: false, propertyId: null });
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    available: 0,
    occupied: 0,
    maintenance: 0
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showNotification, setShowNotification] = useState(true);
  const [activeBookingTab, setActiveBookingTab] = useState('all');
  const [activeGuestTab, setActiveGuestTab] = useState('all');
  const [activeMaintenanceTab, setActiveMaintenanceTab] = useState('all');

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "";
    switch (status) {
      case "Available":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "Occupied":
        bgColor = "bg-blue-100 text-blue-800";
        break;
      case "Maintenance":
        bgColor = "bg-orange-100 text-orange-800";
        break;
      case "Renovation":
        bgColor = "bg-red-100 text-red-800";
        break;
      default:
        bgColor = "bg-gray-100 text-gray-800";
    }
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  // Listing status badge component
  const ListingBadge = ({ isActive }) => {
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center ${isActive ? 'bg-emerald-100 text-emerald-800 w-fit' : 'bg-gray-100 text-gray-800'}`}>
        {isActive ? (
          <>
            <Check size={12} className="mr-1" />
            Active
          </>
        ) : (
          <>
            <X size={12} className="mr-1" />
            Inactive
          </>
        )}
      </span>
    );
  };
  
  // Auto-list badge component
  const AutoListBadge = ({ enabled }) => {
    if (!enabled) return null;
    
    return (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600 flex items-center mr-1 mb-1">
        <Zap size={12} className="mr-1" />
        Auto-list
      </span>
    );
  };

  // Platform badge component
  const PlatformBadge = ({ platform }) => {
    let bgColor = "";
    let label = platform;
    
    switch (platform.toLowerCase()) {
      case "airbnb":
        bgColor = "bg-red-50 text-red-600";
        break;
      case "booking.com":
        bgColor = "bg-blue-50 text-blue-600";
        break;
      case "vrbo":
        bgColor = "bg-green-50 text-green-600";
        break;
      case "expedia":
        bgColor = "bg-yellow-50 text-yellow-700";
        break;
      default:
        bgColor = "bg-purple-50 text-purple-600";
    }
    
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${bgColor} mr-1 mb-1 inline-block`}>
        {label}
      </span>
    );
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    updateFilterCounts();
    filterProperties(activeFilter);
  }, [properties, activeFilter]);

  const updateFilterCounts = () => {
    setFilterCounts({
      all: properties.length,
      active: properties.filter(property => property.isActivelyListed).length,
      inactive: properties.filter(property => !property.isActivelyListed).length,
      available: properties.filter(property => property.status === 'Available').length,
      occupied: properties.filter(property => property.status === 'Occupied').length,
      maintenance: properties.filter(property => 
        property.status === 'Maintenance' || property.status === 'Renovation'
      ).length
    });
  };

  const filterProperties = (filterType) => {
    let result = [...properties];
    
    switch(filterType) {
      case 'active':
        result = properties.filter(property => property.isActivelyListed);
        break;
      case 'inactive':
        result = properties.filter(property => !property.isActivelyListed);
        break;
      case 'available':
        result = properties.filter(property => property.status === 'Available');
        break;
      case 'occupied':
        result = properties.filter(property => property.status === 'Occupied');
        break;
      case 'maintenance':
        result = properties.filter(property => property.status === 'Maintenance' || property.status === 'Renovation');
        break;
      default:
        // 'all' - no filtering needed
        break;
    }
    
    setFilteredProperties(result);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getAll();
      
      // Transform database properties to match component format
      const transformedProperties = (response.properties || []).map(prop => ({
        id: prop.id,
        name: prop.name,
        location: `${prop.city}, ${prop.state}`,
        status: prop.status === 'available' ? 'Available' : 
                prop.status === 'occupied' ? 'Occupied' : 
                prop.status === 'maintenance' ? 'Maintenance' : 'Available',
        rate: `₦${Number(prop.baseRate).toLocaleString()}`,
        bookings: 0,
        revenue: `₦0`,
        image: "https://placehold.co/300x200",
        images: [
          "https://placehold.co/300x200/3b82f6/ffffff?text=Living+Room",
          "https://placehold.co/300x200/10b981/ffffff?text=Bedroom"
        ],
        bedrooms: prop.bedrooms || 0,
        bathrooms: prop.bathrooms || 0,
        maxGuests: prop.maxGuests || 0,
        amenities: prop.amenities || [],
        listedOn: [],
        isActivelyListed: false,
        autoListWhenVacant: false
      }));
      
      setProperties(transformedProperties);
      setError(null); // Success! Even if 0 properties
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      // Don't show error - just show empty state for new users
      setProperties([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowAddForm(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowAddForm(true);
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // Try API call first
        try {
          await propertyService.delete(id);
        } catch (apiError) {
          console.error('API error, using local deletion only:', apiError);
        }
        // Update local state regardless
        setProperties(properties.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete property. Please try again later.');
        console.error(err);
      }
    }
  };
  
  const handleToggleAutoList = async (property) => {
    try {
      // Create updated property data
      const updatedProperty = {
        ...property,
        autoListWhenVacant: !property.autoListWhenVacant
      };
      
      // If property is now available and auto-listing is enabled, activate listings
      if (updatedProperty.status === 'Available' && updatedProperty.autoListWhenVacant) {
        updatedProperty.isActivelyListed = true;
        updatedProperty.listedOn = ['Airbnb', 'Booking.com', 'VRBO', 'Expedia', 'TripAdvisor', 'Agoda'];
      }
      
      // Try API first
      try {
        await propertyService.update(property.id, updatedProperty);
      } catch (apiError) {
        console.error('API error, using local update only:', apiError);
      }
      
      // Update locally
      setProperties(properties.map(p => 
        p.id === property.id ? updatedProperty : p
      ));
    } catch (err) {
      setError('Failed to update auto-list setting. Please try again later.');
      console.error(err);
    }
  };

  const handlePropertyFormSubmit = async (formData) => {
    try {
      if (selectedProperty) {
        // Update existing property
        try {
          // Try API first
          const updated = await propertyService.update(selectedProperty.id, formData);
          setProperties(properties.map(p => p.id === selectedProperty.id ? updated : p));
        } catch (apiError) {
          console.error('API error, using local update only:', apiError);
          // Fall back to local update
          const updated = {
            ...selectedProperty,
            ...formData,
            // Preserve listing data if not included in form
            listedOn: formData.listedOn || selectedProperty.listedOn || [],
            isActivelyListed: formData.isActivelyListed !== undefined 
              ? formData.isActivelyListed 
              : selectedProperty.isActivelyListed || false,
            autoListWhenVacant: formData.autoListWhenVacant !== undefined
              ? formData.autoListWhenVacant
              : selectedProperty.autoListWhenVacant || false
          };
          setProperties(properties.map(p => p.id === selectedProperty.id ? updated : p));
        }
      } else {
        // Add new property
        try {
          // Try API first
          const newProperty = await propertyService.create(formData);
          setProperties([...properties, newProperty]);
        } catch (apiError) {
          console.error('API error, using local creation only:', apiError);
          // Fall back to local creation
          const newProperty = {
            ...formData,
            id: Math.max(...properties.map(p => p.id), 0) + 1,
            bookings: 0,
            revenue: "₦0",
            listedOn: formData.listedOn || [], // New properties start without listings
            isActivelyListed: formData.isActivelyListed || false,
            autoListWhenVacant: formData.autoListWhenVacant || false
          };
          setProperties([...properties, newProperty]);
        }
      }
      setShowAddForm(false);
      setSelectedProperty(null);
    } catch (err) {
      setError('Failed to save property. Please try again later.');
      console.error(err);
    }
  };

  const handleViewProperty = (id) => {
    navigate(`/property/${id}`);
  };

  const handleShareProperty = (e, propertyId) => {
    e.stopPropagation();
    
    // Create a shareable booking link
    const bookingUrl = `${window.location.origin}/book/${propertyId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(bookingUrl)
      .then(() => {
        // Show tooltip
        setShareTooltip({ visible: true, propertyId });
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
          setShareTooltip({ visible: false, propertyId: null });
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingProperty(null);
  };

  const openViewModal = (property) => {
    setViewingProperty(property);
    setShowViewModal(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading properties...</div>;
  }

  return (
    <div className="p-6">
      {/* New feature notification */}
      {showNotification && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md shadow-sm relative">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">New feature:</span> You can now swipe through property images directly from the card. Click or swipe to see more photos!
              </p>
            </div>
          </div>
          <button 
            className="absolute top-4 right-4 text-blue-500 hover:text-blue-700"
            onClick={() => setShowNotification(false)}
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <button 
            onClick={handleAddProperty}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Property
          </button>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              activeFilter === 'all' 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            All
            <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
              {filterCounts.all}
            </span>
          </button>
          <button 
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              activeFilter === 'active' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <Check size={14} className="mr-1" />
            Active Listings
            <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
              {filterCounts.active}
            </span>
          </button>
          <button 
            onClick={() => setActiveFilter('inactive')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              activeFilter === 'inactive' 
                ? 'bg-gray-200 text-gray-800 border border-gray-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <X size={14} className="mr-1" />
            Inactive
            <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
              {filterCounts.inactive}
            </span>
          </button>
          <button 
            onClick={() => setActiveFilter('available')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              activeFilter === 'available' 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Available
            <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
              {filterCounts.available}
            </span>
          </button>
          <button 
            onClick={() => setActiveFilter('occupied')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              activeFilter === 'occupied' 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Occupied
            <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
              {filterCounts.occupied}
            </span>
          </button>
          <button 
            onClick={() => setActiveFilter('maintenance')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              activeFilter === 'maintenance' 
                ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Maintenance
            <span className="ml-1.5 px-1.5 py-0.5 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-200">
              {filterCounts.maintenance}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">
            {properties.length === 0 
              ? "No properties found." 
              : `No properties match the "${activeFilter}" filter.`}
          </p>
          {properties.length === 0 ? (
            <button 
              onClick={handleAddProperty}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Add Your First Property
            </button>
          ) : (
            <button 
              onClick={() => setActiveFilter('all')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Show All Properties
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 relative">
                <ImageCarousel 
                  images={property.images && property.images.length > 0 ? property.images : property.image ? [property.image] : []} 
                  height="100%"
                />
                <div className="absolute top-3 right-3 z-10">
                  <StatusBadge status={property.status} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{property.name}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-3">{property.location}</p>
                
                {/* Listing Status Section */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-medium flex items-center">
                      <Globe size={14} className="mr-1" />
                      Listing Status
                    </span>
                    <ListingBadge isActive={property.isActivelyListed} />
                  </div>
                  
                  {/* Platforms */}
                  <div>
                    <div className="flex flex-wrap mb-2">
                      {property.autoListWhenVacant && (
                        <AutoListBadge enabled={property.autoListWhenVacant} />
                      )}
                      
                      {property.listedOn && property.listedOn.length > 0 ? (
                        property.listedOn.map((platform, index) => (
                          <PlatformBadge key={index} platform={platform} />
                        ))
                      ) : property.isActivelyListed ? (
                        <span className="text-xs text-gray-500 italic">No platforms selected</span>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Not listed on any platforms</span>
                      )}
                    </div>
                    
                    {/* Auto-list quick toggle */}
                    <button
                      onClick={() => handleToggleAutoList(property)}
                      className={`text-xs mt-1 flex items-center ${
                        property.autoListWhenVacant ? 'text-blue-600' : 'text-gray-500'
                      }`}
                    >
                      {property.autoListWhenVacant ? (
                        <>
                          <Zap size={12} className="mr-1" />
                          Auto-list when vacant enabled
                        </>
                      ) : (
                        <>
                          <Zap size={12} className="mr-1" />
                          Enable auto-listing
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Daily rate: <strong>{property.rate}</strong></span>
                  <span>Revenue: <strong>{property.revenue || "₦0"}</strong></span>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button 
                    onClick={() => handleViewProperty(property.id)}
                    className="p-2 rounded-md hover:bg-gray-100 text-blue-600"
                    title="View property"
                  >
                    <Eye size={16} />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={(e) => handleShareProperty(e, property.id)}
                      className="p-2 rounded-md hover:bg-gray-100 text-blue-500"
                      title="Share booking link"
                    >
                      {shareTooltip.visible && shareTooltip.propertyId === property.id ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Share2 size={16} />
                      )}
                    </button>
                    {shareTooltip.visible && shareTooltip.propertyId === property.id && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                        Link copied!
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleEditProperty(property)}
                    className="p-2 rounded-md hover:bg-gray-100 text-indigo-600"
                    title="Edit property"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-2 rounded-md hover:bg-gray-100 text-red-500"
                    title="Delete property"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Property Form Modal using PropertyForm component */}
      {showAddForm && (
        <PropertyForm 
          property={selectedProperty}
          onSubmit={handlePropertyFormSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Property View Modal */}
      {showViewModal && viewingProperty && (
        <div className="booking-form-modal-overlay" onClick={closeViewModal}>
          <div 
            className="property-view-modal max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">{viewingProperty.name}</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={closeViewModal}
                aria-label="Close"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-grow">
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1">
                    {/* Main property image as carousel */}
                    <div className="relative mb-4">
                      <ImageCarousel 
                        images={viewingProperty.images && viewingProperty.images.length > 0 
                          ? viewingProperty.images 
                          : viewingProperty.image ? [viewingProperty.image] : []} 
                        height="300px"
                      />
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5 mb-6">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="font-medium">{viewingProperty.location}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <StatusBadge status={viewingProperty.status} />
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Daily Rate</p>
                        <p className="font-bold text-lg text-blue-600">{viewingProperty.rate}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Revenue</p>
                        <p className="font-bold text-lg">{viewingProperty.revenue || "₦0"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="bg-white mb-6">
                      <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                          <p className="text-xl font-semibold">{viewingProperty.bedrooms}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                          <p className="text-xl font-semibold">{viewingProperty.bathrooms}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Max Guests</p>
                          <p className="text-xl font-semibold">{viewingProperty.maxGuests}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                          <p className="text-xl font-semibold">{viewingProperty.bookings || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {viewingProperty.amenities && viewingProperty.amenities.map((amenity, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-full">
                            {amenity}
                          </span>
                        ))}
                        {(!viewingProperty.amenities || viewingProperty.amenities.length === 0) && (
                          <span className="text-gray-500">No amenities listed</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-4">Listing Information</h3>
                      <div className="mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-gray-500 mb-2">Listing Status</p>
                          <ListingBadge isActive={viewingProperty.isActivelyListed} />
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-sm text-gray-500 mb-2">Auto-List When Vacant</p>
                          {viewingProperty.autoListWhenVacant ? (
                            <span className="text-blue-600 flex items-center">
                              <Zap size={16} className="mr-1.5" />
                              Enabled
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center">
                              <X size={16} className="mr-1.5" />
                              Disabled
                            </span>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Listed Platforms</p>
                          <div className="flex flex-wrap gap-1.5">
                            {viewingProperty.listedOn && viewingProperty.listedOn.length > 0 ? (
                              viewingProperty.listedOn.map((platform, index) => (
                                <PlatformBadge key={index} platform={platform} />
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">Not listed on any platforms</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* NEW: Financial Summary */}
                    <div className="bg-white rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Current Daily Rate</p>
                          <p className="text-xl font-semibold text-blue-600">{viewingProperty.rate}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                          <p className="text-xl font-semibold">{viewingProperty.revenue || "₦0"}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Monthly Average</p>
                          <p className="text-xl font-semibold">₦{Math.round(parseInt(viewingProperty.revenue?.replace(/[^\d]/g, '') || 0) / 3).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
                          <p className="text-xl font-semibold">{Math.round((viewingProperty.bookings || 0) / 3 * 10)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* NEW: Bookings Tab Section */}
                    <div className="bg-white rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Bookings</h3>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button 
                            onClick={() => setActiveBookingTab('all')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeBookingTab === 'all' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setActiveBookingTab('current')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeBookingTab === 'current' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Current
                          </button>
                          <button 
                            onClick={() => setActiveBookingTab('upcoming')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeBookingTab === 'upcoming' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Upcoming
                          </button>
                          <button 
                            onClick={() => setActiveBookingTab('past')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeBookingTab === 'past' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Past
                          </button>
                        </div>
                      </div>
                      
                      {/* Mock Bookings Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Booking ID
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Guest
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check In
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Check Out
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            <tr>
                              <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                No bookings found for this property
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* NEW: Guests Section */}
                    <div className="bg-white rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Guests</h3>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button 
                            onClick={() => setActiveGuestTab('all')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeGuestTab === 'all' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setActiveGuestTab('current')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeGuestTab === 'current' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Current
                          </button>
                          <button 
                            onClick={() => setActiveGuestTab('upcoming')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeGuestTab === 'upcoming' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Upcoming
                          </button>
                          <button 
                            onClick={() => setActiveGuestTab('past')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeGuestTab === 'past' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Past
                          </button>
                        </div>
                      </div>
                      <div className="py-8 text-center text-gray-500">
                        No guests found for this property
                      </div>
                      
                      {/* Show message when no guests match the filter */}
                      {activeGuestTab !== 'all' && 
                       ((activeGuestTab === 'current' && !(activeGuestTab === 'all' || activeGuestTab === 'current')) ||
                        (activeGuestTab === 'upcoming' && !(activeGuestTab === 'all' || activeGuestTab === 'upcoming')) ||
                        (activeGuestTab === 'past' && !(activeGuestTab === 'all' || activeGuestTab === 'past'))) && (
                          <div className="p-8 text-center text-gray-500">
                            No {activeGuestTab} guests found for this property.
                          </div>
                        )}
                    </div>
                    
                    {/* NEW: Maintenance Section */}
                    <div className="bg-white rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Maintenance Issues & Updates</h3>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          <button 
                            onClick={() => setActiveMaintenanceTab('all')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeMaintenanceTab === 'all' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setActiveMaintenanceTab('in-progress')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeMaintenanceTab === 'in-progress' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            In Progress
                          </button>
                          <button 
                            onClick={() => setActiveMaintenanceTab('scheduled')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeMaintenanceTab === 'scheduled' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Scheduled
                          </button>
                          <button 
                            onClick={() => setActiveMaintenanceTab('completed')}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              activeMaintenanceTab === 'completed' ? 'bg-white shadow-sm' : 'text-gray-700'
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      </div>
                      {viewingProperty.status === 'Maintenance' || viewingProperty.status === 'Renovation' ? (
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-orange-700">
                                This property is currently undergoing maintenance.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      
                      <div className="py-8 text-center text-gray-500">
                        No maintenance issues found for this property
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4 flex-shrink-0">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={closeViewModal}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-indigo-50 border border-indigo-300 rounded-md text-indigo-700 hover:bg-indigo-100 flex items-center" 
                onClick={() => {
                  handleEditProperty(viewingProperty);
                  closeViewModal();
                }}
              >
                <Edit size={16} className="mr-2" />
                Edit Property
              </button>
              <button 
                className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-red-700 hover:bg-red-100 flex items-center"
                onClick={() => {
                  closeViewModal();
                  handleDeleteProperty(viewingProperty.id);
                }}
              >
                <Trash size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 