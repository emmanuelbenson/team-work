const chai = require('chai');
const mocha = require('mocha');
const pool = require('../db_config');
const Role = require('../models/role');

mocha.describe('Role', () => {
  mocha.before(() => {
    pool.query('TRUNCATE TABLE roles RESTART IDENTITY');
  });

  mocha.describe('When instantiated', () => {
    const role = new Role();
    mocha.it('Should be an object', () => {
      chai.expect(role).to.be.an('object');
    });
  });

  mocha.describe('When call create() with name not empty', () => {
    mocha.it('Should return object with rowCount above 0', async () => {
      const empRole = new Role();
      empRole.name = 'employee';

      const adminRole = new Role();
      adminRole.name = 'admin';

      const newAdminRole = await adminRole.create();
      await empRole.create();

      chai.expect(newAdminRole.rowCount).to.be.above(0);
    });
  });

  mocha.describe('When call find(id)', () => {
    mocha.it('Should select role with role.id equal id', async () => {
      const roleId = 1;
      const role = new Role();
      const foundRole = await role.find(roleId);

      chai.expect(foundRole.rows[0].id).to.be.equal(roleId);
    });
  });

  mocha.describe('When call findByName(name)', () => {
    let name;
    mocha.before(() => {
      name = 'admin';
    });

    mocha.it('Should select role with role.name equal name', async () => {
      const role = new Role();
      const foundRole = await role.findByName(name);

      chai.expect(foundRole.rows[0].name).to.be.equal(name);
    });
  });
});
