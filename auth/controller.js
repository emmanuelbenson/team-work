const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.js');

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (email === '' || email.length === 0) {
    return res.status(422).json({
      status: 'error',
      error: 'Email is required'
    });
  }

  if (password === '' || password.length === 0) {
    return res.status(422).json({
      status: 'error',
      error: 'Password is required'
    });
  }

  let user = new User();

  const resultPromise = await user.findByEmail(email);

  if (resultPromise.rowCount === 0) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid username/password'
    });
  }

  [user] = resultPromise.rows;

  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid username/password'
    });
  }

  const token = jwt.sign(
    { email: user.email, role: 1 },
    process.env.JWT_SECRET
  );

  user.api_token = token;
  delete user.password; // Removes the password property from the user object

  return res.status(200).json({
    status: 'success',
    data: user
  });
};
