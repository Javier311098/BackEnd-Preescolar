const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Actividad = require("./Actividad");
const EstuDoce = require("./Estudiante_Docente");
const Grado = require("./Grado");
const Periodo = require("./Periodo");

const Clase = db.define(
  "clases",
  {
    id_clase: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // id_esdo: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    // },
    id_grado: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_periodo: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    id_actividad: {
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

// 1:M
// Clase.belongsTo(EstuDoce, { foreignKey: "id_esdo" });
// EstuDoce.hasMany(Clase, { foreignKey: "id_esdo" });

// 1:M
Clase.belongsTo(Grado, { foreignKey: "id_grado" });
Grado.hasMany(Clase, { foreignKey: "id_grado" });

// 1:M
Clase.belongsTo(Periodo, { foreignKey: "id_periodo" });
Periodo.hasMany(Clase, { foreignKey: "id_periodo" });

// 1:M
Clase.belongsTo(Actividad, { foreignKey: "id_actividad" });
Actividad.hasMany(Clase, { foreignKey: "id_actividad" });

module.exports = Clase;
