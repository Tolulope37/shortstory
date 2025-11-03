import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  UserCheck, UserX, Trash2, Settings, Filter,
  Home, Users, ClipboardList, DollarSign, Plus, Clock, X,
  CheckCircle, AlertCircle
} from 'lucide-react';
import '../styles/CalendarPage.css';
import { useNavigate } from 'react-router-dom';

// Setup localizer for the calendar
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const navigate = useNavigate();
  // State for event data and display settings
  const [events, setEvents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [filterType, setFilterType] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    type: 'maintenance',
    title: '',
    propertyId: '',
    propertyName: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    staffName: '',
    description: '',
    priority: 'Medium',
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState(null);

  // Define event types and their corresponding colors
  const eventTypes = {
    checkin: { 
      name: 'Check-in', 
      color: '#4ade80', // Green
      icon: <UserCheck size={16} className="mr-1" />
    },
    checkout: { 
      name: 'Check-out', 
      color: '#f87171', // Red
      icon: <UserX size={16} className="mr-1" />
    },
    cleaning: { 
      name: 'Cleaning', 
      color: '#60a5fa', // Blue
      icon: <Trash2 size={16} className="mr-1" />
    },
    maintenance: { 
      name: 'Maintenance', 
      color: '#f59e0b', // Amber
      icon: <Settings size={16} className="mr-1" />
    }
  };

  // Fetch calendar data
  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterProperty !== 'all' && event.propertyId !== parseInt(filterProperty)) return false;
    return true;
  });

  // Function to fetch bookings, cleanings, and maintenance events
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      
      // Fetch from API - NO MOCK DATA
      setProperties([]);
      setEvents([]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setProperties([]);
      setEvents([]);
      setLoading(false);
    }
  };

  // Handlers for calendar interactions
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  const handleNavigate = (newDate) => {
    setDate(newDate);
  };
  
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Handler for creating a new event
  const handleAddEvent = () => {
    setNewEvent({
      type: 'maintenance',
      title: '',
      propertyId: '',
      propertyName: '',
      start: selectedDate || new Date(),
      end: selectedDate || new Date(),
      allDay: false,
      staffName: '',
      description: '',
      priority: 'Medium',
      notes: ''
    });
    setIsEditingEvent(false);
    setShowEventForm(true);
  };

  // Handler for editing an existing event
  const handleEditEvent = (event) => {
    setSelectedEvent(null);
    setShowEventDetails(false);
    
    // Only cleaning and maintenance events can be edited
    if (event.type === 'cleaning' || event.type === 'maintenance') {
      setNewEvent({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      });
      setIsEditingEvent(true);
      setShowEventForm(true);
    } else {
      alert("Booking events cannot be edited directly. Please use the booking management page.");
    }
  };

  // Handler for saving an event (new or edited)
  const handleSaveEvent = () => {
    // Basic validation
    if (!newEvent.title || !newEvent.propertyId) {
      alert("Please fill in all required fields");
      return;
    }

    const property = properties.find(p => p.id === parseInt(newEvent.propertyId));
    
    if (isEditingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === newEvent.id ? {...newEvent, propertyName: property.name} : event
      ));
    } else {
      // Create new event
      const newEventWithId = {
        ...newEvent,
        id: `${newEvent.type}-${Date.now()}`,
        propertyName: property.name
      };
      setEvents([...events, newEventWithId]);
    }
    
    setShowEventForm(false);
  };

  // Handler for slot selection (clicking on a day or time slot)
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    handleAddEvent();
  };

  // Function to format date for display
  const formatDate = (date) => {
    return moment(date).format('MMM DD, YYYY');
  };

  // Function to format time for display
  const formatTime = (date) => {
    return moment(date).format('h:mm A');
  };

  // Function to format datetime for input fields
  const formatDateTimeForInput = (date) => {
    return moment(date).format('YYYY-MM-DDTHH:mm');
  };

  // Custom event styling
  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: eventTypes[event.type]?.color || '#718096',
      borderRadius: '4px',
      opacity: 0.9,
      color: '#fff',
      border: '0',
      display: 'block'
    };
    return { style };
  };

  // Handler for event form changes
  const handleEventFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setNewEvent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Set propertyName when propertyId changes
    if (name === 'propertyId') {
      const property = properties.find(p => p.id === parseInt(value));
      if (property) {
        const title = newEvent.type === 'maintenance' 
          ? `${newEvent.title.split('-')[0].trim()} - ${property.name}` 
          : `Cleaning - ${property.name}`;
          
        setNewEvent(prev => ({
          ...prev,
          propertyName: property.name,
          title
        }));
      }
    }

    // Update title when event type changes
    if (name === 'type') {
      const property = properties.find(p => p.id === parseInt(newEvent.propertyId));
      if (property) {
        const title = value === 'maintenance' 
          ? `Maintenance - ${property.name}` 
          : `Cleaning - ${property.name}`;
          
        setNewEvent(prev => ({
          ...prev,
          title
        }));
      }
    }
  };

  // Custom toolbar component
  const CustomToolbar = ({ onNavigate, label, onView }) => {
    return (
      <div className="calendar-toolbar">
        <div className="toolbar-left">
          <button onClick={() => onNavigate('PREV')} className="nav-button">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => onNavigate('TODAY')} className="today-button">
            Today
          </button>
          <button onClick={() => onNavigate('NEXT')} className="nav-button">
            <ChevronRight size={18} />
          </button>
          <span className="calendar-label">{label}</span>
        </div>
        <div className="toolbar-right">
          <button onClick={() => onView('month')} className={`view-button ${view === 'month' ? 'active' : ''}`}>
            Month
          </button>
          <button onClick={() => onView('week')} className={`view-button ${view === 'week' ? 'active' : ''}`}>
            Week
          </button>
          <button onClick={() => onView('day')} className={`view-button ${view === 'day' ? 'active' : ''}`}>
            Day
          </button>
          <button onClick={() => onView('agenda')} className={`view-button ${view === 'agenda' ? 'active' : ''}`}>
            Agenda
          </button>
        </div>
      </div>
    );
  };

  // Update this function to use React Router navigation
  const handleViewDetails = (event) => {
    setShowEventDetails(false);
    // Redirect based on event type
    if (event.type === 'checkin' || event.type === 'checkout') {
      // Navigate to booking details
      navigate(`/bookings/${event.bookingId}`);
    } else if (event.type === 'cleaning') {
      // Navigate to cleaning task
      navigate(`/maintenance?type=cleaning&id=${event.id}`);
    } else if (event.type === 'maintenance') {
      // Navigate to maintenance task
      navigate(`/maintenance?type=maintenance&id=${event.id}`);
    }
  };

  // UI for the component
  return (
    <div className="calendar-page">
      <div className="page-header">
        <h1 className="page-title">Calendar</h1>
        <p className="page-description">Manage your property schedule, bookings, and maintenance</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="event-type" className="filter-label">
            <Filter size={16} className="filter-icon" />
            Event Type:
          </label>
          <select 
            id="event-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Events</option>
            <option value="checkin">Check-ins</option>
            <option value="checkout">Check-outs</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="property-filter" className="filter-label">
            <Home size={16} className="filter-icon" />
            Property:
          </label>
          <select 
            id="property-filter"
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Properties</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
        </div>

        <div className="legend">
          <span className="legend-title">Legend:</span>
          {Object.entries(eventTypes).map(([key, { name, color, icon }]) => (
            <div key={key} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: color }}></span>
              <span className="legend-label">{name}</span>
            </div>
          ))}
        </div>

        <button 
          className="add-event-button"
          onClick={handleAddEvent}
          title="Add new task"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading calendar data...</p>
        </div>
      ) : (
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            views={['month', 'week', 'day', 'agenda']}
            defaultView={view}
            defaultDate={date}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleEventClick}
            onSelectSlot={handleSelectSlot}
            selectable={true}
            components={{
              toolbar: CustomToolbar
            }}
          />
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="event-modal-backdrop" onClick={() => setShowEventDetails(false)}>
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header" style={{ backgroundColor: eventTypes[selectedEvent.type]?.color }}>
              <h3 className="event-modal-title">
                {eventTypes[selectedEvent.type]?.icon}
                {selectedEvent.title}
              </h3>
              <button 
                className="close-button" 
                onClick={() => setShowEventDetails(false)}
              >
                &times;
              </button>
            </div>
            <div className="event-modal-body">
              <div className="event-info-grid">
                <div className="info-group">
                  <div className="info-label">
                    <Home size={16} className="info-icon" />
                    Property:
                  </div>
                  <div className="info-value">{selectedEvent.propertyName}</div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <CalendarIcon size={16} className="info-icon" />
                    Date:
                  </div>
                  <div className="info-value">
                    {formatDate(selectedEvent.start)}
                    {!selectedEvent.allDay && ` at ${formatTime(selectedEvent.start)}`}
                  </div>
                </div>

                {/* Conditional fields based on event type */}
                {(selectedEvent.type === 'checkin' || selectedEvent.type === 'checkout') && (
                  <>
                    <div className="info-group">
                      <div className="info-label">
                        <Users size={16} className="info-icon" />
                        Guest:
                      </div>
                      <div className="info-value">{selectedEvent.guestName}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">
                        <Users size={16} className="info-icon" />
                        Guests:
                      </div>
                      <div className="info-value">
                        {selectedEvent.guests.adults} Adults, {selectedEvent.guests.children} Children
                      </div>
                    </div>
                    <div className="info-group contact-info">
                      <div className="info-label">
                        <ClipboardList size={16} className="info-icon" />
                        Status:
                      </div>
                      <div className="info-value">
                        <span className={`status-badge ${selectedEvent.status.toLowerCase()}`}>
                          {selectedEvent.status}
                        </span>
                      </div>
                    </div>
                    <div className="info-group contact-info">
                      <div className="info-label">
                        <DollarSign size={16} className="info-icon" />
                        Payment:
                      </div>
                      <div className="info-value">
                        <span className={`payment-badge ${selectedEvent.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                          {selectedEvent.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {selectedEvent.type === 'cleaning' && (
                  <>
                    <div className="info-group">
                      <div className="info-label">Staff:</div>
                      <div className="info-value">{selectedEvent.staffName}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">Notes:</div>
                      <div className="info-value">{selectedEvent.notes}</div>
                    </div>
                  </>
                )}

                {selectedEvent.type === 'maintenance' && (
                  <>
                    <div className="info-group">
                      <div className="info-label">Staff:</div>
                      <div className="info-value">{selectedEvent.staffName}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">Description:</div>
                      <div className="info-value">{selectedEvent.description}</div>
                    </div>
                    <div className="info-group">
                      <div className="info-label">Priority:</div>
                      <div className="info-value">
                        <span className={`priority-badge ${selectedEvent.priority.toLowerCase()}`}>
                          {selectedEvent.priority}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="event-modal-footer">
                <button 
                  className="modal-action-button"
                  onClick={() => handleViewDetails(selectedEvent)}
                >
                  View Details
                </button>
                <button 
                  className="modal-action-button edit"
                  onClick={() => handleEditEvent(selectedEvent)}
                  disabled={selectedEvent.type === 'checkin' || selectedEvent.type === 'checkout'}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal (Add/Edit) */}
      {showEventForm && (
        <div className="event-modal-backdrop" onClick={() => setShowEventForm(false)}>
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header" style={{ backgroundColor: eventTypes[newEvent.type]?.color }}>
              <h3 className="event-modal-title">
                {isEditingEvent ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button 
                className="close-button" 
                onClick={() => setShowEventForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="event-modal-body">
              <form className="event-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event-type">Task Type</label>
                    <select 
                      id="event-type" 
                      name="type"
                      value={newEvent.type}
                      onChange={handleEventFormChange}
                      disabled={isEditingEvent} // Don't allow changing type when editing
                    >
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="propertyId">Property</label>
                    <select 
                      id="propertyId" 
                      name="propertyId"
                      value={newEvent.propertyId}
                      onChange={handleEventFormChange}
                      required
                    >
                      <option value="">Select a property</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>{property.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event-start">Start Date & Time</label>
                    <input 
                      type="datetime-local" 
                      id="event-start" 
                      name="start"
                      value={formatDateTimeForInput(newEvent.start)}
                      onChange={handleEventFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="event-end">End Date & Time</label>
                    <input 
                      type="datetime-local" 
                      id="event-end" 
                      name="end"
                      value={formatDateTimeForInput(newEvent.end)}
                      onChange={handleEventFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="staffName">Staff Name/Team</label>
                    <input 
                      type="text" 
                      id="staffName" 
                      name="staffName"
                      value={newEvent.staffName}
                      onChange={handleEventFormChange}
                      placeholder="Enter staff name or team"
                    />
                  </div>
                  
                  {newEvent.type === 'maintenance' && (
                    <div className="form-group">
                      <label htmlFor="priority">Priority</label>
                      <select 
                        id="priority" 
                        name="priority"
                        value={newEvent.priority}
                        onChange={handleEventFormChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="form-group full-width">
                  <label htmlFor={newEvent.type === 'maintenance' ? "description" : "notes"}>
                    {newEvent.type === 'maintenance' ? "Description" : "Notes"}
                  </label>
                  <textarea 
                    id={newEvent.type === 'maintenance' ? "description" : "notes"} 
                    name={newEvent.type === 'maintenance' ? "description" : "notes"}
                    value={newEvent.type === 'maintenance' ? newEvent.description : newEvent.notes}
                    onChange={handleEventFormChange}
                    rows="3"
                    placeholder={`Enter ${newEvent.type === 'maintenance' ? "maintenance details" : "cleaning notes"}`}
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      name="allDay"
                      checked={newEvent.allDay}
                      onChange={handleEventFormChange}
                    />
                    All Day Event
                  </label>
                </div>
              </form>
            </div>
            <div className="event-modal-footer">
              <button className="modal-action-button cancel" onClick={() => setShowEventForm(false)}>
                Cancel
              </button>
              <button className="modal-action-button save" onClick={handleSaveEvent}>
                {isEditingEvent ? 'Update' : 'Save'} Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage; 