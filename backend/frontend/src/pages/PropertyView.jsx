import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarClock, Share2, Check } from 'lucide-react';
import { propertyService } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import '../styles/PropertyView.css';

const PropertyView = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getById(id);
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

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleShareLink = () => {
    // Generate a direct booking link that includes the property ID
    const bookingUrl = `${window.location.origin}/book/${id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(bookingUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!property) return <div className="not-found">Property not found</div>;

  return (
    <div className="property-view-container">
      <div className="property-view-header">
        <Link to="/properties" className="back-link">
          <ArrowLeft size={16} /> Back to Properties
        </Link>
        <h1>{property.name}</h1>
      </div>

      <div className="property-view-content">
        <div className="property-images">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.name}
              className="main-image"
            />
          ) : (
            <div className="placeholder-image">No image available</div>
          )}
          
          <div className="thumbnail-container">
            {property.images && property.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${property.name} ${index + 2}`}
                className="thumbnail"
              />
            ))}
          </div>
        </div>

        <div className="property-info">
          <div className="property-details">
            <h2>Property Details</h2>
            <p className="property-price">{formatCurrency(property.price)} per night</p>
            <p className="property-location">{property.location}</p>
            {property.type && property.bedrooms && property.bathrooms && (
              <p className="property-type">{property.type} • {property.bedrooms} Bedrooms • {property.bathrooms} Bathrooms</p>
            )}
            {property.maxGuests && (
              <p className="property-capacity">Max Guests: {property.maxGuests}</p>
            )}
            {property.description && (
              <div className="property-description">
                <h3>Description</h3>
                <p>{property.description}</p>
              </div>
            )}
            {property.amenities && property.amenities.length > 0 && (
              <div className="property-amenities">
                <h3>Amenities</h3>
                <ul>
                  {property.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="booking-action">
            <div className="booking-card">
              <h3>Check Availability</h3>
              <p className="booking-price">{formatCurrency(property.price)} per night</p>
              <Link to={`/bookings?propertyId=${property.id}`} className="book-now-btn">
                <CalendarClock size={16} /> Book Now
              </Link>
              <button 
                onClick={handleShareLink}
                className="share-booking-btn"
                aria-label="Share booking link"
              >
                {copied ? <Check size={16} /> : <Share2 size={16} />} 
                {copied ? 'Link copied!' : 'Share booking link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyView; 