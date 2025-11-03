import React, { useState, useEffect } from 'react';
import { teamService } from '../services/api';
import { UserPlus, Search, Edit, Trash, Home, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react';
import '../styles/TeamPage.css';
import { loadData } from '../utils/loadingUtils';
import { fetchWithCache, clearCacheItem } from '../utils/cacheUtils';
import ErrorMessage from '../components/ErrorMessage';

const TeamPage = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchTeamData = async () => {
      if (activeTab === 'members') {
        // Use cache utility for members
        await loadData(
          () => fetchWithCache('team-members', teamService.getAllMembers),
          setLoading,
          setError,
          setTeamMembers
        );
      } else {
        // Use cache utility for tasks
        await loadData(
          () => fetchWithCache('team-tasks', teamService.getTasks),
          setLoading,
          setError,
          setTasks
        );
      }
    };

    fetchTeamData();
  }, [activeTab]);

  // Filter members based on search and filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = searchTerm === '' || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || member.role === roleFilter;
    const matchesStatus = statusFilter === '' || member.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get unique roles for filter dropdown
  const roles = [...new Set(teamMembers.map(member => member.role))];

  // Handle member actions
  const handleAddMember = () => {
    setEditingMember(null);
    setShowAddMemberModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowAddMemberModal(true);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        setLoading(true);
        await teamService.deleteMember(id);
        setTeamMembers(teamMembers.filter(member => member.id !== id));
        // Clear the cache when modifying data
        clearCacheItem('team-members');
        setLoading(false);
      } catch (error) {
        setError('Failed to delete team member. Please try again.');
        console.error('Error deleting team member:', error);
        setLoading(false);
      }
    }
  };

  // Handle task actions
  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await teamService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
        // Clear the cache when modifying data
        clearCacheItem('team-tasks');
        setLoading(false);
      } catch (error) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', error);
        setLoading(false);
      }
    }
  };

  // Render member initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle member form submission
  const handleMemberSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.role || 
          !formData.status || formData.properties.length === 0 || formData.permissions.length === 0) {
        alert('Please fill out all required fields');
        setLoading(false);
        return;
      }
      
      if (editingMember) {
        // Update existing member
        const updatedMember = await teamService.updateMember(editingMember.id, formData);
        setTeamMembers(teamMembers.map(member => 
          member.id === editingMember.id ? updatedMember : member
        ));
      } else {
        // Create new member
        const newMember = await teamService.createMember(formData);
        setTeamMembers([...teamMembers, newMember]);
      }
      
      // Clear the cache when modifying data
      clearCacheItem('team-members');
      setShowAddMemberModal(false);
      setEditingMember(null);
      setError(null);
    } catch (error) {
      setError('Failed to save team member. Please try again.');
      console.error('Error saving team member:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle task form submission
  const handleTaskSubmit = async (formData) => {
    try {
      setLoading(true);
      
      if (editingTask) {
        // Update existing task
        const updatedTask = await teamService.updateTask(editingTask.id, formData);
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await teamService.createTask(formData);
        setTasks([...tasks, newTask]);
      }
      
      // Clear the cache when modifying data
      clearCacheItem('team-tasks');
      setShowAddTaskModal(false);
      setEditingTask(null);
      setError(null);
    } catch (error) {
      setError('Failed to save task. Please try again.');
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle retry action for error messages
  const handleRetry = () => {
    const fetchTeamData = async () => {
      if (activeTab === 'members') {
        // Clear cache and reload data
        clearCacheItem('team-members');
        await loadData(
          () => fetchWithCache('team-members', teamService.getAllMembers, 0), // 0 duration to force refresh
          setLoading,
          setError,
          setTeamMembers
        );
      } else {
        // Clear cache and reload data
        clearCacheItem('team-tasks');
        await loadData(
          () => fetchWithCache('team-tasks', teamService.getTasks, 0), // 0 duration to force refresh
          setLoading,
          setError,
          setTasks
        );
      }
    };

    fetchTeamData();
  };

  return (
    <div className="team-page">
      <div className="team-page-header">
        <div>
          <h1>Team Management</h1>
          <p>Manage your team members and assign tasks</p>
        </div>
        <div className="team-tabs">
          <button 
            className={`team-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <UserPlus size={18} />
            Team Members
          </button>
          <button 
            className={`team-tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <Calendar size={18} />
            Tasks
          </button>
        </div>
      </div>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
          onDismiss={() => setError(null)}
        />
      )}

      {activeTab === 'members' ? (
        <div className="team-members-section">
          <div className="section-header">
            <div className="search-and-filters">
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input 
                  type="text"
                  placeholder="Search team members..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filters-container">
                <div className="filter-group">
                  <label>Role:</label>
                  <select 
                    className="filter-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">All Roles</option>
                    {roles.map((role, index) => (
                      <option key={index} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Status:</label>
                  <select 
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <button className="add-button" onClick={handleAddMember}>
              <UserPlus size={18} />
              Add Team Member
            </button>
          </div>

          <div className="team-members-list">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Role</th>
                  <th>Properties</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="loading-row">Loading team members...</td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-row">No team members found.</td>
                  </tr>
                ) : (
                  filteredMembers.map(member => (
                    <tr key={member.id}>
                      <td>
                        <div className="name-cell">
                          <div className="member-avatar">
                            <div className="avatar-placeholder">
                              {getInitials(member.name)}
                            </div>
                          </div>
                          <div className="member-info">
                            <div className="member-name">{member.name}</div>
                            <div className="member-email">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="role-badge">{member.role}</span>
                      </td>
                      <td>
                        <div className="properties-list">
                          {member.properties && member.properties.length > 0 ? (
                            <>
                              <span className="property-badge">{member.properties[0]}</span>
                              {member.properties.length > 1 && (
                                <span className="more-properties">+{member.properties.length - 1} more</span>
                              )}
                            </>
                          ) : (
                            <span className="no-properties">No properties assigned</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${member.status}`}>
                          {member.status === 'active' ? (
                            <>
                              <CheckCircle size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-button"
                            onClick={() => handleEditMember(member)}
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="tasks-section">
          <div className="section-header">
            <div className="search-and-filters">
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input 
                  type="text"
                  placeholder="Search tasks..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="add-button" onClick={handleAddTask}>
              <Calendar size={18} />
              Add Task
            </button>
          </div>

          {loading ? (
            <div className="loading-message">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-message">No tasks found.</div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <div className="task-title-row">
                      <h3 className="task-title">{task.title}</h3>
                      <div className="task-actions">
                        <button 
                          className="edit-button edit-task-button"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="delete-button delete-task-button"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="task-meta">
                      <span className={`task-status-badge ${task.status}`}>
                        {task.status === 'completed' ? (
                          <>
                            <CheckCircle size={14} />
                            Completed
                          </>
                        ) : task.status === 'in_progress' ? (
                          <>
                            <Calendar size={14} />
                            In Progress
                          </>
                        ) : (
                          <>
                            <AlertCircle size={14} />
                            Pending
                          </>
                        )}
                      </span>
                      <span className={`task-priority-badge ${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <div className="task-body">
                    <p className="task-description">{task.description}</p>
                    <div className="task-details">
                      <div className="task-property">
                        <Home size={16} />
                        {task.property}
                      </div>
                      <div className="task-due-date">
                        <Calendar size={16} />
                        Due: {task.dueDate}
                      </div>
                      <div className="task-assignment">
                        <div>Assigned to:</div>
                        <div className="assigned-member">
                          <div className="member-avatar small">
                            <div className="avatar-placeholder">
                              {getInitials(task.assignedToName || 'NA')}
                            </div>
                          </div>
                          <span>{task.assignedToName || 'Unassigned'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add modals for adding/editing members and tasks */}
      {showAddMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingMember ? 'Edit Team Member' : 'Add Team Member'}</h2>
              <button className="close-button" onClick={() => setShowAddMemberModal(false)}>
                <X size={18} />
              </button>
            </div>
            <MemberForm 
              member={editingMember}
              onSubmit={handleMemberSubmit}
              onCancel={() => setShowAddMemberModal(false)}
            />
          </div>
        </div>
      )}

      {showAddTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
              <button className="close-button" onClick={() => setShowAddTaskModal(false)}>
                <X size={18} />
              </button>
            </div>
            <TaskForm 
              task={editingTask}
              teamMembers={teamMembers}
              onSubmit={handleTaskSubmit}
              onCancel={() => setShowAddTaskModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// MemberForm component for adding/editing team members
const MemberForm = ({ member, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    role: member?.role || 'Property Manager',
    status: member?.status || 'active',
    properties: member?.properties || [],
    permissions: member?.permissions || []
  });
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({
    basicInfo: false,
    properties: false,
    permissions: false
  });

  // Define available permissions with appropriate labels 
  const availablePermissions = [
    { id: 'dashboard', group: 'Pages', label: 'Dashboard', description: 'View dashboard and statistics' },
    { id: 'properties', group: 'Pages', label: 'Properties', description: 'View property listings' },
    { id: 'bookings', group: 'Pages', label: 'Bookings', description: 'View booking information' },
    { id: 'calendar', group: 'Pages', label: 'Calendar', description: 'View system calendar' },
    { id: 'guests', group: 'Pages', label: 'Guests', description: 'View guest information' },
    { id: 'communications', group: 'Pages', label: 'Communications', description: 'Access messaging system' },
    { id: 'team', group: 'Pages', label: 'Team', description: 'View team members' },
    { id: 'maintenance', group: 'Pages', label: 'Maintenance', description: 'View maintenance tasks' },
    { id: 'finances', group: 'Pages', label: 'Finances', description: 'View financial information' },
    { id: 'locations', group: 'Pages', label: 'Locations', description: 'View property locations' },
    { id: 'predictions', group: 'Pages', label: 'Predictions', description: 'View market predictions' },
    { id: 'settings', group: 'Pages', label: 'Settings', description: 'Access system settings' },
    
    { id: 'manage_properties', group: 'Actions', label: 'Manage Properties', description: 'Create, edit, and delete properties' },
    { id: 'manage_bookings', group: 'Actions', label: 'Manage Bookings', description: 'Create, edit, and delete bookings' },
    { id: 'manage_guests', group: 'Actions', label: 'Manage Guests', description: 'Create, edit, and delete guest info' },
    { id: 'manage_team', group: 'Actions', label: 'Manage Team', description: 'Add and remove team members' },
    { id: 'message_guests', group: 'Actions', label: 'Message Guests', description: 'Send messages to guests' },
    { id: 'manage_finances', group: 'Actions', label: 'Manage Finances', description: 'Process payments and transactions' },
    { id: 'manage_maintenance', group: 'Actions', label: 'Manage Maintenance', description: 'Create and assign maintenance tasks' },
  ];

  // Group permissions for display
  const groupedPermissions = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.group]) {
      acc[permission.group] = [];
    }
    acc[permission.group].push(permission);
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you'd fetch these from your API
        const roles = await teamService.getRoles();
        setAvailableRoles(roles);
        
        // Mock properties data for now
        setAvailableProperties([
          'Lekki Paradise Villa',
          'Victoria Island Luxury Suite',
          'Ikeja GRA Apartment',
          'Abuja Executive Home'
        ]);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePropertyChange = (property) => {
    let updatedProperties = [...formData.properties];
    
    if (updatedProperties.includes(property)) {
      updatedProperties = updatedProperties.filter(p => p !== property);
    } else {
      updatedProperties.push(property);
    }
    
    setFormData({
      ...formData,
      properties: updatedProperties
    });
  };

  const handlePermissionChange = (permissionId) => {
    let updatedPermissions = [...formData.permissions];
    
    if (updatedPermissions.includes(permissionId)) {
      updatedPermissions = updatedPermissions.filter(p => p !== permissionId);
    } else {
      updatedPermissions.push(permissionId);
    }
    
    setFormData({
      ...formData,
      permissions: updatedPermissions
    });
  };

  const handleRoleTemplateChange = (roleName) => {
    const role = availableRoles.find(r => r.name === roleName);
    
    setFormData({
      ...formData,
      role: roleName,
      permissions: role ? [...role.permissions] : []
    });
  };

  const validateBasicInfo = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.role || !formData.status) {
      setErrors({...errors, basicInfo: true});
      return false;
    }
    setErrors({...errors, basicInfo: false});
    return true;
  };

  const validateProperties = () => {
    if (formData.properties.length === 0) {
      setErrors({...errors, properties: true});
      return false;
    }
    setErrors({...errors, properties: false});
    return true;
  };

  const validatePermissions = () => {
    if (formData.permissions.length === 0) {
      setErrors({...errors, permissions: true});
      return false;
    }
    setErrors({...errors, permissions: false});
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (validateBasicInfo()) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 2) {
      if (validateProperties()) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePermissions()) {
      onSubmit(formData);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return <div className="form">Loading...</div>;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {currentStep === 1 && (
        <div className="form-step">
          <h3 className="step-title">Basic Information</h3>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter team member's full name"
                className="modern-input"
              />
            </div>
            <div className="form-group half">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
                className="modern-input"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
                className="modern-input"
              />
            </div>
            <div className="form-group half">
              <label htmlFor="role">Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => {
                  handleChange(e);
                  handleRoleTemplateChange(e.target.value);
                }}
                required
                className="modern-select"
              >
                {availableRoles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="modern-select"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          {errors.basicInfo && (
            <div className="error-message">Please fill in all required fields marked with *</div>
          )}
          
          <div className="form-navigation">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="button" 
              className="next-button" 
              onClick={nextStep}
            >
              Next: Assign Properties
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="form-step">
          <h3 className="step-title">Assigned Properties</h3>
          <p className="step-description">Select which properties this team member will have access to: *</p>
          
          <div className="properties-grid">
            {availableProperties.map(property => (
              <div key={property} className={`property-card ${formData.properties.includes(property) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  id={`property-${property}`}
                  checked={formData.properties.includes(property)}
                  onChange={() => handlePropertyChange(property)}
                  className="property-checkbox-input"
                />
                <label htmlFor={`property-${property}`} className="property-card-content">
                  <Home size={18} className="property-icon" />
                  <span className="property-name">{property}</span>
                </label>
              </div>
            ))}
          </div>
          
          {errors.properties && (
            <div className="error-message">Please select at least one property</div>
          )}
          
          <div className="form-navigation">
            <button type="button" className="back-button" onClick={prevStep}>
              Back
            </button>
            <button 
              type="button" 
              className="next-button" 
              onClick={nextStep}
            >
              Next: Set Permissions
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="form-step permissions-step">
          <h3 className="step-title">Permissions</h3>
          <p className="step-description">Control what this team member can access and do within the system: *</p>
          
          <div className="permissions-role-template">
            <label>Apply Role Template:</label>
            <select 
              onChange={(e) => handleRoleTemplateChange(e.target.value)}
              value={formData.role}
              className="modern-select"
              required
            >
              {availableRoles.map(role => (
                <option key={role.id} value={role.name}>{role.name}</option>
              ))}
            </select>
          </div>

          <div className="permissions-container">
            {Object.entries(groupedPermissions).map(([group, permissions]) => (
              <div key={group} className="permissions-group">
                <h4 className="permissions-group-title">{group}</h4>
                
                <div className="permissions-list">
                  {permissions.map(permission => (
                    <div key={permission.id} className="permission-item">
                      <label className="permission-label">
                        <div className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            checked={formData.permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            className="permission-checkbox"
                          />
                          <span className="checkbox-custom"></span>
                        </div>
                        <div className="permission-info">
                          <span className="permission-name">{permission.label}</span>
                          <span className="permission-description">{permission.description}</span>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {errors.permissions && (
            <div className="error-message">Please select at least one permission</div>
          )}
          
          <div className="form-navigation">
            <button type="button" className="back-button" onClick={prevStep}>
              Back
            </button>
            <button 
              type="submit" 
              className="submit-button"
            >
              {member ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

// TaskForm component for adding/editing tasks
const TaskForm = ({ task, teamMembers, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    property: task?.property || '',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium'
  });
  
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock properties data for now
        setAvailableProperties([
          'Lekki Paradise Villa',
          'Victoria Island Luxury Suite',
          'Ikeja GRA Apartment',
          'Abuja Executive Home'
        ]);
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return <div className="form">Loading...</div>;
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title</label>
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
          <label htmlFor="property">Property</label>
          <select
            id="property"
            name="property"
            value={formData.property}
            onChange={handleChange}
            required
          >
            <option value="">Select property</option>
            {availableProperties.map(property => (
              <option key={property} value={property}>{property}</option>
            ))}
          </select>
        </div>
        <div className="form-group half">
          <label htmlFor="assignedTo">Assigned To</label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            required
          >
            <option value="">Select team member</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group half">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
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
      
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button">
          {task ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TeamPage; 