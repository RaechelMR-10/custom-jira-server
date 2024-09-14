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
    }
},{
    tableName: 'Types'
})

module.exports= Types;