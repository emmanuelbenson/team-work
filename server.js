const http = require('http');
const app = require('./app');
require('dotenv').config();

const server = http.createServer(app);

server.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${server.address().port}`);
});

module.exports = server;
