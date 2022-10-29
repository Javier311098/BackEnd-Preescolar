const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Grado = require("./Grado");
const Role = require("./Role");
const Usuario = require("./Usuario");

const EstuDoce = db.define(
  "estudiantes_docentes",
  {
    id_esdo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario_estudiante: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_usuario_docente: {
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
EstuDoce.belongsTo(Usuario, { foreignKey: "id_usuario_estudiante" });
Usuario.hasOne(EstuDoce, { foreignKey: "id_usuario_estudiante" });

// 1:1
EstuDoce.belongsTo(Usuario, { foreignKey: "id_usuario_docente" });
Usuario.hasOne(EstuDoce, { foreignKey: "id_usuario_docente" });
module.exports = EstuDoce;
