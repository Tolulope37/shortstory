import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Shield, Users, Home, Zap, MessageSquare, BarChart3, Headphones, Smartphone } from 'lucide-react';

export default function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual

  const handleSelectPlan = (planId) => {
    navigate(`/signup?plan=${planId}&billing=${billingCycle}`);
  };

  const calculatePrice = (monthly, annual) => {
    return billingCycle === 'monthly' ? monthly : annual;
  };

  // Feature comparison data with icons
  const features = [
    { category: 'Usage Limits', icon: Users, color: 'blue', items: [
      { name: 'Guest stays per month', starter: 'Up to 50', professional: 'Up to 350' },
      { name: 'Properties', starter: 'Unlimited', professional: 'Unlimited' },
      { name: 'Team members', starter: '2 included', professional: 'Unlimited' },
      { name: 'Platform listings', starter: 'Up to 3 platforms', professional: 'All major platforms' },
    ]},
    { category: 'Property Management', icon: Home, color: 'green', items: [
      { name: 'Photos per property', starter: 'Up to 10', professional: 'Unlimited' },
      { name: 'Message templates', starter: '5 quick reply templates', professional: 'Unlimited custom templates' },
      { name: 'Calendar & booking management', starter: true, professional: true },
      { name: 'Multi-calendar sync', starter: false, professional: 'Avoid double bookings' },
      { name: 'Cleaning & maintenance scheduling', starter: false, professional: true },
    ]},
    { category: 'AI & Pricing Tools', icon: Zap, color: 'yellow', items: [
      { name: 'AI pricing preview', starter: 'Revenue estimates only', professional: false },
      { name: 'Advanced AI predictions', starter: false, professional: 'Pricing & occupancy' },
      { name: 'Dynamic pricing tools', starter: false, professional: 'Real-time AI adjustments' },
      { name: 'Revenue forecasting', starter: false, professional: true },
    ]},
    { category: 'Guest Communication', icon: MessageSquare, color: 'purple', items: [
      { name: 'Automated guest messaging', starter: true, professional: true },
      { name: 'Guest messaging inbox', starter: 'Platform connections only', professional: 'Platform connections' },
      { name: 'SMS / WhatsApp communication', starter: false, professional: true },
      { name: 'Automated review requests', starter: false, professional: true },
    ]},
    { category: 'Analytics & Reports', icon: BarChart3, color: 'indigo', items: [
      { name: 'Analytics & reports', starter: 'Basic (bookings, revenue, occupancy)', professional: 'Advanced analytics & revenue reports' },
      { name: 'Report exports', starter: 'PDF only', professional: 'CSV / Excel for accounting' },
    ]},
    { category: 'Support & Onboarding', icon: Headphones, color: 'pink', items: [
      { name: 'Support', starter: 'Email (24–48 hr response)', professional: 'Priority 24/7 (1–4 hr response)' },
      { name: 'Onboarding', starter: 'Self-service', professional: 'Dedicated onboarding specialist' },
      { name: 'Team collaboration tools', starter: false, professional: 'Tasks, permissions, notes' },
    ]},
    { category: 'Access', icon: Smartphone, color: 'teal', items: [
      { name: 'Mobile app access', starter: true, professional: true },
    ]},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10">
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
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 relative ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-bold shadow-md animate-pulse">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-200 max-w-4xl mx-auto">
          {/* Header Row with Plan Cards */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200">
            
            {/* Starter Plan Header */}
            <div className="text-center bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md p-4 border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Starter</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  £{calculatePrice(100, 1000)}
                </span>
                <span className="text-gray-600 text-sm">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Perfect for independent hosts and small teams getting started.
              </p>
              <button
                onClick={() => handleSelectPlan('starter')}
                className="w-full py-2 px-4 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Get Started →
              </button>
              <p className="text-xs text-gray-500 mt-2 italic">
                Ideal if you manage a few short-lets and want automation without complexity.
              </p>
            </div>

            {/* Professional Plan Header */}
            <div className="text-center bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-lg shadow-md p-4 text-white relative transform transition-all duration-300 hover:scale-105 hover:shadow-lg group border border-purple-400">
              <div className="absolute -top-2 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 px-3 py-0.5 rounded-full text-xs font-bold shadow-md">
                ⭐ MOST POPULAR
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">
                  £{calculatePrice(500, 5000)}
                </span>
                <span className="text-purple-100 text-sm">
                  /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </div>
              <p className="text-sm text-purple-50 mb-3">
                Built for property managers and high-volume operators who want automation, analytics, and control at scale.
              </p>
              <button
                onClick={() => handleSelectPlan('professional')}
                className="w-full py-2 px-4 rounded-lg font-semibold text-sm bg-white hover:bg-gray-50 text-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Get Started →
              </button>
              <p className="text-xs text-purple-100 mt-2 italic">
                Best for teams managing 10+ properties or 300+ monthly guests who want full automation, AI-driven pricing, and enterprise-level reporting.
              </p>
            </div>
          </div>

          {/* Feature Rows */}
          <div className="divide-y divide-gray-200">
            {features.map((category, catIndex) => (
              <div key={catIndex}>
                {/* Category Header */}
                <div className={`
                  bg-gradient-to-r from-gray-50 to-white px-8 py-5 border-l-4
                  ${category.color === 'blue' ? 'border-blue-500' : ''}
                  ${category.color === 'green' ? 'border-green-500' : ''}
                  ${category.color === 'yellow' ? 'border-yellow-500' : ''}
                  ${category.color === 'purple' ? 'border-purple-500' : ''}
                  ${category.color === 'indigo' ? 'border-indigo-500' : ''}
                  ${category.color === 'pink' ? 'border-pink-500' : ''}
                  ${category.color === 'teal' ? 'border-teal-500' : ''}
                `}>
                  <div className="flex items-center space-x-3">
                    <div className={`
                      p-2 rounded-lg
                      ${category.color === 'blue' ? 'bg-blue-100' : ''}
                      ${category.color === 'green' ? 'bg-green-100' : ''}
                      ${category.color === 'yellow' ? 'bg-yellow-100' : ''}
                      ${category.color === 'purple' ? 'bg-purple-100' : ''}
                      ${category.color === 'indigo' ? 'bg-indigo-100' : ''}
                      ${category.color === 'pink' ? 'bg-pink-100' : ''}
                      ${category.color === 'teal' ? 'bg-teal-100' : ''}
                    `}>
                      <category.icon className={`
                        h-5 w-5
                        ${category.color === 'blue' ? 'text-blue-600' : ''}
                        ${category.color === 'green' ? 'text-green-600' : ''}
                        ${category.color === 'yellow' ? 'text-yellow-600' : ''}
                        ${category.color === 'purple' ? 'text-purple-600' : ''}
                        ${category.color === 'indigo' ? 'text-indigo-600' : ''}
                        ${category.color === 'pink' ? 'text-pink-600' : ''}
                        ${category.color === 'teal' ? 'text-teal-600' : ''}
                      `} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">{category.category}</h4>
                  </div>
                </div>
                
                {/* Category Features */}
                {category.items.map((feature, featureIndex) => (
                  <div key={featureIndex} className="grid grid-cols-3 gap-8 px-8 py-5 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200 group">
                    <div className="flex items-center col-span-1">
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{feature.name}</span>
                    </div>
                    
                    {/* Starter Value */}
                    <div className="flex items-center justify-center col-span-1">
                      {feature.starter === true ? (
                        <div className="p-1.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      ) : feature.starter === false ? (
                        <X className="h-5 w-5 text-gray-300" />
                      ) : (
                        <span className="text-center text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{feature.starter}</span>
                      )}
                    </div>
                    
                    {/* Professional Value */}
                    <div className="flex items-center justify-center col-span-1">
                      {feature.professional === true ? (
                        <div className="p-1.5 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      ) : feature.professional === false ? (
                        <X className="h-5 w-5 text-gray-300" />
                      ) : (
                        <span className="text-center text-purple-700 font-semibold group-hover:text-purple-800 transition-colors">{feature.professional}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200">
            <div className="text-center">
              <button
                onClick={() => handleSelectPlan('starter')}
                className="w-full py-2 px-4 rounded-lg font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Start with Starter →
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => handleSelectPlan('professional')}
                className="w-full py-2 px-4 rounded-lg font-semibold text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Start with Professional →
              </button>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 max-w-5xl mx-auto mt-12 border border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">30-Day</div>
              <div className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Money-back guarantee</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Support available</div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">No Lock-in</div>
              <div className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">Cancel anytime, hassle-free</div>
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
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(10px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </div>
  );
}
