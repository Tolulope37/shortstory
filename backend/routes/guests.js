const express = require('express');
const router = express.Router();
const Guest = require('../models/Guest');
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
const guestValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('nationality').optional().trim(),
  body('idType').optional().trim(),
  body('idNumber').optional().trim(),
  body('address').optional().trim(),
  body('guestType').optional().isIn(['new', 'regular', 'vip']),
  body('status').optional().isIn(['active', 'blacklisted', 'archived']),
  body('notes').optional().trim(),
  body('preferences').optional().isObject(),
  body('emergencyContact').optional().isObject(),
  validate
];

const uuidParamValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate
];

// @route   GET /api/guests
// @desc    Get all guests for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { guestType, status, search } = req.query;
    const where = { userId: req.user.id };

    if (guestType) where.guestType = guestType;
    if (status) where.status = status;
    
    // Search by name or email
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const guests = await Guest.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: guests.length,
      data: guests
    });
  } catch (error) {
    logger.error('Error fetching guests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guests'
    });
  }
});

// @route   GET /api/guests/:id
// @desc    Get single guest
// @access  Private
router.get('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const guest = await Guest.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      data: guest
    });
  } catch (error) {
    logger.error('Error fetching guest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guest'
    });
  }
});

// @route   POST /api/guests
// @desc    Create new guest
// @access  Private
router.post('/', protect, guestValidation, async (req, res) => {
  try {
    const guestData = {
      ...req.body,
      userId: req.user.id
    };

    const guest = await Guest.create(guestData);

    logger.info(`Guest created: ${guest.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Guest created successfully',
      data: guest
    });
  } catch (error) {
    logger.error('Error creating guest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create guest'
    });
  }
});

// @route   PUT /api/guests/:id
// @desc    Update guest
// @access  Private
router.put('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const guest = await Guest.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    await guest.update(req.body);

    logger.info(`Guest updated: ${guest.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Guest updated successfully',
      data: guest
    });
  } catch (error) {
    logger.error('Error updating guest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update guest'
    });
  }
});

// @route   DELETE /api/guests/:id
// @desc    Delete guest
// @access  Private
router.delete('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const guest = await Guest.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    await guest.destroy();

    logger.info(`Guest deleted: ${req.params.id} by user: ${req.user.id}`);

    res.json({
      success: true,
      message: 'Guest deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting guest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete guest'
    });
  }
});

// @route   GET /api/guests/:id/bookings
// @desc    Get booking history for a guest
// @access  Private
router.get('/:id/bookings', protect, uuidParamValidation, async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    const guest = await Guest.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Get bookings where guest email matches
    const bookings = await Booking.findAll({
      where: {
        guestEmail: guest.email
      },
      order: [['checkIn', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    logger.error('Error fetching guest bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch guest bookings'
    });
  }
});

module.exports = router;

