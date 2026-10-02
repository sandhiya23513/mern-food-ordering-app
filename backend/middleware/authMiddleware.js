const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../utils/store');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_mern_food_delivery_jwt_key_2026_antigravity'
      );

      if (global.isMongoConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = store.findUserById(decoded.id);
        if (found) {
          const { password, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User session no longer valid. Please sign in again.',
        });
      }

      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired. Please sign in.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please sign in to continue.',
    });
  }
};

module.exports = { protect };
