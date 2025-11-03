import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Search, Filter, MessageSquare, Send, Paperclip, 
  File, Download, Clock, ChevronDown, ChevronRight, ArrowRight,
  UserCheck, Calendar, Bell, CheckCircle, AlertCircle, Home, X,
  Plus, PenSquare, ArrowUp, Trash2, FileText, Package,
  Edit3, Check, Copy, FileSignature, Zap
} from 'lucide-react';
import { guestService, communicationService } from '../services/api';
import AutomatedMessagesSettings from '../components/AutomatedMessagesSettings';
import '../styles/CommunicationsPage.css';
import '../styles/AutomatedMessages.css';

export default function CommunicationsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageTemplates, setMessageTemplates] = useState([]);
  const [welcomePacks, setWelcomePacks] = useState([]);
  const [checkInPacks, setCheckInPacks] = useState([]);
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);
  const [showWelcomePacksDropdown, setShowWelcomePacksDropdown] = useState(false);
  const [showCheckInPacksDropdown, setShowCheckInPacksDropdown] = useState(false);
  const [showQuickActionsDropdown, setShowQuickActionsDropdown] = useState(false);
  const [guestFilter, setGuestFilter] = useState('all'); // 'all', 'arriving', 'staying', 'departed'
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showTemplateEditorModal, setShowTemplateEditorModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesListRef = useRef(null);
  const [templateType, setTemplateType] = useState('message'); // 'message', 'welcome', 'checkin'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [documentToSign, setDocumentToSign] = useState(null);
  const [signatureStatus, setSignatureStatus] = useState({});
  const signaturePadRef = useRef(null);
  const [signatureImage, setSignatureImage] = useState(null);
  const [showSignaturePreview, setShowSignaturePreview] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages', 'automations'
  
  useEffect(() => {
    fetchGuests();
    fetchMessageTemplates();
    fetchWelcomePacks();
    fetchCheckInPacks();
  }, []);
  
  useEffect(() => {
    // Check for guest ID in URL query parameters
    const params = new URLSearchParams(location.search);
    const guestId = params.get('guest');
    
    if (guestId && guests.length > 0) {
      const guest = guests.find(g => g.id.toString() === guestId);
      if (guest) {
        setSelectedGuest(guest);
      }
    } else if (guests.length > 0 && !selectedGuest) {
      setSelectedGuest(guests[0]);
    }
  }, [location.search, guests]);
  
  useEffect(() => {
    if (selectedGuest) {
      fetchMessages(selectedGuest.id);
    }
  }, [selectedGuest]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add scroll event listener to the messages list container
  useEffect(() => {
    const messagesContainer = messagesListRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleMessagesScroll);
      return () => {
        messagesContainer.removeEventListener('scroll', handleMessagesScroll);
      };
    }
  }, []);
  
  // Handle scroll in messages container
  const handleMessagesScroll = () => {
    if (!messagesListRef.current) return;
    
    // Show scroll button when scrolled down more than 300px
    if (messagesListRef.current.scrollTop > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Scroll to top of messages
  const scrollToTop = () => {
    messagesListRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const fetchGuests = async () => {
    try {
      setLoading(true);
      const data = await guestService.getAll();
      
      // If no guests found, show option to create sample data
      if (!data || data.length === 0) {
        setGuests([]);
        setLoading(false);
        return;
      }
      
      // Enhance guest data with status
      const enhancedGuests = data.map(guest => {
        // Determine guest status based on dates
        let status = 'departed';
        const today = new Date();
        
        if (guest.upcomingStay) {
          const stayDate = new Date(guest.upcomingStay);
          const daysDiff = Math.floor((stayDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 0) {
            status = 'staying'; // Currently staying
          } else if (daysDiff <= 7) {
            status = 'arriving-soon'; // Arriving within a week
          } else {
            status = 'arriving'; // Arriving later
          }
        } else if (guest.lastStay) {
          const lastStayDate = new Date(guest.lastStay);
          const daysDiff = Math.floor((today - lastStayDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 1) {
            status = 'staying'; // Might still be staying or just left
          }
        }
        
        return {
          ...guest,
          status
        };
      });
      
      setGuests(enhancedGuests);
      if (enhancedGuests.length > 0) {
        setSelectedGuest(enhancedGuests[0]);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMessages = async (guestId) => {
    try {
      setLoading(true);
      const data = await communicationService.getGuestMessages(guestId);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMessageTemplates = async () => {
    try {
      const templates = await communicationService.getMessageTemplates();
      setMessageTemplates(templates);
    } catch (error) {
      console.error('Error fetching message templates:', error);
    }
  };
  
  const fetchWelcomePacks = async () => {
    try {
      const packs = await communicationService.getWelcomePacks();
      setWelcomePacks(packs);
    } catch (error) {
      console.error('Error fetching welcome packs:', error);
    }
  };
  
  const fetchCheckInPacks = async () => {
    try {
      const packs = await communicationService.getCheckInPacks();
      setCheckInPacks(packs);
    } catch (error) {
      console.error('Error fetching check-in packs:', error);
    }
  };
  
  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
  };
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedGuest) return;
    
    try {
      const newMessage = await communicationService.sendMessage(selectedGuest.id, {
        content: messageText,
        type: 'text'
      });
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleUseTemplate = (template) => {
    setMessageText(template.content);
    setShowTemplatesDropdown(false);
  };
  
  const handleSendWelcomePack = async (pack) => {
    try {
      const newMessage = await communicationService.sendMessage(selectedGuest.id, {
        content: `${pack.title}.pdf`,
        type: 'file',
        fileType: 'pdf',
        fileSize: pack.fileSize
      });
      
      setMessages(prev => [...prev, newMessage]);
      setShowWelcomePacksDropdown(false);
    } catch (error) {
      console.error('Error sending welcome pack:', error);
    }
  };
  
  const handleSendCheckInPack = async (pack) => {
    try {
      const newMessage = await communicationService.sendMessage(selectedGuest.id, {
        content: `${pack.title}.pdf`,
        type: 'file',
        fileType: 'pdf',
        fileSize: pack.fileSize
      });
      
      setMessages(prev => [...prev, newMessage]);
      setShowCheckInPacksDropdown(false);
    } catch (error) {
      console.error('Error sending check-in pack:', error);
    }
  };
  
  const handleSendAutoMessage = async (messageType) => {
    try {
      const newMessage = await communicationService.sendAutomatedMessage(selectedGuest.id, messageType);
      setMessages(prev => [...prev, newMessage]);
      setShowQuickActionsDropdown(false);
    } catch (error) {
      console.error('Error sending automated message:', error);
    }
  };
  
  const handleCheckIn = async () => {
    if (!selectedGuest) return;
    
    try {
      const result = await communicationService.processCheckIn(selectedGuest.id, {
        checkInDate: new Date().toISOString(),
        notes: 'Checked in via communications page'
      });
      
      if (result.success) {
        // Update guest status locally
        const updatedGuests = guests.map(g => 
          g.id === selectedGuest.id 
            ? {...g, status: 'staying', lastCheckIn: result.checkInTime} 
            : g
        );
        setGuests(updatedGuests);
        setSelectedGuest({...selectedGuest, status: 'staying', lastCheckIn: result.checkInTime});
        
        // Send confirmation message
        const confirmMessage = await communicationService.sendMessage(selectedGuest.id, {
          content: 'Check-in completed successfully. Welcome!',
          type: 'text'
        });
        
        setMessages(prev => [...prev, confirmMessage]);
        setShowCheckInModal(false);
      }
    } catch (error) {
      console.error('Error processing check-in:', error);
    }
  };
  
  // Filter guests based on status and search term
  const filteredGuests = guests.filter(guest => {
    // Filter by status
    if (guestFilter !== 'all') {
      if (guestFilter === 'arriving' && !['arriving', 'arriving-soon'].includes(guest.status)) {
        return false;
      }
      if (guestFilter === 'staying' && guest.status !== 'staying') {
        return false;
      }
      if (guestFilter === 'departed' && guest.status !== 'departed') {
        return false;
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        guest.name.toLowerCase().includes(searchLower) ||
        guest.email?.toLowerCase().includes(searchLower) ||
        guest.recentProperties?.[0]?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGuestStatusIcon = (status) => {
    switch (status) {
      case 'arriving-soon':
        return <Calendar size={16} className="text-yellow-500" />;
      case 'arriving':
        return <Calendar size={16} className="text-blue-500" />;
      case 'staying':
        return <UserCheck size={16} className="text-green-500" />;
      case 'departed':
        return <Clock size={16} className="text-gray-500" />;
      default:
        return <User size={16} className="text-gray-500" />;
    }
  };

  const getGuestStatusLabel = (status) => {
    switch (status) {
      case 'arriving-soon':
        return 'Arriving soon';
      case 'arriving':
        return 'Future guest';
      case 'staying':
        return 'Currently staying';
      case 'departed':
        return 'Past guest';
      default:
        return 'Unknown';
    }
  };

  // Add sample guests data
  const addSampleGuests = async () => {
    try {
      setLoading(true);
      
      // Fetch real guest data from API
      const guestData = await guestService.getAll();
      setGuests(guestData || []);
      if (guestData && guestData.length > 0) {
        setSelectedGuest(guestData[0]);
      }
      
    } catch (error) {
      console.error('Error adding sample guests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateEditTemplate = (template = null, type = 'message') => {
    setTemplateType(type);
    
    if (type === 'message') {
      setEditingTemplate(template || { 
        id: Date.now(),
        title: '',
        content: ''
      });
    } else if (type === 'welcome') {
      setEditingTemplate(template || {
        id: Date.now(),
        title: '',
        description: '',
        fileSize: '',
        fileType: 'pdf'
      });
    } else if (type === 'checkin') {
      setEditingTemplate(template || {
        id: Date.now(),
        title: '',
        description: '',
        fileSize: '',
        fileType: 'pdf'
      });
    }
    
    setShowTemplateEditorModal(true);
    setUploadedFile(null);
  };
  
  const handleSaveTemplate = async () => {
    if (!editingTemplate || !editingTemplate.title) {
      return;
    }
    
    try {
      // In a real app, you would save the template to your backend
      // For now, we'll just update the local state
      if (templateType === 'message') {
        if (!editingTemplate.content) {
          return;
        }
        
        const isNew = !messageTemplates.some(t => t.id === editingTemplate.id);
        
        if (isNew) {
          setMessageTemplates([...messageTemplates, editingTemplate]);
        } else {
          setMessageTemplates(
            messageTemplates.map(t => 
              t.id === editingTemplate.id ? editingTemplate : t
            )
          );
        }
      } else if (templateType === 'welcome') {
        // Set file size if a file was uploaded
        let template = { ...editingTemplate };
        if (uploadedFile) {
          const fileSizeInMB = (uploadedFile.size / (1024 * 1024)).toFixed(1);
          template.fileSize = `${fileSizeInMB} MB`;
          template.fileType = uploadedFile.type.split('/')[1] || 'pdf';
        }
        
        const isNew = !welcomePacks.some(p => p.id === template.id);
        
        if (isNew) {
          setWelcomePacks([...welcomePacks, template]);
        } else {
          setWelcomePacks(
            welcomePacks.map(p => 
              p.id === template.id ? template : p
            )
          );
        }
      } else if (templateType === 'checkin') {
        // Set file size if a file was uploaded
        let template = { ...editingTemplate };
        if (uploadedFile) {
          const fileSizeInMB = (uploadedFile.size / (1024 * 1024)).toFixed(1);
          template.fileSize = `${fileSizeInMB} MB`;
          template.fileType = uploadedFile.type.split('/')[1] || 'pdf';
        }
        
        const isNew = !checkInPacks.some(p => p.id === template.id);
        
        if (isNew) {
          setCheckInPacks([...checkInPacks, template]);
        } else {
          setCheckInPacks(
            checkInPacks.map(p => 
              p.id === template.id ? template : p
            )
          );
        }
      }
      
      setShowTemplateEditorModal(false);
      setEditingTemplate(null);
      setUploadedFile(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };
  
  const handleDeleteTemplate = (id, type) => {
    if (type === 'message') {
      setMessageTemplates(messageTemplates.filter(t => t.id !== id));
    } else if (type === 'welcome') {
      setWelcomePacks(welcomePacks.filter(p => p.id !== id));
    } else if (type === 'checkin') {
      setCheckInPacks(checkInPacks.filter(p => p.id !== id));
    }
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Update the template with file info
      setEditingTemplate(prev => ({
        ...prev,
        fileType: file.type.split('/')[1] || 'pdf',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
    }
  };
  
  // New functions for signature handling
  const handleRequestSignature = (documentType, documentId, documentTitle) => {
    setDocumentToSign({
      type: documentType,
      id: documentId,
      title: documentTitle
    });
    setShowSignatureModal(true);
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.getContext('2d').clearRect(
        0, 0, signaturePadRef.current.width, signaturePadRef.current.height
      );
    }
    setSignatureImage(null);
  };

  const saveSignature = () => {
    if (signaturePadRef.current) {
      const signatureDataUrl = signaturePadRef.current.toDataURL();
      setSignatureImage(signatureDataUrl);
      setShowSignaturePreview(true);
    }
  };

  const completeSignature = async () => {
    if (!signatureImage || !documentToSign || !selectedGuest) return;
    
    try {
      // In a real app, you'd send the signature to your backend
      // For now, we'll simulate sending a message with the signed document
      
      // Update local signature status
      setSignatureStatus(prev => ({
        ...prev,
        [`${documentToSign.type}-${documentToSign.id}`]: {
          signed: true,
          date: new Date().toISOString()
        }
      }));

      // Send confirmation message
      const newMessage = await communicationService.sendMessage(selectedGuest.id, {
        content: `${documentToSign.title} has been signed.`,
        type: 'text'
      });
      
      // Send "signed" document
      const signedDocument = await communicationService.sendMessage(selectedGuest.id, {
        content: `SIGNED-${documentToSign.title}.pdf`,
        type: 'file',
        fileType: 'pdf',
        fileSize: '2.5 MB',
        signed: true,
        signatureDate: new Date().toISOString()
      });
      
      setMessages(prev => [...prev, newMessage, signedDocument]);
      
      // Close modal and reset state
      setShowSignatureModal(false);
      setDocumentToSign(null);
      setSignatureImage(null);
      setShowSignaturePreview(false);
    } catch (error) {
      console.error('Error processing signature:', error);
    }
  };
  
  // Initialize canvas for signature when modal is opened
  useEffect(() => {
    if (showSignatureModal && signaturePadRef.current) {
      const canvas = signaturePadRef.current;
      const ctx = canvas.getContext('2d');
      let isDrawing = false;
      let lastX = 0;
      let lastY = 0;
      
      // Configure drawing style
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000';
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw signature line
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 30);
      ctx.lineTo(canvas.width - 20, canvas.height - 30);
      ctx.stroke();
      
      // Add "Sign here" text
      ctx.font = '12px Arial';
      ctx.fillStyle = '#999';
      ctx.fillText('Sign above this line', 20, canvas.height - 10);
      
      // Event handlers for drawing
      const startDrawing = (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      };
      
      const draw = (e) => {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
      };
      
      const stopDrawing = () => {
        isDrawing = false;
      };
      
      // Add event listeners
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
      
      // Touch events for mobile
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      });
      
      canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
      });
      
      // Cleanup event listeners
      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
        canvas.removeEventListener('touchstart', (e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          canvas.dispatchEvent(mouseEvent);
        });
        canvas.removeEventListener('touchmove', (e) => {
          e.preventDefault();
          const touch = e.touches[0];
          const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
          });
          canvas.dispatchEvent(mouseEvent);
        });
        canvas.removeEventListener('touchend', (e) => {
          e.preventDefault();
          const mouseEvent = new MouseEvent('mouseup', {});
          canvas.dispatchEvent(mouseEvent);
        });
      };
    }
  }, [showSignatureModal]);

  // Modify message rendering to show signature status for files
  const renderMessage = (message) => {
    if (message.type === 'text') {
      return <div className="message-content">{message.content}</div>;
    } else {
      const isSigned = message.signed || message.content.startsWith('SIGNED-');
      const fileName = message.content;
      
      return (
        <div className="message-file">
          <File size={16} />
          <span className="file-name">{fileName}</span>
          <span className="file-size">{message.fileSize}</span>
          {isSigned ? (
            <span className="signed-badge">
              <CheckCircle size={14} className="signed-icon" />
              Signed
            </span>
          ) : (
            (fileName.includes('Welcome') || fileName.includes('Check-in')) && 
            !fileName.startsWith('SIGNED-') ? (
              <button 
                className="request-signature-button"
                onClick={() => handleRequestSignature(
                  fileName.includes('Welcome') ? 'welcome' : 'checkin',
                  message.id,
                  fileName
                )}
              >
                <FileSignature size={14} />
                Request Signature
              </button>
            ) : null
          )}
          <button 
            className="download-button" 
            title="Download document"
            onClick={() => handleDownloadDocument(fileName)}
          >
            <Download size={16} className="download-icon" />
          </button>
        </div>
      );
    }
  };

  // Add download document handler
  const handleDownloadDocument = (fileName) => {
    // In a real app, this would trigger a file download from your server
    // For this demo, we'll just show an alert
    alert(`Downloading ${fileName}...`);
    
    // In a real implementation, you would do something like:
    // const fileUrl = `${API_URL}/documents/${documentId}`;
    // window.open(fileUrl, '_blank');
  };

  return (
    <div className="communications-page">
      <div className="communications-header">
        <div className="communications-header-text">
          <h1>Communications</h1>
          <p>Manage conversations with your guests and set up automated messages</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="action-button template-editor-button"
            onClick={() => setShowTemplateEditorModal(true)}
          >
            <PenSquare size={16} />
            <span>Manage Templates</span>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('messages')}
            className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
          >
            <MessageSquare size={16} />
            <span>Guest Messages</span>
          </button>
          <button
            onClick={() => setActiveTab('automations')}
            className={`tab ${activeTab === 'automations' ? 'active' : ''}`}
          >
            <Zap size={16} />
            <span>Automated Messages</span>
          </button>
        </div>
      </div>
      
      {activeTab === 'messages' ? (
        <div className="communications-container">
          {/* Guest List Sidebar */}
          <div className="guests-sidebar">
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input 
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="guest-filters">
              <button 
                className={`guest-filter-btn ${guestFilter === 'all' ? 'active' : ''}`}
                onClick={() => setGuestFilter('all')}
              >
                All
              </button>
              <button 
                className={`guest-filter-btn ${guestFilter === 'arriving' ? 'active' : ''}`}
                onClick={() => setGuestFilter('arriving')}
              >
                Arriving
              </button>
              <button 
                className={`guest-filter-btn ${guestFilter === 'staying' ? 'active' : ''}`}
                onClick={() => setGuestFilter('staying')}
              >
                Staying
              </button>
              <button 
                className={`guest-filter-btn ${guestFilter === 'departed' ? 'active' : ''}`}
                onClick={() => setGuestFilter('departed')}
              >
                Departed
              </button>
            </div>
            
            <div className="guests-list">
              {loading && !filteredGuests.length ? (
                <div className="loading-indicator">Loading guests...</div>
              ) : filteredGuests.length === 0 ? (
                <div className="no-guests-message">
                  <p>No guests found</p>
                  <button 
                    className="add-sample-button"
                    onClick={addSampleGuests}
                  >
                    <Plus size={14} />
                    Add Sample Guests
                  </button>
                </div>
              ) : (
                filteredGuests.map(guest => (
                  <div 
                    key={guest.id} 
                    className={`guest-item ${selectedGuest?.id === guest.id ? 'selected' : ''}`}
                    onClick={() => handleSelectGuest(guest)}
                  >
                    <div className="guest-avatar">
                      {getInitials(guest.name)}
                    </div>
                    <div className="guest-info">
                      <div className="guest-name-row">
                        <div className="guest-name">{guest.name}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="messages-area">
            {selectedGuest ? (
              <>
                <div className="messages-header">
                  <div className="selected-guest-info">
                    <div className="guest-avatar">
                      {getInitials(selectedGuest.name)}
                    </div>
                    <div>
                      <div className="guest-header-row">
                        <div className="guest-name">{selectedGuest.name}</div>
                        <div className="guest-status-badge">
                          {getGuestStatusIcon(selectedGuest.status)}
                          <span>{getGuestStatusLabel(selectedGuest.status)}</span>
                        </div>
                      </div>
                      <div className="guest-subinfo">
                        <div className="guest-last-seen">Last stay: {selectedGuest.lastStay || 'N/A'}</div>
                        {selectedGuest.upcomingStay && (
                          <div className="guest-upcoming">
                            <Calendar size={12} className="mr-1" />
                            Upcoming: {new Date(selectedGuest.upcomingStay).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="message-actions">
                    {/* Check-in button - only show for arriving guests */}
                    {['arriving', 'arriving-soon'].includes(selectedGuest.status) && (
                      <button 
                        className="action-button check-in-button"
                        onClick={() => setShowCheckInModal(true)}
                      >
                        <UserCheck size={16} />
                        <span>Check-in</span>
                      </button>
                    )}
                    
                    {/* Quick Actions Dropdown */}
                    <div className="dropdown-container">
                      <button 
                        className="action-button"
                        onClick={() => setShowQuickActionsDropdown(!showQuickActionsDropdown)}
                      >
                        <Bell size={16} />
                        <span>Quick Actions</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      {showQuickActionsDropdown && (
                        <div className="dropdown-menu quick-actions-dropdown">
                          <h4>Send Auto Message</h4>
                          <div 
                            className="dropdown-item"
                            onClick={() => handleSendAutoMessage('welcome')}
                          >
                            <div className="template-info">
                              <div className="template-title">Welcome Message</div>
                            </div>
                            <ArrowRight size={16} />
                          </div>
                          <div 
                            className="dropdown-item"
                            onClick={() => handleSendAutoMessage('pre-arrival')}
                          >
                            <div className="template-info">
                              <div className="template-title">Pre-arrival Information</div>
                            </div>
                            <ArrowRight size={16} />
                          </div>
                          <div 
                            className="dropdown-item"
                            onClick={() => handleSendAutoMessage('check-in')}
                          >
                            <div className="template-info">
                              <div className="template-title">Check-in Instructions</div>
                            </div>
                            <ArrowRight size={16} />
                          </div>
                          <div 
                            className="dropdown-item"
                            onClick={() => handleSendAutoMessage('during-stay')}
                          >
                            <div className="template-info">
                              <div className="template-title">During Stay Message</div>
                            </div>
                            <ArrowRight size={16} />
                          </div>
                          <div 
                            className="dropdown-item"
                            onClick={() => handleSendAutoMessage('check-out')}
                          >
                            <div className="template-info">
                              <div className="template-title">Check-out Reminder</div>
                            </div>
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Welcome Packs Dropdown */}
                    <div className="dropdown-container">
                      <button 
                        className="action-button welcome-pack-button"
                        onClick={() => setShowWelcomePacksDropdown(!showWelcomePacksDropdown)}
                      >
                        <File size={16} />
                        <span>Welcome Packs</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      {showWelcomePacksDropdown && (
                        <div className="dropdown-menu welcome-packs-dropdown">
                          <h4>Select a Welcome Pack</h4>
                          {welcomePacks.map(pack => (
                            <div 
                              key={pack.id} 
                              className="dropdown-item"
                              onClick={() => handleSendWelcomePack(pack)}
                            >
                              <div className="welcome-pack-info">
                                <div className="welcome-pack-title">{pack.title}</div>
                                <div className="welcome-pack-description">{pack.description}</div>
                              </div>
                              <ArrowRight size={16} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Check-in Packs Dropdown */}
                    <div className="dropdown-container">
                      <button 
                        className="action-button check-in-pack-button"
                        onClick={() => setShowCheckInPacksDropdown(!showCheckInPacksDropdown)}
                      >
                        <UserCheck size={16} />
                        <span>Check-in Guides</span>
                        <ChevronDown size={16} />
                      </button>
                      
                      {showCheckInPacksDropdown && (
                        <div className="dropdown-menu check-in-packs-dropdown">
                          <h4>Select a Check-in Guide</h4>
                          {checkInPacks.map(pack => (
                            <div 
                              key={pack.id} 
                              className="dropdown-item"
                              onClick={() => handleSendCheckInPack(pack)}
                            >
                              <div className="welcome-pack-info">
                                <div className="welcome-pack-title">{pack.title}</div>
                                <div className="welcome-pack-description">{pack.description}</div>
                              </div>
                              <ArrowRight size={16} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="messages-container">
                  {loading ? (
                    <div className="loading-indicator">Loading messages...</div>
                  ) : (
                    <>
                      <div className="messages-list" ref={messagesListRef}>
                        {showScrollTop && (
                          <button 
                            className="scroll-to-top-messages-button"
                            onClick={scrollToTop}
                            aria-label="Scroll to top of messages"
                          >
                            <ArrowUp size={16} />
                          </button>
                        )}
                        {messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`message ${message.sender === 'host' ? 'sent' : 'received'} ${message.automated ? 'automated' : ''}`}
                          >
                            {renderMessage(message)}
                            <div className="message-time">
                              {message.automated && <Bell size={12} className="automated-icon" />}
                              {formatTimestamp(message.timestamp)}
                              {message.signed && message.signatureDate && (
                                <span className="signature-date">
                                  • Signed: {formatTimestamp(message.signatureDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                      
                      <div className="message-input-container">
                        <div className="message-input-wrapper">
                          <textarea 
                            className="message-input"
                            placeholder="Type a message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          
                          <div className="message-input-actions">
                            <button className="attach-button">
                              <Paperclip size={16} />
                            </button>
                            
                            <button 
                              className="send-button"
                              onClick={handleSendMessage}
                              disabled={!messageText.trim()}
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="no-guest-selected">
                <MessageSquare size={32} />
                <p>Select a guest to start messaging</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <AutomatedMessagesSettings />
          
          <div className="automation-help-box">
            <h3>About Automated Messages</h3>
            <p>
              Automated messages help you maintain consistent communication with your guests without manual effort.
            </p>
            <ul>
              <li>Set up triggers based on guest booking events (payment, check-in, etc.)</li>
              <li>Choose from text messages, welcome packs, or email templates</li>
              <li>Set optional delays to time your messages appropriately</li>
              <li>Enable/disable automations as needed</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Check-in Modal */}
      {showCheckInModal && selectedGuest && (
        <div className="modal-overlay" onClick={() => setShowCheckInModal(false)}>
          <div className="modal-content check-in-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Check-in {selectedGuest.name}</h3>
              <button className="modal-close-btn" onClick={() => setShowCheckInModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="check-in-guest-info">
                <div className="guest-property-info">
                  <Home size={20} className="mr-2" />
                  <div>
                    <div className="property-name">{selectedGuest.recentProperties?.[0] || 'No property assigned'}</div>
                    {selectedGuest.upcomingStay && (
                      <div className="property-dates">
                        Arrival: {new Date(selectedGuest.upcomingStay).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="check-in-options">
                <div className="check-in-option-group">
                  <label className="check-in-label">Check-in Actions</label>
                  
                  <div className="check-in-option">
                    <CheckCircle size={18} className="text-green-500 mr-2" />
                    <span>Send check-in confirmation</span>
                  </div>
                  
                  <div className="check-in-option">
                    <CheckCircle size={18} className="text-green-500 mr-2" />
                    <span>Send welcome pack</span>
                  </div>
                  
                  <div className="check-in-option">
                    <CheckCircle size={18} className="text-green-500 mr-2" />
                    <span>Record check-in time</span>
                  </div>
                </div>
              </div>
              
              <div className="check-in-notes">
                <label className="check-in-label">Additional Notes</label>
                <textarea 
                  placeholder="Enter any additional notes about the check-in..."
                  className="check-in-notes-input"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => setShowCheckInModal(false)}
              >
                Cancel
              </button>
              <button 
                className="primary-button"
                onClick={handleCheckIn}
              >
                Complete Check-in
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Template Manager Modal */}
      {showTemplateEditorModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateEditorModal(false)}>
          <div className="modal-content template-manager-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Template Manager</h3>
              <button className="modal-close-btn" onClick={() => setShowTemplateEditorModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="template-tabs">
                <button 
                  className={`template-tab ${templateType === 'message' ? 'active' : ''}`}
                  onClick={() => setTemplateType('message')}
                >
                  <MessageSquare size={16} />
                  Message Templates
                </button>
                <button 
                  className={`template-tab ${templateType === 'welcome' ? 'active' : ''}`}
                  onClick={() => setTemplateType('welcome')}
                >
                  <Package size={16} />
                  Welcome Packs
                </button>
                <button 
                  className={`template-tab ${templateType === 'checkin' ? 'active' : ''}`}
                  onClick={() => setTemplateType('checkin')}
                >
                  <UserCheck size={16} />
                  Check-in Guides
                </button>
              </div>
              
              <div className="template-content">
                {templateType === 'message' && (
                  <div className="template-section">
                    <div className="template-list-header">
                      <h4>Message Templates</h4>
                      <button 
                        className="add-template-btn"
                        onClick={() => handleCreateEditTemplate(null, 'message')}
                      >
                        <Plus size={14} />
                        New Template
                      </button>
                    </div>
                    
                    {editingTemplate && templateType === 'message' ? (
                      <div className="template-form">
                        <div className="form-group">
                          <label>Template Name</label>
                          <input 
                            type="text" 
                            value={editingTemplate.title || ''} 
                            onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
                            placeholder="Enter template name..."
                            className="template-title-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Template Content</label>
                          <textarea 
                            value={editingTemplate.content || ''} 
                            onChange={(e) => setEditingTemplate({...editingTemplate, content: e.target.value})}
                            placeholder="Enter message content..."
                            className="template-content-input"
                            rows={8}
                          />
                        </div>
                        
                        <div className="template-preview">
                          <h4>Preview</h4>
                          <div className="preview-box">
                            {editingTemplate.content || 'Enter content to see preview'}
                          </div>
                        </div>
                        
                        <div className="template-actions">
                          <button 
                            className="secondary-button"
                            onClick={() => setEditingTemplate(null)}
                          >
                            Cancel
                          </button>
                          <button 
                            className="primary-button"
                            onClick={handleSaveTemplate}
                            disabled={!editingTemplate.title || !editingTemplate.content}
                          >
                            Save Template
                          </button>
                        </div>
                      </div>
                    ) : templateType === 'message' ? (
                      <div className="template-list-container">
                        <div className="template-list-items">
                          {messageTemplates.length === 0 ? (
                            <div className="no-templates-message">
                              No message templates found. Create your first template!
                            </div>
                          ) : (
                            messageTemplates.map(template => (
                              <div key={template.id} className="template-list-item">
                                <div className="template-item-content" onClick={() => handleCreateEditTemplate(template, 'message')}>
                                  <div className="template-icon">
                                    <MessageSquare size={16} />
                                  </div>
                                  <div className="template-info">
                                    <div className="template-list-title">{template.title}</div>
                                    <div className="template-preview-text">
                                      {template.content.substring(0, 60)}
                                      {template.content.length > 60 ? '...' : ''}
                                    </div>
                                  </div>
                                </div>
                                <div className="template-actions">
                                  <button 
                                    className="edit-button"
                                    onClick={() => handleCreateEditTemplate(template, 'message')}
                                  >
                                    <PenSquare size={14} />
                                  </button>
                                  <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteTemplate(template.id, 'message')}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                
                {templateType === 'welcome' && (
                  <div className="template-section">
                    <div className="template-list-header">
                      <h4>Welcome Packs</h4>
                      <button 
                        className="add-template-btn"
                        onClick={() => handleCreateEditTemplate(null, 'welcome')}
                      >
                        <Plus size={14} />
                        New Welcome Pack
                      </button>
                    </div>
                    
                    {editingTemplate && templateType === 'welcome' ? (
                      <div className="template-form">
                        <div className="form-group">
                          <label>Pack Title</label>
                          <input 
                            type="text" 
                            value={editingTemplate.title || ''} 
                            onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
                            placeholder="Enter welcome pack title..."
                            className="template-title-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Description</label>
                          <textarea 
                            value={editingTemplate.description || ''} 
                            onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                            placeholder="Enter pack description..."
                            className="template-content-input"
                            rows={3}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Upload File (PDF recommended)</label>
                          <div className="file-upload-container">
                            <input 
                              type="file" 
                              id="welcome-pack-file" 
                              accept=".pdf,.doc,.docx" 
                              onChange={handleFileUpload}
                              className="file-input"
                            />
                            <label htmlFor="welcome-pack-file" className="file-upload-label">
                              <FileText size={16} />
                              {uploadedFile ? uploadedFile.name : 'Choose file...'}
                            </label>
                            {uploadedFile && (
                              <div className="file-info">
                                <span>Type: {uploadedFile.type}</span>
                                <span>Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="template-actions">
                          <button 
                            className="secondary-button"
                            onClick={() => setEditingTemplate(null)}
                          >
                            Cancel
                          </button>
                          <button 
                            className="primary-button"
                            onClick={handleSaveTemplate}
                            disabled={!editingTemplate.title}
                          >
                            Save Welcome Pack
                          </button>
                        </div>
                      </div>
                    ) : templateType === 'welcome' ? (
                      <div className="template-list-container">
                        <div className="template-list-items">
                          {welcomePacks.length === 0 ? (
                            <div className="no-templates-message">
                              No welcome packs found. Create your first welcome pack!
                            </div>
                          ) : (
                            welcomePacks.map(pack => (
                              <div key={pack.id} className="template-list-item">
                                <div className="template-item-content" onClick={() => handleCreateEditTemplate(pack, 'welcome')}>
                                  <div className="template-icon">
                                    <Package size={16} />
                                  </div>
                                  <div className="template-info">
                                    <div className="template-list-title">{pack.title}</div>
                                    <div className="template-preview-text">
                                      {pack.description}
                                    </div>
                                    <div className="file-meta">
                                      <FileText size={12} /> 
                                      {pack.fileType.toUpperCase()} • {pack.fileSize}
                                    </div>
                                  </div>
                                </div>
                                <div className="template-actions">
                                  <button 
                                    className="edit-button"
                                    onClick={() => handleCreateEditTemplate(pack, 'welcome')}
                                  >
                                    <PenSquare size={14} />
                                  </button>
                                  <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteTemplate(pack.id, 'welcome')}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                
                {templateType === 'checkin' && (
                  <div className="template-section">
                    <div className="template-list-header">
                      <h4>Check-in Guides</h4>
                      <button 
                        className="add-template-btn"
                        onClick={() => handleCreateEditTemplate(null, 'checkin')}
                      >
                        <Plus size={14} />
                        New Check-in Guide
                      </button>
                    </div>
                    
                    {editingTemplate && templateType === 'checkin' ? (
                      <div className="template-form">
                        <div className="form-group">
                          <label>Guide Title</label>
                          <input 
                            type="text" 
                            value={editingTemplate.title || ''} 
                            onChange={(e) => setEditingTemplate({...editingTemplate, title: e.target.value})}
                            placeholder="Enter check-in guide title..."
                            className="template-title-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Description</label>
                          <textarea 
                            value={editingTemplate.description || ''} 
                            onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                            placeholder="Enter guide description..."
                            className="template-content-input"
                            rows={3}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>Upload File (PDF recommended)</label>
                          <div className="file-upload-container">
                            <input 
                              type="file" 
                              id="checkin-guide-file" 
                              accept=".pdf,.doc,.docx" 
                              onChange={handleFileUpload}
                              className="file-input"
                            />
                            <label htmlFor="checkin-guide-file" className="file-upload-label">
                              <FileText size={16} />
                              {uploadedFile ? uploadedFile.name : 'Choose file...'}
                            </label>
                            {uploadedFile && (
                              <div className="file-info">
                                <span>Type: {uploadedFile.type}</span>
                                <span>Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="template-actions">
                          <button 
                            className="secondary-button"
                            onClick={() => setEditingTemplate(null)}
                          >
                            Cancel
                          </button>
                          <button 
                            className="primary-button"
                            onClick={handleSaveTemplate}
                            disabled={!editingTemplate.title}
                          >
                            Save Check-in Guide
                          </button>
                        </div>
                      </div>
                    ) : templateType === 'checkin' ? (
                      <div className="template-list-container">
                        <div className="template-list-items">
                          {checkInPacks.length === 0 ? (
                            <div className="no-templates-message">
                              No check-in guides found. Create your first check-in guide!
                            </div>
                          ) : (
                            checkInPacks.map(guide => (
                              <div key={guide.id} className="template-list-item">
                                <div className="template-item-content" onClick={() => handleCreateEditTemplate(guide, 'checkin')}>
                                  <div className="template-icon">
                                    <UserCheck size={16} />
                                  </div>
                                  <div className="template-info">
                                    <div className="template-list-title">{guide.title}</div>
                                    <div className="template-preview-text">
                                      {guide.description}
                                    </div>
                                    <div className="file-meta">
                                      <FileText size={12} /> 
                                      {guide.fileType.toUpperCase()} • {guide.fileSize}
                                    </div>
                                  </div>
                                </div>
                                <div className="template-actions">
                                  <button 
                                    className="edit-button"
                                    onClick={() => handleCreateEditTemplate(guide, 'checkin')}
                                  >
                                    <PenSquare size={14} />
                                  </button>
                                  <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteTemplate(guide.id, 'checkin')}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* E-Signature Modal */}
      {showSignatureModal && documentToSign && (
        <div className="modal-overlay" onClick={() => setShowSignatureModal(false)}>
          <div className="modal-content signature-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{showSignaturePreview ? 'Confirm Signature' : 'Sign Document'}</h3>
              <button className="modal-close-btn" onClick={() => setShowSignatureModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="document-to-sign-info">
                <FileText size={20} className="mr-2" />
                <div>
                  <div className="document-title">{documentToSign.title}</div>
                  <div className="document-type">
                    {documentToSign.type === 'welcome' ? 'Welcome Pack' : 'Check-in Guide'}
                  </div>
                </div>
              </div>
              
              {!showSignaturePreview ? (
                <>
                  <div className="signature-instructions">
                    <p>Please sign in the area below to acknowledge receipt and agreement with this document.</p>
                  </div>
                  
                  <div className="signature-pad-container">
                    <canvas 
                      ref={signaturePadRef}
                      width={550}
                      height={200}
                      className="signature-pad"
                    ></canvas>
                  </div>
                  
                  <div className="signature-actions">
                    <button 
                      className="secondary-button"
                      onClick={clearSignature}
                    >
                      <X size={16} className="mr-1" />
                      Clear
                    </button>
                    <button 
                      className="primary-button"
                      onClick={saveSignature}
                    >
                      <Check size={16} className="mr-1" />
                      Save Signature
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="signature-preview-container">
                    <h4>Your Signature</h4>
                    <div className="signature-preview">
                      <img 
                        src={signatureImage} 
                        alt="Your signature" 
                        className="signature-image" 
                      />
                    </div>
                    <p className="signature-confirmation-text">
                      By confirming, I acknowledge that I have read and agree to the terms outlined in this document.
                    </p>
                  </div>
                  
                  <div className="signature-actions">
                    <button 
                      className="secondary-button"
                      onClick={() => setShowSignaturePreview(false)}
                    >
                      <Edit3 size={16} className="mr-1" />
                      Edit Signature
                    </button>
                    <button 
                      className="primary-button confirm-button"
                      onClick={completeSignature}
                    >
                      <Check size={16} className="mr-1" />
                      Confirm & Sign
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 