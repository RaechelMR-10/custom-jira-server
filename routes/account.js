const express = require('express');
const { signup, auth } = require('../controllers/Account');
const app = express();

app.use(express.json()); 

// Define routes
app.post('/signup', signup);
app.post('/login', auth);

