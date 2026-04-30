const express = require('express');
const router = express.Router();
const { register, login, logout, refreshToken } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validation/authValidation');
const authenticate = require('../middleware/auth');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refreshToken);

module.exports = router;