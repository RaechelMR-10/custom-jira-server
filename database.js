const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('CustommJira', 'Raechel', '',{
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options:{
            trustedConnection: true,
            encrypt: true,
            trustServerCertificate: true, 
        },
    },
});

module.exports = sequelize;