require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.Db_Name, process.env.Db_User, process.env.Db_Password, {
  host: process.env.Db_HOST,
  port: process.env.Db_PORT || 1433, // Default to 1433 if not specified
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: true, // For Azure SQL
      trustServerCertificate: true, // Disable in production
    },
  },
  logging: console.log,
});

module.exports = sequelize;
