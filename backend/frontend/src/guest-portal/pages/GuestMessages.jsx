import { useState, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function GuestMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when guest portal backend is ready
        // const response = await api.get('/guest/messages');
        // setMessages(response.data || []);
        
        // For now, show empty state
        setMessages([]);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // TODO: API call to send message
      // await api.post('/guest/messages', { content: newMessage, conversationId: selectedConversation.id });
      setNewMessage('');
      // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your hosts</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No messages yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Book a property to start chatting with your host!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="col-span-1 bg-white rounded-lg shadow-sm overflow-y-auto">
            {messages.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">{conversation.hostName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{conversation.hostName}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.propertyName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Messages Area */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{selectedConversation.hostName}</h3>
                  <p className="text-sm text-gray-500">{selectedConversation.propertyName}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'guest' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'guest'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'guest' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
