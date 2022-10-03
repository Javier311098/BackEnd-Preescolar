const { Sequelize } = require("sequelize");
const db = require("../database/config");
const Role = require("./Role");

const Usuario = db.define(
  "usuarios",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Associations
Role.hasMany(Usuario, { foreignKey: "role_id", sourceKey: "id" });
Usuario.belongsTo(Role, { foreignKey: "role_id", sourceKey: "id" });

module.exports = Usuario;
