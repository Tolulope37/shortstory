import React, { useState, useEffect } from 'react';
import { Star, Award, Gift, ChevronRight } from 'lucide-react';

export default function GuestLoyalty() {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rewards, setRewards] = useState([]);

  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setLoyaltyData({
        points: 2500,
        tier: 'Silver',
        nextTier: 'Gold',
        pointsToNextTier: 1500,
        memberSince: 'Jan 2024',
        totalStays: 5,
        availableRewards: 2
      });

      setRewards([
        {
          id: 1,
          name: 'Free Night Stay',
          pointsCost: 5000,
          description: 'Redeem for a complimentary night at any of our properties',
          isAvailable: false
        },
        {
          id: 2,
          name: 'Late Checkout',
          pointsCost: 800,
          description: 'Extend your checkout time until 4:00 PM',
          isAvailable: true
        },
        {
          id: 3,
          name: 'Room Upgrade',
          pointsCost: 1200,
          description: 'Upgrade to a premium room category when available',
          isAvailable: true
        },
        {
          id: 4,
          name: 'Airport Transfer',
          pointsCost: 2000,
          description: 'Complimentary airport pickup or drop-off service',
          isAvailable: true
        }
      ]);

      setIsLoading(false);
    }, 800);
  }, []);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Bronze': return 'from-amber-700 to-amber-500 text-amber-100';
      case 'Silver': return 'from-gray-400 to-gray-300 text-white';
      case 'Gold': return 'from-amber-400 to-yellow-300 text-amber-900';
      case 'Platinum': return 'from-slate-500 to-slate-400 text-white';
      case 'Diamond': return 'from-blue-400 to-blue-300 text-white';
      default: return 'from-amber-700 to-amber-500 text-amber-100';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ShortStories Loyalty Program</h1>
        <p className="text-gray-500">Earn points with every stay and unlock exclusive rewards.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading your loyalty information...</p>
        </div>
      ) : (
        <>
          {/* Loyalty Status Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className={`bg-gradient-to-r ${getTierColor(loyaltyData.tier)} p-6`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Your Loyalty Status</h2>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-medium">
                  {loyaltyData.tier} Tier
                </div>
              </div>
              
              <div className="flex items-end mb-1">
                <span className="text-3xl font-bold mr-1">{loyaltyData.points}</span>
                <span className="text-sm font-medium opacity-80">points</span>
              </div>
              
              <p className="text-sm opacity-80 mb-4">Member since {loyaltyData.memberSince} • {loyaltyData.totalStays} stays</p>
              
              {loyaltyData.nextTier && (
                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <p className="text-sm mb-1">
                    <span className="font-medium">{loyaltyData.pointsToNextTier} more points</span> to reach {loyaltyData.nextTier} tier
                  </p>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${(loyaltyData.points / (loyaltyData.points + loyaltyData.pointsToNextTier)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="font-semibold mb-4">Tier Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm">Earn 10 points per ₦1,000 spent</span>
                </li>
                <li className="flex items-center">
                  <Star size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm">Complimentary bottled water daily</span>
                </li>
                {loyaltyData.tier === 'Silver' || loyaltyData.tier === 'Gold' || loyaltyData.tier === 'Platinum' || loyaltyData.tier === 'Diamond' ? (
                  <li className="flex items-center">
                    <Star size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm">Early check-in (subject to availability)</span>
                  </li>
                ) : null}
                {loyaltyData.tier === 'Gold' || loyaltyData.tier === 'Platinum' || loyaltyData.tier === 'Diamond' ? (
                  <li className="flex items-center">
                    <Star size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm">Room upgrade (subject to availability)</span>
                  </li>
                ) : null}
                {loyaltyData.tier === 'Platinum' || loyaltyData.tier === 'Diamond' ? (
                  <li className="flex items-center">
                    <Star size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm">Complimentary welcome amenity</span>
                  </li>
                ) : null}
                {loyaltyData.tier === 'Diamond' ? (
                  <li className="flex items-center">
                    <Star size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm">Guaranteed late checkout (4PM)</span>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
          
          {/* Available Rewards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Rewards</h2>
              <div className="inline-flex items-center text-sm font-medium text-blue-600">
                <Gift size={16} className="mr-1" />
                <span>{loyaltyData.availableRewards} Available</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map(reward => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${!reward.isAvailable ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <span className="inline-flex items-center text-sm">
                      <Award size={14} className="text-blue-500 mr-1" />
                      <span>{reward.pointsCost} points</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{reward.description}</p>
                  <button
                    className={`w-full py-2 rounded-md text-center text-sm font-medium ${
                      reward.isAvailable && loyaltyData.points >= reward.pointsCost
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!reward.isAvailable || loyaltyData.points < reward.pointsCost}
                  >
                    {reward.isAvailable 
                      ? loyaltyData.points >= reward.pointsCost 
                        ? 'Redeem Reward' 
                        : 'Insufficient Points' 
                      : 'Not Available'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* How to Earn Points */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">How to Earn Points</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5 mr-3">
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Book and stay at any ShortStories property</p>
                  <p className="text-xs text-gray-500">Earn 10 points for every ₦1,000 spent on your stay</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5 mr-3">
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Book directly through our website or app</p>
                  <p className="text-xs text-gray-500">Earn an additional 500 points for each direct booking</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5 mr-3">
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Refer a friend</p>
                  <p className="text-xs text-gray-500">Earn 1,000 points when your referral completes their first stay</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5 mr-3">
                  <ChevronRight size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">Write a review after your stay</p>
                  <p className="text-xs text-gray-500">Earn 250 points for each verified review</p>
                </div>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
} 