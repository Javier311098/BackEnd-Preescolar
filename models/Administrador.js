const { Sequelize } = require("sequelize");
const db = require("../database/config");

const Administrador = db.define(
  "administradores",
  {
    id_admin: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_admin: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    telefono_admin: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    correo_admin: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    password_admin: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 255,
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

module.exports = Administrador;
