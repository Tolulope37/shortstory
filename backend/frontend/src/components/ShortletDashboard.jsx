import { useState, useEffect } from 'react';
import { Home, Calendar, Users, Coins, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './PropertyForm';
import ImageCarousel from './ImageCarousel';
import { propertyService, bookingService } from '../services/api';

export default function ShortletDashboard() {
  const navigate = useNavigate();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Properties from database
  const [properties, setProperties] = useState([]);

  // Fetch properties from database on component mount
  useEffect(() => {
    fetchProperties();
    fetchBookings();
  }, []);

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
        ]
      }));
      
      setProperties(transformedProperties);
      setError(null); // Success! Even if 0 properties
    } catch (err) {
      console.error('Error fetching properties:', err);
      // Don't show error - just show empty state for new users
      setProperties([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const [upcomingBookings, setUpcomingBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAll();
      console.log('Fetched bookings from database:', response);
      
      // Transform bookings to match component format
      const transformedBookings = (response.bookings || []).slice(0, 3).map(booking => ({
        id: booking.id,
        guest: booking.guestName,
        property: booking.Property?.name || 'Unknown Property',
        checkIn: new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        checkOut: new Date(booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: booking.status === 'confirmed' ? 'Confirmed' : 
                booking.status === 'pending' ? 'Pending' : 'Confirmed',
        email: booking.guestEmail,
        phone: booking.guestPhone,
        adults: booking.numberOfGuests || 1,
        children: 0,
        paymentStatus: 'Paid',
        paymentMethod: 'N/A',
        totalAmount: `₦${Number(booking.totalPrice).toLocaleString()}`,
        paymentDate: new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        notes: booking.specialRequests || ''
      }));
      
      setUpcomingBookings(transformedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

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
      case "Confirmed":
        bgColor = "bg-emerald-100 text-emerald-800";
        break;
      case "Pending":
        bgColor = "bg-yellow-100 text-yellow-800";
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

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowPropertyForm(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyForm(true);
  };

  const handleViewProperty = (property) => {
    setViewingProperty(property);
    setShowPropertyModal(true);
    setCurrentImageIndex(0);
  };

  const handleViewAllProperties = () => {
    navigate('/properties');
  };

  const handleViewAllBookings = () => {
    navigate('/bookings');
  };

  const handleViewBookingDetails = (bookingId) => {
    const booking = upcomingBookings.find(b => b.id === bookingId);
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleFormSubmit = async (propertyData) => {
    try {
      if (selectedProperty) {
        // Update existing property - call API
        await propertyService.update(selectedProperty.id, propertyData);
      } else {
        // Add new property - call API
        await propertyService.create(propertyData);
      }
      // Refresh properties from database
      await fetchProperties();
      setShowPropertyForm(false);
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Failed to save property. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchProperties}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your properties.</p>
      </div>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Properties</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Home size={20} className="text-blue-500" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">{properties.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar size={20} className="text-green-500" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">{upcomingBookings.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Guests</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users size={20} className="text-purple-500" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Coins size={20} className="text-yellow-500" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">₦0</p>
          </div>
        </div>
      </div>
      
      {/* Properties and Bookings sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties list */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Property Performance</h2>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                onClick={handleAddProperty}
              >
                Add Property
              </button>
            </div>
          </div>
          
          {/* Properties with financial insights */}
          <div className="p-6">
            <div className="property-performance-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                // Calculate financial metrics from real data
                const occupancyRate = 0; // Will be calculated from bookings
                const profitMargin = 0; // Will be calculated from revenue/expenses
                const monthlyExpenses = 0;
                
                return (
                  <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className="relative">
                      {property.images && property.images.length > 0 ? (
                        <div className="h-48 relative">
                          <ImageCarousel 
                            images={property.images}
                            aspectRatio="4/3"
                            className="h-48"
                          />
                          <div className="absolute top-2 right-2 z-10">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full bg-white ${
                              property.status === 'Occupied' ? 'text-blue-600' :
                              property.status === 'Available' ? 'text-green-600' :
                              property.status === 'Maintenance' ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              {property.status}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 relative">
                          <img
                            src={property.image} 
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 z-10">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full bg-white ${
                              property.status === 'Occupied' ? 'text-blue-600' :
                              property.status === 'Available' ? 'text-green-600' :
                              property.status === 'Maintenance' ? 'text-orange-600' : 'text-gray-600'
                            }`}>
                              {property.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{property.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{property.location}</p>
                      
                      <div className="grid grid-cols-2 gap-y-4">
                        <div>
                          <div className="text-sm text-gray-500">Monthly Revenue</div>
                          <div className="font-bold text-gray-900">₦{property.revenue ? property.revenue.replace('₦', '') : (property.rate.replace('₦', '').replace(',', '') * 20).toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Monthly Expenses</div>
                          <div className="font-medium text-gray-900">₦{Number(monthlyExpenses).toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-3 mt-3">
                        <div>
                          <div className="text-sm text-gray-500">Occupancy Rate</div>
                          <div className="font-medium text-gray-900">{occupancyRate}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${occupancyRate > 80 ? 'bg-blue-500' : occupancyRate > 70 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                              style={{ width: `${occupancyRate}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Profit Margin</div>
                          <div className="font-medium text-gray-900">{profitMargin}%</div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${profitMargin > 30 ? 'bg-green-500' : profitMargin > 20 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                              style={{ width: `${profitMargin}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button 
                          className="p-1"
                          onClick={() => handleViewProperty(property)}
                          title="View property"
                        >
                          <Eye size={20} className="text-blue-600" />
                        </button>
                        <button 
                          className="p-1"
                          onClick={() => handleEditProperty(property)}
                          title="Edit property"
                        >
                          <Edit size={20} className="text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 text-center border-t">
            <button 
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
              onClick={handleViewAllProperties}
            >
              View All Properties
            </button>
          </div>
        </div>
        
        {/* Upcoming bookings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold">Upcoming Bookings</h2>
          </div>
          
          <div className="p-4">
            <ul className="divide-y">
              {upcomingBookings.map(booking => (
                <li key={booking.id} className="py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{booking.guest}</h4>
                    <StatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{booking.property}</p>
                  <div className="flex justify-between text-sm">
                    <span>Check-in: <strong>{booking.checkIn}</strong></span>
                    <span>Check-out: <strong>{booking.checkOut}</strong></span>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button 
                      className="px-3 py-1 text-xs rounded-md border border-blue-500 text-blue-500 hover:bg-blue-50"
                      onClick={() => handleViewBookingDetails(booking.id)}
                    >
                      Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 text-center border-t">
            <button 
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
              onClick={handleViewAllBookings}
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm 
          property={selectedProperty}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowPropertyForm(false)}
        />
      )}

      {/* Property View Modal */}
      {showPropertyModal && viewingProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{viewingProperty.name}</h2>
                <button 
                  onClick={() => setShowPropertyModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div>
                {/* Top section - Property Details, Images and Key Info */}
                <div className="flex flex-col md:flex-row gap-6 mb-4">
                  {/* Left side - Image gallery */}
                  <div className="md:w-2/5">
                    {/* Main image showcase */}
                    <div className="relative mb-4 rounded-lg overflow-hidden">
                      {viewingProperty.images && viewingProperty.images.length > 0 ? (
                        <div className="aspect-[4/3] relative">
                          <img 
                            src={viewingProperty.images[currentImageIndex]} 
                            alt={`${viewingProperty.name} - ${currentImageIndex === 0 ? 'Living Room' : 
                                                               currentImageIndex === 1 ? 'Kitchen' : 
                                                               currentImageIndex === 2 ? 'Bedroom' : 
                                                               'Property Image'}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs rounded-full px-2 py-1">
                            {currentImageIndex + 1}/{viewingProperty.images.length} photos
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={viewingProperty.image} 
                          alt={viewingProperty.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Image thumbnails */}
                    {viewingProperty.images && viewingProperty.images.length > 1 && (
                      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                        {viewingProperty.images.map((img, index) => (
                          <div
                            key={index}
                            className={`relative rounded-lg overflow-hidden h-16 w-24 border-2 cursor-pointer ${
                              currentImageIndex === index ? 'border-blue-500' : 'border-transparent'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                          >
                            <img
                              src={img}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Property Key Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
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
                  
                  {/* Right side - Property details */}
                  <div className="md:w-3/5">
                    <h3 className="text-lg font-bold mb-4">Property Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                        <p className="text-lg font-medium">{viewingProperty.bedrooms || 3}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                        <p className="text-lg font-medium">{viewingProperty.bathrooms || 2}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Max Guests</p>
                        <p className="text-lg font-medium">{viewingProperty.maxGuests || 6}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                        <p className="text-lg font-medium">{viewingProperty.bookings || 0}</p>
                      </div>
                    </div>
                    
                    {/* Amenities Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-md">Wi-Fi</span>
                        <span className="px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-md">Air Conditioning</span>
                        <span className="px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-md">Pool</span>
                      </div>
                    </div>
                    
                    {/* Listing Information */}
                    <div>
                      <h3 className="text-lg font-bold mb-4">Listing Information</h3>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-500 mb-1">Listing Status</p>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Active
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-500 mb-1">Auto-List When Vacant</p>
                        <div className="flex items-center text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Enabled
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">Listed Platforms</p>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 text-red-600 text-sm border border-red-100 rounded-md">Airbnb</span>
                          <span className="px-3 py-1 text-blue-600 text-sm border border-blue-100 rounded-md">Booking.com</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPropertyModal(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-200 flex items-center"
                onClick={() => {
                  handleEditProperty(viewingProperty);
                  setShowPropertyModal(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Property
              </button>
              <button 
                className="px-4 py-2 bg-red-100 border border-red-200 rounded-md text-red-700 hover:bg-red-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Status Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-bold">#{selectedBooking.id.toString().padStart(5, '0')}</p>
                </div>
                <StatusBadge status={selectedBooking.status} />
              </div>
              
              {/* Guest Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Guest Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Guest Name</p>
                      <p className="font-medium">{selectedBooking.guest}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{selectedBooking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-medium">{selectedBooking.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Guests</p>
                      <p className="font-medium">{selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stay Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Stay Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Property</p>
                      <p className="font-medium">{selectedBooking.property}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-medium">{parseInt(selectedBooking.checkOut.split(' ')[1]) - parseInt(selectedBooking.checkIn.split(' ')[1])} nights</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check-in Date</p>
                      <p className="font-medium text-green-600">{selectedBooking.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check-out Date</p>
                      <p className="font-medium text-red-600">{selectedBooking.checkOut}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                      <p className="font-medium">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedBooking.paymentStatus === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedBooking.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                      <p className="font-medium">{selectedBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                      <p className="font-bold text-lg">{selectedBooking.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Payment Date</p>
                      <p className="font-medium">{selectedBooking.paymentDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {selectedBooking.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowBookingModal(false)}
              >
                Close
              </button>
              <button 
                className="px-4 py-2 bg-blue-100 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-200 flex items-center"
                onClick={() => {
                  setShowBookingModal(false);
                  navigate(`/bookings/${selectedBooking.id}`);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Booking
              </button>
              <button 
                className="px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-md text-emerald-700 hover:bg-emerald-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-3h-5.05a2.5 2.5 0 00-4.9 0H3V5a1 1 0 011-1h10a1 1 0 011 1v5h1V5a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2H15a2 2 0 002-2v-5h-5v3H9.05a2.5 2.5 0 01-4.9 0H3a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-4.9 0H5a1 1 0 01-1-1V4z" />
                </svg>
                Check In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 