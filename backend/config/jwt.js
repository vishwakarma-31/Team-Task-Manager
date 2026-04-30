require('dotenv').config();
const jwt = require('jsonwebtoken');

const signAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};