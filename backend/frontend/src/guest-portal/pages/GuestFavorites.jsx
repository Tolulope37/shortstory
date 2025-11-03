import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, Trash2, Search } from 'lucide-react';

export default function GuestFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setFavorites([
        {
          id: 1,
          name: "Lekki Paradise Villa",
          location: "Lekki Phase 1, Lagos",
          rating: 4.8,
          reviewCount: 42,
          price: "₦65,000",
          image: "https://placehold.co/600x400/3b82f6/ffffff?text=Lekki+Paradise",
          dateAdded: "2025-01-10T12:30:00",
          amenities: ["Pool", "Wi-Fi", "AC", "Kitchen", "Parking"]
        },
        {
          id: 3,
          name: "Victoria Island Luxury Suite",
          location: "Victoria Island, Lagos",
          rating: 4.9,
          reviewCount: 56,
          price: "₦85,000",
          image: "https://placehold.co/600x400/f59e0b/ffffff?text=VI+Luxury+Suite",
          dateAdded: "2025-01-05T16:45:00",
          amenities: ["Ocean View", "Wi-Fi", "AC", "Gym", "Pool"]
        },
        {
          id: 5,
          name: "Port Harcourt Garden Villa",
          location: "GRA Phase 2, Port Harcourt",
          rating: 4.7,
          reviewCount: 28,
          price: "₦60,000",
          image: "https://placehold.co/600x400/667eea/ffffff?text=PH+Garden",
          dateAdded: "2024-12-22T09:15:00",
          amenities: ["Garden", "Wi-Fi", "AC", "BBQ", "Parking"]
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  // Remove from favorites
  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(property => property.id !== id));
  };

  // Filter favorites based on search query
  const filteredFavorites = favorites.filter(property => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      property.name.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.amenities.some(amenity => amenity.toLowerCase().includes(query))
    );
  });

  // Format date added
  const formatDateAdded = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return `Saved on ${new Date(dateString).toLocaleDateString('en-US', options)}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Favorites</h1>
        <p className="text-gray-500">Properties you've saved for later.</p>
      </div>
      
      {/* Search box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your favorite properties..."
            className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart size={24} className="text-gray-400" />
          </div>
          
          {searchQuery ? (
            <>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No matching favorites</h3>
              <p className="text-gray-500 mb-4">
                No saved properties match your search criteria.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-blue-600 font-medium hover:underline"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-6">
                You haven't saved any properties yet. Click the heart icon on a property to add it to your favorites.
              </p>
              <Link 
                to="/guest/browse"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse properties
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map(property => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button 
                  onClick={() => removeFromFavorites(property.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  title="Remove from favorites"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 rounded-lg px-2 py-1">
                  <div className="flex items-center text-white text-xs">
                    <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" />
                    <span>{property.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{property.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{property.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin size={14} className="mr-1 flex-shrink-0" />
                  <span>{property.location}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {property.amenities.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      +{property.amenities.length - 3} more
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-3">{formatDateAdded(property.dateAdded)}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold">{property.price}<span className="text-sm font-normal text-gray-500"> / night</span></span>
                  <Link 
                    to={`/guest/property/${property.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 