const { Sequelize } = require('sequelize');
require('dotenv').config();

const connectionUrl = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL;

let sequelize;

if (connectionUrl) {
  sequelize = new Sequelize(connectionUrl, {
    dialect: 'mysql',
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.MYSQLDATABASE || 'railway',
    process.env.MYSQLUSER || 'root',
    process.env.MYSQLPASSWORD || '',
    {
      host: process.env.MYSQLHOST || 'localhost',
      port: process.env.MYSQLPORT || 3306,
      dialect: 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
