import { useState, useEffect } from 'react';
import { Clock, Trash2, PlusCircle, Edit2, Save, X, AlertCircle, Calendar, MessageCircle, Package, Mail, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { communicationService } from '../services/api';
import '../styles/AutomatedMessages.css';
import '../styles/CommunicationsPage.css';

export default function AutomatedMessagesSettings() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageTemplates, setMessageTemplates] = useState([]);
  const [welcomePacks, setWelcomePacks] = useState([]);
  const [editingAutomation, setEditingAutomation] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trigger: 'payment_confirmed',
    enabled: true,
    messageType: 'text',
    templateId: '',
    delay: 0,
    delayUnit: 'hours',
    delayPosition: 'after',
    description: ''
  });
  
  // List of available triggers
  const availableTriggers = [
    { id: 'payment_confirmed', name: 'Payment Confirmed', icon: <Mail size={16} /> },
    { id: 'booking_confirmed', name: 'Booking Confirmed', icon: <Calendar size={16} /> },
    { id: 'seven_days_before_arrival', name: '7 Days Before Arrival', icon: <Calendar size={16} /> },
    { id: 'one_day_before_arrival', name: '1 Day Before Arrival', icon: <Calendar size={16} /> },
    { id: 'day_of_arrival', name: 'Day of Arrival', icon: <Calendar size={16} /> },
    { id: 'check_in_completed', name: 'Check-in Completed', icon: <MessageCircle size={16} /> },
    { id: 'mid_stay', name: 'Mid-stay Check-in', icon: <MessageCircle size={16} /> },
    { id: 'one_day_before_departure', name: '1 Day Before Departure', icon: <Calendar size={16} /> },
    { id: 'check_out_completed', name: 'Check-out Completed', icon: <MessageCircle size={16} /> },
    { id: 'review_request', name: 'Review Request (Post-stay)', icon: <MessageCircle size={16} /> }
  ];
  
  // Message type options
  const messageTypes = [
    { id: 'text', name: 'Text Message', icon: <MessageCircle size={16} /> },
    { id: 'welcome_pack', name: 'Welcome Pack', icon: <Package size={16} /> },
    { id: 'email', name: 'Email', icon: <Mail size={16} /> }
  ];
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [automationsData, templatesData, packsData] = await Promise.all([
        communicationService.getMessageAutomations(),
        communicationService.getMessageTemplates(),
        communicationService.getWelcomePacks()
      ]);
      
      setAutomations(automationsData);
      setMessageTemplates(templatesData);
      setWelcomePacks(packsData);
    } catch (error) {
      console.error('Error loading automation data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleAutomation = async (id, currentState) => {
    try {
      const automation = automations.find(a => a.id === id);
      if (!automation) return;
      
      const updatedAutomation = {
        ...automation,
        enabled: !currentState
      };
      
      await communicationService.saveMessageAutomation(updatedAutomation);
      
      // Update local state
      setAutomations(automations.map(a => 
        a.id === id ? {...a, enabled: !currentState} : a
      ));
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };
  
  const handleEditAutomation = (automation) => {
    setFormData({
      id: automation.id,
      name: automation.name,
      trigger: automation.trigger,
      enabled: automation.enabled,
      messageType: automation.messageType,
      templateId: automation.templateId,
      delay: automation.delay,
      delayUnit: automation.delayUnit || 'hours',
      delayPosition: automation.delayPosition || 'after',
      description: automation.description
    });
    setEditingAutomation(automation.id);
    setShowAddForm(true);
  };
  
  const handleDeleteAutomation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this automation?')) return;
    
    try {
      await communicationService.deleteMessageAutomation(id);
      setAutomations(automations.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting automation:', error);
    }
  };
  
  const handleAddNewAutomation = () => {
    setFormData({
      name: '',
      trigger: 'payment_confirmed',
      enabled: true,
      messageType: 'text',
      templateId: '',
      delay: 0,
      delayUnit: 'hours',
      delayPosition: 'after',
      description: ''
    });
    setEditingAutomation(null);
    setShowAddForm(true);
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'trigger') {
      // When trigger changes, we don't need to automatically change the other fields
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Function to get appropriate default delay type based on trigger
  const getDefaultDelayTypeForTrigger = (triggerId) => {
    // Map triggers to their most logical delay types
    const triggerToDelayMap = {
      'payment_confirmed': 'hours', // Hours after payment
      'booking_confirmed': 'hours', // Hours after booking
      'seven_days_before_arrival': 'before_checkin', // Already relative to check-in
      'one_day_before_arrival': 'before_checkin', // Already relative to check-in
      'day_of_arrival': 'before_checkin', // Hours before check-in makes sense
      'check_in_completed': 'after_checkin', // Hours after check-in
      'mid_stay': 'after_checkin', // Hours/days after check-in
      'one_day_before_departure': 'before_checkout', // Already relative to checkout
      'check_out_completed': 'after_checkout', // Hours after checkout
      'review_request': 'after_checkout' // Hours after checkout
    };
    
    return triggerToDelayMap[triggerId] || 'hours';
  };
  
  // Get delay type options from the trigger events
  const getDelayTypeOptions = () => {
    // Instead of showing different delay types, we'll show the trigger events as options
    // This will make it show the same dropdown items as the trigger dropdown
    return availableTriggers.map(trigger => ({
      value: trigger.id,
      label: trigger.name
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await communicationService.saveMessageAutomation(formData);
      
      if (editingAutomation) {
        // Update existing automation
        setAutomations(automations.map(a => 
          a.id === editingAutomation ? result : a
        ));
      } else {
        // Add new automation
        setAutomations([...automations, result]);
      }
      
      // Reset form
      setShowAddForm(false);
      setEditingAutomation(null);
    } catch (error) {
      console.error('Error saving automation:', error);
    }
  };
  
  const getTemplateOptions = () => {
    if (formData.messageType === 'welcome_pack') {
      return welcomePacks.map(pack => (
        <option key={pack.id} value={pack.id}>{pack.title}</option>
      ));
    } else {
      return messageTemplates.map(template => (
        <option key={template.id} value={template.id}>{template.title}</option>
      ));
    }
  };
  
  const getTriggerName = (triggerId) => {
    const trigger = availableTriggers.find(t => t.id === triggerId);
    return trigger ? trigger.name : 'Unknown Trigger';
  };
  
  const getTemplateName = (templateId, type) => {
    if (type === 'welcome_pack') {
      const pack = welcomePacks.find(p => p.id === templateId);
      return pack ? pack.title : 'Unknown Template';
    } else {
      const template = messageTemplates.find(t => t.id === templateId);
      return template ? template.title : 'Unknown Template';
    }
  };
  
  // Helper function to format delay for display
  const formatDelayText = (automation) => {
    if (automation.delay === 0) return 'Immediate';
    
    return `${automation.delay} ${automation.delayUnit} ${automation.delayPosition} ${getTriggerName(automation.trigger)}`;
  };
  
  if (loading) {
    return <div className="loading-indicator">Loading automations...</div>;
  }
  
  return (
    <div className="automation-container">
      <div className="automation-header">
        <h3>Automated Message Triggers</h3>
        <button
          onClick={handleAddNewAutomation}
          className="action-button"
        >
          <PlusCircle size={16} />
          <span>Add Trigger</span>
        </button>
      </div>
      
      {showAddForm && (
        <div className="automation-form">
          <div className="automation-form-header">
            <h4>{editingAutomation ? 'Edit Automation' : 'Create New Automation'}</h4>
            <button 
              onClick={() => {
                setShowAddForm(false);
                setEditingAutomation(null);
              }}
              className="close-button"
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Automation Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="form-input"
                  placeholder="e.g., Welcome Message After Payment"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Trigger Event</label>
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  {availableTriggers.map(trigger => (
                    <option key={trigger.id} value={trigger.id}>{trigger.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Message Type</label>
                <select
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  {messageTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Template</label>
                <select
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleFormChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a template</option>
                  {getTemplateOptions()}
                </select>
              </div>
              
              <div className="form-group">
                <label>Delay Timing</label>
                <div className="delay-input-group delay-input-triple">
                  <input
                    type="number"
                    name="delay"
                    value={formData.delay}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    className="form-input delay-amount"
                    placeholder="0"
                  />
                  <select
                    name="delayUnit"
                    value={formData.delayUnit}
                    onChange={handleFormChange}
                    className="form-select delay-unit"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                  <select
                    name="delayPosition"
                    value={formData.delayPosition}
                    onChange={handleFormChange}
                    className="form-select delay-position"
                  >
                    <option value="before">Before</option>
                    <option value="after">After</option>
                  </select>
                </div>
                <span className="form-hint">Set 0 for immediate delivery when triggered</span>
              </div>
              
              <div className="form-group enabled-checkbox-container">
                <label>Status</label>
                <div className="enabled-toggle">
                  <input
                    type="checkbox"
                    id="enabled-toggle"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleFormChange}
                    className="checkbox"
                  />
                  <label htmlFor="enabled-toggle" className="toggle-label">
                    {formData.enabled ? 'Enabled' : 'Disabled'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="2"
                className="form-textarea"
                placeholder="Brief description of this automation"
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAutomation(null);
                }}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
              >
                {editingAutomation ? 'Update' : 'Create'} Automation
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="automation-list">
        {automations.length === 0 && !showAddForm ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Zap size={32} />
            </div>
            <h3 className="empty-state-title">No automations yet</h3>
            <p className="empty-state-text">Set up automated messages to send to guests when specific events occur.</p>
            <button
              onClick={handleAddNewAutomation}
              className="primary-button"
            >
              <PlusCircle size={16} />
              Create Your First Automation
            </button>
          </div>
        ) : (
          <div className="automation-table-container">
            <table className="automation-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Trigger</th>
                  <th>Message Type</th>
                  <th>Template</th>
                  <th>Delay</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {automations.map(automation => (
                  <tr key={automation.id}>
                    <td>
                      <div className="toggle-container">
                        {automation.enabled 
                          ? <ToggleRight 
                              size={16} 
                              className="toggle on" 
                              onClick={() => handleToggleAutomation(automation.id, automation.enabled)}
                            />
                          : <ToggleLeft 
                              size={16} 
                              className="toggle off" 
                              onClick={() => handleToggleAutomation(automation.id, automation.enabled)}
                            />
                        }
                      </div>
                    </td>
                    <td>
                      <div className="automation-name">{automation.name}</div>
                      {automation.description && (
                        <div className="automation-description">{automation.description}</div>
                      )}
                    </td>
                    <td>
                      <div className="trigger-name">{getTriggerName(automation.trigger)}</div>
                    </td>
                    <td>
                      <span className="message-type-badge">
                        {automation.messageType === 'text' ? 'Text Message' : 
                         automation.messageType === 'welcome_pack' ? 'Welcome Pack' : 'Email'}
                      </span>
                    </td>
                    <td>
                      <div className="template-name">
                        {getTemplateName(automation.templateId, automation.messageType)}
                      </div>
                    </td>
                    <td>
                      <div className="delay-info">
                        <Clock size={14} className="delay-icon" />
                        {formatDelayText(automation)}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditAutomation(automation)}
                          className="edit-button"
                          aria-label="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAutomation(automation.id)}
                          className="delete-button"
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 