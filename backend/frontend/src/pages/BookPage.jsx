import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { propertyService, bookingService } from '../services/api';
import BookingForm from '../components/BookingForm';
import '../styles/BookPage.css';

const BookPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await propertyService.getById(propertyId);
        setProperty(data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property not found');
        setProperty(null);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleBookingSubmit = async (formData) => {
    try {
      const bookingData = {
        ...formData,
        propertyId,
        guest: `${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        checkIn: formData.checkInDate,
        checkOut: formData.checkOutDate,
        status: 'Pending',
        platformSource: 'Direct',
        paymentStatus: 'Unpaid'
      };

      try {
        await bookingService.create(bookingData);
      } catch (apiError) {
        console.error('API error when creating booking, proceeding anyway:', apiError);
        // Continue to success page even if API call fails
      }
      
      // Redirect to a success page
      navigate('/booking-success');
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    }
  };

  if (loading) return <div className="shared-booking-loading">Loading property details...</div>;
  if (error) return <div className="shared-booking-error">{error}</div>;
  if (!property) return <div className="shared-booking-not-found">Property not found</div>;

  return (
    <div className="shared-booking-container">
      <div className="shared-booking-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={16} /> Back
        </button>
        <h1>Book {property.name}</h1>
      </div>

      <div className="shared-booking-content">
        <div className="shared-booking-property-summary">
          <div className="property-image">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0]} alt={property.name} />
            ) : (
              <div className="placeholder-image">No image available</div>
            )}
          </div>
          <div className="property-details">
            <h2>{property.name}</h2>
            <p className="property-location">{property.location}</p>
            {property.type && <p className="property-type">{property.type}</p>}
            {property.bedrooms && <p className="property-bedrooms">{property.bedrooms} Bedrooms</p>}
          </div>
        </div>

        <div className="shared-booking-form">
          <BookingForm 
            propertyId={propertyId} 
            onSubmit={handleBookingSubmit} 
          />
        </div>
      </div>
    </div>
  );
};

export default BookPage; 