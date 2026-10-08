const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'codsoft_secret_key_2026';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access denied. Bearer token is required.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired authentication token.'));
  }
}

// Optional auth (allows unauthenticated fallback to demo user)
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Ignore invalid token in optional mode
    }
  }

  // Fallback to default user (id: 1) if not logged in so public testing is seamless
  if (!req.user) {
    req.user = { id: 1, name: 'Yaswanth Bose', email: 'yaswanth@codsoft.dev' };
  }

  next();
}

module.exports = {
  authenticate,
  optionalAuth,
  JWT_SECRET
};
