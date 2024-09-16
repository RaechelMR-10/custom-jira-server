// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Projects = require('./Projects');
const ProjectMember = require('./ProjectMember');

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
    middle_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
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
    }, 
    role:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Users',
    timestamps: true 
});

module.exports = User;
