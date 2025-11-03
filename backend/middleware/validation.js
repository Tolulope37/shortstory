const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Login validation rules
 */
const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

/**
 * Register validation rules
 */
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Invalid role'),
  validate
];

/**
 * Property validation rules
 */
const propertyValidation = [
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Property name must be between 3 and 200 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('baseRate').isFloat({ min: 0 }).withMessage('Base rate must be a positive number'),
  body('bedrooms').optional().isInt({ min: 0 }).withMessage('Bedrooms must be a positive integer'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('Bathrooms must be a positive integer'),
  body('maxGuests').optional().isInt({ min: 1 }).withMessage('Max guests must be at least 1'),
  validate
];

/**
 * Booking validation rules
 */
const bookingValidation = [
  body('propertyId').isUUID().withMessage('Valid property ID is required'),
  body('guestName').trim().notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('guestPhone').trim().notEmpty().withMessage('Phone number is required'),
  body('checkIn').isDate().withMessage('Valid check-in date is required'),
  body('checkOut').isDate().withMessage('Valid check-out date is required')
    .custom((checkOut, { req }) => {
      if (new Date(checkOut) <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('numberOfGuests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
  validate
];

/**
 * UUID param validation
 */
const uuidParamValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate
];

module.exports = {
  validate,
  loginValidation,
  registerValidation,
  propertyValidation,
  bookingValidation,
  uuidParamValidation
};

