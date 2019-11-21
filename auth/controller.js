const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.js');

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(422).json({
      status: 'error',
      error: 'Email is required'
    });
  }

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

  const user = new User();

  const resultPromise = await user.findByEmail(email);

  if (resultPromise.rowCount === 0) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid username/password'
    });
  }

  const [userObj] = resultPromise.rows;

  const isPassword = await bcrypt.compare(password, userObj.password);

  if (!isPassword) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid username/password'
    });
  }

  user.id = userObj.id;

  const userRolePromise = user.role();
  const userRoleResponse = await userRolePromise;

  const token = jwt.sign(
    { email: userObj.email, userIs: userObj.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  userObj.roleName = userRoleResponse;

  userObj.api_token = token;
  delete userObj.password; // Removes the password property from the user object

  return res.status(200).json({
    status: 'success',
    data: userObj
  });
};
