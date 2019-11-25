const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.js');
const Queries = require('../auth/password-reset/queries');

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
    { email: userObj.email, userId: userObj.id, role: userRoleResponse },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  userObj.roleName = userRoleResponse;

  userObj.api_token = token;
  delete userObj.password; // Removes the password property from the user object

  return res.status(200).json({
    status: 'success',
    data: userObj
  });
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (email === '' || email === undefined || email.length <= 0) {
    return res.status(422).json({
      status: 'error',
      error: 'email is required'
    });
  }

  let token;
  let response;

  try {
    token = await Queries.requestReset(email);
    if (token !== undefined) {
      response = res.status(200).json({
        status: 'success',
        data: {
          token: token
        }
      });
    }
  } catch (error) {
    console.log(error);
    response = res.status(500).json({
      status: 'error',
      error: error.message
    });
  }

  return response;
};

exports.resetPassword = async (req, res) => {
  const { email, oldPassword, newPassword, newPasswordConfirmation } = req.body;
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({
      status: 'error',
      error: 'Bad request'
    });
  }
  const errorBag = {};
  if (email === '' || email === undefined || email.length <= 0) {
    errorBag.email = ['required'];
  }
  if (
    oldPassword === '' ||
    oldPassword === undefined ||
    oldPassword.length <= 0
  ) {
    errorBag.oldPassword = ['required'];
  }
  if (
    newPassword === '' ||
    newPassword === undefined ||
    newPassword.length <= 0
  ) {
    errorBag.newPassword = ['required'];
  } else if (newPasswordConfirmation !== newPassword) {
    errorBag.newPasswordConfirmation = ['password does not match'];
  }
  if (Object.keys(errorBag).length > 0) {
    return res.status(422).json({
      status: 'error',
      error: errorBag
    });
  }
  const user = new User();
  const resultPromise = await user.findByEmail(email);
  if (resultPromise.rowCount === 0) {
    errorBag.email = ['email does not exist'];
    return res.status(404).json({
      status: 'error',
      error: errorBag
    });
  }
  const [userObj] = resultPromise.rows;
  const isPassword = await bcrypt.compare(oldPassword, userObj.password);
  if (!isPassword) {
    errorBag.oldPassword = ['Wrong password'];
    return res.status(401).json({
      status: 'error',
      error: errorBag
    });
  }

  try {
    await Queries.checkResetRequest(token);
  } catch (error) {
    return res.status(404).json({
      status: 'error',
      error: 'Request not found'
    });
  }

  try {
    await Queries.checkRequestToken(token);
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      error: 'Request expired'
    });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  try {
    await Queries.resetPassword(email, hashedPassword);
    await Queries.deleResetRequest(email);
    return res.status(200).json({
      status: 'success',
      data: { message: 'Password successfully updated' }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: 'Could not reset password'
    });
  }
};
