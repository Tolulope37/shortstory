'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create MessageTemplates table
    await queryInterface.createTable('MessageTemplates', {
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
      subject: {
        type: Sequelize.STRING,
        allowNull: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('booking_confirmation', 'check_in', 'check_out', 'thank_you', 'custom'),
        defaultValue: 'custom'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Create MessageAutomations table
    await queryInterface.createTable('MessageAutomations', {
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
      trigger: {
        type: Sequelize.ENUM('booking_confirmed', 'check_in_24h', 'check_in_day', 'check_out_24h', 'check_out_complete'),
        allowNull: false
      },
      templateId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'MessageTemplates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

    // Create GuestMessages table
    await queryInterface.createTable('GuestMessages', {
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
      guestId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Guests',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: true
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      direction: {
        type: Sequelize.ENUM('outgoing', 'incoming'),
        defaultValue: 'outgoing'
      },
      status: {
        type: Sequelize.ENUM('sent', 'delivered', 'read', 'failed'),
        defaultValue: 'sent'
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.addIndex('MessageTemplates', ['userId']);
    await queryInterface.addIndex('MessageTemplates', ['category']);
    await queryInterface.addIndex('MessageAutomations', ['userId']);
    await queryInterface.addIndex('MessageAutomations', ['templateId']);
    await queryInterface.addIndex('GuestMessages', ['userId']);
    await queryInterface.addIndex('GuestMessages', ['guestId']);
    await queryInterface.addIndex('GuestMessages', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GuestMessages');
    await queryInterface.dropTable('MessageAutomations');
    await queryInterface.dropTable('MessageTemplates');
  }
};

