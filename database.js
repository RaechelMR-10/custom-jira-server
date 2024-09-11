const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.Db_Name, process.env.Db_User , '',{
    host: process.env.Db_HOST,
    port: process.env.Db_PORT,
    dialect: 'mssql',
    dialectOptions: {
        options:{
            trustedConnection: true,
            encrypt: true,
            trustServerCertificate: true, 
        },
    },
    logging: console.log
});

module.exports = sequelize;
