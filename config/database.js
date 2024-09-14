const config = require('../config/config');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  config.development.database,
  null,
  null,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    dialectModule: config.development.dialectModule,
    dialectOptions: config.development.dialectOptions
  }
);
sequelize.authenticate()
  .then(() => console.log('Connection established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
