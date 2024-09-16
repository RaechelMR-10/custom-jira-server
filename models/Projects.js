const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const Users= require('./User')
const ProjectMember = require('./ProjectMember')
const Projects = sequelize.define('Projects',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    organization_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model:'Organizations',
            key: 'id'
        }
    }, 
    prefix:{
        type:DataTypes.STRING,
        allowNull: true
    }
},{
        tableName: 'Projects'
    
})

module.exports = Projects;