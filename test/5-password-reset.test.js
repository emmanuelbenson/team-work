const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

const pool = require('../db_config');
const queries = require('../auth/password-reset/queries');

mocha.describe('Password Reset', () => {
  mocha.describe('# request reset with existing email', () => {
    mocha.before(() => {
      pool.query('TRUNCATE TABLE password_resets RESTART IDENTITY');
    });

    mocha.it('Should return string token', () => {
      const email = 'mantchi@gmail.com';
      queries.requestReset(email).then(token => {
        chai.assert.isString(token);
      });
    });
  });

  mocha.describe('# request reset with non-existing email', () => {
    mocha.it('Should return token undefined', () => {
      const email = 'mantchi1@gmail.com';
      queries.requestReset(email).then(token => {
        chai.assert.isUndefined(token);
      });
    });
  });

  mocha.describe('# POST /api/v1/auth/password/email', () => {
    mocha.before(() => {
      pool.query('TRUNCATE TABLE password_resets RESTART IDENTITY', () => {});
    });
    mocha.describe('When called with valid user email', () => {
      mocha.it('Should return a token string', done => {
        const email = 'mantchi@gmail.com';
        chai
          .request(app)
          .post('/api/v1/auth/password/email')
          .set(
            'Authorization',
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbnRjaGlAZ21haWwuY29tIiwidXNlcklkIjoyLCJyb2xlIjoiZW1wbG95ZWUiLCJpYXQiOjE1NzQ2ODM1MTAsImV4cCI6MTU3NDc2OTkxMH0.8hhF868yfodWgkUPPWORKOML5a8BjBU8yQVJNroIq0c'
          )
          .send({ email: email })
          .end((err, res) => {
            chai.expect(res.body.data).to.have.property('token');
            chai.assert.isString(res.body.data.token);
          });
        done();
      });
    });
  });
});

mocha.describe('Reset Password', () => {
  mocha.it('Should return number > 0', () => {
    const [email, token, newPassword] = [
      'mantchi@gmail.com',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbnRjaGlAZ21haWwuY29tIiwidXNlcklkIjoyLCJpYXQiOjE1NzQ0NTM3MTMsImV4cCI6MTU3NDQ4OTcxM30.jGeStXICxzOCPUitUZMQ7fH0vyd0BIA0dZw5rg0JsF0',
      'SecretPassword'
    ];

    queries
      .resetPassword(email, newPassword, token)
      .then(affectedRow => {
        chai.assert.equal(affectedRow, 1);
      })
      .catch(err => {
        console.log(err);
      });
  });

  mocha.describe('# POST /api/v1/auth/password/reset?token', () => {
    mocha.describe(
      'When called with valid user email, oldPassword, newPassword and newPasswordConfirmation',
      () => {
        let email;
        let oldPassword;
        let newPassword;
        let newPasswordConfirmation;
        mocha.before(() => {
          email = 'mantchi@gmail.com';
          oldPassword = 'password';
          newPassword = 'password';
          newPasswordConfirmation = 'password';
        });

        mocha.it.only('Should return 200 status code', done => {
          chai
            .request(app)
            .post(
              '/api/v1/auth/password/reset?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbnRjaGlAZ21haWwuY29tIiwidXNlcklkIjoyLCJpYXQiOjE1NzQ2OTY4NjAsImV4cCI6MTU3NDczMjg2MH0.z4gYD-AFo2CkO28RF4cvXf_x0aLgYImOOf42aM0FulU'
            )
            .send({
              email: email,
              oldPassword: oldPassword,
              newPassword: newPassword,
              newPasswordConfirmation: newPasswordConfirmation
            })
            .end((err, res) => {
              chai.expect(res).to.have.status(200);
            });
          done();
        });
      }
    );
  });
});
