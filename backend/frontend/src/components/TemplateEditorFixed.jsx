import React, { useState, useEffect } from 'react';
import { 
  PenLine, 
  Trash2, 
  Plus, 
  XCircle, 
  Save,
  MessageSquare,
  MailOpen
} from 'lucide-react';
import { communicationService } from '../api/communicationService';
import '../styles/TemplateEditor.css';

const TemplateEditor = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'sms'
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communicationService.getMessageTemplates();
      setTemplates(response.data);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (editingTemplate) {
        await communicationService.updateMessageTemplate(editingTemplate.id, templateForm);
      } else {
        await communicationService.createMessageTemplate(templateForm);
      }
      
      resetForm();
      await loadTemplates();
    } catch (err) {
      console.error('Failed to save template:', err);
      setError('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject || '',
      content: template.content,
      type: template.type
    });
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    
    try {
      setLoading(true);
      setError(null);
      await communicationService.deleteMessageTemplate(id);
      await loadTemplates();
    } catch (err) {
      console.error('Failed to delete template:', err);
      setError('Failed to delete template');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      subject: '',
      content: '',
      type: 'sms'
    });
  };

  const cancelEdit = () => {
    resetForm();
  };

  if (!isOpen) return null;

  // Define placeholder text based on template type
  let placeholderText;
  if (templateForm.type === 'sms') {
    placeholderText = "e.g., Hi {{guest.firstName}}, welcome to your stay!";
  } else {
    placeholderText = "e.g., Dear {{guest.firstName}}, Welcome to your stay at {{property.name}}! Best regards, The ShortStories Team";
  }

  return (
    <div className="template-editor-backdrop">
      <div className="template-editor-modal">
        <div className="template-editor-header">
          <h2>Message Templates</h2>
          <button onClick={onClose} className="close-button">
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="template-editor-content">
          <div className="template-list">
            <h3>Your Templates</h3>
            {loading && <div className="loading-indicator">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
            
            {templates.length === 0 && !loading ? (
              <div className="empty-templates">
                <p>No templates yet. Create your first template to get started.</p>
              </div>
            ) : (
              <ul className="template-items">
                {templates.map(template => (
                  <li key={template.id} className="template-item">
                    <div className="template-item-header">
                      <div className="template-type-icon">
                        {template.type === 'email' ? <MailOpen size={16} /> : <MessageSquare size={16} />}
                      </div>
                      <div className="template-name">{template.name}</div>
                      <div className="template-type-badge">{template.type.toUpperCase()}</div>
                    </div>
                    <div className="template-preview">
                      {template.type === 'email' ? (
                        <>
                          <div className="template-subject">Subject: {template.subject}</div>
                          <div className="template-content">{template.content.substring(0, 80)}...</div>
                        </>
                      ) : (
                        <div className="template-content">{template.content.substring(0, 100)}...</div>
                      )}
                    </div>
                    <div className="template-actions">
                      <button 
                        onClick={() => handleEditTemplate(template)} 
                        className="edit-button"
                      >
                        <PenLine size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(template.id)} 
                        className="delete-button"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            {!editingTemplate && (
              <button 
                onClick={() => setEditingTemplate({})} 
                className="add-template-button"
              >
                <Plus size={16} /> Create New Template
              </button>
            )}
          </div>
          
          {editingTemplate && (
            <div className="template-form">
              <h3>{editingTemplate.id ? 'Edit Template' : 'Create Template'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Template Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={templateForm.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Welcome Message"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Message Type</label>
                  <select
                    id="type"
                    name="type"
                    value={templateForm.type}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                
                {templateForm.type === 'email' && (
                  <div className="form-group">
                    <label htmlFor="subject">Email Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={templateForm.subject}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., Welcome to ShortStories"
                      required
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="content">Message Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={templateForm.content}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder={placeholderText}
                    required
                  />
                  <small className="form-hint">
                    You can use placeholders like {{guest.firstName}}, {{property.name}}, etc.
                  </small>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="primary-button"
                    disabled={loading}
                  >
                    <Save size={16} /> {editingTemplate.id ? 'Update Template' : 'Save Template'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor; 