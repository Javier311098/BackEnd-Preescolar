const { Sequelize } = require("sequelize");
const db = require("../database/config");

const Materia = db.define(
  "materias",
  {
    id_materia: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_materia: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
      unique: true,
    },
    descripcion: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 255,
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

module.exports = Materia;
