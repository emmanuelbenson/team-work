const chai = require('chai');
const mocha = require('mocha');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

mocha.describe('API endpoints', () => {
  let email;
  let password;

  mocha.describe('# /api/v1/auth/login', () => {
    mocha.describe('When no email', () => {
      mocha.before(() => {
        email = '';
        password = 'password';
      });

      mocha.it('Should return error (422)', done => {
        chai
          .request(app)
          .post('/api/v1/auth/login')
          .send({ email: email, password: password })
          .end((err, res) => {
            chai.expect(res).to.have.status(422);
            chai.expect(res.body.error).to.equal('Email is required');
          });
        done();
      });
    });

    mocha.describe('When no password', () => {
      mocha.before(() => {
        email = 'email1@example.com';
        password = '';
      });

      mocha.it('Should return error (422)', done => {
        chai
          .request(app)
          .post('/api/v1/auth/login')
          .send({ email: email, password: password })
          .end((err, res) => {
            chai.expect(res).to.have.status(422);
            chai.expect(res.body.error).to.equal('Password is required');
          });
        done();
      });
    });

    mocha.describe('When correct email and password', () => {
      mocha.before(() => {
        email = 'email1@example.com';
        password = 'password';
      });
      mocha.it(
        'Should return 200 code and user object with api_token',
        async done => {
          chai
            .request(app)
            .post('/api/v1/auth/login')
            .send({ email: email, password: password })
            .end((err, res) => {
              chai.expect(res).to.have.status(200);
              chai.assert.hasAllKeys(res.body.data, [
                'id',
                'email',
                'api_token',
                'roleName'
              ]);
            });
          done();
        }
      );
    });
  });
});
