import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Bell, LogOut, Search, User, Clock, Star, Map, CreditCard, HelpCircle } from 'lucide-react';

export default function GuestLayout({ children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get user data from context/API
  // TODO: Replace with actual user context when guest portal backend is ready
  const guestUser = {
    name: 'Guest',
    email: 'guest@example.com',
    avatar: null,
    loyaltyPoints: 0,
    loyaltyTier: 'Bronze'
  };
  
  // Get the current active page based on the URL path
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/guest/dashboard')) return 'dashboard';
    if (path.includes('/guest/bookings')) return 'bookings';
    if (path.includes('/guest/trips')) return 'trips';
    if (path.includes('/guest/messages')) return 'messages';
    if (path.includes('/guest/favorites')) return 'favorites';
    if (path.includes('/guest/payments')) return 'payments';
    if (path.includes('/guest/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getActivePage();
  
  const handleLogout = () => {
    // In a real app, this would call logout from auth context
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!guestUser || !guestUser.name) return 'G';
    return guestUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar navigation */}
      <div className="hidden md:flex md:w-64 bg-white shadow-sm flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center border-b">
          <h1 className="text-xl font-bold text-blue-600">ShortStories</h1>
        </div>
        
        {/* User info card */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            {guestUser.avatar ? (
              <img src={guestUser.avatar} alt={guestUser.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                {getUserInitials()}
              </div>
            )}
            <div>
              <h3 className="font-medium">{guestUser.name}</h3>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs text-gray-500">{guestUser.loyaltyTier} • {guestUser.loyaltyPoints} pts</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-y-auto">
          <p className="text-xs font-medium text-gray-500 px-3 py-2">MAIN</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/guest/dashboard"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Home size={18} />
                <span className="ml-3 text-sm">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/guest/bookings"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Calendar size={18} />
                <span className="ml-3 text-sm">Upcoming Stays</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/guest/trips"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'trips' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Clock size={18} />
                <span className="ml-3 text-sm">Past Trips</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/guest/messages"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare size={18} />
                <span className="ml-3 text-sm">Messages</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/guest/favorites"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'favorites' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Star size={18} />
                <span className="ml-3 text-sm">Favorites</span>
              </Link>
            </li>
          </ul>
          
          <p className="text-xs font-medium text-gray-500 px-3 py-2 mt-6">ACCOUNT</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/guest/profile"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <User size={18} />
                <span className="ml-3 text-sm">Profile</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/guest/payments"
                className={`flex items-center w-full px-3 py-2 rounded-lg ${activeTab === 'payments' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <CreditCard size={18} />
                <span className="ml-3 text-sm">Payments</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Bottom actions */}
        <div className="p-4 border-t">
          <ul className="space-y-1">
            <li>
              <Link 
                to="/guest/help"
                className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <HelpCircle size={18} />
                <span className="ml-3 text-sm">Help & Support</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-red-500"
              >
                <LogOut size={18} />
                <span className="ml-3 text-sm">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-blue-600">ShortStories</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-gray-100 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium"
            >
              {getUserInitials()}
            </button>
          </div>
        </div>
        
        {/* Mobile dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-16 right-4 w-60 bg-white rounded-lg shadow-lg py-2 z-20">
            <div className="px-4 py-2 border-b">
              <p className="font-medium">{guestUser.name}</p>
              <p className="text-xs text-gray-500">{guestUser.email}</p>
            </div>
            <ul>
              <li>
                <Link to="/guest/profile" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                  <User size={16} className="mr-2" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link to="/guest/bookings" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>My Bookings</span>
                </Link>
              </li>
              <li>
                <Link to="/guest/help" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                  <HelpCircle size={16} className="mr-2" />
                  <span>Help & Support</span>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        )}
        
        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-between p-2 md:hidden">
          <Link to="/guest/dashboard" className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/guest/bookings" className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'bookings' ? 'text-blue-600' : 'text-gray-500'}`}>
            <Calendar size={20} />
            <span className="text-xs mt-1">Bookings</span>
          </Link>
          <Link to="/guest/messages" className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'messages' ? 'text-blue-600' : 'text-gray-500'}`}>
            <MessageSquare size={20} />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          <Link to="/guest/profile" className={`flex flex-col items-center justify-center flex-1 py-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`}>
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <main className="p-4 md:p-6 mt-16 md:mt-0 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
} 