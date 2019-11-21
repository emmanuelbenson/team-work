const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

module.exports = (req, res, next) => {
  const userId = req.get('userId');

  if (!userId) {
    req.isAdmin = false;
    return next();
  }

  const user = new User();
  user.find(userId).then(result => {
    if (result.rowCount < 1) {
      req.isAdmin = false;
      return next();
    }

    user.id = result.rows[0].id;

    if (user.role !== 'admin') {
      req.isAdmin = false;
      return next();
    }

    req.isAdmin = true;
    return next();
  });

  return next();
};
