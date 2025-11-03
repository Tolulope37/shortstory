import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingForm from './BookingForm';
import { BrowserRouter } from 'react-router-dom';

// Mock the formatters functions
jest.mock('../utils/formatters', () => ({
  formatCurrency: jest.fn(val => `₦${val}`),
  formatDate: jest.fn(date => date),
  calculateNights: jest.fn((checkIn, checkOut) => 2)
}));

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('BookingForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockPropertyId = '123';
  const defaultProps = {
    propertyId: mockPropertyId,
    onSubmit: mockOnSubmit
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders BookingForm with all fields', () => {
    renderWithRouter(<BookingForm {...defaultProps} />);
    
    expect(screen.getByText('Book Your Stay')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Check-in Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Check-out Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Special Requests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Booking/i })).toBeInTheDocument();
  });

  test('populates form with initial values', () => {
    const initialValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      checkInDate: '2023-05-01',
      checkOutDate: '2023-05-03',
      guests: 2,
      specialRequests: 'Need an extra pillow'
    };
    
    renderWithRouter(<BookingForm {...defaultProps} initialValues={initialValues} />);
    
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue('1234567890');
    expect(screen.getByLabelText(/Check-in Date/i)).toHaveValue('2023-05-01');
    expect(screen.getByLabelText(/Check-out Date/i)).toHaveValue('2023-05-03');
    expect(screen.getByLabelText(/Number of Guests/i)).toHaveValue(2);
    expect(screen.getByLabelText(/Special Requests/i)).toHaveValue('Need an extra pillow');
  });

  test('displays validation errors for required fields', async () => {
    renderWithRouter(<BookingForm {...defaultProps} />);
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });
    
    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    renderWithRouter(<BookingForm {...defaultProps} />);
    
    // Fill in all required fields except email
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Check-in Date/i), { target: { value: '2023-05-01' } });
    fireEvent.change(screen.getByLabelText(/Check-out Date/i), { target: { value: '2023-05-03' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
    
    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates check-in/check-out dates', async () => {
    renderWithRouter(<BookingForm {...defaultProps} />);
    
    // Fill in all required fields with invalid dates (check-out before check-in)
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Check-in Date/i), { target: { value: '2023-05-03' } });
    fireEvent.change(screen.getByLabelText(/Check-out Date/i), { target: { value: '2023-05-01' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Check-out date must be after check-in date')).toBeInTheDocument();
    });
    
    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    renderWithRouter(<BookingForm {...defaultProps} />);
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Check-in Date/i), { target: { value: '2023-05-01' } });
    fireEvent.change(screen.getByLabelText(/Check-out Date/i), { target: { value: '2023-05-03' } });
    fireEvent.change(screen.getByLabelText(/Number of Guests/i), { target: { value: '2' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    
    // Check that onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        checkInDate: '2023-05-01',
        checkOutDate: '2023-05-03',
        guests: '2',
        specialRequests: '',
        propertyId: mockPropertyId
      });
    });
    
    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/bookings');
  });

  test('displays price summary when dates are selected', async () => {
    renderWithRouter(<BookingForm {...defaultProps} />);
    
    // Wait for mock property data to load
    await waitFor(() => {
      // Fill in check-in and check-out dates
      fireEvent.change(screen.getByLabelText(/Check-in Date/i), { target: { value: '2023-05-01' } });
      fireEvent.change(screen.getByLabelText(/Check-out Date/i), { target: { value: '2023-05-03' } });
    });
    
    // Check for price summary elements
    await waitFor(() => {
      expect(screen.getByText('Price Summary')).toBeInTheDocument();
      expect(screen.getByText('Stay Duration')).toBeInTheDocument();
      expect(screen.getByText('2 nights')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
    });
  });
}); 