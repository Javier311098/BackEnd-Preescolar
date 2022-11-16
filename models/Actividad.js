const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Materia = require("./Materia");

const Actividad = db.define(
  "actividades",
  {
    id_actividad: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_actividad: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    material: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    imagen_1: {
      type: Sequelize.BLOB,
      allowNull: true,
    },
    imagen_2: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    video: {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        max: 255,
      },
    },
    objectivo: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 255,
      },
    },
    instrucciones: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 255,
      },
    },
    estatus: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        max: 1,
      },
    },
    id_materia: {
      type: Sequelize.INTEGER,
      allowNull: false,
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
Materia.hasMany(Actividad, { foreignKey: "id_materia" });
Actividad.belongsTo(Materia, { foreignKey: "id_materia" });

module.exports = Actividad;
