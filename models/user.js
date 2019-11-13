const pool = require('../db_config');

function User() {
  this.email = null;
  this.password = null;
  this.apiToken = null;
  this.createdAt = null;
  this.updatedAt = null;
}

User.prototype.create = async function() {
  return new Promise((resolve, reject) => {
    const query =
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const values = [this.email, this.password];
    pool.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

User.prototype.find = id => {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT id, email, api_token, created_at, updated_at FROM users WHERE id = $1';
    const value = [id];
    pool.query(query, value, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

User.prototype.findByEmail = email => {
  return new Promise((resolve, reject) => {
    const query =
      'SELECT id, email, api_token, password FROM users WHERE email = $1';
    const value = [email];

    pool
      .query(query, value)
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = User;
