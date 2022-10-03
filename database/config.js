const { Sequelize } = require("sequelize");

const db = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASS,
  {
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: "postgres",
  }
);

module.exports = db;
