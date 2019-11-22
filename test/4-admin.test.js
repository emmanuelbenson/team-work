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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsMUBleGFtcGxlLmNvbSIsInVzZXJJZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTc0NDI0NTcyLCJleHAiOjE1NzQ0MjgxNzJ9.fSLFMQnU8WzfasWQn4ju9Ewy0btJJcPo718JpIe59Ng'
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
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbnRjaGlAZ21haWwuY29tIiwidXNlcklkIjoyLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE1NzQ0MjQ2NTIsImV4cCI6MTU3NDQyODI1Mn0.jegb_Culsf55LDCqp-3SbRpcODdJ-iL9ACm6LHeqU4s'
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
