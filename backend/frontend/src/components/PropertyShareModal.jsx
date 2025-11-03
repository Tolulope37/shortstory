import { useState, useRef } from 'react';
import { X, Copy, Check, Share2, Facebook, Twitter, Mail, WhatsApp, Link } from 'lucide-react';

export default function PropertyShareModal({ property, onClose }) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const linkInputRef = useRef(null);
  
  // Generate a unique share link when the component mounts
  useState(() => {
    // In a real app, this would call an API to create a shareable link with tracking
    // For now, just generate a fake link with the property ID
    const baseUrl = window.location.origin;
    const uniqueCode = generateUniqueCode();
    setShareLink(`${baseUrl}/p/${property.id}/${uniqueCode}`);
  }, [property.id]);
  
  // Generate a simple "unique" code for the link
  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleCopyLink = () => {
    linkInputRef.current.select();
    document.execCommand('copy');
    setCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareViaEmail = () => {
    const subject = `Check out this property: ${property.name}`;
    const body = `Hey, I thought you might be interested in this property:\n\n${property.name} in ${property.location}\n\nView and book it here: ${shareLink}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };
  
  const shareViaWhatsApp = () => {
    const text = `Check out this property: ${property.name} in ${property.location}. View and book it here: ${shareLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };
  
  const shareViaTwitter = () => {
    const text = `Check out this amazing property: ${property.name} in ${property.location}`;
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`);
  };
  
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Share2 size={20} className="mr-2 text-blue-500" />
              Share Property
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-800 mb-1">{property.name}</h3>
              <p className="text-sm text-gray-500">{property.location}</p>
              <p className="text-sm text-gray-500 mt-1">Daily rate: {property.rate}</p>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share this property with potential guests
            </label>
            
            <div className="flex mb-4">
              <input
                ref={linkInputRef}
                type="text"
                value={shareLink}
                readOnly
                className="flex-grow rounded-l-lg border-gray-300 border border-r-0 py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              >
                {copied ? (
                  <>
                    <Check size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              When someone books through this link, the booking will appear in your dashboard for confirmation.
            </p>
            
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={shareViaWhatsApp}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-green-50 text-green-600"
              >
                <WhatsApp size={24} />
                <span className="text-xs mt-1">WhatsApp</span>
              </button>
              
              <button
                onClick={shareViaEmail}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50 text-blue-600"
              >
                <Mail size={24} />
                <span className="text-xs mt-1">Email</span>
              </button>
              
              <button
                onClick={shareViaTwitter}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-sky-50 text-sky-500"
              >
                <Twitter size={24} />
                <span className="text-xs mt-1">Twitter</span>
              </button>
              
              <button
                onClick={shareViaFacebook}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-blue-50 text-blue-600"
              >
                <Facebook size={24} />
                <span className="text-xs mt-1">Facebook</span>
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>Bookings created through this link will be marked as "Pending" until you confirm them.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 