const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Grado = require("./Grado");
const Role = require("./Role");

const Usuario = db.define(
  "usuarios",
  {
    id_usuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_usuario: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        max: 100,
      },
    },
    direccion_residencia: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    telefono: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    telefono_emergencia_1: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    telefono_emergencia_2: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    correo_electronico: {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        max: 100,
      },
    },
    tipo_sangre: {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        max: 10,
      },
    },
    edad: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fecha_nacimiento: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    foto_usuario: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    password_usuario: {
      type: Sequelize.TEXT,
      allowNull: true,
      validate: {
        min: 255,
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
    id_rol: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_grado: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "fecha_creacion",
    updatedAt: "fecha_actualizacion",
  }
);

Role.hasMany(Usuario, { foreignKey: "id_rol", sourceKey: "id_rol" });
Usuario.belongsTo(Role, { foreignKey: "id_rol", sourceKey: "id_rol" });

Grado.hasMany(Usuario, { foreignKey: "id_grado", sourceKey: "id_grado" });
Usuario.belongsTo(Grado, { foreignKey: "id_grado", sourceKey: "id_grado" });

module.exports = Usuario;
