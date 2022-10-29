const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Clase = require("./Clase");

const Asistencia = db.define(
  "asistencias",
  {
    id_asistencia: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_clase: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    asistencia: {
      type: Sequelize.INTEGER,
      allowNull: false,
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

// 1:1
Asistencia.belongsTo(Clase, { foreignKey: "id_clase" });
Clase.hasOne(Asistencia, { foreignKey: "id_clase" });

module.exports = Asistencia;
