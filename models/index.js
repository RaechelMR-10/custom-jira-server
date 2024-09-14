// models/index.js
const sequelize = require('../config/database');
const Users = require('./Users'); 
const Organization = require('./Organization'); 
const Projects = require('./Projects'); 
const Status = require('./Status'); 
const TicketComments = require('./TicketComments'); 
const TicketHistory = require('./TicketHistory'); 
const Tickets = require('./Tickets'); 
const Types = require('./Types'); 


module.exports = { sequelize, Users, Organization, Projects, Status, TicketComments, TicketHistory, Tickets, Types };
