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
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching guests:', error);
      return [];
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

// Communication service for guest messaging
const communicationService = {
  // Get all messages for a guest
  getGuestMessages: async (guestId) => {
    try {
      const response = await api.get(`/communications/messages/${guestId}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching messages for guest ${guestId}:`, error);
      return [];
    }
  },
  
  // Send a message to a guest
  sendMessage: async (guestId, message) => {
    try {
      const response = await api.post(`/communications/messages/${guestId}`, message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Get templates for quick responses
  getMessageTemplates: async () => {
    try {
      const response = await api.get('/communications/templates');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching message templates:', error);
      return [];
    }
  },
  
  // Get welcome pack templates
  getWelcomePacks: async () => {
    try {
      const response = await api.get('/communications/welcome-packs');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching welcome packs:', error);
      return [];
    }
  },
  
  // Get check-in templates
  getCheckInPacks: async () => {
    try {
      const response = await api.get('/communications/check-in-packs');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching check-in packs:', error);
      return [];
    }
  },
  
  // Process a guest check-in
  processCheckIn: async (guestId, checkInData) => {
    try {
      const response = await api.post(`/communications/check-in/${guestId}`, checkInData);
      return response.data;
    } catch (error) {
      console.error('Error processing check-in:', error);
      throw error;
    }
  },
  
  // Send automated messages based on guest status
  sendAutomatedMessage: async (guestId, messageType) => {
    try {
      const response = await api.post(`/communications/automated-message/${guestId}`, { messageType });
      return response.data;
    } catch (error) {
      console.error('Error sending automated message:', error);
      throw error;
    }
  },
  
  // Get message automation trigger settings
  getMessageAutomations: async () => {
    try {
      const response = await api.get('/communications/automations');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching message automations:', error);
      return [];
    }
  },
  
  // Save or update a message automation trigger
  saveMessageAutomation: async (automation) => {
    try {
      const response = await api.post('/communications/automations', automation);
      return response.data;
    } catch (error) {
      console.error('Error saving message automation:', error);
      throw error;
    }
  },
  
  // Delete a message automation trigger
  deleteMessageAutomation: async (id) => {
    try {
      const response = await api.delete(`/communications/automations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting message automation:', error);
      throw error;
    }
  }
};

// Team services
const teamService = {
  // Get all team members
  getAllMembers: async () => {
    try {
      const response = await api.get('/team/members');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
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
      const response = await api.get('/team/roles');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },
  
  // Task management
  getTasks: async (filters = {}) => {
    try {
      const response = await api.get('/team/tasks', { params: filters });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
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
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
      return [];
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
    try {
      const response = await api.get('/maintenance/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [
        { id: 'plumbing', name: 'Plumbing' },
        { id: 'electrical', name: 'Electrical' },
        { id: 'cleaning', name: 'Cleaning' },
        { id: 'repair', name: 'Repair' },
        { id: 'inspection', name: 'Inspection' },
        { id: 'other', name: 'Other' },
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