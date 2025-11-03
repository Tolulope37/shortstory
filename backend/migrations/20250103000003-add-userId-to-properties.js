'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add userId column to Properties table
    await queryInterface.addColumn('Properties', 'userId', {
      type: Sequelize.UUID,
      allowNull: true, // Allow null for existing properties
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index for faster queries
    await queryInterface.addIndex('Properties', ['userId']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Properties', ['userId']);
    await queryInterface.removeColumn('Properties', 'userId');
  }
};
