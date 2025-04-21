const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

// Validate product input
exports.validateProduct = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters')
    .trim(),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price must be a positive number'),
  
  body('images')
    .isArray({ min: 1 }).withMessage('At least one image is required'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'food', 'other'])
    .withMessage('Please select a valid category'),
  
  // Check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new ErrorResponse(errorMessages.join(', '), 400));
    }
    next();
  }
];
