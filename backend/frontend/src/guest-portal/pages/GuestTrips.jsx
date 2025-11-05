import { useState, useEffect } from 'react';
import { MapPin, Calendar, User } from 'lucide-react';

export default function GuestTrips() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trips from API
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when guest portal backend is ready
        // const response = await api.get('/guest/trips');
        // setTrips(response.data || []);
        
        // For now, show empty state
        setTrips([]);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrips();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
        <p className="text-gray-600">View all your past and upcoming trips</p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No trips yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Book your first property to start your journey!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <img src={trip.image} alt={trip.propertyName} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{trip.propertyName}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {trip.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(trip.checkIn).toLocaleDateString()} - {new Date(trip.checkOut).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {trip.guests} {trip.guests === 1 ? 'guest' : 'guests'}
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold mr-1">₦</span>
                    {trip.totalPrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
