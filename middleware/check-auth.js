const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    req.role = decodedToken.role;
    req.isAuth = true;

    return next();
  } catch (err) {
    console.error(err.message);

    const error = new Error('Invalid user!');
    return res.status(401).json({
      status: 'error',
      error: error.message
    });
  }
};
