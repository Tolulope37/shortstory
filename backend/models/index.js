const User = require('./User');
const Property = require('./Property');
const Booking = require('./Booking');
const Guest = require('./Guest');

// Define associations
Property.hasMany(Booking, {
  foreignKey: 'propertyId',
  as: 'bookings',
  onDelete: 'CASCADE'
});

Booking.belongsTo(Property, {
  foreignKey: 'propertyId',
  as: 'property'
});

module.exports = {
  User,
  Property,
  Booking,
  Guest
};

