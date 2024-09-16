const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const ProjectMember = sequelize.define('ProjectMember',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    user_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    project_id:{
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Projects',
            key: 'id'
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    tableName: 'ProjectMembers'
})

module.exports= ProjectMember;