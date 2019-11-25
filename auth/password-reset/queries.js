const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../../models/user');
const pool = require('../../db_config');

exports.requestReset = async email => {
  return new Promise((resolve, reject) => {
    const user = new User();

    user
      .findByEmail(email)
      .then(result => {
        let token;

        if (result.rowCount > 0) {
          token = jwt.sign(
            { email: email, userId: result.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
          );

          const queryString =
            'INSERT INTO password_resets (email, token) VALUES ($1, $2) RETURNING *';
          const values = [email, token];

          pool.query(queryString, values, (err, res) => {
            if (err) {
              reject(err);
            } else {
              const rows = res.rows[0];
              resolve(rows.token);
            }
          });
        } else {
          resolve(token);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.checkResetRequest = token => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT email FROM password_resets WHERE token = $1';
    const value = [token];
    pool.query(query, value, (err, result) => {
      let status = false;
      if (err) {
        reject(status);
      }
      if (result.rowCount <= 0) {
        reject(status);
      }
      status = true;
      resolve(status);
    });
  });
};

exports.checkRequestToken = token => {
  return new Promise((resolve, reject) => {
    let status = false;
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      status = true;

      resolve(status);
    } catch (error) {
      reject(status);
    }
  });
};

exports.resetPassword = (email, newPassword) => {
  return new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
    const vals = [newPassword, email];
    pool.query(updateQuery, vals, (updateErr, updateResult) => {
      if (updateErr) {
        console.log('Failure');

        reject(updateErr);
      } else {
        console.log('Success');

        resolve(updateResult);
      }
    });
  });
};

exports.deleResetRequest = email => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM password_resets WHERE email = $1';
    const value = [email];

    pool.query(query, value, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
