import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Shield } from 'lucide-react';

export default function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual

  const handleSelectPlan = (planId) => {
    navigate(`/signup?plan=${planId}&billing=${billingCycle}`);
  };

  const calculatePrice = (monthly, annual) => {
    return billingCycle === 'monthly' ? monthly : annual;
  };

  // Feature comparison data
  const features = [
    { category: 'Usage Limits', items: [
      { name: 'Guest stays per month', starter: 'Up to 50', professional: 'Up to 350' },
      { name: 'Properties', starter: 'Unlimited', professional: 'Unlimited' },
      { name: 'Team members', starter: '2 included', professional: 'Unlimited' },
      { name: 'Platform listings', starter: 'Up to 3 platforms', professional: 'All major platforms' },
    ]},
    { category: 'Property Management', items: [
      { name: 'Photos per property', starter: 'Up to 10', professional: 'Unlimited' },
      { name: 'Message templates', starter: '5 quick reply templates', professional: 'Unlimited custom templates' },
      { name: 'Calendar & booking management', starter: true, professional: true },
      { name: 'Multi-calendar sync', starter: false, professional: 'Avoid double bookings' },
      { name: 'Cleaning & maintenance scheduling', starter: false, professional: true },
    ]},
    { category: 'AI & Pricing Tools', items: [
      { name: 'AI pricing preview', starter: 'Revenue estimates only', professional: false },
      { name: 'Advanced AI predictions', starter: false, professional: 'Pricing & occupancy' },
      { name: 'Dynamic pricing tools', starter: false, professional: 'Real-time AI adjustments' },
      { name: 'Revenue forecasting', starter: false, professional: true },
    ]},
    { category: 'Guest Communication', items: [
      { name: 'Automated guest messaging', starter: true, professional: true },
      { name: 'Guest messaging inbox', starter: 'Platform connections only', professional: 'Platform connections' },
      { name: 'SMS / WhatsApp communication', starter: false, professional: true },
      { name: 'Automated review requests', starter: false, professional: true },
    ]},
    { category: 'Analytics & Reports', items: [
      { name: 'Analytics & reports', starter: 'Basic (bookings, revenue, occupancy)', professional: 'Advanced analytics & revenue reports' },
      { name: 'Report exports', starter: 'PDF only', professional: 'CSV / Excel for accounting' },
    ]},
    { category: 'Support & Onboarding', items: [
      { name: 'Support', starter: 'Email (24–48 hr response)', professional: 'Priority 24/7 (1–4 hr response)' },
      { name: 'Onboarding', starter: 'Self-service', professional: 'Dedicated onboarding specialist' },
      { name: 'Team collaboration tools', starter: false, professional: 'Tasks, permissions, notes' },
    ]},
    { category: 'Access', items: [
      { name: 'Mobile app access', starter: true, professional: true },
    ]},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Shortlet</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start managing your properties efficiently. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-8 p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-b-4 border-gray-200">
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Features</h3>
              <p className="text-sm text-gray-600">Compare what's included</p>
            </div>
            
            {/* Starter Plan Header */}
            <div className="text-center bg-white rounded-xl shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-blue-600">
                  £{calculatePrice(100, 1000)}
                </span>
                <span className="text-gray-600">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Perfect for independent hosts and small teams getting started.
              </p>
              <button
                onClick={() => handleSelectPlan('starter')}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                Get Started
              </button>
              <p className="text-xs text-gray-500 mt-3 italic">
                Ideal if you manage a few short-lets and want automation without complexity.
              </p>
            </div>

            {/* Professional Plan Header */}
            <div className="text-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white relative">
              <div className="absolute -top-3 right-4 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">
                ⭐ MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold">
                  £{calculatePrice(500, 5000)}
                </span>
                <span className="text-purple-100">
                  /{billingCycle === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              <p className="text-sm text-purple-100 mb-4">
                Built for property managers and high-volume operators who want automation, analytics, and control at scale.
              </p>
              <button
                onClick={() => handleSelectPlan('professional')}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-white hover:bg-gray-100 text-purple-700 transition-all"
              >
                Get Started
              </button>
              <p className="text-xs text-purple-100 mt-3 italic">
                Best for teams managing 10+ properties or 300+ monthly guests who want full automation, AI-driven pricing, and enterprise-level reporting.
              </p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-gray-200">
            {features.map((category, catIndex) => (
              <div key={catIndex}>
                {/* Category Header */}
                <div className="bg-gray-50 px-8 py-4">
                  <h4 className="text-lg font-bold text-gray-900">{category.category}</h4>
                </div>
                
                {/* Category Features */}
                {category.items.map((feature, featureIndex) => (
                  <div key={featureIndex} className="grid grid-cols-3 gap-8 px-8 py-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium">{feature.name}</span>
                    </div>
                    
                    {/* Starter Value */}
                    <div className="flex items-center justify-center">
                      {feature.starter === true ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : feature.starter === false ? (
                        <X className="h-6 w-6 text-gray-300" />
                      ) : (
                        <span className="text-center text-gray-700">{feature.starter}</span>
                      )}
                    </div>
                    
                    {/* Professional Value */}
                    <div className="flex items-center justify-center">
                      {feature.professional === true ? (
                        <Check className="h-6 w-6 text-green-500" />
                      ) : feature.professional === false ? (
                        <X className="h-6 w-6 text-gray-300" />
                      ) : (
                        <span className="text-center text-purple-700 font-medium">{feature.professional}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="grid grid-cols-3 gap-8 p-8 bg-gray-50 border-t-4 border-gray-200">
            <div></div>
            <div className="text-center">
              <button
                onClick={() => handleSelectPlan('starter')}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg"
              >
                Start with Starter
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => handleSelectPlan('professional')}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all shadow-lg"
              >
                Start with Professional
              </button>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto mt-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">30-Day</div>
              <div className="text-gray-600">Money-back guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">No Lock-in</div>
              <div className="text-gray-600">Cancel anytime, hassle-free</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                What happens if I exceed my guest limit?
              </h4>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limit. You can easily upgrade to the next tier anytime to accommodate more guests.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h4>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                Yes, all plans come with a 14-day free trial. No credit card required to start. You can cancel anytime during the trial period.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and PayPal. All payments are secure and encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing? Our team is here to help!
          </p>
          <button
            onClick={() => window.open('mailto:support@shortlet.com', '_blank')}
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
