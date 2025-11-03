import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Mail, Phone, Home, X } from 'lucide-react';
import { formatCurrency, calculateNights } from '../utils/formatters';
import { propertyService } from '../services/api';
import '../styles/BookingForm.css';

// Helper function to format numbers with commas
const formatNumberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to remove commas for processing
const removeCommas = (str) => {
  return str.replace(/,/g, '');
};

const BookingForm = ({ propertyId, properties, onSubmit, onCancel, initialValues = {} }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || initialValues?.propertyId || '');
  
  const [formData, setFormData] = useState({
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    checkInDate: initialValues?.checkInDate || '',
    checkOutDate: initialValues?.checkOutDate || '',
    guests: initialValues?.guests ? formatNumberWithCommas(initialValues.guests) : '',
    specialRequests: initialValues?.specialRequests || '',
    propertyId: propertyId || initialValues?.propertyId || ''
  });

  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails(propertyId);
    }
  }, [propertyId]);

  const fetchPropertyDetails = async (id) => {
    try {
      setLoading(true);
      // Use the propertyService from the API services
      try {
        const response = await propertyService.getById(id);
        setProperty(response);
        setLoading(false);
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);
        // Fallback to mock data if API call fails
        setProperty({
          id: id,
          name: "Beach Villa",
          price: 65000,
          location: "Lekki Phase 1, Lagos",
          image: "beach-villa.jpg"
        });
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to load property details");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'propertyId') {
      setSelectedPropertyId(value);
      if (value) {
        fetchPropertyDetails(value);
      } else {
        setProperty(null);
      }
    } else if (name === 'guests') {
      const rawValue = removeCommas(value);
      if (rawValue === '' || /^\d+$/.test(rawValue)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Process the form data - remove commas from number fields
    const processedData = {
      ...formData,
      propertyId: Number(formData.propertyId),
      guests: formData.guests ? Number(removeCommas(formData.guests)) : undefined
    };
    
    // Add guest name field for display purposes
    processedData.guest = `${processedData.firstName} ${processedData.lastName}`;
    
    try {
      setLoading(true);
      await onSubmit(processedData);
      setLoading(false);
    } catch (err) {
      setError("Failed to create booking");
      setLoading(false);
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.checkInDate || !formData.checkOutDate || !formData.propertyId) {
      setError("Please fill in all required fields");
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    // Date validation
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (checkIn >= checkOut) {
      setError("Check-out date must be after check-in date");
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleModalClose = (e) => {
    // Prevent clicks inside the modal from closing it
    if (e && e.target.closest('.booking-form-content')) {
      return;
    }
    onCancel();
  };

  if (loading && !property) {
    return <div className="booking-form-loading">Loading...</div>;
  }

  return (
    <div className="booking-form-modal-overlay" onClick={handleModalClose}>
      <div className="booking-form-content" onClick={(e) => e.stopPropagation()}>
        <div className="booking-form-header">
        <h2 className="booking-form-title">
  {initialValues?.id ? 'Edit Booking' : 'New Booking'}
</h2>
          <button 
            type="button" 
            className="booking-form-close-btn" 
            onClick={onCancel}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && <div className="booking-form-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="booking-form">
          {properties && properties.length > 0 && (
            <div className="form-group">
              <label htmlFor="propertyId">
                <Home size={18} />
                Select Property *
              </label>
              <select
                id="propertyId"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a property --</option>
                {properties.map(prop => (
                  <option key={prop.id} value={prop.id}>{prop.name}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="firstName">
              <User size={18} />
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
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
              value={formData.lastName}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="checkInDate">
              <Calendar size={18} />
              Check-in Date *
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="checkOutDate">
              <Calendar size={18} />
              Check-out Date *
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="guests">
              <User size={18} />
              Number of Guests
            </label>
            <input
              type="text"
              id="guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
              max={property?.maxGuests || 10}
              pattern="^[0-9,]*$"
              inputMode="numeric"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="specialRequests">
              <Home size={18} />
              Special Requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          {property && formData.checkInDate && formData.checkOutDate && (
            <div className="price-summary">
              <h3>Price Summary</h3>
              <div className="price-details">
                <div className="price-row">
                  <span>Stay Duration</span>
                  <span>{calculateNights(formData.checkInDate, formData.checkOutDate)} nights</span>
                </div>
                <div className="price-row">
                  <span>Price per night</span>
                  <span>{formatCurrency(property.price)}</span>
                </div>
                <div className="price-row price-total">
                  <span>Total</span>
                  <span>{formatCurrency(property.price * calculateNights(formData.checkInDate, formData.checkOutDate))}</span>
                </div>
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className="booking-submit-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 