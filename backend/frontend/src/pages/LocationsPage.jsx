import React, { useState, useEffect } from 'react';
import '../styles/LocationsPage.css';
import { MapPin, Search, Filter, Map, List, ExternalLink } from 'lucide-react';
import PropertyMap from '../components/PropertyMap';
import { locationService } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map', 'list', or 'hybrid'
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  useEffect(() => {
    // Fetch property locations from the API
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await locationService.getPropertyLocations();
        setLocations(data);
        setFilteredLocations(data);
      } catch (error) {
        console.error('Error fetching property locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Update filtered locations when search term or filter status changes
  useEffect(() => {
    const filtered = locations.filter(location => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredLocations(filtered);
  }, [searchTerm, filterStatus, locations]);

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleClosePropertyModal = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="locations-container">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Property Locations</h1>
          {/* Add Property button removed */}
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center space-x-3 flex-grow max-w-md">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="relative">
              <select
                className="appearance-none px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-8"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-md">
            <button
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1 ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4" />
              <span className="text-sm">List</span>
            </button>
            <button
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1 ${
                viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleViewModeChange('map')}
            >
              <Map className="h-4 w-4" />
              <span className="text-sm">Map</span>
            </button>
            <button
              className={`px-3 py-1.5 rounded-md flex items-center space-x-1 ${
                viewMode === 'hybrid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleViewModeChange('hybrid')}
            >
              <div className="flex">
                <List className="h-4 w-4" />
                <Map className="h-4 w-4 -ml-1" />
              </div>
              <span className="text-sm">Hybrid</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-spinner"></div>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-6">
          <MapPin className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500 text-center">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className={`${viewMode === 'hybrid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'w-full'}`}>
          {/* Map View */}
          {(viewMode === 'map' || viewMode === 'hybrid') && (
            <div className={`${viewMode === 'hybrid' ? '' : 'w-full'} h-[70vh]`}>
              <PropertyMap 
                properties={filteredLocations} 
                onPropertySelect={handlePropertySelect} 
              />
            </div>
          )}
          
          {/* List View */}
          {(viewMode === 'list' || viewMode === 'hybrid') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer property-card"
                  onClick={() => handlePropertySelect(location)}
                >
                  <div className="relative h-40 property-image">
                    <img
                      src={location.images && location.images.length > 0 
                        ? location.images[0] 
                        : 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 property-status-badge">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        location.status === 'Active' ? 'bg-green-100 text-green-800' :
                        location.status === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {location.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-base text-gray-900">{location.name}</h3>
                    <div className="flex items-start space-x-1 text-gray-600 mt-1 mb-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <p className="text-xs line-clamp-1">{location.address}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-baseline">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(location.rate.replace(/[^\d]/g, ''))}</span>
                        <span className="text-xs text-gray-500 ml-1">/ night</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {location.bedrooms}B • {location.bathrooms}B
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Property Detail Modal (displayed when a property is selected) */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedProperty.name}</h2>
                <button 
                  onClick={handleClosePropertyModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Property Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedProperty.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        selectedProperty.status === 'Active' ? 'text-green-600' :
                        selectedProperty.status === 'Maintenance' ? 'text-orange-600' : 'text-gray-600'
                      }`}>{selectedProperty.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">{formatCurrency(selectedProperty.rate.replace(/[^\d]/g, ''))} per night</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{selectedProperty.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{selectedProperty.bathrooms}</span>
                    </div>
                    {selectedProperty.amenities && (
                      <div>
                        <span className="text-gray-600">Amenities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedProperty.amenities.map((amenity, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Location</h3>
                  <p className="text-gray-600 mb-3">{selectedProperty.address}</p>
                  
                  <div className="h-48 bg-gray-100 rounded-lg relative">
                    {selectedProperty.location ? (
                      <div id="property-detail-map" className="w-full h-full relative rounded-lg">
                        <iframe
                          title={`Map of ${selectedProperty.name}`}
                          width="100%"
                          height="100%"
                          style={{ border: 0, borderRadius: '0.5rem' }}
                          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&q=${selectedProperty.location.lat},${selectedProperty.location.lng}&zoom=15`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-indigo-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                <p className="text-gray-600">{selectedProperty.description || "No description available."}</p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={handleClosePropertyModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;