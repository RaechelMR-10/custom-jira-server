require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CustomJira', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'LAPTOP-G5DE1LDD',
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true ,
        trustServerCertificate: true,
    }
});


module.exports = sequelize;
