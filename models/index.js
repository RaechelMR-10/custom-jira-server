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
const PriorityLevel = require('./PriorityLevel');
const Severity = require('./Severity');
const Watcher = require('./Watcher');
const AuditTrail = require('./AuditTrails');
const Sprint = require('./Sprint');
const Documents= require('./Documents');
const Recent = require('./Recent');
const Attachments = require('./Attachments');

Projects.hasMany(ProjectMember, {
    foreignKey: 'project_id',
    onDelete: 'CASCADE'
});

ProjectMember.belongsTo(Projects, {
    foreignKey: 'project_id'
});


Tickets.belongsTo(Users, { as: 'reporter', foreignKey: 'reporter_user_id' , onDelete: 'NO ACTION'});
Tickets.belongsTo(Users, { as: 'assignee', foreignKey: 'assignee_user_id', onDelete: 'NO ACTION' });
Tickets.belongsTo(Types, { as: 'type_details', foreignKey: 'type_id', onDelete: 'NO ACTION' });




Users.hasMany(Tickets, { as: 'reportedTickets', foreignKey: 'reporter_user_id' , onDelete: 'NO ACTION'});
Users.hasMany(Tickets, { as: 'assignedTickets', foreignKey: 'assignee_user_id' , onDelete: 'NO ACTION'});


module.exports = { sequelize, Users, Organization, Projects,ProjectMember, Status, TicketComments, TicketHistory, Tickets, Types, AuditTrail, Sprint, Severity, PriorityLevel, Documents, Attachments, Watcher };
