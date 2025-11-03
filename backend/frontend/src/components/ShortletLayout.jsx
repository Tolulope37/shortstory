import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, Coins, Map, Settings, Bell, LogOut, Search, Menu, X, ChevronDown, CalendarDays, TrendingUp, MessageSquare, UserPlus, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ShortletLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Get the current active page based on the URL path
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/properties')) return 'properties';
    if (path.includes('/bookings')) return 'bookings';
    if (path.includes('/guests')) return 'guests';
    if (path.includes('/finances')) return 'finances';
    if (path.includes('/locations')) return 'locations';
    if (path.includes('/calendar')) return 'calendar';
    if (path.includes('/predictions')) return 'predictions';
    if (path.includes('/communications')) return 'communications';
    if (path.includes('/team')) return 'team';
    if (path.includes('/maintenance')) return 'maintenance';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeTab = getActivePage();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 flex flex-col h-screen`}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b">
          {isSidebarOpen && <h1 className="text-xl font-bold text-blue-600">ShortStories</h1>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/dashboard"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Home size={20} />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/properties"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'properties' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Home size={20} />
                {isSidebarOpen && <span className="ml-3">Properties</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/bookings"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Calendar size={20} />
                {isSidebarOpen && <span className="ml-3">Bookings</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/calendar"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'calendar' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <CalendarDays size={20} />
                {isSidebarOpen && <span className="ml-3">Calendar</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/guests"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'guests' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Users size={20} />
                {isSidebarOpen && <span className="ml-3">Guests</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/communications"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'communications' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <MessageSquare size={20} />
                {isSidebarOpen && <span className="ml-3">Communications</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/team"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'team' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <UserPlus size={20} />
                {isSidebarOpen && <span className="ml-3">Team</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/maintenance"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'maintenance' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Wrench size={20} />
                {isSidebarOpen && <span className="ml-3">Maintenance</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/finances"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'finances' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Coins size={20} />
                {isSidebarOpen && <span className="ml-3">Finances</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/locations"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'locations' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Map size={20} />
                {isSidebarOpen && <span className="ml-3">Locations</span>}
              </Link>
            </li>
            <li>
              <Link 
                to="/predictions"
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'predictions' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <TrendingUp size={20} />
                {isSidebarOpen && <span className="ml-3">Predictions</span>}
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Bottom actions */}
        <div className="p-4 border-t">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <Settings size={20} />
                {isSidebarOpen && <span className="ml-3">Settings</span>}
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-red-500"
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center rounded-lg bg-gray-100 p-2 w-64">
              <Search size={18} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none ml-2 text-sm w-full"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {getUserInitials()}
                </div>
                {isSidebarOpen && (
                  <div className="ml-2 flex items-center">
                    <span className="text-sm font-medium">{user?.name || 'User'}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 