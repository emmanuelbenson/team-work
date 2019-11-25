const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');
const User = require('../models/user');
const adminQueries = require('../admin/queries');

const app = require('../app');

chai.use(chaiHttp);

mocha.describe('Admin', () => {
  mocha.describe('# createEmployee', () => {
    mocha.it('Should return object', () => {
      adminQueries.createEmployee('mantchi@gmail.com', 'password').then(() => {
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

  mocha.describe('# POST /api/v1/admin/employee', () => {
    mocha.it('Should return status code 201 if user is admin', () => {
      chai
        .request(app)
        .post('/api/v1/admin/employee')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMUBleGFtcGxlLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTc0NDQ3MDUwLCJleHAiOjE1NzQ1MzM0NTB9.3Le1DTkx_0yH5HFJAv8V5iT9Qz0bKpv8gtdq7-fSydI'
        )
        .send({
          email: 'emm@gmail.com',
          password: 'secret'
        })
        .end((err, res) => {
          chai.expect(res).to.have.status(201);
        });
    });
  });

  mocha.describe('# POST /api/v1/admin/employee', () => {
    mocha.it('Should return status code 401 if user is not admin', () => {
      chai
        .request(app)
        .post('/api/v1/admin/employee')
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbnRjaGlAZ21haWwuY29tIiwidXNlcklkIjoyLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE1NzQ0NDcwODIsImV4cCI6MTU3NDUzMzQ4Mn0.MZ5vO8tURZ4YHPV5HBNz0CphCAO5kr8lGAG4n5my9MA'
        )
        .send({
          email: 'emm@gmail.com',
          password: 'secret'
        })
        .end((err, res) => {
          chai.expect(res).to.have.status(401);
        });
    });
  });
});
