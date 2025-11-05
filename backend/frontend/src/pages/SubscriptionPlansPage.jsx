import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Users, Crown, Shield } from 'lucide-react';

export default function SubscriptionPlansPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small property managers getting started',
      price: {
        monthly: 100,
        annual: 1000 // 2 months free
      },
      currency: '£',
      guestLimit: 50,
      features: [
        'Up to 50 guests per month',
        'Unlimited properties',
        'List on up to 3 platforms (Airbnb, Booking.com, etc.)',
        'Up to 2 team members',
        'Up to 10 photos per property',
        '5 pre-built message templates',
        'Basic AI predictions (revenue only)',
        'Automated messaging',
        'Basic analytics & reports',
        'Calendar management',
        'Booking management',
        'Guest communication (platform only)',
        'Email support (24-48hr response)',
        'Self-service onboarding',
        'PDF reports only',
        'Mobile app access'
      ],
      notIncluded: [
        'Unlimited platform listings',
        'Unlimited team members',
        'SMS/WhatsApp integration',
        'Dynamic pricing tools',
        'Custom booking website',
        'Multi-calendar sync',
        'Automated review requests',
        'Advanced AI predictions',
        'CSV/Excel export',
        'Priority 24/7 support',
        'Dedicated onboarding specialist'
      ],
      popular: false,
      icon: Users,
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses with high guest volume',
      price: {
        monthly: 500,
        annual: 5000 // 2 months free
      },
      currency: '£',
      guestLimit: 350,
      features: [
        'Up to 350 guests per month',
        'Unlimited properties',
        'List on unlimited platforms (Airbnb, Booking.com, etc.)',
        'Unlimited team members',
        'Unlimited photos per property',
        'Unlimited custom message templates',
        'Advanced AI predictions (revenue, occupancy, pricing)',
        'Dynamic pricing tools with AI suggestions',
        'Multi-calendar sync (prevent double bookings)',
        'Custom booking website with your branding',
        'SMS/WhatsApp direct guest communication',
        'Automated review requests',
        'Advanced automated messaging',
        'Advanced analytics & reports',
        'CSV/Excel financial exports',
        'Calendar management',
        'Booking management',
        'Priority support 24/7 (1-4hr response)',
        'Dedicated onboarding specialist',
        'Mobile app access',
        'Team collaboration tools',
        'Revenue forecasting',
        'Cleaning schedule management'
      ],
      notIncluded: [],
      popular: true,
      icon: Crown,
      color: 'purple'
    }
  ];

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    // Navigate to signup with selected plan
    navigate(`/signup?plan=${planId}&billing=${billingCycle}`);
  };

  const calculateSavings = (plan) => {
    const monthlyTotal = plan.price.monthly * 12;
    const annualTotal = plan.price.annual;
    return monthlyTotal - annualTotal;
  };

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

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all transform hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-bl-2xl font-semibold text-sm">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`p-3 rounded-xl bg-${plan.color}-100`}
                      style={{
                        backgroundColor: plan.color === 'blue' ? '#DBEAFE' : '#F3E8FF'
                      }}
                    >
                      <Icon
                        className={`h-8 w-8 text-${plan.color}-600`}
                        style={{
                          color: plan.color === 'blue' ? '#2563EB' : '#9333EA'
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-extrabold text-gray-900">
                        {plan.currency}
                        {billingCycle === 'monthly'
                          ? plan.price.monthly
                          : plan.price.annual}
                      </span>
                      <span className="ml-2 text-gray-500">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Save {plan.currency}{calculateSavings(plan)} per year!
                      </p>
                    )}
                    <div className="mt-3 text-gray-600">
                      <span className="font-semibold text-lg">
                        Up to {plan.guestLimit} guests
                      </span>
                      <span className="text-sm"> per month</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Get Started with {plan.name}
                  </button>

                  {/* Features List */}
                  <div className="mt-8 space-y-4">
                    <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      What's Included:
                    </h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature, index) => (
                        <li key={`not-${index}`} className="flex items-start opacity-50">
                          <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">30-Day</div>
              <div className="text-gray-600">Money-back guarantee</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Priority support included</div>
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

