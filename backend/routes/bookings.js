const express = require('express');
const router = express.Router();
const { Booking, Property, Guest } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { bookingValidation, uuidParamValidation } = require('../middleware/validation');
const { checkAvailability, calculateBookingPrice, getAvailableDates, getBookingCalendar } = require('../services/bookingService');
const logger = require('../utils/logger');

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { status, propertyId, startDate, endDate } = req.query;
    
    const where = {};
    
    if (status) where.status = status;
    if (propertyId) where.propertyId = propertyId;
    if (startDate) {
      where.checkIn = { [require('sequelize').Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      where.checkOut = { [require('sequelize').Op.lte]: new Date(endDate) };
    }

    // SECURITY FIX: Only show bookings for properties owned by the logged-in user
    const bookings = await Booking.findAll({
      where,
      include: [{ 
        model: Property, 
        as: 'property',
        where: { userId: req.user.id }, // Filter by property owner!
        required: true
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    logger.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking
 * @access  Private
 */
router.get('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // SECURITY FIX: Verify user owns the property this booking is for
    if (booking.property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view bookings for your own properties'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    logger.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Create new booking
 * @access  Public/Private
 */
router.post('/', bookingValidation, async (req, res) => {
  try {
    const { propertyId, guestName, guestEmail, guestPhone, checkIn, checkOut, numberOfGuests, specialRequests } = req.body;

    // Check if property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check availability
    const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for selected dates'
      });
    }

    // Check max guests
    if (numberOfGuests > property.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Property can accommodate maximum ${property.maxGuests} guests`
      });
    }

    // Calculate pricing
    const pricing = await calculateBookingPrice(propertyId, checkIn, checkOut, numberOfGuests);

    // Create or update guest
    let guest = await Guest.findOne({ where: { email: guestEmail } });
    if (!guest) {
      guest = await Guest.create({
        name: guestName,
        email: guestEmail,
        phone: guestPhone
      });
    }

    // Create booking
    const booking = await Booking.create({
      propertyId,
      guestName,
      guestEmail,
      guestPhone,
      numberOfGuests,
      checkIn,
      checkOut,
      numberOfNights: pricing.nights,
      baseAmount: pricing.baseAmount,
      cleaningFee: pricing.cleaningFee,
      serviceFee: pricing.serviceFee,
      totalAmount: pricing.totalAmount,
      specialRequests,
      status: 'pending',
      paymentStatus: 'unpaid'
    });

    logger.info(`Booking created: ID ${booking.id} for property ${property.name}`);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking
 * @access  Private
 */
router.put('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // SECURITY FIX: Verify user owns the property this booking is for
    if (booking.property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update bookings for your own properties'
      });
    }

    // If dates are being changed, check availability
    if (req.body.checkIn || req.body.checkOut) {
      const newCheckIn = req.body.checkIn || booking.checkIn;
      const newCheckOut = req.body.checkOut || booking.checkOut;
      
      const isAvailable = await checkAvailability(booking.propertyId, newCheckIn, newCheckOut, booking.id);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Property is not available for selected dates'
        });
      }

      // Recalculate pricing if dates changed
      const pricing = await calculateBookingPrice(booking.propertyId, newCheckIn, newCheckOut, booking.numberOfGuests);
      req.body.numberOfNights = pricing.nights;
      req.body.baseAmount = pricing.baseAmount;
      req.body.totalAmount = pricing.totalAmount;
    }

    await booking.update(req.body);

    logger.info(`Booking updated: ID ${booking.id} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    logger.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Delete/Cancel booking
 * @access  Private
 */
router.delete('/:id', protect, uuidParamValidation, async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // SECURITY FIX: Verify user owns the property this booking is for
    if (booking.property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel bookings for your own properties'
      });
    }

    // Soft delete - mark as cancelled instead of deleting
    await booking.update({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: req.body.reason || 'Cancelled by user'
    });

    logger.info(`Booking cancelled: ID ${booking.id} by ${req.user.email}`);

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    logger.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/properties/:id/bookings
 * @desc    Get bookings for a specific property
 * @access  Private
 */
router.get('/properties/:id/bookings', protect, uuidParamValidation, async (req, res) => {
  try {
    // SECURITY FIX: Verify user owns this property
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    if (property.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view bookings for your own properties'
      });
    }

    const bookings = await Booking.findAll({
      where: { propertyId: req.params.id },
      order: [['checkIn', 'DESC']]
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    logger.error('Error fetching property bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/properties/:id/availability
 * @desc    Check property availability
 * @access  Public
 */
router.get('/properties/:id/availability', uuidParamValidation, async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (checkIn && checkOut) {
      // Check specific dates
      const isAvailable = await checkAvailability(req.params.id, checkIn, checkOut);
      res.json({
        success: true,
        data: { isAvailable, checkIn, checkOut }
      });
    } else {
      // Get all available dates for next 90 days
      const availableDates = await getAvailableDates(req.params.id, new Date(), 90);
      res.json({
        success: true,
        data: { availableDates }
      });
    }
  } catch (error) {
    logger.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/properties/:id/calendar
 * @desc    Get booking calendar for property
 * @access  Private
 */
router.get('/properties/:id/calendar', protect, uuidParamValidation, async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const calendar = await getBookingCalendar(req.params.id, parseInt(currentYear), parseInt(currentMonth));

    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    logger.error('Error fetching calendar:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching calendar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

