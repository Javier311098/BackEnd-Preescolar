const { Sequelize } = require("sequelize");
const db = require("../database/config");

const Role = db.define(
  "roles",
  {
    id_rol: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rol: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 10,
      },
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
      validate: {
        max: 1,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
  }
);

module.exports = Role;
