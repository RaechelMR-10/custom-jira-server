// models/index.js
const sequelize = require('../config/database');
const Users = require('./User'); 
const Organization = require('./Organization'); 
const Projects = require('./Projects'); 
const ProjectMember = require('./ProjectMember'); 
const Status = require('./Status'); 
const TicketComments = require('./TicketComments'); 
const TicketHistory = require('./TicketHistory'); 
const Tickets = require('./Tickets'); 
const Types = require('./Types'); 

Projects.hasMany(ProjectMember, {
    foreignKey: 'project_id',
    onDelete: 'CASCADE'
});

ProjectMember.belongsTo(Projects, {
    foreignKey: 'project_id'
});

module.exports = { sequelize, Users, Organization, Projects,ProjectMember, Status, TicketComments, TicketHistory, Tickets, Types };
