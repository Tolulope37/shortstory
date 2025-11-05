const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MessageAutomation = sequelize.define('MessageAutomation', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trigger: {
    type: DataTypes.ENUM('booking_confirmed', 'check_in_24h', 'check_in_day', 'check_out_24h', 'check_out_complete'),
    allowNull: false
  },
  templateId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'MessageTemplates',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'MessageAutomations'
});

module.exports = MessageAutomation;

