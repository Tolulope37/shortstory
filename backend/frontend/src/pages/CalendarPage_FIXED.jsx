// SIMPLIFIED VERSION - Remove all mock data and fetch from API

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { propertyService, bookingService } from '../services/api';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      
      // Fetch properties and bookings from database
      const [propsResponse, bookingsResponse] = await Promise.all([
        propertyService.getAll(),
        bookingService.getAll()
      ]);
      
      setProperties(propsResponse.properties || []);
      setBookings(bookingsResponse.bookings || []);
      
      // Transform bookings to calendar events
      const bookingEvents = (bookingsResponse.bookings || []).map(booking => ({
        id: booking.id,
        title: `${booking.guestName} - ${booking.Property?.name || 'Unknown Property'}`,
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut),
        type: 'booking',
        resource: booking
      }));
      
      setEvents(bookingEvents);
      
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
      setEvents([]); // NO MOCK DATA - Show empty calendar
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
        <p className="text-gray-500">View all bookings and schedules</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

