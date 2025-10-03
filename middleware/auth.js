const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = "your_jwt_secret_here";  // 🔑 Hardcoded secret

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalid' });
  }
};
