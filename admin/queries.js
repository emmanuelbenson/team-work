const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Role = require('../models/role');

exports.createEmployee = async function(email, password) {
  const user = new User();
  user.email = email;
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;

  return new Promise((resolve, reject) => {
    user
      .create()
      .then(res => {
        user.id = res.rows[0].id;

        const role = new Role();
        role
          .findByName('employee')
          .then(result => {
            const roleId = result.rows[0].id;
            user
              .assignRole(roleId)
              .then(employeeRole => {
                resolve(employeeRole);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(roleError => {
            reject(roleError);
          });
      })
      .catch(newUserError => {
        reject(newUserError);
      });
  });
};
