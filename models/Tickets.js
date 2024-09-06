const {DataTypes} = require('sequelize');
const sequelize = require('../database');

const Tickets = sequelize.define('Tickets',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Status',
            key: 'id'
        }
    },
    resolution:{
        type: DataTypes.STRING,
        allowNull: false
    },
    type_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Types',
            key: 'id'
        }
    },
    reporter_user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Users',
            key: 'id'
        }
    },
    assignee_user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Users',
            key: 'id'
        }
    }
},{
    tableName: 'Tickets'
})

module.exports = Tickets;