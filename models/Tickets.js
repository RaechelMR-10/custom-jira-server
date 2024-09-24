const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

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
        allowNull: true
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    status_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'Status',
            key: 'id'
        }
    },
    resolution:{
        type: DataTypes.STRING,
        allowNull: true
    },
    type_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Types',
            key: 'id'
        }
    },
    reporter_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'Users',
            key: 'id'
        }
    },
    assignee_user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'Users',
            key: 'id'
        }
    },
    project_guid:{
        type: DataTypes.UUID,
        allowNull: true
    },
    project_prefix:{
        type: DataTypes.STRING,
        allowNull: true
    },
    parent_id:{ 
        type: DataTypes.INTEGER,
        allowNull: true
    },
    ticket_id:{ //prefix
        type: DataTypes.STRING, 
        allowNull: true
    },
    severity_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'Severity',
            key: 'id'
        }
    },
    priority_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: 'PriorityLevel',
            key: 'id'
        }
    },
    linked_issue_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    sprint_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
},{
    tableName: 'Tickets'
})

module.exports = Tickets;