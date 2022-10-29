const { Sequelize } = require("sequelize");
const db = require("../database/config");

const Periodo = db.define(
  "periodos",
  {
    id_periodo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_periodo: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    inicio_periodo: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    fin_periodo: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
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

module.exports = Periodo;
