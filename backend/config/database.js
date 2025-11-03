const { Sequelize } = require('sequelize');
const logger = require('../utils/logger');

// Use environment variable or default to local database with your username
const dbUrl = process.env.DATABASE_URL || 'postgresql://tolulopearobieke@localhost:5432/shortlet_db';

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions:
    process.env.DATABASE_SSL === 'true'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✓ Database connection established successfully');
    
    if (process.env.NODE_ENV !== 'production') {
      // Sync models in development only
      await sequelize.sync({ alter: true });
      logger.info('✓ Database models synchronized');
    }
  } catch (error) {
    logger.error('✗ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };

