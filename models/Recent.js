const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Recent = sequelize.define('Recent',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    guid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    user_guid:{
        type: DataTypes.UUID,
        allowNull: true
    },
    ticket_guid:{
        type: DataTypes.UUID,
        allowNull: true
    }
},{
    tableName:'Recent'
})

module.exports = Recent;