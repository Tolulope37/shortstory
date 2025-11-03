import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, ArrowRight, Check, X, MessageSquare, FileText, Clock, AlertCircle, Star } from 'lucide-react';

export default function GuestBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: [],
    cancelled: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setBookings({
        upcoming: [
          {
            id: 1,
            propertyName: "Lekki Paradise Villa",
            propertyImage: "https://placehold.co/600x400/3b82f6/ffffff?text=Lekki+Paradise",
            location: "Lekki Phase 1, Lagos",
            checkIn: "2025-04-24",
            checkOut: "2025-04-28",
            status: "Confirmed",
            totalPaid: "₦260,000",
            guests: 3,
            reference: "BKNG-24042025-1",
            isCheckinReady: true,
            host: {
              name: "Oluwaseun Adeyemi",
              responseRate: 98,
              image: "https://placehold.co/100x100/718096/ffffff?text=OA"
            }
          },
          {
            id: 2,
            propertyName: "Victoria Island Luxury Suite",
            propertyImage: "https://placehold.co/600x400/f59e0b/ffffff?text=VI+Luxury+Suite",
            location: "Victoria Island, Lagos",
            checkIn: "2025-05-15",
            checkOut: "2025-05-20",
            status: "Pending",
            totalPaid: "₦425,000",
            guests: 2,
            reference: "BKNG-15052025-2",
            isCheckinReady: false,
            host: {
              name: "Chinwe Okonkwo",
              responseRate: 95,
              image: "https://placehold.co/100x100/4299e1/ffffff?text=CO"
            }
          }
        ],
        past: [
          {
            id: 3,
            propertyName: "Abuja Executive Home",
            propertyImage: "https://placehold.co/600x400/ec4899/ffffff?text=Abuja+Executive",
            location: "Maitama, Abuja",
            checkIn: "2024-12-10",
            checkOut: "2024-12-15",
            status: "Completed",
            totalPaid: "₦375,000",
            guests: 4,
            reference: "BKNG-10122024-3",
            hasReview: true,
            rating: 5,
            host: {
              name: "Mohammed Ibrahim",
              responseRate: 92,
              image: "https://placehold.co/100x100/ed8936/ffffff?text=MI"
            }
          },
          {
            id: 4,
            propertyName: "Ikeja GRA Apartment",
            propertyImage: "https://placehold.co/600x400/10b981/ffffff?text=Ikeja+Apartment",
            location: "Ikeja GRA, Lagos",
            checkIn: "2024-11-05",
            checkOut: "2024-11-10",
            status: "Completed",
            totalPaid: "₦225,000",
            guests: 1,
            reference: "BKNG-05112024-4",
            hasReview: false,
            host: {
              name: "Amaka Nwosu",
              responseRate: 97,
              image: "https://placehold.co/100x100/9f7aea/ffffff?text=AN"
            }
          }
        ],
        cancelled: [
          {
            id: 5,
            propertyName: "Port Harcourt Garden Villa",
            propertyImage: "https://placehold.co/600x400/667eea/ffffff?text=PH+Garden",
            location: "GRA Phase 2, Port Harcourt",
            checkIn: "2025-03-15",
            checkOut: "2025-03-20",
            status: "Cancelled",
            totalPaid: "₦0",
            refundStatus: "Refunded",
            refundAmount: "₦300,000",
            cancellationReason: "Personal emergency",
            reference: "BKNG-15032025-5",
            guests: 2,
            host: {
              name: "Emeka Obi",
              responseRate: 90,
              image: "https://placehold.co/100x100/48bb78/ffffff?text=EO"
            }
          }
        ]
      });
      setIsLoading(false);
    }, 800);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate number of nights
  const calculateNights = (checkIn, checkOut) => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate days until check-in
  const getDaysUntilCheckIn = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = Math.abs(checkIn - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Bookings</h1>
        <p className="text-gray-500">View and manage all your stays.</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'upcoming' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
            {bookings.upcoming.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {bookings.upcoming.length}
              </span>
            )}
          </button>
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'past' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('past')}
          >
            Past Stays
            {bookings.past.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {bookings.past.length}
              </span>
            )}
          </button>
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'cancelled' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
            {bookings.cancelled.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {bookings.cancelled.length}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Bookings list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto bg-gray-200"></div>
                <div className="p-4 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {bookings[activeTab].length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {activeTab === 'upcoming' ? (
                  <Calendar size={24} className="text-gray-400" />
                ) : activeTab === 'past' ? (
                  <Clock size={24} className="text-gray-400" />
                ) : (
                  <X size={24} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No {activeTab} bookings</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'upcoming' 
                  ? "You don't have any upcoming stays." 
                  : activeTab === 'past'
                  ? "You haven't completed any stays yet."
                  : "You don't have any cancelled bookings."}
              </p>
              {activeTab === 'upcoming' && (
                <Link 
                  to="/guest/browse"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Find a place to stay
                </Link>
              )}
            </div>
          ) : (
            bookings[activeTab].map(booking => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Property image */}
                  <div className="md:w-1/4 relative">
                    <img 
                      src={booking.propertyImage} 
                      alt={booking.propertyName}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    {activeTab === 'upcoming' && booking.isCheckinReady && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Check-in Ready
                      </div>
                    )}
                    {activeTab === 'past' && booking.hasReview && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Check size={12} className="mr-1" /> Reviewed
                      </div>
                    )}
                    {activeTab === 'cancelled' && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Cancelled
                      </div>
                    )}
                  </div>
                  
                  {/* Booking details */}
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{booking.propertyName}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-1">
                          <MapPin size={14} className="mr-1" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                            <span className="mx-1">•</span>
                            {calculateNights(booking.checkIn, booking.checkOut)} nights
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:text-right">
                        {activeTab === 'upcoming' && (
                          <div className="mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        )}
                        <p className="text-gray-500 text-sm">Booking #{booking.reference}</p>
                        <p className="font-bold">{booking.totalPaid}</p>
                      </div>
                    </div>
                    
                    {/* Status section based on tab */}
                    {activeTab === 'upcoming' && (
                      <div className="flex items-center text-xs mb-4">
                        <Clock size={14} className="text-blue-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-800">
                            Check-in in {getDaysUntilCheckIn(booking.checkIn)} days
                          </p>
                          <p className="text-gray-600">
                            {booking.isCheckinReady 
                              ? "Details ready. View in booking details." 
                              : "Details available 24h before stay."}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'past' && !booking.hasReview && (
                      <div className="flex items-center text-xs mb-4">
                        <Star size={14} className="text-yellow-600 mr-2" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            Share your experience
                          </p>
                          <p className="text-gray-600">
                            Your feedback helps future guests and hosts
                          </p>
                        </div>
                        <Link 
                          to={`/guest/review/${booking.id}`}
                          className="ml-auto bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium"
                        >
                          Review
                        </Link>
                      </div>
                    )}
                    
                    {activeTab === 'cancelled' && (
                      <div className="flex items-center text-xs mb-4">
                        <AlertCircle size={14} className="text-gray-600 mr-2" />
                        <div>
                          <p className="font-medium text-gray-800">
                            Cancelled: {booking.cancellationReason}
                          </p>
                          <p className="text-gray-600">
                            Refund: <span className="font-medium text-green-600">{booking.refundStatus} ({booking.refundAmount})</span>
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Host section */}
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src={booking.host.image} 
                          alt={booking.host.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hosted by {booking.host.name}</p>
                        <p className="text-xs text-gray-500">{booking.host.responseRate}% response rate</p>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link
                        to={`/guest/bookings/${booking.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FileText size={14} className="mr-1" />
                        Details
                      </Link>
                      
                      {activeTab === 'upcoming' && (
                        <Link
                          to={`/guest/messages?booking=${booking.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <MessageSquare size={14} className="mr-1" />
                          Contact Host
                        </Link>
                      )}
                      
                      {activeTab === 'past' && !booking.hasReview && (
                        <Link
                          to={`/guest/review/${booking.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          <Star size={14} className="mr-1" />
                          Review
                        </Link>
                      )}
                      
                      {activeTab === 'past' && booking.hasReview && (
                        <Link
                          to={`/guest/property/${booking.propertyName.replace(/\s+/g, '-').toLowerCase()}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Calendar size={14} className="mr-1" />
                          Book Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 