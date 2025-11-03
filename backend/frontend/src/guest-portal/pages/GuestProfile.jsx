import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Star, Shield, Camera, Edit2, Check } from 'lucide-react';

export default function GuestProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data fetch
  useEffect(() => {
    setTimeout(() => {
      setProfile({
        name: 'Adeola Johnson',
        email: 'adeola.johnson@example.com',
        phone: '+234 812 345 6789',
        dateJoined: '2023-08-15',
        location: 'Lagos, Nigeria',
        avatar: null,
        verified: {
          email: true,
          phone: true,
          id: true
        },
        loyaltyTier: 'Gold',
        loyaltyPoints: 450,
        preferences: {
          communication: {
            email: true,
            sms: true,
            app: false
          },
          tripTypes: ['Business', 'Family'],
          amenities: ['Wi-Fi', 'Kitchen', 'Pool']
        }
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes would go here in a real app
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto md:mx-0"></div>
            </div>
            <div className="md:w-2/3 space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Get user initials for avatar
  const getUserInitials = () => {
    return profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-500">Manage your personal information and preferences.</p>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'personal' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'security' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`pb-4 px-4 font-medium text-sm ${activeTab === 'preferences' 
              ? 'border-b-2 border-blue-600 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
      </div>
      
      {/* Profile content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'personal' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
              <button
                onClick={handleEditToggle}
                className={`inline-flex items-center px-3 py-2 border ${isEditing 
                  ? 'border-transparent bg-blue-600 text-white hover:bg-blue-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} rounded-lg text-sm font-medium`}
              >
                {isEditing ? 'Save Changes' : (
                  <>
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile photo */}
              <div className="md:w-1/3">
                <div className="relative w-32 h-32 mx-auto md:mx-0">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-medium">
                      {getUserInitials()}
                    </div>
                  )}
                  
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700">
                      <Camera size={16} />
                    </button>
                  )}
                </div>
                
                <div className="mt-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{profile.loyaltyTier}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{profile.loyaltyPoints} points</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Member since {formatDate(profile.dateJoined)}</p>
                </div>
              </div>
              
              {/* Profile details */}
              <div className="md:w-2/3">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span>{profile.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Mail size={16} className="text-gray-400 mr-2" />
                          <span>{profile.email}</span>
                          {profile.verified.email && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">Verified</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Phone size={16} className="text-gray-400 mr-2" />
                          <span>{profile.phone}</span>
                          {profile.verified.phone && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">Verified</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <MapPin size={16} className="text-gray-400 mr-2" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">Account Verification</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-500 mr-2" />
                        <span>Email</span>
                      </div>
                      {profile.verified.email ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <button className="text-blue-600 text-sm font-medium">Verify now</button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone size={16} className="text-gray-500 mr-2" />
                        <span>Phone</span>
                      </div>
                      {profile.verified.phone ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <button className="text-blue-600 text-sm font-medium">Verify now</button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield size={16} className="text-gray-500 mr-2" />
                        <span>ID Verification</span>
                      </div>
                      {profile.verified.id ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <button className="text-blue-600 text-sm font-medium">Verify now</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">Password</h3>
                <button className="text-blue-600 font-medium hover:underline flex items-center">
                  <Edit2 size={16} className="mr-2" /> 
                  Change Password
                </button>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
                <p className="text-gray-500 text-sm mb-2">Add an extra layer of security to your account</p>
                <button className="text-blue-600 font-medium hover:underline">Enable 2FA</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">Communication Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="comm-email"
                      checked={profile.preferences.communication.email}
                      onChange={() => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          communication: {
                            ...profile.preferences.communication,
                            email: !profile.preferences.communication.email
                          }
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="comm-email" className="ml-2 block text-sm text-gray-700">
                      Email notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="comm-sms"
                      checked={profile.preferences.communication.sms}
                      onChange={() => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          communication: {
                            ...profile.preferences.communication,
                            sms: !profile.preferences.communication.sms
                          }
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="comm-sms" className="ml-2 block text-sm text-gray-700">
                      SMS notifications
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="comm-app"
                      checked={profile.preferences.communication.app}
                      onChange={() => setProfile({
                        ...profile,
                        preferences: {
                          ...profile.preferences,
                          communication: {
                            ...profile.preferences.communication,
                            app: !profile.preferences.communication.app
                          }
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="comm-app" className="ml-2 block text-sm text-gray-700">
                      App notifications
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-3">Travel Preferences</h3>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Preferred trip types</p>
                  <div className="flex flex-wrap gap-2">
                    {['Business', 'Family', 'Solo', 'Couple', 'Group'].map(type => (
                      <label key={type} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.preferences.tripTypes.includes(type)}
                          onChange={() => {
                            const newTypes = profile.preferences.tripTypes.includes(type)
                              ? profile.preferences.tripTypes.filter(t => t !== type)
                              : [...profile.preferences.tripTypes, type];
                            
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                tripTypes: newTypes
                              }
                            });
                          }}
                          className="sr-only"
                        />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          profile.preferences.tripTypes.includes(type)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-700 mb-2">Must-have amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {['Wi-Fi', 'Kitchen', 'Pool', 'AC', 'Parking', 'Workspace', 'Pet-friendly'].map(amenity => (
                      <label key={amenity} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={profile.preferences.amenities.includes(amenity)}
                          onChange={() => {
                            const newAmenities = profile.preferences.amenities.includes(amenity)
                              ? profile.preferences.amenities.filter(a => a !== amenity)
                              : [...profile.preferences.amenities, amenity];
                            
                            setProfile({
                              ...profile,
                              preferences: {
                                ...profile.preferences,
                                amenities: newAmenities
                              }
                            });
                          }}
                          className="sr-only"
                        />
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          profile.preferences.amenities.includes(amenity)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 