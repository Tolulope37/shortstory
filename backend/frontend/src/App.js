import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShortletDashboard from './components/ShortletDashboard';
import PropertiesPage from './pages/PropertiesPage';
import BookingsPage from './pages/BookingsPage';
import GuestsPage from './pages/GuestsPage';
import FinancesPage from './pages/FinancesPage';
import LocationsPage from './pages/LocationsPage';
import CalendarPage from './pages/CalendarPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import BookPage from './pages/BookPage';
import BookingSuccess from './pages/BookingSuccess';
import PredictionsPage from './pages/PredictionsPage';
import CommunicationsPage from './pages/CommunicationsPage';
import TeamPage from './pages/TeamPage';
import MaintenancePage from './pages/MaintenancePage';
import SettingsPage from './pages/SettingsPage';
import LoyaltyProgramPage from './pages/LoyaltyProgramPage';
import ShortletLayout from './components/ShortletLayout';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Guest Portal Import
import GuestLayout from './guest-portal/components/GuestLayout';
import GuestDashboard from './guest-portal/pages/GuestDashboard';
import GuestBookings from './guest-portal/pages/GuestBookings';
import GuestMessages from './guest-portal/pages/GuestMessages';
import GuestTrips from './guest-portal/pages/GuestTrips';
import GuestFavorites from './guest-portal/pages/GuestFavorites';
import GuestProfile from './guest-portal/pages/GuestProfile';
import GuestPayments from './guest-portal/pages/GuestPayments';
import GuestLoyalty from './guest-portal/pages/GuestLoyalty';

import './styles/global.css';
import './App.css';

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/reset-password" element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" replace />} />
      
      {/* Guest Portal Routes */}
      <Route path="/guest" element={<GuestLayout><GuestDashboard /></GuestLayout>} />
      <Route path="/guest/dashboard" element={<GuestLayout><GuestDashboard /></GuestLayout>} />
      <Route path="/guest/bookings" element={<GuestLayout><GuestBookings /></GuestLayout>} />
      <Route path="/guest/messages" element={<GuestLayout><GuestMessages /></GuestLayout>} />
      <Route path="/guest/trips" element={<GuestLayout><GuestTrips /></GuestLayout>} />
      <Route path="/guest/favorites" element={<GuestLayout><GuestFavorites /></GuestLayout>} />
      <Route path="/guest/loyalty" element={<GuestLayout><GuestLoyalty /></GuestLayout>} />
      <Route path="/guest/profile" element={<GuestLayout><GuestProfile /></GuestLayout>} />
      <Route path="/guest/payments" element={<GuestLayout><GuestPayments /></GuestLayout>} />
      
      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <ShortletDashboard />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/properties" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <PropertiesPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bookings" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <BookingsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/guests" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <GuestsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/finances" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <FinancesPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/locations" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <LocationsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <CalendarPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/predictions" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <PredictionsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/communications" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <CommunicationsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <TeamPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/maintenance" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <MaintenancePage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <SettingsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/property/:id" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <PropertyDetailsPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* New Routes for Shareable Booking Links - These remain public */}
      <Route 
        path="/book/:propertyId" 
        element={
          <ErrorBoundary>
            <BookPage />
          </ErrorBoundary>
        } 
      />
      <Route 
        path="/booking-success" 
        element={
          <ErrorBoundary>
            <BookingSuccess />
          </ErrorBoundary>
        } 
      />
      
      {/* Add the new route for LoyaltyProgramPage */}
      <Route 
        path="/loyalty" 
        element={
          <ProtectedRoute>
            <ShortletLayout>
              <ErrorBoundary>
                <LoyaltyProgramPage />
              </ErrorBoundary>
            </ShortletLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
