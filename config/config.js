require('dotenv').config();

module.exports = {
  development: {
    database: process.env.Db_Name,
    host: process.env.Db_HOST,
    dialect: 'mssql',
    dialectModule: require('msnodesqlv8'),
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
      trustedConnection: true
    }
  }
};