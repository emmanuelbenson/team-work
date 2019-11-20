const pool = require('../db_config');

function UserRole() {
  this.userId = 0;
  this.roleId = 0;
}

UserRole.prototype.create = async function() {
  return new Promise((resolve, reject) => {
    const query =
      'INSERT INTO users_roles (user_id, role_id) VALUES ($1, $2) RETURNING *';
    const values = [this.userId, this.roleId];

    pool.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

UserRole.prototype.findByUserId = async function(userId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users_roles WHERE user_id = $1';
    const value = [userId];

    pool.query(query, value, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = UserRole;
