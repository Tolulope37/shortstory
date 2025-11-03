import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, List } from 'lucide-react';
import '../styles/BookPage.css';

const BookingSuccess = () => {
  return (
    <div className="booking-success-container">
      <CheckCircle size={64} className="booking-success-icon" />
      <h1 className="booking-success-title">Booking Confirmed!</h1>
      <p className="booking-success-message">
        Thank you for your booking. We've sent you a confirmation email with all the details.
        <br />
        The property owner will be in touch with you shortly.
      </p>
      <div className="booking-success-buttons">
        <Link to="/bookings" className="view-bookings-btn">
          <List size={16} /> View My Bookings
        </Link>
        <Link to="/" className="return-home-btn">
          <Home size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess; 