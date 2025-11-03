import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Globe, Home, Calendar, PieChart, Users, MessageCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">ShortStories</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 font-medium hover:text-black">Login</Link>
            <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Streamline Your Shortlet Management
              </h1>
              <p className="text-xl mb-8 text-gray-300 leading-relaxed">
                The all-in-one platform that helps property managers maximize occupancy and simplify operations.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/register" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center">
                  Start Free Trial <ArrowRight size={20} className="ml-2" />
                </Link>
                <a href="#demo" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition flex items-center justify-center">
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="md:w-1/2 ml-0 md:ml-10">
              <div className="bg-white p-4 rounded-xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Dashboard Preview" 
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-gray-500 text-sm font-medium uppercase tracking-wider mb-10">
            Trusted by property managers across Nigeria
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, index) => (
              <div key={index} className="text-gray-400 font-bold text-xl">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">All-in-One Management Solution</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Everything you need to manage your shortlet properties efficiently in one powerful platform.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Home size={32} />}
              title="Property Management"
              description="Easily add, organize, and manage all your properties and their details in one place."
            />
            <FeatureCard 
              icon={<Calendar size={32} />}
              title="Booking Management"
              description="Handle reservations, check-ins, and check-outs with automated confirmations and reminders."
            />
            <FeatureCard 
              icon={<Users size={32} />}
              title="Guest Management"
              description="Keep track of guest information, preferences, and booking history for personalized service."
            />
            <FeatureCard 
              icon={<PieChart size={32} />}
              title="Performance Analytics"
              description="Gain insights into occupancy rates, revenue, and booking trends to optimize your business."
            />
            <FeatureCard 
              icon={<MessageCircle size={32} />}
              title="Guest Communication"
              description="Send automated messages and manage guest inquiries from a centralized inbox."
            />
            <FeatureCard 
              icon={<Globe size={32} />}
              title="Channel Integration"
              description="Sync with popular booking platforms to manage all reservations in one dashboard."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">How ShortStories Works</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Simple and effective shortlet management in just a few steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Add Your Properties"
              description="Easily upload your properties with photos, amenities, and detailed descriptions."
            />
            <StepCard
              number="2"
              title="Manage Bookings"
              description="Accept bookings, manage calendars, and communicate with guests all in one place."
            />
            <StepCard
              number="3"
              title="Grow Your Business"
              description="Use analytics and insights to optimize pricing and maximize occupancy rates."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Join hundreds of satisfied property managers who've transformed their business with ShortStories
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="ShortStories has completely transformed how I manage my properties. The automated messaging alone has saved me hours every week."
              author="Oluwaseun A."
              role="Property Manager, Lagos"
            />
            <TestimonialCard
              quote="The analytics dashboard gives me insights I never had before. I've been able to increase my occupancy rate by 30% in just three months."
              author="Amina Y."
              role="Shortlet Owner, Abuja"
            />
            <TestimonialCard
              quote="The guest management features have helped us deliver a much more personalized experience. Our review scores have improved significantly."
              author="Emmanuel O."
              role="Hospitality Manager, Port Harcourt"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Choose the plan that works best for your business
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              plan="Starter"
              price="₦15,000"
              description="Perfect for individual owners with 1-3 properties"
              features={[
                "Up to 3 properties",
                "Booking management",
                "Guest communication",
                "Basic analytics",
                "Email support"
              ]}
              buttonText="Start Free Trial"
              isPrimary={false}
            />
            <PricingCard
              plan="Professional"
              price="₦35,000"
              description="Ideal for growing businesses with multiple properties"
              features={[
                "Up to 10 properties",
                "Advanced analytics",
                "Team management",
                "Channel integration",
                "Priority support"
              ]}
              buttonText="Start Free Trial"
              isPrimary={true}
            />
            <PricingCard
              plan="Enterprise"
              price="Custom"
              description="For large property management companies"
              features={[
                "Unlimited properties",
                "Custom reporting",
                "API access",
                "Dedicated account manager",
                "Custom integration support"
              ]}
              buttonText="Contact Sales"
              isPrimary={false}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your property management?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of property managers who are saving time and maximizing revenue with ShortStories.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Start Your Free Trial
            </Link>
            <a href="#demo" className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition">
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ShortStories</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#press" className="text-gray-400 hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#security" className="text-gray-400 hover:text-white transition">Security</a></li>
                <li><a href="#roadmap" className="text-gray-400 hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#guides" className="text-gray-400 hover:text-white transition">Guides</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white transition">API Documentation</a></li>
                <li><a href="#community" className="text-gray-400 hover:text-white transition">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-400">Email:</span> support@shortstories.com</li>
                <li><span className="text-gray-400">Phone:</span> +234 800 123 4567</li>
                <li><span className="text-gray-400">Address:</span> Lagos, Nigeria</li>
                <li className="pt-2 flex space-x-4">
                  <a href="#twitter" className="text-gray-400 hover:text-white transition">Twitter</a>
                  <a href="#facebook" className="text-gray-400 hover:text-white transition">Facebook</a>
                  <a href="#instagram" className="text-gray-400 hover:text-white transition">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2023 ShortStories. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#terms" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#privacy" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Component for feature cards
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition group">
    <div className="text-gray-900 mb-4 group-hover:text-black">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Component for step cards
const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-gray-900 text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-6">
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Component for testimonial cards
const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
    <div className="flex mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={20} className="text-amber-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-6 italic">"{quote}"</p>
    <div>
      <h4 className="font-semibold">{author}</h4>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);

// Component for pricing cards
const PricingCard = ({ plan, price, description, features, buttonText, isPrimary }) => (
  <div className={`bg-white rounded-xl shadow-md border ${isPrimary ? 'border-gray-900 shadow-lg transform scale-105' : 'border-gray-200'}`}>
    <div className={`p-6 ${isPrimary ? 'bg-gray-900 text-white rounded-t-xl' : 'border-b border-gray-100'}`}>
      <h3 className="text-xl font-bold">{plan}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-extrabold">{price}</span>
        <span className="ml-1 text-sm opacity-80">/month</span>
      </div>
      <p className={`mt-2 text-sm ${isPrimary ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
    </div>
    <div className="p-6">
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={20} className={`mr-2 flex-shrink-0 ${isPrimary ? 'text-gray-900' : 'text-gray-700'}`} />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition ${
        isPrimary 
          ? 'bg-gray-900 text-white hover:bg-black' 
          : 'bg-white text-gray-900 border border-gray-900 hover:bg-gray-100'
      }`}>
        {buttonText}
      </button>
    </div>
  </div>
);

export default LandingPage; 