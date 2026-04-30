const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateStatus,
  deleteTask
} = require('../controllers/taskController');
const { requireAdmin } = require('../middleware/role');
const authenticate = require('../middleware/auth');
const taskValidation = require('../validation/taskValidation');

router.get('/', authenticate, getTasks);
router.post('/', authenticate, requireAdmin, taskValidation.create, createTask);
router.get('/:id', authenticate, getTaskById);
router.patch('/:id', authenticate, requireAdmin, taskValidation.update, updateTask);
router.patch('/:id/status', authenticate, taskValidation.updateStatus, updateStatus);
router.delete('/:id', authenticate, requireAdmin, deleteTask);

module.exports = router;