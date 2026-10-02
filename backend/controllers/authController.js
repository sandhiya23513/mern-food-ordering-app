const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const store = require('../utils/store');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecret_mern_food_delivery_jwt_key_2026_antigravity',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected
    if (global.isMongoConnected) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please sign in.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone || '',
        address: address || '',
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
        },
      });
    }

    // 2. Resilient Fallback Store (Instant response, zero timeout)
    const existing = store.findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    const newUser = await store.createUser({
      name,
      email: cleanEmail,
      password,
      phone,
      address,
    });

    const token = generateToken(newUser._id);
    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is connected
    if (global.isMongoConnected) {
      const user = await User.findOne({ email: cleanEmail });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        return res.json({
          success: true,
          message: 'Signed in successfully',
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
          },
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Resilient Fallback Store (Instant response, zero timeout)
    const user = store.findUserByEmail(cleanEmail);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = generateToken(user._id);
        return res.json({
          success: true,
          message: 'Signed in successfully',
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during sign in',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) {
        return res.json({ success: true, user });
      }
    } else {
      const user = store.findUserById(req.user._id);
      if (user) {
        const { password, ...safeUser } = user;
        return res.json({ success: true, user: safeUser });
      }
    }

    return res.status(404).json({
      success: false,
      message: 'User profile not found',
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
