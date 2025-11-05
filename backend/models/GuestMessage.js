const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GuestMessage = sequelize.define('GuestMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Property owner/manager'
  },
  guestId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Guests',
      key: 'id'
    }
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  direction: {
    type: DataTypes.ENUM('outgoing', 'incoming'),
    defaultValue: 'outgoing'
  },
  status: {
    type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
    defaultValue: 'sent'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'GuestMessages'
});

module.exports = GuestMessage;

