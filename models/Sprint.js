const {DataTypes} = require('sequelize')
const sequelize = require('../config/database');

const Sprint = sequelize.define('Sprint', {
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
    date_start:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    date_end:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    estimated_date_end:{
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    duration:{
        type: DataTypes.STRING,
        allowNull: true
    },
    isActive:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    project_guid:{
        type: DataTypes.UUID,
        allowNull: true
    }
},{
    tableName: 'Sprint'
})

module.exports = Sprint;