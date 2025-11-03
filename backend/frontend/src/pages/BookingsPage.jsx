import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Edit, Trash, Plus, Filter, Search, ExternalLink, X } from 'lucide-react';
import { bookingService, propertyService } from '../services/api';
import BookingForm from '../components/BookingForm';
import { formatCurrency as formatCurrencyUtil } from '../utils/formatters';
import '../styles/BookingForm.css';

export default function BookingsPage() {
  const [searchParams] = useSearchParams();
  const propertyIdFromUrl = searchParams.get('propertyId');
  
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsBooking, setDetailsBooking] = useState(null);
  const [filter, setFilter] = useState('all'); // all, confirmed, pending, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingBooking, setViewingBooking] = useState(null);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusText = status || '';
    const badgeClasses = {
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${badgeClasses[statusText.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusText}
      </span>
    );
  };

  // Payment status badge component
  const PaymentBadge = ({ status }) => {
    const statusText = status || '';
    const badgeClasses = {
      paid: 'bg-green-100 text-green-800 border-green-300',
      unpaid: 'bg-red-100 text-red-800 border-red-300',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${badgeClasses[statusText.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {statusText}
      </span>
    );
  };

  // Platform source badge component
  const PlatformBadge = ({ platform }) => {
    const badgeClasses = {
      'airbnb': 'bg-red-50 text-red-700 border-red-200',
      'booking.com': 'bg-blue-50 text-blue-700 border-blue-200',
      'vrbo': 'bg-green-50 text-green-700 border-green-200',
      'direct': 'bg-purple-50 text-purple-700 border-purple-200',
      'expedia': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    
    const platformText = platform || '';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${badgeClasses[platformText.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
        {platformText}
      </span>
    );
  };

  useEffect(() => {
    fetchBookings();
    fetchProperties();
    
    // If propertyId is in URL params, open the booking form
    if (propertyIdFromUrl) {
      handleAddBookingWithProperty(propertyIdFromUrl);
    }
  }, [propertyIdFromUrl]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAll();
      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      // Don't show error - just show empty state for new users
      setBookings([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getAll();
      setProperties(response.properties || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setProperties([]); // NO MOCK DATA - Show empty
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        // Try API call first
        try {
          await bookingService.delete(id);
        } catch (apiError) {
          console.error('API error, using local deletion only:', apiError);
        }
        // Update local state regardless
        setBookings(bookings.filter(b => b.id !== id));
      } catch (err) {
        setError('Failed to delete booking. Please try again later.');
        console.error(err);
      }
    }
  };

  const handleViewBooking = (booking) => {
    setViewingBooking(booking);
    setShowDetailsModal(true);
  };

  const handleAddBookingWithProperty = (propertyId) => {
    setSelectedBooking(null);
    setShowAddForm(true);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setShowAddForm(true);
  };

  const handleEditBooking = (booking) => {
    // Transform booking data to match the form fields
    const initialValues = {
      id: booking.id,
      firstName: booking.guest?.split(' ')[0] || '',
      lastName: booking.guest?.split(' ')[1] || '',
      email: booking.guestEmail || '',
      phone: booking.guestPhone || '',
      checkInDate: booking.checkIn || '',
      checkOutDate: booking.checkOut || '',
      propertyId: booking.propertyId || '',
      guests: booking.guests || 1,
      specialRequests: booking.notes || ''
    };
    
    setSelectedBooking(initialValues);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setSelectedBooking(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsBooking(null);
  };

  const handleBookingFormSubmit = async (formData) => {
    try {
      if (selectedBooking?.id) {
        // Update existing booking
        try {
          // Try API first
          const updated = await bookingService.update(selectedBooking.id, formData);
          setBookings(bookings.map(b => b.id === selectedBooking.id ? updated : b));
        } catch (apiError) {
          console.error('API error, using local update only:', apiError);
          // Fall back to local update
          const updated = {
            ...bookings.find(b => b.id === selectedBooking.id),
            guest: `${formData.firstName} ${formData.lastName}`,
            guestEmail: formData.email,
            guestPhone: formData.phone,
            propertyId: formData.propertyId,
            property: properties.find(p => p.id == formData.propertyId)?.name || 'Unknown Property',
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
            notes: formData.specialRequests,
            guests: formData.guests
          };
          setBookings(bookings.map(b => b.id === selectedBooking.id ? updated : b));
        }
      } else {
        // Add new booking
        try {
          // Try API first
          const newBooking = await bookingService.create(formData);
          setBookings([...bookings, newBooking]);
        } catch (apiError) {
          console.error('API error, using local creation only:', apiError);
          // Fall back to local creation
          const newBooking = {
            ...formData,
            id: Math.max(...bookings.map(b => b.id), 0) + 1,
            guest: `${formData.firstName} ${formData.lastName}`,
            guestEmail: formData.email,
            guestPhone: formData.phone,
            property: properties.find(p => p.id == formData.propertyId)?.name || 'Unknown Property',
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
            status: 'Pending',
            platformSource: 'Direct',
            paymentStatus: 'Unpaid',
            totalAmount: '0'
          };
          setBookings([...bookings, newBooking]);
        }
      }
      setShowAddForm(false);
      setSelectedBooking(null);
    } catch (err) {
      setError('Failed to save booking. Please try again later.');
      console.error(err);
    }
  };

  // Filter and search bookings
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (filter !== 'all' && booking.status && booking.status.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (booking.guest && booking.guest.toLowerCase().includes(searchLower)) ||
        (booking.guestEmail && booking.guestEmail.toLowerCase().includes(searchLower)) ||
        (booking.property && booking.property.toLowerCase().includes(searchLower)) ||
        (booking.platformSource && booking.platformSource.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setViewingBooking(null);
  };

  const handleEditFromDetails = () => {
    setSelectedBooking(viewingBooking);
    setShowAddForm(true);
    setShowDetailsModal(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading bookings...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <button 
          onClick={handleAddBooking}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
        >
          <Plus size={16} className="mr-1" />
          New Booking
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('confirmed')}
                className={`px-3 py-1 text-sm rounded-full ${filter === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Confirmed
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-3 py-1 text-sm rounded-full ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('cancelled')}
                className={`px-3 py-1 text-sm rounded-full ${filter === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
              >
                Cancelled
              </button>
            </div>
          </div>
          <div className="flex items-center rounded-lg bg-gray-100 p-2 w-64">
            <Search size={16} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">No bookings found.</p>
          <button 
            onClick={handleAddBooking}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            Create Your First Booking
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="pl-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Guest
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dates
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Platform
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="pr-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    {/* Guest Info */}
                    <td className="py-3 pl-6">
                      <div className="flex items-center">
                        <div className="h-9 w-9 flex-shrink-0 mr-3">
                          <img
                            className="h-full w-full rounded-full object-cover"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.guest || '')}&background=random`}
                            alt={booking.guest || ''}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{booking.guest}</div>
                          <div className="text-gray-500 text-xs">{booking.guestEmail}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Property */}
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="h-9 w-9 flex-shrink-0 mr-3">
                          <img
                            className="h-full w-full rounded-md object-cover"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(booking.property || '')}&bold=true&background=random`}
                            alt={booking.property || ''}
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{booking.property}</div>
                      </div>
                    </td>
                    
                    {/* Dates */}
                    <td className="py-3">
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500">Check-in</div>
                        <div className="text-sm">{formatDate(booking.checkIn)}</div>
                        <div className="text-xs text-gray-500 mt-1">Check-out</div>
                        <div className="text-sm">{formatDate(booking.checkOut)}</div>
                      </div>
                    </td>
                    
                    {/* Platform */}
                    <td className="py-3">
                      <PlatformBadge platform={booking.platformSource} />
                    </td>
                    
                    {/* Total */}
                    <td className="py-3">
                      <span className="text-sm font-medium">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </td>
                    
                    {/* Payment Status */}
                    <td className="py-3">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    
                    {/* Booking Status */}
                    <td className="py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3 pr-6">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-gray-400 hover:text-amber-600"
                          title="Edit Booking"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Booking"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showAddForm && (
        <BookingForm 
          booking={selectedBooking}
          properties={properties}
          propertyId={selectedBooking?.propertyId}
          onSubmit={handleBookingFormSubmit}
          onCancel={handleCancelForm}
          initialValues={selectedBooking}
        />
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && viewingBooking && (
        <div className="booking-form-modal-overlay">
          <div className="booking-details-modal">
            <div className="booking-form-header">
              <h2>Booking Details</h2>
              <button
                className="booking-form-close-btn"
                onClick={closeDetailsModal}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="booking-details-content">
              <div className="booking-details-section">
                <h3>Guest Information</h3>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Name</span>
                    <span className="details-value">{viewingBooking.guest}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Email</span>
                    <span className="details-value">{viewingBooking.guestEmail || 'Not provided'}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Phone</span>
                    <span className="details-value">{viewingBooking.guestPhone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-details-section">
                <h3>Stay Details</h3>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Property</span>
                    <span className="details-value">{viewingBooking.property}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Check-in Date</span>
                    <span className="details-value">{formatDate(viewingBooking.checkIn)}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Check-out Date</span>
                    <span className="details-value">{formatDate(viewingBooking.checkOut)}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Nights</span>
                    <span className="details-value">{calculateDays(viewingBooking.checkIn, viewingBooking.checkOut)}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Guests</span>
                    <span className="details-value">{viewingBooking.guests}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Status</span>
                    <span className="details-value">
                      <StatusBadge status={viewingBooking.status} />
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="booking-details-section">
                <h3>Payment Information</h3>
                <div className="details-grid">
                  <div className="details-item">
                    <span className="details-label">Total Price</span>
                    <span className="details-value">{viewingBooking.totalAmount ? formatCurrency(viewingBooking.totalAmount) : '0'}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Payment Status</span>
                    <span className="details-value">
                      <PaymentBadge status={viewingBooking.paymentStatus} />
                    </span>
                  </div>
                </div>
              </div>
              
              {viewingBooking.notes && (
                <div className="booking-details-section">
                  <h3>Notes & Special Requests</h3>
                  <p className="booking-notes">{viewingBooking.notes}</p>
                </div>
              )}
              
              <div className="booking-details-actions">
                <button className="edit-btn" onClick={handleEditFromDetails}>
                  <Edit size={16} />
                  Edit Booking
                </button>
                <button className="delete-btn" onClick={() => handleDeleteBooking(viewingBooking.id)}>
                  <Trash size={16} />
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function calculateDays(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatCurrency(amount) {
  return formatCurrencyUtil(amount);
} 