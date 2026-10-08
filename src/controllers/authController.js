const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { ApiError } = require('../middleware/errorHandler');
const { JWT_SECRET } = require('../middleware/auth');

const AuthController = {
  register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || name.trim().length < 2) {
        throw new ApiError(400, 'Name must be at least 2 characters.');
      }

      const existing = UserModel.findByEmail(email);
      if (existing) {
        throw new ApiError(409, `An account with email '${email}' already exists.`);
      }

      const user = UserModel.create({ name, email, password });

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = UserModel.findByEmail(email);
      if (!user) {
        throw new ApiError(401, 'Invalid email or password.');
      }

      const isMatch = UserModel.comparePassword(password, user.password);
      if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password.');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile(req, res, next) {
    try {
      const user = UserModel.findById(req.user.id);
      if (!user) {
        throw new ApiError(404, 'User not found.');
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AuthController;
