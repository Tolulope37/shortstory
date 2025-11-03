import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Enhanced API configuration with timeout and better error handling
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for consistent error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Log the error for debugging
    if (error.response) {
      // Server responded with an error status
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error Request:', error.request);
    } else {
      // Other errors
      console.error('API Error:', error.message);
    }
    
    // Continue with the error for proper handling in services
    return Promise.reject(error);
  }
);

// Property services
const propertyService = {
  getAll: async () => {
    try {
      const response = await api.get('/properties');
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },
  
  create: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },
  
  update: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
      throw error;
    }
  }
};

// Booking services
const bookingService = {
  getAll: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },
  
  getByPropertyId: async (propertyId) => {
    try {
      const response = await api.get(`/properties/${propertyId}/bookings`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bookings for property ${propertyId}:`, error);
      throw error;
    }
  },
  
  create: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  update: async (id, bookingData) => {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  }
};

// Guest services
const guestService = {
  getAll: async () => {
    try {
      const response = await api.get('/guests');
      return response.data;
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/guests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching guest ${id}:`, error);
      throw error;
    }
  },
  
  getBookingHistory: async (id) => {
    try {
      const response = await api.get(`/guests/${id}/bookings`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking history for guest ${id}:`, error);
      throw error;
    }
  },
  
  create: async (guestData) => {
    try {
      const response = await api.post('/guests', guestData);
      return response.data;
    } catch (error) {
      console.error('Error creating guest:', error);
      throw error;
    }
  },
  
  update: async (id, guestData) => {
    try {
      const response = await api.put(`/guests/${id}`, guestData);
      return response.data;
    } catch (error) {
      console.error(`Error updating guest ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/guests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting guest ${id}:`, error);
      throw error;
    }
  }
};

// Add a new communicationService for guest messaging

const communicationService = {
  // Get all messages for a guest
  getGuestMessages: async (guestId) => {
    // In a real implementation, this would call your backend API
    // For now, we'll return mock data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockMessages = [
      {
        id: 1,
        guestId: guestId,
        sender: 'host',
        content: 'Hi there! Welcome to our ShortStories property. Let me know if you have any questions.',
        timestamp: '2025-05-01T14:30:00',
        read: true,
        type: 'text'
      },
      {
        id: 2,
        guestId: guestId,
        sender: 'guest',
        content: 'Thanks for the welcome! What time is check-in?',
        timestamp: '2025-05-01T14:45:00',
        read: true,
        type: 'text'
      },
      {
        id: 3,
        guestId: guestId,
        sender: 'host',
        content: 'Check-in is at 3 PM. I\'ve sent you the welcome pack with all details.',
        timestamp: '2025-05-01T15:00:00',
        read: true,
        type: 'text'
      },
      {
        id: 4, 
        guestId: guestId,
        sender: 'host',
        content: 'Welcome Pack.pdf',
        timestamp: '2025-05-01T15:01:00',
        read: true,
        type: 'file',
        fileType: 'pdf',
        fileSize: '2.4 MB'
      }
    ];
    
    return mockMessages;
  },
  
  // Send a message to a guest
  sendMessage: async (guestId, message) => {
    // In a real implementation, this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: Date.now(),
      guestId: guestId,
      sender: 'host',
      content: message.content,
      timestamp: new Date().toISOString(),
      read: false,
      type: message.type || 'text',
      ...(message.type === 'file' && { 
        fileType: message.fileType,
        fileSize: message.fileSize
      })
    };
  },
  
  // Get templates for quick responses
  getMessageTemplates: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        title: 'Welcome Message',
        content: 'Hello and welcome to our property! We\'re excited to host you. Please let me know if you need anything to make your stay more comfortable.'
      },
      {
        id: 2,
        title: 'Check-in Instructions',
        content: 'Your check-in is scheduled for tomorrow at 3 PM. The keypad code is 1234. Please text me when you arrive and I\'ll guide you through the process.'
      },
      {
        id: 3,
        title: 'Check-out Reminder',
        content: 'Just a friendly reminder that check-out is at 11 AM tomorrow. Please leave the keys on the table and lock the door behind you. We hope you enjoyed your stay!'
      },
      {
        id: 4,
        title: 'WiFi Information',
        content: 'Here\'s the WiFi information:\nNetwork: ShortStories_Guest\nPassword: welcome2023'
      },
      {
        id: 5,
        title: 'Local Recommendations',
        content: 'Looking for things to do nearby? I recommend checking out the local market (10 min walk) and the beach (15 min drive). Let me know if you\'d like more specific recommendations!'
      }
    ];
  },
  
  // Get welcome pack templates
  getWelcomePacks: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        title: 'Standard Welcome Pack',
        description: 'Basic information about the property, check-in/out procedures, and local amenities.',
        fileSize: '1.2 MB',
        fileType: 'pdf'
      },
      {
        id: 2,
        title: 'Premium Welcome Pack',
        description: 'Comprehensive guide with detailed local recommendations, restaurant discounts, and special amenities.',
        fileSize: '3.5 MB',
        fileType: 'pdf'
      },
      {
        id: 3,
        title: 'Business Traveler Pack',
        description: 'Information focused on work amenities, business centers, and efficient transportation options.',
        fileSize: '1.8 MB',
        fileType: 'pdf'
      }
    ];
  },
  
  // Get check-in templates
  getCheckInPacks: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        title: 'Standard Check-in Package',
        description: 'Basic check-in information, WiFi codes, and house rules.',
        fileSize: '0.8 MB',
        fileType: 'pdf'
      },
      {
        id: 2,
        title: 'Detailed Check-in Guide',
        description: 'Comprehensive instructions with photos for accessing the property and using amenities.',
        fileSize: '2.5 MB',
        fileType: 'pdf'
      },
      {
        id: 3,
        title: 'Digital Key Access',
        description: 'Instructions for using the digital key system and backup entry methods.',
        fileSize: '1.0 MB',
        fileType: 'pdf'
      }
    ];
  },
  
  // Process a guest check-in
  processCheckIn: async (guestId, checkInData) => {
    // In a real implementation, this would update the backend with check-in details
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      checkInTime: new Date().toISOString(),
      message: 'Guest successfully checked in'
    };
  },
  
  // Send automated messages based on guest status
  sendAutomatedMessage: async (guestId, messageType) => {
    // In a real implementation, this would send an automated message from the system
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const messageTemplates = {
      welcome: 'Welcome to our property! We\'re excited to host you.',
      'pre-arrival': 'Your stay is coming up soon! Here\'s some information to prepare for your visit.',
      'check-in': 'Today\'s your check-in day! Here\'s everything you need to know.',
      'during-stay': 'We hope you\'re enjoying your stay! Let us know if you need anything.',
      'check-out': 'Check-out is tomorrow. Here\'s what you need to know before departing.'
    };
    
    return {
      id: Date.now(),
      guestId: guestId,
      sender: 'host',
      content: messageTemplates[messageType] || 'Automated message',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };
  },
  
  // Get message automation trigger settings
  getMessageAutomations: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock data for automation triggers
    return [
      {
        id: 1,
        name: 'Welcome Pack',
        trigger: 'payment_confirmed',
        enabled: true,
        messageType: 'welcome_pack',
        templateId: 1,
        delay: 0, // Send immediately
        delayUnit: 'hours',
        delayPosition: 'after',
        description: 'Send welcome pack after payment is confirmed'
      },
      {
        id: 2,
        name: 'Check-in Instructions',
        trigger: 'one_day_before_arrival',
        enabled: true,
        messageType: 'text',
        templateId: 2,
        delay: 24,
        delayUnit: 'hours',
        delayPosition: 'before',
        description: 'Send check-in instructions one day before arrival'
      },
      {
        id: 3,
        name: 'Checkout Reminder',
        trigger: 'one_day_before_departure',
        enabled: true,
        messageType: 'text',
        templateId: 3,
        delay: 2,
        delayUnit: 'hours',
        delayPosition: 'before',
        description: 'Send checkout information one day before departure'
      }
    ];
  },
  
  // Save or update a message automation trigger
  saveMessageAutomation: async (automation) => {
    // In a real implementation, this would update the backend
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...automation,
      id: automation.id || Date.now()
    };
  },
  
  // Delete a message automation trigger
  deleteMessageAutomation: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: 'Automation trigger deleted successfully'
    };
  }
};

// Team services
const teamService = {
  // Get all team members
  getAllMembers: async () => {
    try {
      const response = await api.get('/team/members');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },
  
  getMemberById: async (id) => {
    try {
      const response = await api.get(`/team/members/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team member ${id}:`, error);
      throw error;
    }
  },
  
  createMember: async (memberData) => {
    try {
      const response = await api.post('/team/members', memberData);
      return response.data;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },
  
  updateMember: async (id, memberData) => {
    try {
      const response = await api.put(`/team/members/${id}`, memberData);
      return response.data;
    } catch (error) {
      console.error(`Error updating team member ${id}:`, error);
      throw error;
    }
  },
  
  deleteMember: async (id) => {
    try {
      const response = await api.delete(`/team/members/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting team member ${id}:`, error);
      throw error;
    }
  },
  
  // Get available roles
  getRoles: async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        { id: 1, name: 'Property Manager', permissions: ['manage_properties', 'manage_bookings', 'manage_team', 'manage_guests'] },
        { id: 2, name: 'Assistant Manager', permissions: ['manage_properties', 'manage_bookings', 'manage_guests'] },
        { id: 3, name: 'Cleaner', permissions: ['view_properties'] },
        { id: 4, name: 'Maintenance', permissions: ['view_properties'] },
        { id: 5, name: 'Guest Concierge', permissions: ['view_properties', 'message_guests'] },
        { id: 6, name: 'Security', permissions: ['view_properties'] },
        { id: 7, name: 'Custom Role', permissions: [] }
      ];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },
  
  // Task management
  getTasks: async (filters = {}) => {
    try {
      const response = await api.get('/team/tasks', { params: filters });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  createTask: async (taskData) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get the team member's name
      let assignedToName = 'Unknown';
      if (taskData.assignedTo) {
        try {
          const member = await teamService.getMemberById(taskData.assignedTo);
          assignedToName = member.name;
        } catch (e) {
          console.error('Could not fetch team member name', e);
        }
      }
      
      // In a real app, you'd make an API call like:
      // const response = await api.post('/team/tasks', taskData);
      // return response.data;
      
      // For now, return a mock response
      return {
        id: Date.now(),
        ...taskData,
        assignedToName,
        createdAt: new Date().toISOString().split('T')[0],
        status: taskData.status || 'pending'
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd make an API call like:
      // const response = await api.put(`/team/tasks/${id}`, taskData);
      // return response.data;
      
      // For now, return a mock response
      return {
        id: Number(id),
        ...taskData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd make an API call like:
      // const response = await api.delete(`/team/tasks/${id}`);
      // return response.data;
      
      // For now, return a mock response
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }
};

// Maintenance service for managing maintenance logs
const maintenanceService = {
  // Get all maintenance logs
  getAllLogs: async (filters = {}) => {
    try {
      const response = await api.get('/maintenance/logs', { params: filters });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
      throw error;
    }
  },
  
  getLogById: async (id) => {
    try {
      const response = await api.get(`/maintenance/logs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching maintenance log ${id}:`, error);
      throw error;
    }
  },
  
  createLog: async (logData) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // In a real implementation, you'd make an API call
      // For now, return a mock response with the data that would be created
      return {
        id: Date.now(),
        ...logData,
        reportedDate: logData.reportedDate || new Date().toISOString().split('T')[0],
        notes: logData.notes || [],
        attachments: logData.attachments || []
      };
    } catch (error) {
      console.error('Error creating maintenance log:', error);
      throw error;
    }
  },
  
  updateLog: async (id, logData) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, you'd make an API call
      return {
        id: Number(id),
        ...logData,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error updating maintenance log ${id}:`, error);
      throw error;
    }
  },
  
  deleteLog: async (id) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, you'd make an API call
      return { success: true, message: 'Maintenance log deleted successfully' };
    } catch (error) {
      console.error(`Error deleting maintenance log ${id}:`, error);
      throw error;
    }
  },
  
  addNote: async (logId, noteData) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real implementation, you'd make an API call
      return {
        id: Date.now(),
        ...noteData,
        date: noteData.date || new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error(`Error adding note to maintenance log ${logId}:`, error);
      throw error;
    }
  },
  
  uploadAttachment: async (logId, fileData) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you'd make an API call to upload the file
      return {
        id: Date.now(),
        name: fileData.name,
        url: `/mock-images/${fileData.name}`,
        type: fileData.type,
        size: fileData.size,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error uploading attachment to maintenance log ${logId}:`, error);
      throw error;
    }
  },
  
  getCategories: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      { id: 'plumbing', name: 'Plumbing' },
      { id: 'electrical', name: 'Electrical' },
      { id: 'appliances', name: 'Appliances' },
      { id: 'furniture', name: 'Furniture' },
      { id: 'structural', name: 'Structural' },
      { id: 'electronics', name: 'Electronics & Internet' },
      { id: 'hvac', name: 'HVAC' },
      { id: 'exterior', name: 'Exterior' },
      { id: 'other', name: 'Other' }
    ];
  }
};

// Location Service for property map functionality
const locationService = {
  // Get all property locations with coordinates
  getPropertyLocations: async (filters = {}) => {
    try {
      const response = await api.get('/properties/locations', { params: filters });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching property locations:', error);
      return [];
    }
  },
  
  // Get a single property location by ID
  getPropertyById: async (id) => {
    // Use the getPropertyLocations function to get all properties
    const locations = await locationService.getPropertyLocations();
    
    // Find the property with the matching ID
    const property = locations.find(p => p.id === parseInt(id));
    
    if (!property) {
      throw new Error('Property not found');
    }
    
    return property;
  },
  
  // Update a property's location
  updatePropertyLocation: async (id, updatedData) => {
    // In a real app, this would send a request to the server
    // For this mock, we'll just return the updated data
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      ...updatedData,
      id: parseInt(id)
    };
  }
};

export { propertyService, bookingService, guestService, communicationService, teamService, maintenanceService, locationService }; 