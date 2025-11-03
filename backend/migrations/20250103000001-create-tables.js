'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Users table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'manager', 'staff'),
        defaultValue: 'staff'
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Properties table
    await queryInterface.createTable('Properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('apartment', 'villa', 'house', 'studio', 'penthouse'),
        defaultValue: 'apartment'
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        defaultValue: 'Nigeria'
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      maxGuests: {
        type: Sequelize.INTEGER,
        defaultValue: 2
      },
      baseRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      weekendRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      weeklyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      monthlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      cleaningFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      securityDeposit: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('available', 'occupied', 'maintenance', 'inactive'),
        defaultValue: 'available'
      },
      amenities: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      images: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      rules: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      checkInTime: {
        type: Sequelize.STRING,
        defaultValue: '14:00'
      },
      checkOutTime: {
        type: Sequelize.STRING,
        defaultValue: '11:00'
      },
      minStay: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      maxStay: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Bookings table
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      propertyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      guestName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      guestEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      guestPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numberOfGuests: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      checkIn: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      checkOut: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      numberOfNights: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      baseAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      cleaningFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      serviceFee: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'),
        defaultValue: 'pending'
      },
      paymentStatus: {
        type: Sequelize.ENUM('unpaid', 'partial', 'paid', 'refunded'),
        defaultValue: 'unpaid'
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentReference: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      specialRequests: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create Guests table
    await queryInterface.createTable('Guests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT,
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
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      nationality: {
        type: Sequelize.STRING,
        defaultValue: 'Nigeria'
      },
      totalBookings: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalSpent: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      loyaltyPoints: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isBlacklisted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      blacklistReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('Properties', ['status']);
    await queryInterface.addIndex('Properties', ['city']);
    await queryInterface.addIndex('Properties', ['isActive']);
    await queryInterface.addIndex('Bookings', ['propertyId']);
    await queryInterface.addIndex('Bookings', ['checkIn']);
    await queryInterface.addIndex('Bookings', ['checkOut']);
    await queryInterface.addIndex('Bookings', ['status']);
    await queryInterface.addIndex('Bookings', ['paymentStatus']);
    await queryInterface.addIndex('Bookings', ['guestEmail']);
    await queryInterface.addIndex('Guests', ['email']);
    await queryInterface.addIndex('Guests', ['phone']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
    await queryInterface.dropTable('Guests');
    await queryInterface.dropTable('Properties');
    await queryInterface.dropTable('Users');
  }
};

