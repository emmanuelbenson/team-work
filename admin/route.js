const express = require('express');
const isAuth = require('../middleware/check-auth');
const isAdmin = require('../middleware/is-admin');
const controller = require('./controller');

const router = express.Router();

// router.get('/employee', (req, res) => {});
// router.get('/employee/:id', (req, res) => {});
router.post('/employee', [isAuth, isAdmin], controller.createEmployee);
// router.delete('/employee/:id', (req, res) => {});

module.exports = router;
