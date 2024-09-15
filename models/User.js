// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false 
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Organizations', 
            key: 'id'
        }
    }
}, {
    tableName: 'Users',
    timestamps: true 
});

module.exports = User;
