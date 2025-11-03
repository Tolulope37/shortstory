import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star, Clock, MessageSquare, Search, Heart, TrendingUp, Bookmark, ChevronRight, Home } from 'lucide-react';

export default function GuestDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setFeaturedProperties([
        {
          id: 1,
          name: "Lekki Paradise Villa",
          location: "Lekki Phase 1, Lagos",
          rating: 4.8,
          reviewCount: 42,
          price: "₦65,000",
          image: "https://placehold.co/600x400/3b82f6/ffffff?text=Lekki+Paradise",
          isFavorite: true
        },
        {
          id: 2,
          name: "Ikeja GRA Apartment",
          location: "Ikeja GRA, Lagos",
          rating: 4.6,
          reviewCount: 38,
          price: "₦45,000",
          image: "https://placehold.co/600x400/10b981/ffffff?text=Ikeja+Apartment",
          isFavorite: false
        },
        {
          id: 3,
          name: "Victoria Island Luxury Suite",
          location: "Victoria Island, Lagos",
          rating: 4.9,
          reviewCount: 56,
          price: "₦85,000",
          image: "https://placehold.co/600x400/f59e0b/ffffff?text=VI+Luxury+Suite",
          isFavorite: true
        },
        {
          id: 4,
          name: "Abuja Executive Home",
          location: "Maitama, Abuja",
          rating: 4.7,
          reviewCount: 32,
          price: "₦75,000",
          image: "https://placehold.co/600x400/ec4899/ffffff?text=Abuja+Executive",
          isFavorite: false
        },
      ]);

      setUpcomingBooking({
        id: 1,
        propertyName: "Lekki Paradise Villa",
        propertyImage: "https://placehold.co/600x400/3b82f6/ffffff?text=Lekki+Paradise",
        checkIn: "2025-04-24",
        checkOut: "2025-04-28",
        status: "Confirmed",
        totalPaid: "₦260,000",
        host: {
          name: "Oluwaseun Adeyemi",
          responseRate: 98,
          responseTime: "within an hour"
        }
      });

      setIsLoading(false);
    }, 800);
  }, []);

  const toggleFavorite = (propertyId) => {
    setFeaturedProperties(prev => 
      prev.map(property => 
        property.id === propertyId 
          ? {...property, isFavorite: !property.isFavorite} 
          : property
      )
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate days until check-in
  const getDaysUntilCheckIn = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = Math.abs(checkIn - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      {/* Welcome message and search */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, Adeola!</h1>
        <p className="text-gray-500 mb-6">Discover amazing places to stay for your next adventure.</p>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search for properties, locations..."
            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>
      
      {/* Upcoming booking card */}
      {upcomingBooking ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Your Upcoming Stay</h2>
            <Link to="/guest/bookings" className="text-blue-600 text-sm font-medium flex items-center">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="relative h-32 sm:w-1/3">
                <img 
                  src={upcomingBooking.propertyImage} 
                  alt={upcomingBooking.propertyName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-2 left-3 text-white">
                  <h3 className="font-bold text-lg">{upcomingBooking.propertyName}</h3>
                </div>
              </div>
              
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      upcomingBooking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {upcomingBooking.status}
                    </span>
                    <span className="text-gray-500 text-xs">#{upcomingBooking.id}</span>
                    <span className="text-sm font-medium">{upcomingBooking.totalPaid}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {formatDate(upcomingBooking.checkIn)} - {formatDate(upcomingBooking.checkOut)}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock size={16} className="text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-blue-600">Check-in in {getDaysUntilCheckIn(upcomingBooking.checkIn)} days</span>
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      to={`/guest/bookings/${upcomingBooking.id}`}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Details
                    </Link>
                    <Link 
                      to={`/guest/messages?booking=${upcomingBooking.id}`}
                      className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <MessageSquare size={14} className="mr-1" />
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : !isLoading && (
        <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <Home size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Looking for your next getaway?</h3>
            <p className="text-gray-600 text-sm">Browse our featured properties and book your perfect stay.</p>
          </div>
          <Link 
            to="/guest/browse"
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Browse Now
          </Link>
        </div>
      )}
      
      {/* Featured properties */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Featured Properties</h2>
          <Link to="/guest/browse" className="text-blue-600 text-sm font-medium flex items-center">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                <div className="relative h-48">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Heart 
                      size={18} 
                      className={property.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} 
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{property.rating}</span>
                    <span className="text-gray-400 text-sm ml-1">({property.reviewCount} reviews)</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{property.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{property.price}<span className="text-sm font-normal text-gray-500"> / night</span></span>
                    <Link 
                      to={`/guest/property/${property.id}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link to="/guest/browse" className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <Search size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium">Find Properties</span>
          </Link>
          <Link to="/guest/favorites" className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <Heart size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium">Favorites</span>
          </Link>
          <Link to="/guest/trips" className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <Clock size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium">Past Trips</span>
          </Link>
          <Link to="/guest/loyalty" className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
            <Star size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium">Loyalty Program</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 