const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Materia = require("./Materia");
const Periodo = require("./Periodo");
const Usuario = require("./Usuario");

const Calificacion = db.define(
  "calificaciones",
  {
    id_calificacion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_periodo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    calificacion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    id_materia: {
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

// Asocioaciones
// 1:M
Calificacion.belongsTo(Usuario, { foreignKey: "id_usuario" });
Usuario.hasMany(Calificacion, { foreignKey: "id_usuario" });

// 1:M
Calificacion.belongsTo(Periodo, { foreignKey: "id_periodo" });
Periodo.hasMany(Calificacion, { foreignKey: "id_periodo" });

// 1:1
Calificacion.belongsTo(Materia, { foreignKey: "id_materia" });
Materia.hasOne(Calificacion, { foreignKey: "id_materia" });

module.exports = Calificacion;
