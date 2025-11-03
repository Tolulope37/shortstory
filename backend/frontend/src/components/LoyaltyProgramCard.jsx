import React from 'react';
import { Award, Gift, Star, TrendingUp, Users } from 'lucide-react';

const LoyaltyProgramCard = ({ guest }) => {
  // Default values if guest object is incomplete or not provided
  const {
    name = 'Guest',
    loyaltyPoints = 0,
    loyaltyTier = 'Bronze',
    stayCount = 0,
    totalSpent = 0,
    rewardsRedeemed = 0
  } = guest || {};

  // Calculate progress to next tier
  const getTierInfo = (tier) => {
    switch (tier) {
      case 'Bronze':
        return { 
          nextTier: 'Silver', 
          pointsToNext: 1000 - loyaltyPoints, 
          maxPoints: 1000,
          color: 'from-amber-700 to-amber-500',
          nextColor: 'text-gray-400'
        };
      case 'Silver':
        return { 
          nextTier: 'Gold', 
          pointsToNext: 3000 - loyaltyPoints,
          maxPoints: 3000,
          color: 'from-gray-400 to-gray-300',
          nextColor: 'text-amber-400'
        };
      case 'Gold':
        return { 
          nextTier: 'Platinum', 
          pointsToNext: 5000 - loyaltyPoints,
          maxPoints: 5000,
          color: 'from-amber-400 to-yellow-300',
          nextColor: 'text-slate-400'
        };
      case 'Platinum':
        return { 
          nextTier: 'Diamond', 
          pointsToNext: 10000 - loyaltyPoints,
          maxPoints: 10000,
          color: 'from-slate-400 to-slate-300',
          nextColor: 'text-blue-400'
        };
      case 'Diamond':
        return { 
          nextTier: 'Diamond', 
          pointsToNext: 0,
          maxPoints: 10000,
          color: 'from-blue-400 to-blue-300',
          nextColor: 'text-blue-400'
        };
      default:
        return { 
          nextTier: 'Silver', 
          pointsToNext: 1000 - loyaltyPoints,
          maxPoints: 1000,
          color: 'from-amber-700 to-amber-500',
          nextColor: 'text-gray-400'
        };
    }
  };

  const tierInfo = getTierInfo(loyaltyTier);
  const progress = tierInfo.maxPoints > 0 
    ? ((loyaltyPoints / tierInfo.maxPoints) * 100) 
    : 100;

  // Calculate available rewards
  const availableRewards = Math.floor(loyaltyPoints / 500);

  // Sample reward options based on tier
  const getRewardOptions = (tier) => {
    const baseRewards = [
      { points: 500, description: 'Free Late Check-out' },
      { points: 1000, description: 'Room Upgrade (when available)' },
    ];

    const silverRewards = [
      { points: 1500, description: 'Free Breakfast' },
      { points: 2000, description: '10% Discount on Next Stay' },
    ];

    const goldRewards = [
      { points: 2500, description: 'Free Extra Night' },
      { points: 3000, description: 'Airport Transfer' },
    ];

    const platinumRewards = [
      { points: 4000, description: 'Spa Treatment' },
      { points: 5000, description: '25% Discount on Next Stay' },
    ];

    const diamondRewards = [
      { points: 7500, description: 'Free Weekend Stay' },
      { points: 10000, description: 'Elite Experience Package' },
    ];

    switch (tier) {
      case 'Bronze':
        return baseRewards;
      case 'Silver':
        return [...baseRewards, ...silverRewards];
      case 'Gold':
        return [...baseRewards, ...silverRewards, ...goldRewards];
      case 'Platinum':
        return [...baseRewards, ...silverRewards, ...goldRewards, ...platinumRewards];
      case 'Diamond':
        return [...baseRewards, ...silverRewards, ...goldRewards, ...platinumRewards, ...diamondRewards];
      default:
        return baseRewards;
    }
  };

  const rewardOptions = getRewardOptions(loyaltyTier);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Award className="mr-2 text-blue-500" size={20} />
          Loyalty Program
        </h3>
        <div className="flex items-center">
          {[...Array(getLoyaltyStars(loyaltyTier))].map((_, i) => (
            <Star key={i} 
              size={16} 
              className={`${getTierColor(loyaltyTier)} ${i === 0 ? 'ml-0' : 'ml-1'}`} 
              fill="currentColor" 
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${tierInfo.color} flex items-center justify-center text-white font-semibold text-xs mr-2`}>
              {loyaltyTier.charAt(0)}
            </div>
            <span className="font-medium">{loyaltyTier} Member</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Next Tier</span>
            <div className="flex items-center">
              <span className={`font-medium ${tierInfo.nextColor}`}>{tierInfo.nextTier}</span>
              <div className={`h-6 w-6 rounded-full ml-2 bg-gradient-to-r ${getTierInfoByName(tierInfo.nextTier).color} flex items-center justify-center text-white font-semibold text-xs`}>
                {tierInfo.nextTier.charAt(0)}
              </div>
            </div>
          </div>
        </div>

        {loyaltyTier !== 'Diamond' && (
          <>
            <div className="h-2 bg-gray-200 rounded-full mb-1 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${tierInfo.color}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{loyaltyPoints} points</span>
              <span>{tierInfo.pointsToNext} points to {tierInfo.nextTier}</span>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <TrendingUp size={16} className="text-blue-500 mr-2" />
            <span className="text-sm text-gray-500">Total Points</span>
          </div>
          <p className="text-xl font-semibold">{loyaltyPoints}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <Users size={16} className="text-green-500 mr-2" />
            <span className="text-sm text-gray-500">Total Stays</span>
          </div>
          <p className="text-xl font-semibold">{stayCount}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Gift size={16} className="text-pink-500 mr-2" />
          Available Rewards
        </h4>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-2">
            {availableRewards} {availableRewards === 1 ? 'reward' : 'rewards'} available to redeem
          </p>
          {rewardOptions.filter(r => r.points <= loyaltyPoints).length > 0 ? (
            <div className="space-y-2">
              {rewardOptions
                .filter(reward => reward.points <= loyaltyPoints)
                .map((reward, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{reward.description}</span>
                    <button className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs">
                      Redeem ({reward.points})
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Continue earning points to unlock rewards
            </p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <h4 className="font-medium mb-1">How to earn points</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>100 points per night</li>
          <li>1 point per ₦100 spent</li>
          <li>500 bonus points for referring friends</li>
          <li>250 bonus points for booking directly</li>
        </ul>
      </div>
    </div>
  );
};

// Helper functions
function getLoyaltyStars(tier) {
  switch (tier) {
    case 'Bronze': return 1;
    case 'Silver': return 2;
    case 'Gold': return 3;
    case 'Platinum': return 4;
    case 'Diamond': return 5;
    default: return 1;
  }
}

function getTierColor(tier) {
  switch (tier) {
    case 'Bronze': return 'text-amber-700';
    case 'Silver': return 'text-gray-400';
    case 'Gold': return 'text-amber-400';
    case 'Platinum': return 'text-slate-400';
    case 'Diamond': return 'text-blue-400';
    default: return 'text-amber-700';
  }
}

function getTierInfoByName(tierName) {
  switch (tierName) {
    case 'Bronze':
      return { color: 'from-amber-700 to-amber-500' };
    case 'Silver':
      return { color: 'from-gray-400 to-gray-300' };
    case 'Gold':
      return { color: 'from-amber-400 to-yellow-300' };
    case 'Platinum':
      return { color: 'from-slate-400 to-slate-300' };
    case 'Diamond':
      return { color: 'from-blue-400 to-blue-300' };
    default:
      return { color: 'from-amber-700 to-amber-500' };
  }
}

export default LoyaltyProgramCard; 