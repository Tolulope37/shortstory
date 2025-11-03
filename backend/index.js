const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Configure CORS with more options
app.use(cors({
  origin: ['http://localhost:3000'], // Add your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Mock data for properties
let properties = [
  { id: 1, name: "Lekki Paradise Villa", location: "Lekki Phase 1, Lagos", status: "Occupied", rate: "₦65,000", bookings: 12, revenue: "₦780,000", image: "https://placehold.co/300x200" },
  { id: 2, name: "Ikeja GRA Apartment", location: "Ikeja GRA, Lagos", status: "Available", rate: "₦45,000", bookings: 8, revenue: "₦360,000", image: "https://placehold.co/300x200" },
  { id: 3, name: "Victoria Island Luxury Suite", location: "Victoria Island, Lagos", status: "Maintenance", rate: "₦85,000", bookings: 15, revenue: "₦1,275,000", image: "https://placehold.co/300x200" },
  { id: 4, name: "Abuja Executive Home", location: "Maitama, Abuja", status: "Available", rate: "₦75,000", bookings: 10, revenue: "₦750,000", image: "https://placehold.co/300x200" },
];

// Mock data for bookings
let bookings = [
  { id: 1, guest: "Adeola Johnson", propertyId: 1, property: "Lekki Paradise Villa", checkIn: "Apr 24, 2025", checkOut: "Apr 28, 2025", status: "Confirmed", guestPhone: "+2348012345678", guestEmail: "adeola@example.com" },
  { id: 2, guest: "Chinedu Okafor", propertyId: 2, property: "Ikeja GRA Apartment", checkIn: "Apr 25, 2025", checkOut: "Apr 30, 2025", status: "Pending", guestPhone: "+2348023456789", guestEmail: "chinedu@example.com" },
  { id: 3, guest: "Fatima Ibrahim", propertyId: 4, property: "Abuja Executive Home", checkIn: "May 2, 2025", checkOut: "May 7, 2025", status: "Confirmed", guestPhone: "+2348034567890", guestEmail: "fatima@example.com" },
];

// Mock users for authentication
let users = [
  { id: 1, username: 'admin', password: 'password123', name: 'Admin User', role: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'manager', password: 'manager123', name: 'Property Manager', role: 'manager', email: 'manager@example.com' }
];

// Routes
// Get all properties
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

// Get a single property
app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === parseInt(req.params.id));
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
});

// Create a property
app.post('/api/properties', (req, res) => {
  const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
  const newProperty = {
    id: newId,
    ...req.body
  };
  properties.push(newProperty);
  res.status(201).json(newProperty);
});

// Update a property
app.put('/api/properties/:id', (req, res) => {
  const propertyIndex = properties.findIndex(p => p.id === parseInt(req.params.id));
  if (propertyIndex === -1) return res.status(404).json({ message: 'Property not found' });
  
  const updatedProperty = {
    ...properties[propertyIndex],
    ...req.body
  };
  properties[propertyIndex] = updatedProperty;
  res.json(updatedProperty);
});

// Delete a property
app.delete('/api/properties/:id', (req, res) => {
  const propertyIndex = properties.findIndex(p => p.id === parseInt(req.params.id));
  if (propertyIndex === -1) return res.status(404).json({ message: 'Property not found' });
  
  properties = properties.filter(p => p.id !== parseInt(req.params.id));
  res.json({ message: 'Property deleted successfully' });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Get bookings for a specific property
app.get('/api/properties/:id/bookings', (req, res) => {
  const propertyId = parseInt(req.params.id);
  const propertyBookings = bookings.filter(b => b.propertyId === propertyId);
  res.json(propertyBookings);
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
  const newBooking = {
    id: newId,
    ...req.body
  };
  bookings.push(newBooking);
  res.status(201).json(newBooking);
});

// Update a booking
app.put('/api/bookings/:id', (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (bookingIndex === -1) return res.status(404).json({ message: 'Booking not found' });
  
  const oldPaymentStatus = bookings[bookingIndex].paymentStatus || 'Unpaid';
  const updatedBooking = {
    ...bookings[bookingIndex],
    ...req.body
  };
  bookings[bookingIndex] = updatedBooking;
  
  // Check if payment status has changed to "Paid"
  const newPaymentStatus = updatedBooking.paymentStatus || 'Unpaid';
  if (oldPaymentStatus !== 'Paid' && newPaymentStatus === 'Paid') {
    // Payment has been confirmed - this would trigger automated messages
    // In a real implementation, this would dispatch an event to a message queue
    console.log(`Payment confirmed for booking ID ${updatedBooking.id} - This would trigger automated messages`);
  }
  
  res.json(updatedBooking);
});

// Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
  const bookingIndex = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (bookingIndex === -1) return res.status(404).json({ message: 'Booking not found' });
  
  bookings = bookings.filter(b => b.id !== parseInt(req.params.id));
  res.json({ message: 'Booking deleted successfully' });
});

// New endpoint for triggering automated messages
app.post('/api/automations/trigger', (req, res) => {
  const { trigger, bookingId, guestId } = req.body;
  
  if (!trigger) {
    return res.status(400).json({ message: 'Trigger type is required' });
  }
  
  // In a real implementation, this would process the trigger and send appropriate messages
  // based on automation settings
  
  console.log(`Manually triggered "${trigger}" for booking ${bookingId} and guest ${guestId}`);
  
  res.json({
    success: true,
    message: `Triggered "${trigger}" automation`,
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt with:', req.body);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    console.log('Login failed: Invalid credentials');
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  console.log('Login successful for user:', username);
  
  // In a real app, you would generate a JWT token here
  const token = 'mock-jwt-token-' + user.id;
  
  // Return user data without the password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    token,
    user: userWithoutPassword
  });
});

app.get('/api/auth/user', (req, res) => {
  // In a real app, you would verify the JWT token from authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = parseInt(token.split('-').pop());
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  
  // Return user data without the password
  const { password: _, ...userWithoutPassword } = user;
  
  res.json(userWithoutPassword);
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch all routes - serve a 404
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
