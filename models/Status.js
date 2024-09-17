const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define('Status', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    color:{
        type: DataTypes.STRING,
        allowNull: true
    },
    project_guid:{
        type: DataTypes.UUID,
        allowNull: true
    },
    isDefault:{
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
},{
    tableName: 'Status'
})

module.exports = Status