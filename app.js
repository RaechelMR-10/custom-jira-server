// app.js
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/Users');
const tediousConnection = require('./config/tediousconn'); // Optional, if you need tedious for other purposes

// Sync models with the database
sequelize.sync({ alter: true }) // Use { force: true } to drop and recreate tables
    .then(() => {
        console.log("Models synchronized with the database.");
        // You can start your application logic here
    })
    .catch(err => {
        console.error('Error syncing models:', err);
    });
