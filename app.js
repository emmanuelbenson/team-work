const Express = require('express');
const bodyParser = require('body-parser');

const app = Express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

module.exports = app;
