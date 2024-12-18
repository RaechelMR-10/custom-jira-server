const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Users= require('./User');
const Tickets= require('./Tickets');

const TicketComments = sequelize.define('TicketComments',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    ticket_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tickets',
            key:'id'
        }
    },
    content:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'TicketComments'
})
TicketComments.belongsTo(Users, { 
    foreignKey: 'user_id',
    onDelete: 'NO ACTION'
});

module.exports = TicketComments;