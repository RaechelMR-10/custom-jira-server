const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');


const TicketHistory = sequelize.define('TicketHistory',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
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
    history_type:{
        type: DataTypes.STRING,
        allowNull: true
    },
    target_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
},{
    tableName: 'TicketHistory'
})

module.exports = TicketHistory;