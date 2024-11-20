require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CustomJira', process.env.Db_User, process.env.Db_Password, {
    host: 'LAPTOP-G5DE1LDD',
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true ,
        trustServerCertificate: true,
    }
});


module.exports = sequelize;
