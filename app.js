const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./auth/route');
const checkAuth = require('./middleware/check-auth');
const isAdmin = require('./middleware/is-admin');
const adminRoute = require('./admin/route');

const app = Express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use('/api/v1/auth', authRoute);

app.use(checkAuth);
app.use(isAdmin);

app.use('/api/v1/admin', adminRoute);

module.exports = app;
