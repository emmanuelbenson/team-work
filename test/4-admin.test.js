const chai = require('chai');
const mocha = require('mocha');
const User = require('../models/user');
const adminQueries = require('../admin/queries');

mocha.describe('Admin', () => {
  mocha.describe('# createEmployee', () => {
    mocha.it('Should return object', async () => {
      adminQueries.createEmployee('mantchi@gmail.com', 'password').then(res => {
        const user = new User();
        user.findByEmail('mantchi@gmail.com').then(response => {
          user.id = response.rows[0].id;
          user.role().then(resp => {
            chai.assert.equal('employee', resp);
          });
        });
      });
    });
  });
});
