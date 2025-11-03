import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Gift, Star, TrendingUp, Users, Search, Filter, 
  ChevronUp, ChevronDown, ArrowUpRight, Plus, Trophy
} from 'lucide-react';
import LoyaltyProgramCard from '../components/LoyaltyProgramCard';

const LoyaltyProgramPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = () => {
      setIsLoading(true);
      setGuests([]);
      setIsLoading(false);
    };
    
    fetchGuests();
  }, []);

  // Filter guests based on search query and filter
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guest.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'bronze') return matchesSearch && guest.loyaltyTier === 'Bronze';
    if (filter === 'silver') return matchesSearch && guest.loyaltyTier === 'Silver';
    if (filter === 'gold') return matchesSearch && guest.loyaltyTier === 'Gold';
    if (filter === 'platinum') return matchesSearch && guest.loyaltyTier === 'Platinum';
    if (filter === 'diamond') return matchesSearch && guest.loyaltyTier === 'Diamond';
    return matchesSearch;
  });

  const handleGuestClick = (guestId) => {
    // Navigate to guest details page
    navigate(`/guests/${guestId}`);
  };

  const renderTierIcon = (tier) => {
    const getTierColor = (tier) => {
      switch (tier) {
        case 'Bronze': return 'bg-gradient-to-r from-amber-700 to-amber-500';
        case 'Silver': return 'bg-gradient-to-r from-gray-400 to-gray-300';
        case 'Gold': return 'bg-gradient-to-r from-amber-400 to-yellow-300';
        case 'Platinum': return 'bg-gradient-to-r from-slate-400 to-slate-300';
        case 'Diamond': return 'bg-gradient-to-r from-blue-400 to-blue-300';
        default: return 'bg-gradient-to-r from-amber-700 to-amber-500';
      }
    };
    
    return (
      <div className={`h-6 w-6 rounded-full ${getTierColor(tier)} flex items-center justify-center text-white font-semibold text-xs`}>
        {tier.charAt(0)}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Award className="mr-3 text-blue-500" size={28} />
          Loyalty Program
        </h1>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
          onClick={() => navigate('/guests')}
        >
          Back to Guests
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <Trophy className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800">ShortStories Loyalty Program</h3>
              <p className="mt-1 text-sm text-blue-700">
                Reward loyal guests with point-based rewards and tiered benefits
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
          <div className="mr-3 bg-indigo-100 text-indigo-700 p-3 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Total Members</h3>
            <p className="text-2xl font-bold">{guests.length}</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center">
          <div className="mr-3 bg-green-100 text-green-700 p-3 rounded-lg">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500">Rewards Redeemed</h3>
            <p className="text-2xl font-bold">{guests.reduce((sum, guest) => sum + guest.rewardsRedeemed, 0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold mb-4 md:mb-0">Loyalty Program Members</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-blue-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-gray-500">Loading members...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stays
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Stay
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rewards Used
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGuests.map(guest => (
                    <tr key={guest.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleGuestClick(guest.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{guest.name}</div>
                            <div className="text-sm text-gray-500">{guest.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderTierIcon(guest.loyaltyTier)}
                          <span className="ml-2">{guest.loyaltyTier}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{guest.loyaltyPoints.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{guest.stayCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{guest.lastStay}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{guest.rewardsRedeemed}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-indigo-600 hover:text-indigo-900 font-medium mr-2">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 font-medium">
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredGuests.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500">No loyalty program members found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Tier Benefits Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 border-l-4 border-amber-700 bg-amber-50 rounded-r-md">
              <div className="h-8 w-8 bg-gradient-to-r from-amber-700 to-amber-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                B
              </div>
              <div>
                <h4 className="font-medium">Bronze</h4>
                <p className="text-sm text-gray-600">Basic benefits, earn 1 point per ₦100</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-gray-400 bg-gray-50 rounded-r-md">
              <div className="h-8 w-8 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center text-white font-bold mr-3">
                S
              </div>
              <div>
                <h4 className="font-medium">Silver</h4>
                <p className="text-sm text-gray-600">5% discount, early check-in when available</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-amber-400 bg-amber-50 rounded-r-md">
              <div className="h-8 w-8 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full flex items-center justify-center text-white font-bold mr-3">
                G
              </div>
              <div>
                <h4 className="font-medium">Gold</h4>
                <p className="text-sm text-gray-600">10% discount, room upgrades when available</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-slate-400 bg-slate-50 rounded-r-md">
              <div className="h-8 w-8 bg-gradient-to-r from-slate-400 to-slate-300 rounded-full flex items-center justify-center text-white font-bold mr-3">
                P
              </div>
              <div>
                <h4 className="font-medium">Platinum</h4>
                <p className="text-sm text-gray-600">15% discount, guaranteed room upgrades</p>
              </div>
            </div>
            <div className="flex items-center p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-md">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full flex items-center justify-center text-white font-bold mr-3">
                D
              </div>
              <div>
                <h4 className="font-medium">Diamond</h4>
                <p className="text-sm text-gray-600">25% discount, personalized service</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Award Points</h4>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white flex-grow">
                  <option value="">Select Guest</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.id}>{guest.name}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  placeholder="Points" 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm w-24"
                />
                <button className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm">
                  Award
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Upgrade Member Tier</h4>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white flex-grow">
                  <option value="">Select Guest</option>
                  {guests.map(guest => (
                    <option key={guest.id} value={guest.id}>{guest.name}</option>
                  ))}
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white w-32">
                  <option value="">New Tier</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Diamond">Diamond</option>
                </select>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm">
                  Upgrade
                </button>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Export Member Data</h4>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white flex-grow">
                  <option value="all">All Members</option>
                  <option value="bronze">Bronze Members</option>
                  <option value="silver">Silver Members</option>
                  <option value="gold">Gold Members</option>
                  <option value="platinum">Platinum Members</option>
                  <option value="diamond">Diamond Members</option>
                </select>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm">
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgramPage; 