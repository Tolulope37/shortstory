const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Properties',
      key: 'id'
    }
  },
  guestName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  guestEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  guestPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numberOfGuests: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isAfterCheckIn(value) {
        if (new Date(value) <= new Date(this.checkIn)) {
          throw new Error('Check-out date must be after check-in date');
        }
      }
    }
  },
  numberOfNights: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  baseAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cleaningFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  serviceFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'partial', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['propertyId'] },
    { fields: ['checkIn'] },
    { fields: ['checkOut'] },
    { fields: ['status'] },
    { fields: ['paymentStatus'] },
    { fields: ['guestEmail'] }
  ],
  hooks: {
    beforeValidate: (booking) => {
      // Calculate number of nights
      if (booking.checkIn && booking.checkOut) {
        const checkInDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);
        const diffTime = Math.abs(checkOutDate - checkInDate);
        booking.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }
  }
});

module.exports = Booking;

