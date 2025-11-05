import { useState, useEffect } from 'react';
import { Heart, MapPin, Star } from 'lucide-react';

export default function GuestFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch favorites from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when guest portal backend is ready
        // const response = await api.get('/guest/favorites');
        // setFavorites(response.data || []);
        
        // For now, show empty state
        setFavorites([]);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);

  const removeFavorite = async (propertyId) => {
    try {
      // TODO: API call to remove favorite
      // await api.delete(`/guest/favorites/${propertyId}`);
      setFavorites(favorites.filter(fav => fav.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorites</h1>
        <p className="text-gray-600">Properties you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No favorites yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start exploring and save properties you love!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <img src={property.image} alt={property.name} className="w-full h-48 object-cover" />
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span>{property.rating} ({property.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center font-semibold text-gray-900">
                      <span className="font-bold mr-1">₦</span>
                      {property.price}
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
