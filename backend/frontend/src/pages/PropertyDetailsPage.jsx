import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash, Plus, Globe, Check, X, Zap, Share2, ArrowLeft, Award, Star } from 'lucide-react';
import { propertyService } from '../services/api';
import ImageCarousel from '../components/ImageCarousel';
import LoyaltyProgramCard from '../components/LoyaltyProgramCard';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBookingTab, setActiveBookingTab] = useState('all');
  const [activeGuestTab, setActiveGuestTab] = useState('all');
  const [activeMaintenanceTab, setActiveMaintenanceTab] = useState('all');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getById(id);
        setProperty(data);
      } catch (err) {
        setError('Property not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Reusing components from the modal
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

  const handleGoBack = () => {
    navigate('/properties');
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // Try API first
        try {
          await propertyService.delete(property.id);
        } catch (apiError) {
          console.error('API error on delete:', apiError);
        }
        navigate('/properties');
      } catch (err) {
        setError('Failed to delete property');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }

  if (error || !property) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error || 'Property not found'}
        </div>
        <button 
          onClick={handleGoBack}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Properties
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{property.name}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleEdit}
            className="px-4 py-2 bg-indigo-50 border border-indigo-300 rounded-md text-indigo-700 hover:bg-indigo-100 flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit Property
          </button>
          <button 
            onClick={handleDelete}
            className="px-4 py-2 bg-red-50 border border-red-300 rounded-md text-red-700 hover:bg-red-100 flex items-center"
          >
            <Trash size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          {/* Main property image */}
          <div className="relative mb-4">
            <ImageCarousel 
              images={property.images && property.images.length > 0 
                ? property.images 
                : property.image ? [property.image] : []} 
              height="300px"
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-5 mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="font-medium">{property.location}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <StatusBadge status={property.status} />
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Daily Rate</p>
              <p className="font-bold text-lg text-blue-600">{property.rate}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Revenue</p>
              <p className="font-bold text-lg">{property.revenue || "₦0"}</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                <p className="text-xl font-semibold">{property.bedrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                <p className="text-xl font-semibold">{property.bathrooms}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Max Guests</p>
                <p className="text-xl font-semibold">{property.maxGuests}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
                <p className="text-xl font-semibold">{property.bookings || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {property.amenities && property.amenities.map((amenity, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-full">
                  {amenity}
                </span>
              ))}
              {(!property.amenities || property.amenities.length === 0) && (
                <span className="text-gray-500">No amenities listed</span>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Listing Information</h3>
            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-2">Listing Status</p>
                <ListingBadge isActive={property.isActivelyListed} />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-2">Auto-List When Vacant</p>
                {property.autoListWhenVacant ? (
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
                  {property.listedOn && property.listedOn.length > 0 ? (
                    property.listedOn.map((platform, index) => (
                      <PlatformBadge key={index} platform={platform} />
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">Not listed on any platforms</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Current Daily Rate</p>
                <p className="text-xl font-semibold text-blue-600">{property.rate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-xl font-semibold">{property.revenue || "₦0"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Monthly Average</p>
                <p className="text-xl font-semibold">₦{Math.round(parseInt(property.revenue?.replace(/[^\d]/g, '') || 0) / 3).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Occupancy Rate</p>
                <p className="text-xl font-semibold">{Math.round((property.bookings || 0) / 3 * 10)}%</p>
              </div>
            </div>
          </div>

          {/* Bookings Tab Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
          
          {/* Guests Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
                <button 
                  onClick={() => setActiveGuestTab('loyalty')}
                  className={`px-3 py-1 rounded text-sm font-medium flex items-center ${
                    activeGuestTab === 'loyalty' ? 'bg-white shadow-sm' : 'text-gray-700'
                  }`}
                >
                  <Award size={14} className="mr-1" />
                  Loyalty
                </button>
              </div>
            </div>
            
            {activeGuestTab !== 'loyalty' ? (
              <div className="py-8 text-center text-gray-500">
                No guests found for this property
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="mr-3 text-blue-500">
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700">ShortStories Loyalty Program</h4>
                      <p className="text-sm text-blue-600">Reward your loyal guests with special perks and incentives.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-3">Current Guest Loyalty Status</h4>
                  <div className="py-4 text-center text-gray-500">
                    No guest selected
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-3">Guest Loyalty Management</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adjust Loyalty Points</label>
                      <div className="flex space-x-2">
                        <input 
                          type="number" 
                          className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm"
                          placeholder="Enter points"
                        />
                        <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
                          Add Points
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Add or remove points (use negative values to deduct)</p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upgrade Tier</label>
                      <div className="flex space-x-2">
                        <select className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm">
                          <option value="">Select Tier</option>
                          <option value="Bronze">Bronze</option>
                          <option value="Silver">Silver</option>
                          <option value="Gold">Gold</option>
                          <option value="Platinum">Platinum</option>
                          <option value="Diamond">Diamond</option>
                        </select>
                        <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
                          Update
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Recent Activity</h5>
                      <div className="bg-gray-50 rounded-md p-3 text-sm text-center text-gray-500">
                        No recent activity
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Show message when no guests match the filter */}
            {activeGuestTab !== 'all' && activeGuestTab !== 'loyalty' && 
             ((activeGuestTab === 'current' && !(activeGuestTab === 'all' || activeGuestTab === 'current')) ||
              (activeGuestTab === 'upcoming' && !(activeGuestTab === 'all' || activeGuestTab === 'upcoming')) ||
              (activeGuestTab === 'past' && !(activeGuestTab === 'all' || activeGuestTab === 'past'))) && (
              <div className="p-8 text-center text-gray-500">
                No {activeGuestTab} guests found for this property.
              </div>
            )}
          </div>
          
          {/* Maintenance Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
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
            {property.status === 'Maintenance' || property.status === 'Renovation' ? (
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
  );
} 