const { body } = require('express-validator');

const projectValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Project name is required')
      .isLength({ max: 200 })
      .withMessage('Name must be at most 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be at most 1000 characters')
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Project name cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Name must be at most 200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description must be at most 1000 characters')
  ],
  addMember: [
    body('userId')
      .notEmpty()
      .withMessage('User ID is required')
      .isMongoId()
      .withMessage('Invalid user ID')
  ]
};

module.exports = projectValidation;