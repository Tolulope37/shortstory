'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Guests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: true
      },
      idType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      idNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      guestType: {
        type: Sequelize.ENUM('new', 'regular', 'vip'),
        defaultValue: 'new'
      },
      totalBookings: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalSpent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      averageRating: {
        type: Sequelize.DECIMAL(3, 2),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      preferences: {
        type: Sequelize.JSON,
        allowNull: true
      },
      emergencyContact: {
        type: Sequelize.JSON,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'blacklisted', 'archived'),
        defaultValue: 'active'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('Guests', ['userId']);
    await queryInterface.addIndex('Guests', ['email']);
    await queryInterface.addIndex('Guests', ['guestType']);
    await queryInterface.addIndex('Guests', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Guests');
  }
};

