const { Booking, Property } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * Check if a property is available for given dates
 */
const checkAvailability = async (propertyId, checkIn, checkOut, excludeBookingId = null) => {
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find overlapping bookings
    const whereClause = {
      propertyId,
      status: {
        [Op.notIn]: ['cancelled', 'checked-out']
      },
      [Op.or]: [
        {
          // Booking starts during requested period
          checkIn: {
            [Op.between]: [checkInDate, checkOutDate]
          }
        },
        {
          // Booking ends during requested period
          checkOut: {
            [Op.between]: [checkInDate, checkOutDate]
          }
        },
        {
          // Booking encompasses requested period
          checkIn: {
            [Op.lte]: checkInDate
          },
          checkOut: {
            [Op.gte]: checkOutDate
          }
        }
      ]
    };

    // Exclude specific booking (for updates)
    if (excludeBookingId) {
      whereClause.id = { [Op.ne]: excludeBookingId };
    }

    const overlappingBookings = await Booking.count({ where: whereClause });

    return overlappingBookings === 0;
  } catch (error) {
    logger.error('Error checking availability:', error);
    throw error;
  }
};

/**
 * Get available dates for a property (next 365 days)
 */
const getAvailableDates = async (propertyId, startDate = new Date(), days = 365) => {
  try {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    // Get all bookings for the property in this period
    const bookings = await Booking.findAll({
      where: {
        propertyId,
        status: {
          [Op.notIn]: ['cancelled']
        },
        checkOut: {
          [Op.gte]: startDate
        },
        checkIn: {
          [Op.lte]: endDate
        }
      },
      order: [['checkIn', 'ASC']]
    });

    // Create array of booked dates
    const bookedDates = new Set();
    bookings.forEach(booking => {
      const current = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      
      while (current < end) {
        bookedDates.add(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    // Generate available dates
    const availableDates = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      if (!bookedDates.has(dateStr)) {
        availableDates.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }

    return availableDates;
  } catch (error) {
    logger.error('Error getting available dates:', error);
    throw error;
  }
};

/**
 * Calculate booking price
 */
const calculateBookingPrice = async (propertyId, checkIn, checkOut, numberOfGuests) => {
  try {
    const property = await Property.findByPk(propertyId);
    
    if (!property) {
      throw new Error('Property not found');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    let baseAmount = 0;
    const currentDate = new Date(checkInDate);

    // Calculate nightly rates (considering weekend rates)
    for (let i = 0; i < nights; i++) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday
      
      const rate = isWeekend && property.weekendRate 
        ? parseFloat(property.weekendRate)
        : parseFloat(property.baseRate);
      
      baseAmount += rate;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Apply weekly/monthly discounts if applicable
    if (nights >= 30 && property.monthlyRate) {
      const months = Math.floor(nights / 30);
      const remainingNights = nights % 30;
      baseAmount = (months * parseFloat(property.monthlyRate)) + 
                   (remainingNights * parseFloat(property.baseRate));
    } else if (nights >= 7 && property.weeklyRate) {
      const weeks = Math.floor(nights / 7);
      const remainingNights = nights % 7;
      baseAmount = (weeks * parseFloat(property.weeklyRate)) + 
                   (remainingNights * parseFloat(property.baseRate));
    }

    const cleaningFee = parseFloat(property.cleaningFee) || 0;
    const serviceFee = baseAmount * 0.05; // 5% service fee
    const totalAmount = baseAmount + cleaningFee + serviceFee;

    return {
      nights,
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      cleaningFee: parseFloat(cleaningFee.toFixed(2)),
      serviceFee: parseFloat(serviceFee.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2))
    };
  } catch (error) {
    logger.error('Error calculating booking price:', error);
    throw error;
  }
};

/**
 * Get booking calendar for a property
 */
const getBookingCalendar = async (propertyId, year, month) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bookings = await Booking.findAll({
      where: {
        propertyId,
        status: {
          [Op.notIn]: ['cancelled']
        },
        [Op.or]: [
          {
            checkIn: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            checkOut: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            checkIn: {
              [Op.lte]: startDate
            },
            checkOut: {
              [Op.gte]: endDate
            }
          }
        ]
      },
      order: [['checkIn', 'ASC']]
    });

    return bookings;
  } catch (error) {
    logger.error('Error getting booking calendar:', error);
    throw error;
  }
};

module.exports = {
  checkAvailability,
  getAvailableDates,
  calculateBookingPrice,
  getBookingCalendar
};

