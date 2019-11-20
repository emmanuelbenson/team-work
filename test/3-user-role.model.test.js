const chai = require('chai');
const mocha = require('mocha');
const pool = require('../db_config');
const UserRole = require('../models/user-role');

mocha.describe('UserRole', () => {
  mocha.before(() => {
    pool.query('TRUNCATE TABLE users_roles RESTART IDENTITY');
  });

  mocha.describe('When instantiated', () => {
    mocha.it('Should be an object', async () => {
      const userRole = new UserRole();
      chai.expect(userRole).to.be.an('object');
    });
  });

  mocha.describe('When call create() with valid role id and user id', () => {
    mocha.it(
      'Should return object with rowCount attribute that has value greater than 0',
      async () => {
        const userRole = new UserRole();
        userRole.userId = 1;
        userRole.roleId = 1;

        const result = await userRole.create();
        chai.expect(result).to.have.property('rowCount');
        chai.expect(result.rowCount).to.be.above(0);
      }
    );
  });

  mocha.describe('When call findByUserId(id)', () => {
    mocha.it('Should return obj with rowCount greater than 0', async () => {
      const userRole = new UserRole();
      const userId = 1;
      const result = await userRole.findByUserId(userId);

      chai.expect(result.rowCount).to.be.above(0);
    });
  });
});
