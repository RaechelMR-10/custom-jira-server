const {DataTypes} = require('sequelize');
const sequelize= require('../config/database');
const { Users } = require('.');

const Documents = sequelize.define('Documents', {
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
    author_user_id:{
        type: DataTypes.INTEGER,
        allowNull:true,
        references:{
            model: 'Users',
            key: 'id'
        }
    },
    project_guid:{
        type: DataTypes.UUID,
        allowNull: true
    }
},{
    tableName: 'Documents'
});
Documents.belongsTo(Users, {
    foreignKey: 'author_user_id',
    as: 'author' 
});
module.exports = Documents;