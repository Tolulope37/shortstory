'use strict';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@shortlet.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        username: 'manager',
        email: 'manager@shortlet.com',
        password: await bcrypt.hash('manager123', salt),
        name: 'Property Manager',
        role: 'manager',
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('Users', users);

    // Create sample properties
    const properties = [
      {
        id: uuidv4(),
        name: 'Lekki Paradise Villa',
        description: 'Luxurious beachfront villa with stunning ocean views',
        type: 'villa',
        location: 'Lekki Phase 1',
        address: '123 Beach Road, Lekki Phase 1',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        bedrooms: 3,
        bathrooms: 2,
        maxGuests: 6,
        baseRate: 65000.00,
        weekendRate: 75000.00,
        cleaningFee: 5000.00,
        securityDeposit: 50000.00,
        status: 'available',
        amenities: JSON.stringify(['WiFi', 'Pool', 'AC', 'Kitchen', 'Parking']),
        images: JSON.stringify(['https://placehold.co/800x600/1']),
        checkInTime: '14:00',
        checkOutTime: '11:00',
        minStay: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Ikeja GRA Apartment',
        description: 'Modern apartment in the heart of Ikeja GRA',
        type: 'apartment',
        location: 'Ikeja GRA',
        address: '45 Allen Avenue, Ikeja GRA',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        bedrooms: 2,
        bathrooms: 2,
        maxGuests: 4,
        baseRate: 45000.00,
        cleaningFee: 3000.00,
        securityDeposit: 30000.00,
        status: 'available',
        amenities: JSON.stringify(['WiFi', 'AC', 'Kitchen', 'Parking', 'Generator']),
        images: JSON.stringify(['https://placehold.co/800x600/2']),
        checkInTime: '14:00',
        checkOutTime: '11:00',
        minStay: 1,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Victoria Island Luxury Suite',
        description: 'Premium penthouse with panoramic city views',
        type: 'penthouse',
        location: 'Victoria Island',
        address: '78 Adeola Odeku, Victoria Island',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        bedrooms: 4,
        bathrooms: 3,
        maxGuests: 8,
        baseRate: 85000.00,
        weekendRate: 95000.00,
        weeklyRate: 550000.00,
        cleaningFee: 8000.00,
        securityDeposit: 80000.00,
        status: 'available',
        amenities: JSON.stringify(['WiFi', 'Pool', 'Gym', 'AC', 'Kitchen', 'Parking', 'Security']),
        images: JSON.stringify(['https://placehold.co/800x600/3']),
        checkInTime: '15:00',
        checkOutTime: '12:00',
        minStay: 2,
        isActive: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Abuja Executive Home',
        description: 'Spacious executive home in prestigious Maitama',
        type: 'house',
        location: 'Maitama',
        address: '12 Aguiyi Ironsi Street, Maitama',
        city: 'Abuja',
        state: 'FCT',
        country: 'Nigeria',
        bedrooms: 5,
        bathrooms: 4,
        maxGuests: 10,
        baseRate: 75000.00,
        weeklyRate: 480000.00,
        monthlyRate: 1800000.00,
        cleaningFee: 10000.00,
        securityDeposit: 100000.00,
        status: 'available',
        amenities: JSON.stringify(['WiFi', 'Pool', 'Garden', 'AC', 'Kitchen', 'Parking', 'Security', 'Generator']),
        images: JSON.stringify(['https://placehold.co/800x600/4']),
        checkInTime: '14:00',
        checkOutTime: '11:00',
        minStay: 3,
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('Properties', properties);

    // Create sample guests
    const guests = [
      {
        id: uuidv4(),
        name: 'Adeola Johnson',
        email: 'adeola@example.com',
        phone: '+2348012345678',
        nationality: 'Nigeria',
        totalBookings: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        isBlacklisted: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Chinedu Okafor',
        email: 'chinedu@example.com',
        phone: '+2348023456789',
        nationality: 'Nigeria',
        totalBookings: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        isBlacklisted: false,
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('Guests', guests);

    console.log('✓ Seed data inserted successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Guests', null, {});
    await queryInterface.bulkDelete('Properties', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};

