const { body } = require('express-validator');

const taskValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Task title is required')
      .isLength({ max: 300 })
      .withMessage('Title must be at most 300 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description must be at most 2000 characters'),
    body('projectId')
      .notEmpty()
      .withMessage('Project ID is required')
      .isMongoId()
      .withMessage('Invalid project ID'),
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('Invalid assigned user ID'),
    body('status')
      .optional()
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be todo, in-progress, or done'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format')
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Task title cannot be empty')
      .isLength({ max: 300 })
      .withMessage('Title must be at most 300 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Description must be at most 2000 characters'),
    body('assignedTo')
      .optional()
      .isMongoId()
      .withMessage('Invalid assigned user ID'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format')
  ],
  updateStatus: [
    body('status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn(['todo', 'in-progress', 'done'])
      .withMessage('Status must be todo, in-progress, or done')
  ]
};

module.exports = taskValidation;