import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Clock, Check, CheckCheck, Search, ChevronLeft, ChevronRight, Phone, Info, Image, Paperclip, Smile, MessageSquare } from 'lucide-react';

export default function GuestMessages() {
  const [searchParams] = useSearchParams();
  const initialBookingId = searchParams.get('booking');
  
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Mock data fetch
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockConversations = [
        {
          id: 1,
          host: {
            id: 101,
            name: "Oluwaseun Adeyemi",
            image: "https://placehold.co/100x100/718096/ffffff?text=OA",
            responseTime: "usually responds within an hour"
          },
          property: {
            id: 1,
            name: "Lekki Paradise Villa",
            booking: {
              id: 1,
              checkIn: "2025-04-24",
              checkOut: "2025-04-28"
            }
          },
          lastMessage: {
            text: "Your check-in details will be ready 24 hours before your arrival. Let me know if you have any questions!",
            timestamp: "2025-04-20T15:30:00",
            isFromHost: true,
            isRead: true
          },
          messages: [
            {
              id: 1,
              text: "Hello Adeola! I'm excited to host you at Lekki Paradise Villa. Do you have any questions before your stay?",
              timestamp: "2025-04-18T10:15:00",
              isFromHost: true,
              isRead: true
            },
            {
              id: 2,
              text: "Hi Oluwaseun! Yes, I'd like to know if early check-in is possible around noon?",
              timestamp: "2025-04-18T11:20:00",
              isFromHost: false,
              isRead: true
            },
            {
              id: 3,
              text: "Absolutely! I can accommodate an early check-in at noon. I'll make sure the villa is prepared for you by then.",
              timestamp: "2025-04-18T12:45:00",
              isFromHost: true,
              isRead: true
            },
            {
              id: 4,
              text: "Thank you so much! Also, is there parking available on the premises?",
              timestamp: "2025-04-19T09:10:00",
              isFromHost: false,
              isRead: true
            },
            {
              id: 5,
              text: "Yes, there's secure parking for up to 2 vehicles inside the compound. The gate will be open when you arrive.",
              timestamp: "2025-04-19T10:30:00",
              isFromHost: true,
              isRead: true
            },
            {
              id: 6,
              text: "Perfect! Looking forward to our stay.",
              timestamp: "2025-04-20T08:45:00",
              isFromHost: false,
              isRead: true
            },
            {
              id: 7,
              text: "Your check-in details will be ready 24 hours before your arrival. Let me know if you have any questions!",
              timestamp: "2025-04-20T15:30:00",
              isFromHost: true,
              isRead: true
            }
          ]
        },
        {
          id: 2,
          host: {
            id: 102,
            name: "Chinwe Okonkwo",
            image: "https://placehold.co/100x100/4299e1/ffffff?text=CO",
            responseTime: "usually responds within 2 hours"
          },
          property: {
            id: 3,
            name: "Victoria Island Luxury Suite",
            booking: {
              id: 2,
              checkIn: "2025-05-15",
              checkOut: "2025-05-20"
            }
          },
          lastMessage: {
            text: "Hello! I saw your booking for the Luxury Suite. Is this your first time staying in Victoria Island?",
            timestamp: "2025-04-21T14:20:00",
            isFromHost: true,
            isRead: false
          },
          messages: [
            {
              id: 1,
              text: "Hello! I saw your booking for the Luxury Suite. Is this your first time staying in Victoria Island?",
              timestamp: "2025-04-21T14:20:00",
              isFromHost: true,
              isRead: false
            }
          ]
        }
      ];
      
      setConversations(mockConversations);
      
      // If a booking ID was passed in the URL, open that conversation
      if (initialBookingId) {
        const conversation = mockConversations.find(
          c => c.property.booking.id === parseInt(initialBookingId)
        );
        if (conversation) {
          setActiveConversation(conversation);
          setIsMobileChatOpen(true);
        }
      } else if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
      }
      
      setIsLoading(false);
    }, 800);
  }, [initialBookingId]);
  
  // Auto-scroll to bottom of messages when active conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation]);
  
  // Format date for display
  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return formatTime(messageDate);
    } 
    // Check if the message is from yesterday
    else if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${formatTime(messageDate)}`;
    } 
    // For other days, show the full date
    else {
      const options = { month: 'short', day: 'numeric' };
      return `${messageDate.toLocaleDateString('en-US', options)}, ${formatTime(messageDate)}`;
    }
  };
  
  // Format time only
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  };
  
  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !activeConversation) return;
    
    const newMessage = {
      id: activeConversation.messages.length + 1,
      text: message.trim(),
      timestamp: new Date().toISOString(),
      isFromHost: false,
      isRead: false
    };
    
    // Update the active conversation with the new message
    const updatedConversation = {
      ...activeConversation,
      lastMessage: newMessage,
      messages: [...activeConversation.messages, newMessage]
    };
    
    // Update the conversations list
    const updatedConversations = conversations.map(conv => 
      conv.id === activeConversation.id ? updatedConversation : conv
    );
    
    setActiveConversation(updatedConversation);
    setConversations(updatedConversations);
    setMessage('');
    
    // In a real app, you would send the message to the server here
  };
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      conv.host.name.toLowerCase().includes(lowerCaseQuery) ||
      conv.property.name.toLowerCase().includes(lowerCaseQuery)
    );
  });
  
  // Count unread messages
  const unreadCount = conversations.reduce((count, conv) => {
    return count + (conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.isFromHost ? 1 : 0);
  }, 0);
  
  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          Messages
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h1>
        <p className="text-gray-500">Stay in touch with your hosts.</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Conversation list (hidden on mobile when chat is open) */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 ${isMobileChatOpen ? 'hidden md:block' : 'block'}`}>
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>
          
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 57px)' }}>
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2].map(n => (
                  <div key={n} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div 
                  key={conv.id}
                  className={`p-3 border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setActiveConversation(conv);
                    setIsMobileChatOpen(true);
                  }}
                >
                  <div className="relative">
                    <img 
                      src={conv.host.image} 
                      alt={conv.host.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.isFromHost && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900 truncate">{conv.host.name}</p>
                      {conv.lastMessage && (
                        <p className="text-xs text-gray-500">
                          {new Date(conv.lastMessage.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.property.name}</p>
                    {conv.lastMessage && (
                      <p className={`text-xs truncate ${
                        !conv.lastMessage.isRead && conv.lastMessage.isFromHost 
                          ? 'font-medium text-gray-900' 
                          : 'text-gray-500'
                      }`}>
                        {conv.lastMessage.isFromHost ? '' : 'You: '}
                        {conv.lastMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Chat area (shown on mobile only when a chat is open) */}
        <div className={`w-full md:w-2/3 lg:w-3/4 flex flex-col ${!isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-b border-gray-200 flex items-center">
                <button 
                  className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setIsMobileChatOpen(false)}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <img 
                  src={activeConversation.host.image} 
                  alt={activeConversation.host.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                <div className="ml-3 flex-1">
                  <p className="font-medium">{activeConversation.host.name}</p>
                  <p className="text-xs text-gray-500">
                    {activeConversation.property.name}
                    <span className="mx-1">•</span>
                    {activeConversation.host.responseTime}
                  </p>
                </div>
                
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Info size={20} className="text-gray-500" />
                </button>
                
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center max-w-md mx-auto">
                  <p className="text-sm font-medium">Your stay at {activeConversation.property.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(activeConversation.property.booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                    {' - '}
                    {new Date(activeConversation.property.booking.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                
                {activeConversation.messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isFromHost ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[75%] ${msg.isFromHost ? 'order-last' : 'order-first'}`}>
                      {msg.isFromHost && (
                        <img 
                          src={activeConversation.host.image} 
                          alt={activeConversation.host.name}
                          className="w-8 h-8 rounded-full mb-1"
                        />
                      )}
                      <div className={`rounded-2xl p-3 inline-block ${
                        msg.isFromHost 
                          ? 'bg-white border border-gray-200 text-gray-800' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <div className={`flex text-xs mt-1 ${msg.isFromHost ? '' : 'justify-end'}`}>
                        <span className="text-gray-500 mr-1">{formatMessageDate(msg.timestamp)}</span>
                        {!msg.isFromHost && (
                          msg.isRead ? (
                            <CheckCheck size={12} className="text-blue-600" />
                          ) : (
                            <Check size={12} className="text-gray-400" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-3 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <button 
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <Smile size={20} />
                  </button>
                  <button 
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full py-2 px-4 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className={`p-2 rounded-full ${
                      message.trim() 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!message.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No conversation selected</h3>
              <p className="text-gray-500 max-w-sm mb-4">
                Select a conversation from the list to start chatting with your host.
              </p>
              {conversations.length === 0 && !isLoading && (
                <p className="text-sm text-gray-500">
                  You don't have any conversations yet. When you book a stay, you'll be able to message your host.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 