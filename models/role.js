const pool = require('../db_config');

function Role() {
  this.id = 0;
  this.name = null;
}

Role.prototype.create = function() {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO roles(name) VALUES ($1) RETURNING *';
    const value = [this.name];

    pool.query(query, value, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

Role.prototype.find = function(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM roles WHERE id = $1';
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

Role.prototype.findByName = function(name) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM roles WHERE name = $1';
    const value = [name];

    pool.query(query, value, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = Role;
