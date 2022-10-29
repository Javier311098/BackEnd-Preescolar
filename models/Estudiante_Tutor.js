const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Usuario = require("./Usuario");

const EstuTutor = db.define(
  "estudiantes_tutores",
  {
    id_estu: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario_estudiante: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_usuario_tutor: {
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
EstuTutor.belongsTo(Usuario, { foreignKey: "id_usuario_estudiante" });
Usuario.hasOne(EstuTutor, { foreignKey: "id_usuario_estudiante" });

// 1:1
EstuTutor.belongsTo(Usuario, { foreignKey: "id_usuario_tutor" });
Usuario.hasOne(EstuTutor, { foreignKey: "id_usuario_tutor" });

module.exports = EstuTutor;
