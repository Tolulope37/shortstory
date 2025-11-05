const express = require('express');
const router = express.Router();
const MaintenanceLog = require('../models/MaintenanceLog');
const Property = require('../models/Property');
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
const maintenanceValidation = [
  body('propertyId').isUUID().withMessage('Valid property ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('category').optional().isIn(['plumbing', 'electrical', 'cleaning', 'repair', 'inspection', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('assignedTo').optional().isUUID(),
  body('cost').optional().isDecimal(),
  body('scheduledDate').optional().isISO8601(),
  body('completedDate').optional().isISO8601(),
  body('notes').optional().trim(),
  body('images').optional().isArray(),
  validate
];

const uuidParamValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate
];

// @route   GET /api/maintenance/logs
// @desc    Get all maintenance logs for logged-in user
// @access  Private
router.get('/logs', protect, async (req, res) => {
  try {
    const { category, status, priority, propertyId } = req.query;
    const where = { userId: req.user.id };

    if (category) where.category = category;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (propertyId) where.propertyId = propertyId;

    const logs = await MaintenanceLog.findAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    logger.error('Error fetching maintenance logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance logs'
    });
  }
});

// @route   GET /api/maintenance/logs/:id
// @desc    Get single maintenance log
// @access  Private
router.get('/logs/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const log = await MaintenanceLog.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    logger.error('Error fetching maintenance log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance log'
    });
  }
});

// @route   POST /api/maintenance/logs
// @desc    Create new maintenance log
// @access  Private
router.post('/logs', protect, maintenanceValidation, async (req, res) => {
  try {
    // Verify property belongs to user
    const property = await Property.findOne({
      where: {
        id: req.body.propertyId,
        userId: req.user.id
      }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or you do not have access to it'
      });
    }

    const logData = {
      ...req.body,
      userId: req.user.id
    };

    const log = await MaintenanceLog.create(logData);

    logger.info(`Maintenance log created: ${log.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Maintenance log created successfully',
      data: log
    });
  } catch (error) {
    logger.error('Error creating maintenance log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance log'
    });
  }
});

// @route   PUT /api/maintenance/logs/:id
// @desc    Update maintenance log
// @access  Private
router.put('/logs/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const log = await MaintenanceLog.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found'
      });
    }

    // If marking as completed, set completedDate
    if (req.body.status === 'completed' && !log.completedDate) {
      req.body.completedDate = new Date();
    }

    await log.update(req.body);

    logger.info(`Maintenance log updated: ${log.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Maintenance log updated successfully',
      data: log
    });
  } catch (error) {
    logger.error('Error updating maintenance log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance log'
    });
  }
});

// @route   DELETE /api/maintenance/logs/:id
// @desc    Delete maintenance log
// @access  Private
router.delete('/logs/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const log = await MaintenanceLog.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance log not found'
      });
    }

    await log.destroy();

    logger.info(`Maintenance log deleted: ${req.params.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Maintenance log deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting maintenance log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete maintenance log'
    });
  }
});

// @route   GET /api/maintenance/categories
// @desc    Get maintenance categories
// @access  Private
router.get('/categories', protect, async (req, res) => {
  try {
    const categories = [
      { id: 'plumbing', name: 'Plumbing', icon: 'wrench' },
      { id: 'electrical', name: 'Electrical', icon: 'bolt' },
      { id: 'cleaning', name: 'Cleaning', icon: 'spray-can' },
      { id: 'repair', name: 'Repair', icon: 'screwdriver' },
      { id: 'inspection', name: 'Inspection', icon: 'clipboard-check' },
      { id: 'other', name: 'Other', icon: 'circle-question' }
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;

