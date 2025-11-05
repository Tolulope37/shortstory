import { useState, useEffect } from 'react';
import { Award, Gift, TrendingUp, Star } from 'lucide-react';

export default function GuestLoyalty() {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch loyalty data from API
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API calls when guest portal backend is ready
        // const loyaltyResponse = await api.get('/guest/loyalty');
        // const rewardsResponse = await api.get('/guest/loyalty/rewards');
        // setLoyaltyData(loyaltyResponse.data);
        // setRewards(rewardsResponse.data || []);
        
        // For now, show empty state
        setLoyaltyData(null);
        setRewards([]);
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
        setLoyaltyData(null);
        setRewards([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLoyaltyData();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
        <p className="text-gray-600">Earn points and unlock exclusive rewards</p>
      </div>

      {!loyaltyData ? (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Not enrolled in loyalty program</h3>
          <p className="mt-2 text-sm text-gray-500">
            Complete your first booking to join our loyalty program and start earning rewards!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Points Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-3xl font-bold text-gray-900">{loyaltyData.totalPoints}</p>
                </div>
                <Star className="h-10 w-10 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Tier</p>
                  <p className="text-3xl font-bold text-gray-900">{loyaltyData.tier}</p>
                </div>
                <Award className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Next Tier</p>
                  <p className="text-lg font-semibold text-gray-900">{loyaltyData.nextTier}</p>
                  <p className="text-xs text-gray-500">{loyaltyData.pointsToNext} points to go</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress to {loyaltyData.nextTier}</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {loyaltyData.totalPoints} / {loyaltyData.pointsForNext} points
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${(loyaltyData.totalPoints / loyaltyData.pointsForNext) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                ></div>
              </div>
            </div>
          </div>

          {/* Available Rewards */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
            {rewards.length === 0 ? (
              <p className="text-gray-600">No rewards available yet. Keep booking to earn more points!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {rewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Gift className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{reward.name}</h4>
                        <p className="text-sm text-gray-500">{reward.pointsCost} points</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Redeem
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
