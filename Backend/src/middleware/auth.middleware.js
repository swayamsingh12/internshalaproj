const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User } = require('../models');

// Authenticate middleware - verifies JWT token and attaches user to request
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }
  
  // Check if header starts with 'Bearer '
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header must start with "Bearer "' });
  }
  
  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(401).json({ error: 'Token missing user ID' });
    }
    
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch(err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token format' });
    } else if (err.name === 'NotBeforeError') {
      return res.status(401).json({ error: 'Token not active yet' });
    }
    console.error('Authentication error:', err);
    return res.status(401).json({ error: 'Authentication failed' }); 
  }
};

// Authorize role middleware - checks if user has required role(s)
const authorizeRole = (roles = []) => (req, res, next) => {
  console.log(req.user);
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const roleArr = Array.isArray(roles) ? roles : [roles];
  if (!roleArr.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Export both as named exports
module.exports = { authenticate, authorizeRole };

// Also export authenticate as default for backward compatibility
module.exports.default = authenticate;
