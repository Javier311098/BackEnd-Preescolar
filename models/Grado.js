const { Sequelize } = require("sequelize");
const db = require("../database/config");

const Grado = db.define(
  "grados",
  {
    id_grado: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_grado: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
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

module.exports = Grado;
