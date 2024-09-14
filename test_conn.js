require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CustomJira', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'LAPTOP-G5DE1LDD',
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true ,
        trustServerCertificate: true
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        console.log('DB_USER:', process.env.DB_USER);
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    });
