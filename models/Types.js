const {DataTypes}= require('sequelize')
const sequelize = require('../config/database');

const Types = sequelize.define('Types', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    icon:{
        type: DataTypes.STRING,
        allowNull: false
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
    tableName: 'Types'
})

module.exports= Types;