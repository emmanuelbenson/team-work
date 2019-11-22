const express = require('express');
const controller = require('./controller');

const router = express.Router();

// router.get('/employee', (req, res) => {});
// router.get('/employee/:id', (req, res) => {});
router.post('/employee', controller.createEmployee);
// router.delete('/employee/:id', (req, res) => {});

module.exports = router;
