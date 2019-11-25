const express = require('express');
const controller = require('./controller');

const router = express.Router();

router.post('/login', controller.signIn);
router.post('/password/email', controller.requestPasswordReset);
router.post('/password/reset', controller.resetPassword);

module.exports = router;
