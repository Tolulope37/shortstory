const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('apartment', 'villa', 'house', 'studio', 'penthouse'),
    defaultValue: 'apartment'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'Nigeria'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0
    }
  },
  maxGuests: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    validate: {
      min: 1
    }
  },
  baseRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Base nightly rate in Naira'
  },
  weekendRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Weekend rate (Fri-Sun) in Naira'
  },
  weeklyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Weekly rate in Naira'
  },
  monthlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Monthly rate in Naira'
  },
  cleaningFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  securityDeposit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'maintenance', 'inactive'),
    defaultValue: 'available'
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  rules: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  checkInTime: {
    type: DataTypes.STRING,
    defaultValue: '14:00'
  },
  checkOutTime: {
    type: DataTypes.STRING,
    defaultValue: '11:00'
  },
  minStay: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Minimum nights required'
  },
  maxStay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum nights allowed'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['status'] },
    { fields: ['city'] },
    { fields: ['isActive'] }
  ]
});

module.exports = Property;

