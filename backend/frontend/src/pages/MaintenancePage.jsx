import React, { useState, useEffect } from 'react';
import { maintenanceService, propertyService, teamService, guestService } from '../services/api';
import { 
  Wrench, Search, Edit, Trash, 
  Home, Calendar, AlertCircle, 
  CheckCircle, PlusCircle, FileText, 
  Upload, X, Clock, DollarSign,
  Tag, User, Users
} from 'lucide-react';
import '../styles/MaintenancePage.css';

const MaintenancePage = () => {
  // State for maintenance logs
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('all'); // 'all', 'detail'
  const [selectedLog, setSelectedLog] = useState(null);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  
  // State for properties, team members, and categories
  const [properties, setProperties] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [guests, setGuests] = useState([]);
  const [noteText, setNoteText] = useState('');
  
  // Fetch maintenance logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch maintenance logs with filters
        const filters = {
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          propertyId: propertyFilter,
        };
        
        const logs = await maintenanceService.getAllLogs(filters);
        setMaintenanceLogs(logs);
        
        // Fetch properties, team members, and categories if not already loaded
        if (properties.length === 0) {
          const propertiesData = await propertyService.getAll();
          setProperties(propertiesData);
        }
        
        if (teamMembers.length === 0) {
          const teamData = await teamService.getAllMembers();
          setTeamMembers(teamData);
        }
        
        if (categories.length === 0) {
          const categoriesData = await maintenanceService.getCategories();
          setCategories(categoriesData);
        }
        
        if (guests.length === 0) {
          const guestsData = await guestService.getAll();
          setGuests(guestsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, priorityFilter, categoryFilter, propertyFilter]);
  
  // Filter logs based on search term
  const filteredLogs = maintenanceLogs.filter(log => {
    return searchTerm === '' || 
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.reportedByName && log.reportedByName.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // Handle view a single log
  const handleViewLog = async (log) => {
    try {
      setLoading(true);
      const logDetails = await maintenanceService.getLogById(log.id);
      setSelectedLog(logDetails);
      setActiveView('detail');
    } catch (error) {
      console.error('Error fetching log details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a new log
  const handleAddLog = () => {
    setEditingLog(null);
    setShowAddLogModal(true);
  };
  
  // Handle editing a log
  const handleEditLog = (log) => {
    setEditingLog(log);
    setShowAddLogModal(true);
  };
  
  // Handle deleting a log
  const handleDeleteLog = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance log?')) {
      try {
        await maintenanceService.deleteLog(id);
        setMaintenanceLogs(maintenanceLogs.filter(log => log.id !== id));
        if (selectedLog && selectedLog.id === id) {
          setSelectedLog(null);
          setActiveView('all');
        }
      } catch (error) {
        console.error('Error deleting maintenance log:', error);
      }
    }
  };
  
  // Handle log form submission
  const handleLogSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (editingLog) {
        // Update existing log
        const updatedLog = await maintenanceService.updateLog(editingLog.id, formData);
        setMaintenanceLogs(maintenanceLogs.map(log => 
          log.id === editingLog.id ? updatedLog : log
        ));
        
        if (selectedLog && selectedLog.id === editingLog.id) {
          setSelectedLog(updatedLog);
        }
      } else {
        // Create new log
        const newLog = await maintenanceService.createLog(formData);
        setMaintenanceLogs([...maintenanceLogs, newLog]);
      }
      
      setShowAddLogModal(false);
      setEditingLog(null);
    } catch (error) {
      console.error('Error saving maintenance log:', error);
      alert('There was an error saving the maintenance log. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle adding a note to a log
  const handleAddNote = async (logId, noteText) => {
    try {
      const noteData = {
        text: noteText,
        addedBy: 'Current User' // In a real app, this would come from authentication
      };
      
      const newNote = await maintenanceService.addNote(logId, noteData);
      
      // Update the selected log with the new note
      if (selectedLog && selectedLog.id === logId) {
        setSelectedLog({
          ...selectedLog,
          notes: [...selectedLog.notes, newNote]
        });
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="maintenance-page">
      <div className="maintenance-page-header">
        <div>
          <h1>Maintenance Log</h1>
          <p>Track and manage maintenance issues across your properties</p>
        </div>
        <div className="maintenance-tabs">
          <button 
            className={`maintenance-tab ${activeView === 'all' ? 'active' : ''}`}
            onClick={() => setActiveView('all')}
          >
            <Wrench size={18} />
            All Maintenance
          </button>
          {activeView === 'detail' && selectedLog && (
            <button 
              className="maintenance-tab active"
              onClick={() => setActiveView('detail')}
            >
              <FileText size={18} />
              Issue Details
            </button>
          )}
        </div>
      </div>

      {activeView === 'all' ? (
        <div className="maintenance-logs-section">
          <div className="section-header">
            <div className="search-and-filters">
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input 
                  type="text"
                  placeholder="Search maintenance logs..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters-container">
                <div className="filter-group">
                  <label>Status:</label>
                  <select 
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Priority:</label>
                  <select 
                    className="filter-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Property:</label>
                  <select 
                    className="filter-select"
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                  >
                    <option value="">All Properties</option>
                    {properties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Category:</label>
                  <select 
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button className="add-button" onClick={handleAddLog}>
              <PlusCircle size={18} />
              Add Maintenance Issue
            </button>
          </div>

          {loading ? (
            <div className="loading-message">Loading maintenance logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="empty-message">No maintenance logs found.</div>
          ) : (
            <div className="maintenance-logs-grid">
              {filteredLogs.map(log => (
                <div key={log.id} className="log-card" onClick={() => handleViewLog(log)}>
                  <div className="log-header">
                    <div className="log-title-row">
                      <h3 className="log-title">{log.title}</h3>
                      <div className="log-actions" onClick={e => e.stopPropagation()}>
                        <button 
                          className="edit-button edit-log-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLog(log);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="delete-button delete-log-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLog(log.id);
                          }}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="log-meta">
                      <span className={`log-status-badge ${log.status}`}>
                        {log.status === 'completed' ? (
                          <>
                            <CheckCircle size={14} />
                            Completed
                          </>
                        ) : log.status === 'in_progress' ? (
                          <>
                            <Clock size={14} />
                            In Progress
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} />
                            Pending
                          </>
                        )}
                      </span>
                      <span className={`log-priority-badge ${log.priority}`}>
                        {log.priority}
                      </span>
                      <span className="log-category-badge">
                        <Tag size={14} />
                        {log.category}
                      </span>
                      <span className={`log-reporter-badge ${log.reportedBy}`}>
                        {log.reportedBy === 'guest' ? (
                          <>
                            <User size={14} />
                            Guest
                          </>
                        ) : log.reportedBy === 'staff' ? (
                          <>
                            <Users size={14} />
                            Staff
                          </>
                        ) : (
                          <>
                            <Home size={14} />
                            Owner
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="log-body">
                    <p className="log-description">
                      {log.description.length > 100 
                        ? `${log.description.substring(0, 100)}...` 
                        : log.description
                      }
                    </p>
                    <div className="log-details">
                      <div className="log-property">
                        <Home size={16} />
                        {log.propertyName}
                      </div>
                      <div className="log-dates">
                        <Calendar size={16} />
                        Reported: {log.reportedDate}
                        {log.scheduledDate && ` | Scheduled: ${log.scheduledDate}`}
                      </div>
                      {(log.estimatedCost || log.actualCost) && (
                        <div className="log-costs">
                          {log.actualCost 
                            ? `Cost: ₦${log.actualCost.toLocaleString()}` 
                            : `Est. Cost: ₦${log.estimatedCost.toLocaleString()}`
                          }
                        </div>
                      )}
                      {log.assignedTo && (
                        <div className="log-assignment">
                          <div>Assigned to:</div>
                          <div className="assigned-member">
                            <span>{log.assignedToName || 'Unassigned'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {log.attachments && log.attachments.length > 0 && (
                    <div className="log-footer">
                      <div>Attachments: {log.attachments.length}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="maintenance-detail-section">
          {loading ? (
            <div className="loading-message">Loading maintenance details...</div>
          ) : !selectedLog ? (
            <div className="empty-message">No maintenance log selected.</div>
          ) : (
            <div className="maintenance-detail">
              <div className="detail-header">
                <div className="detail-title">{selectedLog.title}</div>
                <div className="detail-meta">
                  <span className={`log-status-badge ${selectedLog.status}`}>
                    {selectedLog.status === 'completed' ? (
                      <>
                        <CheckCircle size={14} />
                        Completed
                      </>
                    ) : selectedLog.status === 'in_progress' ? (
                      <>
                        <Clock size={14} />
                        In Progress
                      </>
                    ) : (
                      <>
                        <AlertCircle size={14} />
                        Pending
                      </>
                    )}
                  </span>
                  <span className={`log-priority-badge ${selectedLog.priority}`}>
                    {selectedLog.priority}
                  </span>
                  <span className="log-category-badge">
                    <Tag size={14} />
                    {selectedLog.category}
                  </span>
                  <span className={`log-reporter-badge ${selectedLog.reportedBy}`}>
                    {selectedLog.reportedBy === 'guest' ? (
                      <>
                        <User size={14} />
                        Reported by Guest: {selectedLog.reportedByName}
                      </>
                    ) : selectedLog.reportedBy === 'staff' ? (
                      <>
                        <Users size={14} />
                        Reported by Staff: {selectedLog.reportedByName}
                      </>
                    ) : (
                      <>
                        <Home size={14} />
                        Reported by Owner
                      </>
                    )}
                  </span>
                </div>
                <div className="detail-info">
                  <div className="detail-info-item">
                    <div className="detail-info-label">Property</div>
                    <div className="detail-info-value">{selectedLog.propertyName}</div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Date Reported</div>
                    <div className="detail-info-value">{selectedLog.reportedDate}</div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Assigned To</div>
                    <div className="detail-info-value">
                      {selectedLog.assignedToName || 'Not assigned'}
                    </div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Scheduled Date</div>
                    <div className="detail-info-value">
                      {selectedLog.scheduledDate || 'Not scheduled'}
                    </div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Completed Date</div>
                    <div className="detail-info-value">
                      {selectedLog.completedDate || 'Not completed'}
                    </div>
                  </div>
                  <div className="detail-info-item">
                    <div className="detail-info-label">Cost</div>
                    <div className="detail-info-value">
                      {selectedLog.actualCost 
                        ? `₦${selectedLog.actualCost.toLocaleString()}` 
                        : selectedLog.estimatedCost 
                          ? `Estimated: ₦${selectedLog.estimatedCost.toLocaleString()}`
                          : 'Not specified'
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-body">
                <div className="detail-section">
                  <h3 className="detail-section-title">Description</h3>
                  <p className="detail-description">{selectedLog.description}</p>
                </div>
                
                {selectedLog.attachments && selectedLog.attachments.length > 0 && (
                  <div className="detail-section">
                    <h3 className="detail-section-title">Attachments</h3>
                    <div className="attachments-list">
                      {selectedLog.attachments.map(attachment => (
                        <div key={attachment.id} className="attachment-item">
                          <FileText size={16} />
                          <span>{attachment.name}</span>
                          <span className="attachment-size">({attachment.size})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="detail-section">
                  <h3 className="detail-section-title">Notes & Activity</h3>
                  <div className="notes-list">
                    {selectedLog.notes && selectedLog.notes.length > 0 ? (
                      selectedLog.notes.map(note => (
                        <div key={note.id} className="note-item">
                          <div className="note-header">
                            <span className="note-author">{note.addedBy}</span>
                            <span className="note-date">{note.date}</span>
                          </div>
                          <div className="note-text">{note.text}</div>
                        </div>
                      ))
                    ) : (
                      <div className="note-item">
                        <div className="note-text">No notes or activity yet.</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="add-note-form">
                    <textarea 
                      className="add-note-input" 
                      placeholder="Add a note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    ></textarea>
                    <button 
                      className="add-note-button"
                      onClick={() => {
                        if (noteText.trim()) {
                          handleAddNote(selectedLog.id, noteText);
                          setNoteText('');
                        }
                      }}
                    >
                      <PlusCircle size={18} />
                      Add Note
                    </button>
                  </div>
                </div>
                
                <div className="detail-actions">
                  <button className="cancel-button" onClick={() => setActiveView('all')}>
                    Back to All Maintenance
                  </button>
                  <div className="action-buttons">
                    <button 
                      className="edit-issue-button"
                      onClick={() => handleEditLog(selectedLog)}
                    >
                      Edit Issue
                    </button>
                    <button 
                      className="delete-issue-button"
                      onClick={() => handleDeleteLog(selectedLog.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Maintenance Log Form Modal */}
      {showAddLogModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingLog ? 'Edit Maintenance Issue' : 'Add Maintenance Issue'}</h2>
              <button className="close-button" onClick={() => setShowAddLogModal(false)}>
                <X size={18} />
              </button>
            </div>
            <MaintenanceLogForm 
              log={editingLog}
              properties={properties}
              teamMembers={teamMembers}
              categories={categories}
              guests={guests}
              onSubmit={handleLogSubmit}
              onCancel={() => setShowAddLogModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// MaintenanceLogForm component for adding/editing maintenance logs
const MaintenanceLogForm = ({ log, properties, teamMembers, categories, guests, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: log?.title || '',
    description: log?.description || '',
    status: log?.status || 'pending',
    priority: log?.priority || 'medium',
    propertyId: log?.propertyId || '',
    propertyName: log?.propertyName || '',
    reportedBy: log?.reportedBy || 'owner',
    reportedById: log?.reportedById || '',
    reportedByName: log?.reportedByName || 'Property Owner',
    reportedDate: log?.reportedDate || new Date().toISOString().split('T')[0],
    assignedTo: log?.assignedTo || '',
    estimatedCost: log?.estimatedCost || '',
    actualCost: log?.actualCost || '',
    category: log?.category || '',
    scheduledDate: log?.scheduledDate || '',
    completedDate: log?.completedDate || '',
    attachments: log?.attachments || []
  });
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Update property name if property ID changes
    if (name === 'propertyId') {
      const selectedProperty = properties.find(p => p.id === Number(value));
      if (selectedProperty) {
        setFormData(prev => ({
          ...prev,
          propertyId: Number(value),
          propertyName: selectedProperty.name
        }));
      }
    }
    
    // Update reporter name if reporter changes
    if (name === 'reportedBy') {
      if (value === 'owner') {
        setFormData(prev => ({
          ...prev,
          reportedBy: value,
          reportedById: '',
          reportedByName: 'Property Owner'
        }));
      }
    }
    
    // Update reporter name if reporter ID changes
    if (name === 'reportedById') {
      if (formData.reportedBy === 'guest') {
        const selectedGuest = guests.find(g => g.id === Number(value));
        if (selectedGuest) {
          setFormData(prev => ({
            ...prev,
            reportedById: Number(value),
            reportedByName: selectedGuest.name
          }));
        }
      } else if (formData.reportedBy === 'staff') {
        const selectedStaff = teamMembers.find(t => t.id === Number(value));
        if (selectedStaff) {
          setFormData(prev => ({
            ...prev,
            reportedById: Number(value),
            reportedByName: selectedStaff.name
          }));
        }
      }
    }
  };
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // In a real app, these would be uploaded to your server
    // For now, we'll just add them to state
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random().toString().substring(2, 8),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
      file: file // This would not be stored in state in a real app
    }));
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };
  
  const removeFile = (fileId) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would first upload any files
    // and get their URLs to include in the form submission
    const attachmentsToSubmit = [
      ...(formData.attachments || []),
      ...uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        url: `/mock-images/${file.name}`,
        type: file.type,
        size: file.size
      }))
    ];
    
    onSubmit({
      ...formData,
      attachments: attachmentsToSubmit
    });
  };
  
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Issue Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="propertyId">Property</label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            required
          >
            <option value="">Select property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group half">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="form-group half">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="reportedBy">Reported By</label>
          <select
            id="reportedBy"
            name="reportedBy"
            value={formData.reportedBy}
            onChange={handleChange}
            required
          >
            <option value="owner">Property Owner</option>
            <option value="guest">Guest</option>
            <option value="staff">Staff</option>
          </select>
        </div>
        {formData.reportedBy !== 'owner' && (
          <div className="form-group half">
            <label htmlFor="reportedById">
              {formData.reportedBy === 'guest' ? 'Select Guest' : 'Select Staff Member'}
            </label>
            <select
              id="reportedById"
              name="reportedById"
              value={formData.reportedById}
              onChange={handleChange}
              required
            >
              <option value="">Select {formData.reportedBy}</option>
              {formData.reportedBy === 'guest' ? (
                guests.map(guest => (
                  <option key={guest.id} value={guest.id}>{guest.name}</option>
                ))
              ) : (
                teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))
              )}
            </select>
          </div>
        )}
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="reportedDate">Date Reported</label>
          <input
            type="date"
            id="reportedDate"
            name="reportedDate"
            value={formData.reportedDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group half">
          <label htmlFor="assignedTo">Assign To</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">Not assigned</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="scheduledDate">Scheduled Date</label>
          <input
            type="date"
            id="scheduledDate"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
          />
        </div>
        {formData.status === 'completed' && (
          <div className="form-group half">
            <label htmlFor="completedDate">Completed Date</label>
            <input
              type="date"
              id="completedDate"
              name="completedDate"
              value={formData.completedDate}
              onChange={handleChange}
              required={formData.status === 'completed'}
            />
          </div>
        )}
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="estimatedCost">Estimated Cost (₦)</label>
          <input
            type="number"
            id="estimatedCost"
            name="estimatedCost"
            value={formData.estimatedCost}
            onChange={handleChange}
            min="0"
          />
        </div>
        {formData.status === 'completed' && (
          <div className="form-group half">
            <label htmlFor="actualCost">Actual Cost (₦)</label>
            <input
              type="number"
              id="actualCost"
              name="actualCost"
              value={formData.actualCost}
              onChange={handleChange}
              min="0"
            />
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label>Attachments</label>
        <label htmlFor="fileUpload" className="file-upload-area">
          <div className="file-upload-icon">
            <Upload size={24} />
          </div>
          <div className="file-upload-text">
            Click or drag files to upload attachments
          </div>
          <input
            type="file"
            id="fileUpload"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </label>
        
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files">
            {uploadedFiles.map(file => (
              <div key={file.id} className="uploaded-file-item">
                <FileText size={14} />
                <span>{file.name}</span>
                <span>({file.size})</span>
                <button
                  type="button"
                  className="remove-file-button"
                  onClick={() => removeFile(file.id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {formData.attachments && formData.attachments.length > 0 && (
          <div className="uploaded-files">
            <p>Existing Attachments:</p>
            {formData.attachments.map(attachment => (
              <div key={attachment.id} className="uploaded-file-item">
                <FileText size={14} />
                <span>{attachment.name}</span>
                <span>({attachment.size})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button">
          {log ? 'Update Maintenance Issue' : 'Add Maintenance Issue'}
        </button>
      </div>
    </form>
  );
};

export default MaintenancePage; 