const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/login', controller.signIn);

module.exports = router;
