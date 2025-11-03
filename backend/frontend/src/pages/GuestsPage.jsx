import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Search, Filter, Plus, Star, Clock, Eye, Edit, Trash, 
  Heart, Award, Phone, Mail, Calendar, Home, MapPin, X, MessageSquare,
  StarIcon, Save, CheckCircle
} from 'lucide-react';
import { guestService } from '../services/api';
import '../styles/GuestsPage.css';
import '../styles/BookingForm.css';
import { createPortal } from 'react-dom';

export default function GuestsPage() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, regular, new, vip
  const [statusFilter, setStatusFilter] = useState('all'); // all, current, past
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid'); // grid or list
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: 'Regular',
    notes: ''
  });
  const [newGuestData, setNewGuestData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    property: '',
    guests: 1,
    specialRequests: '',
    location: '',
    type: 'Regular'
  });
  const [guestRating, setGuestRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingNote, setRatingNote] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Type badge component
  const GuestTypeBadge = ({ type }) => {
    const typeClasses = {
      regular: 'guest-regular',
      new: 'guest-new',
      vip: 'guest-vip'
    };

    return (
      <span className={`guest-badge ${typeClasses[type.toLowerCase()] || 'guest-new'}`}>
        {type}
      </span>
    );
  };

  // Review score component
  const ReviewScore = ({ score }) => {
    let scoreClass = 'review-average';
    
    if (score >= 4.5) {
      scoreClass = 'review-excellent';
    } else if (score >= 4) {
      scoreClass = 'review-good';
    } else if (score < 3) {
      scoreClass = 'review-poor';
    }
    
    return (
      <span className={`review-score ${scoreClass}`}>
        {score} <Star size={12} className="ml-1" />
      </span>
    );
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const data = await guestService.getAll();
      setGuests(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch guests:', err);
      // Don't show error - just show empty state for new users
      setGuests([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGuest = (guest) => {
    setSelectedGuest(guest);
    setShowDetailsModal(true);
  };

  const handleEditProfile = () => {
    if (selectedGuest) {
      setEditProfileData({
        name: selectedGuest.name,
        email: selectedGuest.email,
        phone: selectedGuest.phone,
        location: selectedGuest.location,
        type: selectedGuest.type,
        notes: selectedGuest.notes || ''
      });
      setShowEditProfileModal(true);
    }
  };

  const handleCloseDetailsModal = () => {
    setSelectedGuest(null);
    setShowDetailsModal(false);
  };

  // Filter and search guests
  const filteredGuests = guests.filter(guest => {
    // Filter by type
    if (filter !== 'all' && guest.type.toLowerCase() !== filter.toLowerCase()) {
      return false;
    }
    
    // Filter by status (current/past)
    if (statusFilter !== 'all') {
      const today = new Date();
      if (statusFilter === 'current' && !guest.upcomingStay) {
        return false;
      }
      if (statusFilter === 'past' && guest.upcomingStay) {
        return false;
      }
    }
    
    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        guest.name?.toLowerCase().includes(searchLower) ||
        guest.email?.toLowerCase().includes(searchLower) ||
        guest.phone?.toLowerCase().includes(searchLower) ||
        guest.location?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Helper functions
  function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function calculateDaysAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }

  function getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(part => part[0]).join('');
  }

  // Handle add guest form changes
  const handleAddGuestChange = (e) => {
    const { name, value } = e.target;
    setNewGuestData({
      ...newGuestData,
      [name]: value
    });
  };

  // Validate guest form
  const validateGuestForm = () => {
    // Basic validation
    if (!newGuestData.firstName || !newGuestData.lastName || !newGuestData.email) {
      setError("Please fill in all required fields");
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newGuestData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    setError(null);
    return true;
  };

  // Handle add guest submission
  const handleAddGuestSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateGuestForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Create a new guest object
      const fullName = `${newGuestData.firstName} ${newGuestData.lastName}`;
      const newGuest = {
        id: guests.length + 1, // Temporary ID for mock data
        name: fullName,
        email: newGuestData.email,
        phone: newGuestData.phone,
        location: newGuestData.location,
        type: newGuestData.type,
        stayCount: 0,
        upcomingStay: newGuestData.checkInDate || null,
        lastStay: null,
        totalSpent: "0",
        averageStayLength: 0,
        reviewScore: null,
        notes: newGuestData.specialRequests,
        recentProperties: [newGuestData.property],
        bookingHistory: []
      };
      
      try {
        // Try API first
        // await guestService.create(newGuest);
        
        // For now, just add to the local state
        setGuests([...guests, newGuest]);
        setShowAddGuestModal(false);
        setNewGuestData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          checkInDate: '',
          checkOutDate: '',
          property: '',
          guests: 1,
          specialRequests: '',
          location: '',
          type: 'Regular'
        });
      } catch (apiError) {
        console.error('API error when creating guest:', apiError);
        // Fall back to just updating local state
        setGuests([...guests, newGuest]);
        setShowAddGuestModal(false);
      }
    } catch (err) {
      setError('Failed to add guest. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (e) => {
    // Prevent clicks inside the modal from closing it
    if (e && e.target.closest('.booking-form-content')) {
      return;
    }
    setShowAddGuestModal(false);
  };

  const handleMessageGuest = (guestId) => {
    navigate(`/communications?guest=${guestId}`);
  };

  // Function to handle opening the rating modal
  const handleRateGuest = () => {
    if (selectedGuest) {
      // Temporarily hide the guest details modal when opening the rating modal
      const detailsModal = document.querySelector('.guest-details-modal')?.parentElement;
      if (detailsModal) {
        detailsModal.style.display = 'none';
      }
      
      setGuestRating(selectedGuest.guestRating || 0);
      setHoverRating(0);
      setRatingNote(selectedGuest.ratingNote || '');
      setSubmitError('');
      setShowRatingModal(true);
    }
  };
  
  // Function to handle rating selection
  const handleRatingClick = (rating) => {
    setGuestRating(rating);
    setSubmitError('');
  };
  
  // Function to handle rating hover
  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };
  
  // Function to submit the guest rating
  const handleSubmitRating = () => {
    if (guestRating === 0) {
      setSubmitError("Please select a rating before submitting");
      return;
    }
    
    setSubmitError("");
    setRatingSubmitted(true);
    
    // Update the selected guest with the new rating
    const updatedGuest = {
      ...selectedGuest,
      guestRating: guestRating,
      ratingNote: ratingNote
    };
    
    // Update the guest in the guests array
    const updatedGuests = guests.map(guest => 
      guest.id === selectedGuest.id ? updatedGuest : guest
    );
    
    // Update state
    setSelectedGuest(updatedGuest);
    setGuests(updatedGuests);
    
    // Close modal after a short delay to show success message
    setTimeout(() => {
      setRatingSubmitted(false);
      setShowRatingModal(false);
    }, 1500);
  };
  
  // Function to close the rating modal
  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setRatingSubmitted(false);
    setSubmitError('');
    
    // Restore the guest details modal
    const detailsModal = document.querySelector('.guest-details-modal')?.parentElement;
    if (detailsModal) {
      detailsModal.style.display = 'flex';
    }
  };
  
  // Guest Rating Stars component
  const RatingStars = ({ rating, size = 20, interactive = false, onRatingClick, onRatingHover }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star}
            className={`cursor-${interactive ? 'pointer' : 'default'} p-0.5`}
            onClick={() => interactive && onRatingClick && onRatingClick(star)}
            onMouseEnter={() => interactive && onRatingHover && onRatingHover(star)}
            onMouseLeave={() => interactive && onRatingHover && onRatingHover(0)}
          >
            <Star 
              size={size} 
              className={`${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors`} 
            />
          </div>
        ))}
      </div>
    );
  };

  // Add handleEditProfileChange function
  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add handleEditProfileSubmit function
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Split name into first and last name
      const nameParts = editProfileData.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      // Create updated guest object
      const updatedGuest = {
        ...selectedGuest,
        name: editProfileData.name,
        email: editProfileData.email,
        phone: editProfileData.phone,
        location: editProfileData.location,
        type: editProfileData.type,
        notes: editProfileData.notes
      };
      
      // Update in API
      try {
        await guestService.update(selectedGuest.id, updatedGuest);
      } catch (apiError) {
        console.error('API error, updating locally:', apiError);
      }
      
      // Update in local state
      setGuests(prevGuests => 
        prevGuests.map(guest => 
          guest.id === selectedGuest.id ? updatedGuest : guest
        )
      );
      
      // Update selected guest
      setSelectedGuest(updatedGuest);
      
      // Close modal
      setShowEditProfileModal(false);
      setLoading(false);
    } catch (err) {
      setError("Failed to update guest profile");
      setLoading(false);
    }
  };

  const handleCloseEditProfileModal = (e) => {
    if (e && e.target.closest('.modal-content')) {
      return;
    }
    setShowEditProfileModal(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading guests...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Guests</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/loyalty')}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 flex items-center"
          >
            <Award size={16} className="mr-2" />
            Loyalty Program
          </button>
          <button 
            onClick={() => setShowAddGuestModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Guest
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
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
                  onClick={() => setFilter('regular')}
                  className={`px-3 py-1 text-sm rounded-full ${filter === 'regular' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Regular
                </button>
                <button 
                  onClick={() => setFilter('vip')}
                  className={`px-3 py-1 text-sm rounded-full ${filter === 'vip' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  VIP
                </button>
                <button 
                  onClick={() => setFilter('new')}
                  className={`px-3 py-1 text-sm rounded-full ${filter === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  New
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <div className="flex space-x-2">
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  All Guests
                </button>
                <button 
                  onClick={() => setStatusFilter('current')}
                  className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'current' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Current Guests
                </button>
                <button 
                  onClick={() => setStatusFilter('past')}
                  className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'past' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700'}`}
                >
                  Past Guests
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded-lg ${viewType === 'grid' ? 'bg-gray-200' : 'bg-gray-100'}`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded-lg ${viewType === 'list' ? 'bg-gray-200' : 'bg-gray-100'}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex items-center rounded-lg bg-gray-100 p-2 w-64">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search guests..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guests List */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">No guests found.</p>
          <button 
            onClick={() => setShowAddGuestModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            Add Your First Guest
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewType === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuests.map(guest => (
                <div key={guest.id} className="guest-card bg-white">
                  <div className="guest-card-header">
                    <div className="guest-avatar">
                      {getInitials(guest.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{guest.name}</h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <GuestTypeBadge type={guest.type} />
                        <span className={`stay-count ${guest.stayCount > 5 ? 'high' : guest.stayCount > 2 ? 'medium' : ''}`}>
                          {guest.stayCount} {guest.stayCount === 1 ? 'stay' : 'stays'}
                        </span>
                      </div>
                    </div>
                    {guest.reviewScore && (
                      <ReviewScore score={guest.reviewScore} />
                    )}
                  </div>
                  <div className="guest-card-body">
                    <div className="guest-card-section">
                      <div className="guest-card-section-title">Contact</div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Mail size={14} className="mr-2" /> {guest.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2" /> {guest.phone}
                      </div>
                    </div>
                    
                    <div className="guest-card-section">
                      <div className="guest-card-section-title">Recent Stay</div>
                      <div className="text-sm text-gray-800 font-medium mb-1">
                        {guest.recentProperties && guest.recentProperties[0] ? guest.recentProperties[0] : 'No recent properties'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={14} className="mr-2" /> 
                        {guest.lastStay ? formatDate(guest.lastStay) : 'No recent stays'}
                      </div>
                    </div>
                    
                    {guest.upcomingStay && (
                      <div className="guest-card-section">
                        <div className="guest-card-section-title">Upcoming</div>
                        <div className="flex items-center text-sm text-blue-600">
                          <Calendar size={14} className="mr-2" /> 
                          {formatDate(guest.upcomingStay)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="guest-card-footer">
                    <button 
                      onClick={() => handleViewGuest(guest)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      title="View details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => console.log('Edit guest', guest.id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                      title="Edit guest"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => console.log('Delete guest', guest.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Delete guest"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* List View */}
          {viewType === 'list' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stays
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Stay
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Upcoming
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGuests.map(guest => (
                      <tr key={guest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="guest-avatar h-8 w-8 text-sm">
                              {getInitials(guest.name)}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{guest.name}</div>
                              <div className="text-xs text-gray-500">{guest.location || 'No location'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{guest.email}</div>
                          <div className="text-xs text-gray-500">{guest.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <GuestTypeBadge type={guest.type} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`stay-count ${guest.stayCount > 5 ? 'high' : guest.stayCount > 2 ? 'medium' : ''}`}>
                            {guest.stayCount} {guest.stayCount === 1 ? 'stay' : 'stays'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {guest.lastStay ? formatDate(guest.lastStay) : 'No recent stays'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          {guest.upcomingStay ? formatDate(guest.upcomingStay) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {guest.reviewScore && <ReviewScore score={guest.reviewScore} />}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleViewGuest(guest)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View details"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => console.log('Edit guest', guest.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit guest"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => console.log('Delete guest', guest.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete guest"
                            >
                              <Trash size={16} />
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
        </>
      )}

      {/* Add Guest Modal */}
      {showAddGuestModal && (
        <div className="booking-form-modal-overlay" onClick={handleModalClose}>
          <div className="booking-form-content" onClick={(e) => e.stopPropagation()}>
            <div className="booking-form-header">
              <h2 className="booking-form-title">Add New Guest</h2>
              <button 
                type="button" 
                className="booking-form-close-btn" 
                onClick={() => setShowAddGuestModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            {error && <div className="booking-form-error">{error}</div>}
            
            <form onSubmit={handleAddGuestSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="firstName">
                  <User size={18} />
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newGuestData.firstName}
                  onChange={handleAddGuestChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">
                  <User size={18} />
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newGuestData.lastName}
                  onChange={handleAddGuestChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newGuestData.email}
                  onChange={handleAddGuestChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={newGuestData.phone}
                  onChange={handleAddGuestChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="property">
                  <Home size={18} />
                  Select Property
                </label>
                <select
                  id="property"
                  name="property"
                  value={newGuestData.property}
                  onChange={handleAddGuestChange}
                >
                  <option value="">-- Select a property --</option>
                  <option value="Lekki Paradise Villa">Lekki Paradise Villa</option>
                  <option value="Ikeja GRA Apartment">Ikeja GRA Apartment</option>
                  <option value="Victoria Island Luxury Suite">Victoria Island Luxury Suite</option>
                  <option value="Abuja Executive Home">Abuja Executive Home</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="checkInDate">
                  <Calendar size={18} />
                  Check-in Date
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={newGuestData.checkInDate}
                  onChange={handleAddGuestChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="checkOutDate">
                  <Calendar size={18} />
                  Check-out Date
                </label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={newGuestData.checkOutDate}
                  onChange={handleAddGuestChange}
                  min={newGuestData.checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="guests">
                  <User size={18} />
                  Number of Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  value={newGuestData.guests}
                  onChange={handleAddGuestChange}
                  min="1"
                  max="10"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">
                  <Award size={18} />
                  Guest Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={newGuestData.type}
                  onChange={handleAddGuestChange}
                >
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="New">New</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">
                  <MapPin size={18} />
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newGuestData.location}
                  onChange={handleAddGuestChange}
                />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="specialRequests">
                  <Edit size={18} />
                  Special Requests
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={newGuestData.specialRequests}
                  onChange={handleAddGuestChange}
                  rows="3"
                />
              </div>
              
              {newGuestData.property && newGuestData.checkInDate && newGuestData.checkOutDate && (
                <div className="price-summary" style={{ gridColumn: '1 / -1' }}>
                  <h3>Stay Summary</h3>
                  <div className="price-details">
                    <div className="price-row">
                      <span>Property</span>
                      <span>{newGuestData.property}</span>
                    </div>
                    <div className="price-row">
                      <span>Stay Duration</span>
                      <span>
                        {newGuestData.checkInDate && newGuestData.checkOutDate ? 
                          calculateDaysAgo(newGuestData.checkInDate, newGuestData.checkOutDate) : '0'} nights
                      </span>
                    </div>
                    <div className="price-row">
                      <span>Guests</span>
                      <span>{newGuestData.guests} {newGuestData.guests === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="booking-submit-button"
                disabled={loading}
                style={{ gridColumn: '1 / -1' }}
              >
                {loading ? 'Processing...' : 'Add Guest'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Guest Details Modal */}
      {showDetailsModal && selectedGuest && (
        <div className="booking-form-modal-overlay" onClick={handleCloseDetailsModal}>
          <div 
            className="guest-details-modal max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">Guest Profile</h2>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={handleCloseDetailsModal}
                aria-label="Close"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* Guest Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-500 text-white text-2xl font-bold">
                    {getInitials(selectedGuest.name)}
                  </div>
                  <div className="ml-5">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-bold text-gray-900">{selectedGuest.name}</h1>
                      <div className="flex items-center gap-3">
                        <GuestTypeBadge type={selectedGuest.type} />
                        <div className="flex items-center text-gray-500">
                          <MapPin size={16} className="mr-1" />
                          <span>{selectedGuest.location}</span>
                        </div>
                        {/* Display guest rating if it exists */}
                        {selectedGuest.guestRating && (
                          <div className="flex items-center gap-1">
                            <RatingStars rating={selectedGuest.guestRating} size={16} />
                            <span className="text-sm text-gray-700">Guest Rating</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-2 md:mt-0">
                  <button 
                    className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-md text-blue-700 hover:bg-blue-100 flex items-center"
                    onClick={handleEditProfile}
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </button>
                  <button 
                    className="px-4 py-2.5 bg-green-50 border border-green-200 rounded-md text-green-700 hover:bg-green-100 flex items-center"
                    onClick={() => handleMessageGuest(selectedGuest.id)}
                  >
                    <MessageSquare size={18} className="mr-2" />
                    Message
                  </button>
                  <button 
                    className="px-4 py-2.5 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 hover:bg-yellow-100 flex items-center"
                    onClick={handleRateGuest}
                  >
                    <Star size={18} className="mr-2" />
                    Rate Guest
                  </button>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col">
                  <span className="text-gray-500 mb-1">Total Stays</span>
                  <span className="text-3xl font-bold">{selectedGuest.stayCount}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col">
                  <span className="text-gray-500 mb-1">Total Spent</span>
                  <span className="text-3xl font-bold">₦{parseInt(selectedGuest.totalSpent || 0).toLocaleString()}</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 flex flex-col">
                  <span className="text-gray-500 mb-1">Avg. Stay Length</span>
                  <span className="text-3xl font-bold">{selectedGuest.averageStayLength} <span className="text-lg font-normal">nights</span></span>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="text-lg font-semibold p-4 border-b border-gray-100">
                      Contact Information
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-start">
                        <Phone size={20} className="text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div>{selectedGuest.phone || "Not provided"}</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail size={20} className="text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div>{selectedGuest.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Guest Rating Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="text-lg font-semibold p-4 border-b border-gray-100">
                      Guest Rating
                    </div>
                    <div className="p-5">
                      {selectedGuest.guestRating ? (
                        <div>
                          <div className="flex items-center mb-3">
                            <div className="mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star}
                                  size={20} 
                                  className="inline-block mr-0.5"
                                  fill={star <= selectedGuest.guestRating ? "#FFD700" : "none"} 
                                  color={(hoverRating || guestRating) >= star ? "#FFD700" : "#d1d5db"} 
                                />
                              ))}
                            </div>
                            <span className="text-gray-700 ml-1">
                              {selectedGuest.guestRating}/5
                            </span>
                          </div>
                          
                          {selectedGuest.ratingNote && (
                            <div className="bg-gray-50 p-3 rounded-md mb-3">
                              <p className="text-gray-700 text-sm italic">"{selectedGuest.ratingNote}"</p>
                            </div>
                          )}
                          
                          <button 
                            onClick={handleRateGuest}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <Edit size={14} className="mr-1" />
                            Update Rating
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <p className="text-gray-600 mb-4">This guest hasn't been rated yet</p>
                          <button 
                            onClick={handleRateGuest}
                            className="px-4 py-2 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 hover:bg-yellow-100 font-medium flex items-center mx-auto"
                          >
                            <Star size={18} className="mr-2" />
                            Rate Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guest Notes */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="text-lg font-semibold p-4 border-b border-gray-100">
                      Notes
                    </div>
                    <div className="p-5">
                      {selectedGuest.notes ? (
                        <p className="text-gray-600">{selectedGuest.notes}</p>
                      ) : (
                        <p className="text-gray-500 italic">No notes available for this guest.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Recent Properties */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="text-lg font-semibold p-4 border-b border-gray-100">
                      Recent Properties
                    </div>
                    <div className="p-5">
                      {selectedGuest.recentProperties && selectedGuest.recentProperties.length > 0 ? (
                        <div className="space-y-3">
                          {selectedGuest.recentProperties.map((property, index) => (
                            <div key={index} className="flex items-center">
                              <Home size={20} className="text-gray-400 mr-3" />
                              <span>{property}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No recent properties.</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - 2/3 width */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold">Booking History</h3>
                      {selectedGuest.bookingHistory && selectedGuest.bookingHistory.length > 2 && (
                        <button className="text-sm text-blue-600 hover:underline">
                          View all bookings
                        </button>
                      )}
                    </div>
                    
                    <div>
                      {selectedGuest.bookingHistory && selectedGuest.bookingHistory.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {selectedGuest.bookingHistory.map(booking => (
                            <div key={booking.id} className="p-5 hover:bg-gray-50 transition-colors">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="text-lg font-medium text-gray-900 mb-1">{booking.property}</h4>
                                  <div className="flex items-center text-gray-500">
                                    <Calendar size={16} className="mr-2" />
                                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                  </div>
                                </div>
                                <div className="font-bold text-lg">
                                  ₦{parseInt(booking.amount).toLocaleString()}
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                {booking.review && (
                                  <div className="text-gray-600 italic max-w-xl">
                                    "{booking.review}"
                                  </div>
                                )}
                                
                                <div className="flex items-center ml-4">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={16} 
                                      className={i < Math.floor(booking.rating) ? 'text-yellow-400' : 'text-gray-200'} 
                                      fill={i < Math.floor(booking.rating) ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm font-medium text-gray-700">{booking.rating}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-5 text-gray-500">No booking history available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rating Modal - Moved to top level */}
      {showRatingModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="text-xl font-bold">Rate Guest</h2>
              <button 
                onClick={handleCloseRatingModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {ratingSubmitted ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <p className="text-lg font-medium text-gray-700">Rating submitted successfully!</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-center text-xl font-medium mb-6">Rate your experience with :</h3>
                    <div className="flex justify-center space-x-6 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          onMouseEnter={() => handleRatingHover(star)}
                          onMouseLeave={() => handleRatingHover(0)}
                          className="p-1 focus:outline-none"
                          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        >
                          <Star 
                            size={45} 
                            className="transition-colors" 
                            fill={(hoverRating || guestRating) >= star ? "#FFD700" : "none"} 
                            color={(hoverRating || guestRating) >= star ? "#FFD700" : "#d1d5db"} 
                            strokeWidth={1}
                          />
                        </button>
                      ))}
                    </div>
                    {submitError && (
                      <p className="text-center text-sm text-red-500 mt-2">{submitError}</p>
                    )}
                  </div>
                  
                  <div className="mb-10">
                    <label htmlFor="ratingNote" className="block text-base font-medium text-gray-700 mb-2">
                      Add a note (optional):
                    </label>
                    <textarea
                      id="ratingNote"
                      value={ratingNote}
                      onChange={(e) => setRatingNote(e.target.value)}
                      placeholder="Share details of your experience with this guest..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={handleCloseRatingModal}
                      className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium min-w-[120px]"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSubmitRating}
                      className="px-6 py-3 bg-blue-500 rounded-md text-white hover:bg-blue-600 font-medium min-w-[120px]"
                    >
                      Submit Rating
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      
      {/* Edit Profile Modal */}
      {showEditProfileModal && selectedGuest && (
        <div className="modal-overlay" onClick={handleCloseEditProfileModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Guest Profile</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowEditProfileModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditProfileSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={16} className="icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editProfileData.name}
                    onChange={handleEditProfileChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} className="icon" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editProfileData.email}
                    onChange={handleEditProfileChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={16} className="icon" />
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editProfileData.phone}
                    onChange={handleEditProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">
                    <MapPin size={16} className="icon" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editProfileData.location}
                    onChange={handleEditProfileChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">
                    <Award size={16} className="icon" />
                    Guest Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={editProfileData.type}
                    onChange={handleEditProfileChange}
                  >
                    <option value="Regular">Regular</option>
                    <option value="New">New</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">
                    <Edit size={16} className="icon" />
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={editProfileData.notes}
                    onChange={handleEditProfileChange}
                    rows="4"
                    placeholder="Add notes about this guest..."
                  ></textarea>
                </div>
                
                <div className="button-group">
                  <button 
                    type="button" 
                    className="btn secondary"
                    onClick={() => setShowEditProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 