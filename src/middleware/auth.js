const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function checkJwtToken(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
      }
      req.user = decoded.user;
      next();
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    return res.status(500).json({ msg: 'Server Error' });
  }
};
