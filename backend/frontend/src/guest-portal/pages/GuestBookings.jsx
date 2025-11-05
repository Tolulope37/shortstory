import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Download, MessageSquare, X } from 'lucide-react';

export default function GuestBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when guest portal backend is ready
        // const response = await api.get('/guest/bookings');
        // setBookings(response.data || []);
        
        // For now, show empty state
        setBookings([]);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(booking.checkIn) > new Date();
    if (filter === 'past') return new Date(booking.checkOut) < new Date();
    if (filter === 'cancelled') return booking.status === 'Cancelled';
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">View and manage all your bookings</p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {['all', 'upcoming', 'past', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-1 text-sm font-medium capitalize ${
              filter === tab
              ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} {filteredBookings.length > 0 && `(${filteredBookings.length})`}
          </button>
        ))}
      </div>
      
      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t made any bookings yet. Start exploring properties!' 
              : `No ${filter} bookings to display.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {booking.propertyName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {booking.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                  <p className="mt-2 text-lg font-bold text-gray-900">{booking.totalPrice}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal (placeholder) */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Booking ID: {selectedBooking.id}</p>
              <p className="text-gray-600">Property: {selectedBooking.propertyName}</p>
              <p className="text-gray-600">Check-in: {new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
              <p className="text-gray-600">Check-out: {new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
              <p className="text-gray-600">Status: {selectedBooking.status}</p>
              <p className="text-gray-900 font-bold">Total: {selectedBooking.totalPrice}</p>
                </div>
              </div>
        </div>
      )}
    </div>
  );
} 
