const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoute = require('./auth/route');
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

app.use('/api/v1/admin', adminRoute);

module.exports = app;
