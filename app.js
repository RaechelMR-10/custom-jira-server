// app.js
require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Status = require('./models/Status');
const Tickets = require('./models/Tickets');
const TicketHistory = require('./models/TicketHistory');
const TicketComments = require('./models/TicketComments');
const Types = require('./models/Types');
const Projects = require('./models/Projects');

const tediousConnection = require('./config/tediousconn'); 

// Sync models with the database
sequelize.sync({ alter: true }) // Use { force: true } to drop and recreate tables
    .then(() => {
        console.log("Models synchronized with the database.");
    })
    .catch(err => {
        console.error('Error syncing models:', err);
    });
