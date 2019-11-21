const pool = require('../db_config');
const UserRole = require('../models/user-role');
const Role = require('../models/role');

function User() {
  this.id = null;
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

User.prototype.assignRole = async function(roleId) {
  return new Promise((resolve, reject) => {
    const userRole = new UserRole();
    userRole.userId = this.id;
    userRole.roleId = roleId;

    userRole
      .create()
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
  });
};

User.prototype.role = async function() {
  return new Promise((resolve, reject) => {
    const userRole = new UserRole();

    userRole
      .findByUserId(this.id)
      .then(result => {
        const role = new Role();

        role.find(result.rows[0].role_id).then(res => {
          resolve(res.rows[0].name);
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = User;
