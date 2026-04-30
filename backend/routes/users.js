const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.get('/', authenticate, getUsers);
router.patch('/:id/role', authenticate, requireAdmin, updateUserRole);
router.delete('/:id', authenticate, requireAdmin, deleteUser);

module.exports = router;
