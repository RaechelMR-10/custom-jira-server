const {DataTypes}= require('sequelize');
const sequelize = require('../config/database');

const Attachments = sequelize.define('Attachments',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    image_filename:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    target_module:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    file_extension:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    project_guid:{
        type: DataTypes.UUID,
        allowNull: true
    },
    ticket_guid:{
        type: DataTypes.UUID,
        allowNull: true
    }
},{
    tableName: 'Attachments'
})

module.exports= Attachments