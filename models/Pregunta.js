const { Sequelize } = require("sequelize");
const db = require("../database/config");

const Pregunta = db.define(
  "preguntas",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    preguntaHecha: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Pregunta;
