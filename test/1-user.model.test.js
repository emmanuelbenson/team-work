const assert = require('chai').assert;
const chai = require('chai');
const mocha = require('mocha');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const pool = require('../db_config');

mocha.describe('User model', async () => {
  mocha.before(() => {
    pool.query('TRUNCATE TABLE users RESTART IDENTITY');
  });

  mocha.describe('# create', async () => {
    mocha.it('Should create user', async () => {
      const user = new User();
      user.email = 'email1@example.com';
      user.password = await bcrypt.hash('password', 12);

      return user
        .create()
        .then(result => {
          assert.exists(result.rows[0].id);
        })
        .catch(function(err) {
          assert.notExists(err);
        });
    });
  });

  mocha.describe('# find', async () => {
    mocha.it('Should find one user with id 1', async () => {
      const user = new User();
      const id = 1;

      return user
        .find(id)
        .then(result => {
          assert.equal(result.rows[0].id, id);
        })
        .catch(err => {
          assert.notExists(err);
        });
    });
  });

  mocha.describe('# findByEmail', async () => {
    mocha.it('Should find one user by email address', async () => {
      const user = new User();
      const email = 'email1@example.com';

      return user
        .findByEmail(email)
        .then(result => {
          assert.equal(result.rows[0].email, email);
        })
        .catch(err => {
          assert.notExists(err);
        });
    });
  });

  mocha.describe('When call assignRole', async () => {
    mocha.it('Should return object with role_id', async () => {
      const user = new User();
      user.id = 1;
      const roleId = 1;

      const result = await user.assignRole(roleId);

      chai.expect(result.rows[0]).to.have.property('role_id');
    });
  });

  mocha.describe('When call role', async () => {
    mocha.it('Should return role name as string', async () => {
      const user = new User();
      user.id = 1;

      const result = await user.role();

      chai.expect(result).to.be.equal('Admin');
    });
  });
});
