const {DataTypes}  = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization',{
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
    }
},{
    tableName: 'Organization'
}
)
module.exports = Organization;