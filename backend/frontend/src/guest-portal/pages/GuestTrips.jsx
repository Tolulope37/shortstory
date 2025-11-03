import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Star, Check, FileText, ArrowRight } from 'lucide-react';

export default function GuestTrips() {
  const [pastTrips, setPastTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setPastTrips([
        {
          id: 1,
          propertyName: "Abuja Executive Home",
          propertyImage: "https://placehold.co/600x400/ec4899/ffffff?text=Abuja+Executive",
          location: "Maitama, Abuja",
          checkIn: "2024-06-10",
          checkOut: "2024-06-15",
          status: "Completed",
          totalPaid: "₦375,000",
          rating: 5,
          hasReview: true,
          host: {
            name: "Mohammed Ibrahim",
            image: "https://placehold.co/100x100/ed8936/ffffff?text=MI"
          }
        },
        {
          id: 2,
          propertyName: "Ikeja GRA Apartment",
          propertyImage: "https://placehold.co/600x400/10b981/ffffff?text=Ikeja+Apartment",
          location: "Ikeja GRA, Lagos",
          checkIn: "2024-05-05",
          checkOut: "2024-05-10",
          status: "Completed",
          totalPaid: "₦225,000",
          hasReview: false,
          host: {
            name: "Amaka Nwosu",
            image: "https://placehold.co/100x100/9f7aea/ffffff?text=AN"
          }
        },
        {
          id: 3,
          propertyName: "Victoria Island Luxury Suite",
          propertyImage: "https://placehold.co/600x400/f59e0b/ffffff?text=VI+Luxury+Suite",
          location: "Victoria Island, Lagos",
          checkIn: "2024-03-15",
          checkOut: "2024-03-20",
          status: "Completed",
          totalPaid: "₦425,000",
          rating: 4,
          hasReview: true,
          host: {
            name: "Chinwe Okonkwo",
            image: "https://placehold.co/100x100/4299e1/ffffff?text=CO"
          }
        },
        {
          id: 4,
          propertyName: "Lekki Paradise Villa",
          propertyImage: "https://placehold.co/600x400/3b82f6/ffffff?text=Lekki+Paradise",
          location: "Lekki Phase 1, Lagos",
          checkIn: "2024-02-24",
          checkOut: "2024-02-28",
          status: "Completed",
          totalPaid: "₦260,000",
          rating: 5,
          hasReview: true,
          host: {
            name: "Oluwaseun Adeyemi",
            image: "https://placehold.co/100x100/718096/ffffff?text=OA"
          }
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Past Trips</h1>
        <p className="text-gray-500">Your travel history and completed stays.</p>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto bg-gray-200"></div>
                <div className="p-4 flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pastTrips.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No past trips</h3>
          <p className="text-gray-500 mb-6">
            You haven't completed any stays yet. Your past trips will appear here.
          </p>
          <Link
            to="/guest/browse"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Find a place to stay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pastTrips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Property image */}
                <div className="md:w-1/4 relative">
                  <img 
                    src={trip.propertyImage} 
                    alt={trip.propertyName}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  {trip.hasReview && (
                    <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <Check size={12} className="mr-1" /> Reviewed
                    </div>
                  )}
                </div>
                
                {/* Trip details */}
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{trip.propertyName}</h3>
                      <div className="flex items-center text-gray-500 text-sm mb-1">
                        <MapPin size={14} className="mr-1" />
                        <span>{trip.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(trip.checkIn)} - {formatDate(trip.checkOut)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-gray-500 text-sm">Total paid</p>
                      <p className="font-bold">{trip.totalPaid}</p>
                    </div>
                  </div>
                  
                  {/* Rating display */}
                  {trip.hasReview ? (
                    <div className="mb-3">
                      <div className="flex items-center">
                        <p className="text-xs font-medium text-gray-800 mr-2">Your rating:</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              className={i < trip.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs mb-3">
                      <Star size={14} className="text-yellow-600 mr-2" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          Share your experience
                        </p>
                        <p className="text-gray-600">
                          Your feedback helps future guests and hosts
                        </p>
                      </div>
                      <Link 
                        to={`/guest/review/${trip.id}`}
                        className="ml-auto bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium"
                      >
                        Review
                      </Link>
                    </div>
                  )}
                  
                  {/* Host information */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img 
                        src={trip.host.image} 
                        alt={trip.host.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs">Hosted by <span className="font-medium">{trip.host.name}</span></p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                      to={`/guest/trips/${trip.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileText size={14} className="mr-1" />
                      Details
                    </Link>
                    
                    <Link
                      to={`/guest/property/${trip.propertyName.replace(/\s+/g, '-').toLowerCase()}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar size={14} className="mr-1" />
                      Book Again
                    </Link>
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