const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');


const AuditTrails = sequelize.define('AuditTrails',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    action_made:{
        type: DataTypes.STRING,
        allowNull: true
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    ip_address:{
        type: DataTypes.STRING,
        allowNull: true
    },
    organization_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Organizations',
            key: 'id'
        }
    },
    user_agent:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    tableName: 'AuditTrails'
})

module.exports = AuditTrails;