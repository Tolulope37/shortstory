import React, { useState, useEffect } from 'react';
import { 
  User, Shield, CreditCard, Star, Building, Save, 
  Edit, Camera, CheckCircle, AlertTriangle, X, 
  ChevronRight, MessageSquare, Award, Heart, Settings
} from 'lucide-react';
import '../styles/SettingsPage.css';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '/assets/images/profile-placeholder.jpg',
    bio: ''
  });
  
  // Business Details state
  const [business, setBusiness] = useState({
    businessName: '',
    businessType: 'Property Management Company',
    registrationNumber: '',
    address: '',
    website: '',
    logo: '/assets/images/business-logo.png',
    description: ''
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Subscription state
  const [subscription, setSubscription] = useState({
    currentPlan: 'Basic',
    billingCycle: 'Monthly',
    nextBillingDate: '',
    paymentMethod: ''
  });
  
  // Ratings state
  const [ratings, setRatings] = useState({
    averageRating: 0,
    totalReviews: 0,
    breakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    recentReviews: []
  });
  
  // Plans available for upgrade
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₮5,000',
      features: [
        'Up to 5 properties',
        'Basic analytics',
        'Email support',
        'Standard booking tools'
      ],
      current: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₮12,000',
      features: [
        'Up to 15 properties',
        'Advanced analytics',
        'Priority email support',
        'Enhanced booking tools',
        'Guest messaging platform'
      ],
      current: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₮25,000',
      features: [
        'Unlimited properties',
        'Premium analytics & reports',
        '24/7 dedicated support',
        'Complete booking suite',
        'Advanced messaging platform',
        'API access',
        'Custom integrations'
      ],
      current: false
    }
  ];
  
  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };
  
  // Handle business form submission
  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Business details updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setLoading(false);
      setError("Passwords don't match");
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };
  
  // Handle subscription upgrade
  const handleUpgrade = (planId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscription({
        ...subscription,
        currentPlan: plans.find(plan => plan.id === planId).name
      });
      setSuccess('Subscription upgraded successfully!');
      
      // Update current plan status
      plans.forEach(plan => plan.current = plan.id === planId);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }, 1000);
  };
  
  // Profile image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          profileImage: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Business logo upload handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusiness({
          ...business,
          logo: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Render rating stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={i <= rating ? 'filled-star' : 'empty-star'}
          fill={i <= rating ? 'currentColor' : 'none'}
        />
      );
    }
    return stars;
  };
  
  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1><Settings size={24} className="header-icon" /> Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>
        
        {/* Success and error messages */}
        {success && (
          <div className="success-message">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <AlertTriangle size={16} />
            <span>{error}</span>
            <button onClick={() => setError('')} className="close-button">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div className="settings-container">
        <div className="settings-sidebar">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile</span>
            <ChevronRight size={16} className="tab-icon" />
          </button>
          
          <button
            className={`settings-tab ${activeTab === 'business' ? 'active' : ''}`}
            onClick={() => setActiveTab('business')}
          >
            <Building size={18} />
            <span>Business Details</span>
            <ChevronRight size={16} className="tab-icon" />
          </button>
          
          <button
            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <Shield size={18} />
            <span>Password & Security</span>
            <ChevronRight size={16} className="tab-icon" />
          </button>
       
          
          <button
            className={`settings-tab ${activeTab === 'ratings' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            <Star size={18} />
            <span>Ratings & Reviews</span>
            <ChevronRight size={16} className="tab-icon" />
          </button>
        </div>
        
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-panel">
              <h2>Profile Settings</h2>
              <p className="panel-description">
                Manage your personal information and how it appears to guests
              </p>
              
              <form onSubmit={handleProfileSubmit}>
                <div className="profile-image-section">
                  <div className="profile-image">
                    <img src={profile.profileImage} alt="Profile" />
                    <div className="image-upload-overlay">
                      <label htmlFor="profile-upload">
                        <Camera size={20} />
                        <span>Change</span>
                      </label>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                      />
                    </div>
                  </div>
                  <div className="profile-name">
                    <h3>{profile.firstName} {profile.lastName}</h3>
                    <span className="profile-email">{profile.email}</span>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Bio (Visible to Guests)</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell guests about yourself and your business..."
                  />
                  <p className="input-help">This information will be visible on your public profile.</p>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Business Details Tab */}
          {activeTab === 'business' && (
            <div className="settings-panel">
              <h2>Business Details</h2>
              <p className="panel-description">
                Manage your business information that guests will see
              </p>
              
              <form onSubmit={handleBusinessSubmit}>
                <div className="business-logo-section">
                  <div className="business-logo">
                    <img src={business.logo} alt="Business Logo" />
                    <div className="image-upload-overlay">
                      <label htmlFor="logo-upload">
                        <Camera size={20} />
                        <span>Change</span>
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        hidden
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      value={business.businessName}
                      onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Business Type</label>
                    <select
                      value={business.businessType}
                      onChange={(e) => setBusiness({ ...business, businessType: e.target.value })}
                    >
                      <option value="Property Management Company">Property Management Company</option>
                      <option value="Individual Host">Individual Host</option>
                      <option value="Real Estate Agency">Real Estate Agency</option>
                      <option value="Hospitality Group">Hospitality Group</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Registration Number (Optional)</label>
                    <input
                      type="text"
                      value={business.registrationNumber}
                      onChange={(e) => setBusiness({ ...business, registrationNumber: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Website (Optional)</label>
                    <input
                      type="url"
                      value={business.website}
                      onChange={(e) => setBusiness({ ...business, website: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Business Address</label>
                  <input
                    type="text"
                    value={business.address}
                    onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                  />
                </div>
                
                <div className="form-group">
                  <label>Business Description (Visible to Guests)</label>
                  <textarea
                    value={business.description}
                    onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                    rows={4}
                    placeholder="Describe your business to potential guests..."
                  />
                  <p className="input-help">This information will be visible on your public profile.</p>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="primary-button" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Password & Security Tab */}
          {activeTab === 'password' && (
            <div className="settings-panel">
              <h2>Password & Security</h2>
              <p className="panel-description">
                Manage your password and account security settings
              </p>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="security-section">
                  <h3>Change Password</h3>
                  
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <p className="input-help">Password must be at least 8 characters long with letters, numbers, and special characters.</p>
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="primary-button" disabled={loading}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
                
                <div className="security-section">
                  <h3>Two-Factor Authentication</h3>
                  <p>Enhance your account security by enabling two-factor authentication.</p>
                  
                  <div className="security-card">
                    <div className="security-status enabled">
                      <Shield size={20} />
                      <div>
                        <h4>Two-Factor Authentication</h4>
                        <p>Enabled via SMS to ******7890</p>
                      </div>
                    </div>
                    <button className="secondary-button">Manage</button>
                  </div>
                </div>
                
                <div className="security-section">
                  <h3>Login Sessions</h3>
                  <p>Manage your active login sessions across devices.</p>
                  
                  <div className="session-card">
                    <div className="device-icon">
                      <span>🖥️</span>
                    </div>
                    <div className="session-details">
                      <h4>MacBook Pro - Chrome</h4>
                      <p>Lagos, Nigeria • Current Session</p>
                    </div>
                  </div>
                  
                  <div className="session-card">
                    <div className="device-icon">
                      <span>📱</span>
                    </div>
                    <div className="session-details">
                      <h4>iPhone 13 - Safari</h4>
                      <p>Lagos, Nigeria • Last active: 2 hours ago</p>
                    </div>
                    <button className="text-button danger">Sign Out</button>
                  </div>
                  
                  <button className="secondary-button">Sign Out All Other Devices</button>
                </div>
              </form>
            </div>
          )}
          
          
          
          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div className="settings-panel">
              <h2>Ratings & Reviews</h2>
              <p className="panel-description">
                View your ratings and reviews from guests
              </p>
              
              <div className="ratings-overview">
                <div className="ratings-summary">
                  <div className="average-rating">
                    <h3>{ratings.averageRating}</h3>
                    <div className="stars-container">
                      {renderStars(Math.round(ratings.averageRating))}
                    </div>
                    <p className="review-count">{ratings.totalReviews} reviews</p>
                  </div>
                  
                  <div className="ratings-breakdown">
                    {Object.entries(ratings.breakdown).reverse().map(([rating, count]) => (
                      <div key={rating} className="rating-bar">
                        <div className="rating-label">{rating} star</div>
                        <div className="rating-progress">
                          <div 
                            className="rating-progress-fill" 
                            style={{ width: `${(count / ratings.totalReviews) * 100}%` }}
                          ></div>
                        </div>
                        <div className="rating-count">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="ratings-badges">
                  <div className="rating-badge">
                    <Award size={24} />
                    <div className="badge-content">
                      <h4>Superhost Status</h4>
                      <p>You've achieved Superhost status!</p>
                    </div>
                  </div>
                  
                  <div className="rating-badge">
                    <MessageSquare size={24} />
                    <div className="badge-content">
                      <h4>Response Rate</h4>
                      <p>98% response rate (under 1 hour)</p>
                    </div>
                  </div>
                  
                  <div className="rating-badge">
                    <Heart size={24} />
                    <div className="badge-content">
                      <h4>Guest Satisfaction</h4>
                      <p>95% of guests rate 4 stars or higher</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="recent-reviews">
                <h3>Recent Guest Reviews</h3>
                
                {ratings.recentReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="guest-info">
                        <div className="guest-avatar">
                          {review.guestName.charAt(0)}
                        </div>
                        <div>
                          <h4>{review.guestName}</h4>
                          <p className="review-date">{review.date}</p>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="review-content">
                      {review.comment}
                    </div>
                  </div>
                ))}
                
                <button className="secondary-button">View All Reviews</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 