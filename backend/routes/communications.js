const express = require('express');
const router = express.Router();
const MessageTemplate = require('../models/MessageTemplate');
const MessageAutomation = require('../models/MessageAutomation');
const GuestMessage = require('../models/GuestMessage');
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

const uuidParamValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate
];

// ==================== MESSAGE TEMPLATES ROUTES ====================

// @route   GET /api/communications/templates
// @desc    Get all message templates for logged-in user
// @access  Private
router.get('/templates', protect, async (req, res) => {
  try {
    const templates = await MessageTemplate.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    logger.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch templates'
    });
  }
});

// @route   POST /api/communications/templates
// @desc    Create new message template
// @access  Private
router.post('/templates', protect, async (req, res) => {
  try {
    const templateData = {
      ...req.body,
      userId: req.user.id
    };

    const template = await MessageTemplate.create(templateData);

    logger.info(`Template created: ${template.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });
  } catch (error) {
    logger.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create template'
    });
  }
});

// @route   PUT /api/communications/templates/:id
// @desc    Update message template
// @access  Private
router.put('/templates/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const template = await MessageTemplate.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await template.update(req.body);

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: template
    });
  } catch (error) {
    logger.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update template'
    });
  }
});

// @route   DELETE /api/communications/templates/:id
// @desc    Delete message template
// @access  Private
router.delete('/templates/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const template = await MessageTemplate.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    await template.destroy();

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete template'
    });
  }
});

// ==================== MESSAGE AUTOMATIONS ROUTES ====================

// @route   GET /api/communications/automations
// @desc    Get all message automations for logged-in user
// @access  Private
router.get('/automations', protect, async (req, res) => {
  try {
    const automations = await MessageAutomation.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: MessageTemplate,
          as: 'template',
          attributes: ['id', 'name', 'subject', 'message']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: automations.length,
      data: automations
    });
  } catch (error) {
    logger.error('Error fetching automations:', error);
    res.json({
      success: true,
      count: 0,
      data: []
    });
  }
});

// @route   POST /api/communications/automations
// @desc    Create new message automation
// @access  Private
router.post('/automations', protect, async (req, res) => {
  try {
    const automationData = {
      ...req.body,
      userId: req.user.id
    };

    const automation = await MessageAutomation.create(automationData);

    logger.info(`Automation created: ${automation.id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Automation created successfully',
      data: automation
    });
  } catch (error) {
    logger.error('Error creating automation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create automation'
    });
  }
});

// @route   DELETE /api/communications/automations/:id
// @desc    Delete message automation
// @access  Private
router.delete('/automations/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const automation = await MessageAutomation.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!automation) {
      return res.status(404).json({
        success: false,
        message: 'Automation not found'
      });
    }

    await automation.destroy();

    res.json({
      success: true,
      message: 'Automation deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting automation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete automation'
    });
  }
});

// ==================== GUEST MESSAGES ROUTES ====================

// @route   GET /api/communications/messages/:guestId
// @desc    Get messages for a specific guest
// @access  Private
router.get('/messages/:guestId', protect, uuidParamValidation, async (req, res) => {
  try {
    // Verify guest belongs to user
    const guest = await Guest.findOne({
      where: {
        id: req.params.guestId,
        userId: req.user.id
      }
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    const messages = await GuestMessage.findAll({
      where: {
        guestId: req.params.guestId,
        userId: req.user.id
      },
      order: [['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// @route   POST /api/communications/messages/:guestId
// @desc    Send message to a guest
// @access  Private
router.post('/messages/:guestId', protect, uuidParamValidation, async (req, res) => {
  try {
    // Verify guest belongs to user
    const guest = await Guest.findOne({
      where: {
        id: req.params.guestId,
        userId: req.user.id
      }
    });

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    const messageData = {
      ...req.body,
      userId: req.user.id,
      guestId: req.params.guestId,
      direction: 'outgoing',
      sentAt: new Date()
    };

    const message = await GuestMessage.create(messageData);

    logger.info(`Message sent: ${message.id} to guest: ${req.params.guestId} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// ==================== WELCOME PACKS & CHECK-IN PACKS (Stub routes) ====================

// @route   GET /api/communications/welcome-packs
// @desc    Get welcome packs
// @access  Private
router.get('/welcome-packs', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    logger.error('Error fetching welcome packs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch welcome packs'
    });
  }
});

// @route   GET /api/communications/check-in-packs
// @desc    Get check-in packs
// @access  Private
router.get('/check-in-packs', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    logger.error('Error fetching check-in packs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch check-in packs'
    });
  }
});

module.exports = router;

