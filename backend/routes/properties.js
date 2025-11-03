const express = require('express');
const router = express.Router();
const { Property } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { propertyValidation, uuidParamValidation } = require('../middleware/validation');
const logger = require('../utils/logger');

/**
 * @route   GET /api/properties
 * @desc    Get all properties (ONLY for logged-in user)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { status, city, minRate, maxRate, bedrooms } = req.query;
    
    // IMPORTANT: Only show properties owned by the logged-in user
    const where = { 
      isActive: true,
      userId: req.user.id  // Filter by current user!
    };
    
    if (status) where.status = status;
    if (city) where.city = city;
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (minRate || maxRate) {
      where.baseRate = {};
      if (minRate) where.baseRate[require('sequelize').Op.gte] = parseFloat(minRate);
      if (maxRate) where.baseRate[require('sequelize').Op.lte] = parseFloat(maxRate);
    }

    const properties = await Property.findAll({ where });

    res.json({
      success: true,
      count: properties.length,
      properties: properties // Changed from 'data' to 'properties' to match frontend
    });
  } catch (error) {
    logger.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/properties/:id
 * @desc    Get single property
 * @access  Public
 */
router.get('/:id', uuidParamValidation, async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    logger.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching property',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/properties
 * @desc    Create new property
 * @access  Private (All authenticated users can create)
 */
router.post('/', protect, propertyValidation, async (req, res) => {
  try {
    // Automatically assign property to the logged-in user
    const propertyData = {
      ...req.body,
      userId: req.user.id  // Link property to current user!
    };
    
    const property = await Property.create(propertyData);

    logger.info(`Property created: ${property.name} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    logger.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating property',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private (Owner only)
 */
router.put('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns this property
    if (property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own properties'
      });
    }

    await property.update(req.body);

    logger.info(`Property updated: ${property.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    logger.error('Error updating property:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property
 * @access  Private (Admin only)
 */
router.delete('/:id', protect, authorize('admin'), uuidParamValidation, async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.destroy();

    logger.info(`Property deleted: ${property.name} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

