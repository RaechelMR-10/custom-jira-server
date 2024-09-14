const express = require('express');
const { signup, auth } = require('../controllers/Account');

// Create an instance of Router, not express application
const router = express.Router();

// Define routes
router.post('/signup', signup);
router.post('/login', auth);

module.exports = router;
