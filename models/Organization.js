// models/Organization.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscription_type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    subscription_StartDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    subscription_EndDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW  
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'Organizations',
    timestamps: false
});

module.exports = Organization;
