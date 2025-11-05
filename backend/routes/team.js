const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');
const TeamTask = require('../models/TeamTask');
const { protect } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validation rules
const memberValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('role').optional().trim(),
  body('assignedProperties').optional().isArray(),
  body('status').optional().isIn(['active', 'inactive', 'on_leave']),
  body('hireDate').optional().isISO8601(),
  body('notes').optional().trim(),
  validate
];

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('assignedTo').optional().isUUID(),
  body('propertyId').optional().isUUID(),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('dueDate').optional().isISO8601(),
  validate
];

const uuidParamValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate
];

// ==================== TEAM MEMBERS ROUTES ====================

// @route   GET /api/team/members
// @desc    Get all team members for logged-in user
// @access  Private
router.get('/members', protect, async (req, res) => {
  try {
    const members = await TeamMember.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    logger.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members'
    });
  }
});

// @route   GET /api/team/members/:id
// @desc    Get single team member
// @access  Private
router.get('/members/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const member = await TeamMember.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    logger.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team member'
    });
  }
});

// @route   POST /api/team/members
// @desc    Create new team member
// @access  Private
router.post('/members', protect, memberValidation, async (req, res) => {
  try {
    const memberData = {
      ...req.body,
      userId: req.user.id
    };

    const member = await TeamMember.create(memberData);

    logger.info(`Team member created: ${member.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: member
    });
  } catch (error) {
    logger.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create team member'
    });
  }
});

// @route   PUT /api/team/members/:id
// @desc    Update team member
// @access  Private
router.put('/members/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const member = await TeamMember.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await member.update(req.body);

    logger.info(`Team member updated: ${member.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: member
    });
  } catch (error) {
    logger.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update team member'
    });
  }
});

// @route   DELETE /api/team/members/:id
// @desc    Delete team member
// @access  Private
router.delete('/members/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const member = await TeamMember.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await member.destroy();

    logger.info(`Team member deleted: ${req.params.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete team member'
    });
  }
});

// @route   GET /api/team/roles
// @desc    Get available team roles
// @access  Private
router.get('/roles', protect, async (req, res) => {
  try {
    // Return predefined roles
    const roles = [
      { id: 1, name: 'Property Manager', permissions: ['manage_properties', 'manage_bookings', 'manage_team', 'manage_guests'] },
      { id: 2, name: 'Assistant Manager', permissions: ['manage_properties', 'manage_bookings', 'manage_guests'] },
      { id: 3, name: 'Cleaner', permissions: ['view_properties', 'update_cleaning_status'] },
      { id: 4, name: 'Maintenance', permissions: ['view_properties', 'update_maintenance'] },
      { id: 5, name: 'Guest Concierge', permissions: ['view_properties', 'message_guests'] },
      { id: 6, name: 'Security', permissions: ['view_properties'] },
      { id: 7, name: 'Staff', permissions: ['view_properties'] }
    ];

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    logger.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles'
    });
  }
});

// ==================== TEAM TASKS ROUTES ====================

// @route   GET /api/team/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/tasks', protect, async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    const tasks = await TeamTask.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// @route   POST /api/team/tasks
// @desc    Create new task
// @access  Private
router.post('/tasks', protect, taskValidation, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.user.id
    };

    const task = await TeamTask.create(taskData);

    logger.info(`Task created: ${task.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task'
    });
  }
});

// @route   PUT /api/team/tasks/:id
// @desc    Update task
// @access  Private
router.put('/tasks/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const task = await TeamTask.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // If marking as completed, set completedAt
    if (req.body.status === 'completed' && !task.completedAt) {
      req.body.completedAt = new Date();
    }

    await task.update(req.body);

    logger.info(`Task updated: ${task.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    logger.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
});

// @route   DELETE /api/team/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/tasks/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const task = await TeamTask.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.destroy();

    logger.info(`Task deleted: ${req.params.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
});

module.exports = router;

